import { Request, Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { storageUrl, deleteStoredFile } from "../config/storage.js";
import { storedPathOf } from "../middleware/upload.js";
import { validate, sendData, sendMessage, notFound, validationError, param } from "../utils/http.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, toIso } from "../utils/dates.js";
import { slugify } from "../utils/slug.js";

export const MEDIA_FOLDERS = [
  "Products",
  "News & Event",
  "CSR",
  "Factory Tour",
  "Company Profile",
  "Gallery",
  "Others",
] as const;

const FolderEnum = z.enum(MEDIA_FOLDERS);

function serializeMediaAsset(a: any) {
  return {
    id: a.id,
    name: a.name,
    url: storageUrl(a.path),
    folder: a.folder,
    type: a.type,
    size: Number(a.size),
    created_at: toIso(a.created_at),
    updated_at: toIso(a.updated_at),
  };
}

function generateAssetId(originalName: string): string {
  const withoutExt = originalName.replace(/\.[a-z0-9]+$/i, "");
  const base = slugify(withoutExt).slice(0, 40) || "asset";
  const rand = crypto.randomBytes(3).toString("hex");
  return `${base}-${rand}`;
}

export async function listMediaAssets(req: Request, res: Response) {
  const folder = (req.query.folder as string) || "All";
  const query = ((req.query.q as string) || "").trim();

  const where: any = {};
  if (folder !== "All" && MEDIA_FOLDERS.includes(folder as any)) {
    where.folder = folder;
  }
  if (query) {
    where.name = { contains: query };
  }

  const assets = await prisma.media_assets.findMany({
    where,
    orderBy: { created_at: "desc" },
  });

  sendData(res, assets.map(serializeMediaAsset));
}

export async function uploadMediaAsset(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    validationError("file", "A file is required.");
  }

  const { folder, name } = validate(
    z.object({
      folder: FolderEnum,
      name: z.string().optional().nullable(),
    }),
    req.body
  );

  const storedPath = storedPathOf(file)!;
  const assetName = name?.trim() || file.originalname;
  const assetId = generateAssetId(assetName);
  const now = nowDb();

  const created = await prisma.media_assets.create({
    data: {
      id: assetId,
      name: assetName,
      path: storedPath,
      folder: folder as any,
      type: file.mimetype || "application/octet-stream",
      size: BigInt(file.size),
      created_at: now,
      updated_at: now,
    },
  });

  await recordAudit(req, {
    action: "upload",
    resource_type: "MediaAsset",
    resource_id: created.id,
    payload: { name: created.name, folder: created.folder },
  });

  sendData(res, serializeMediaAsset(created), 201);
}

export async function renameMediaAsset(req: Request, res: Response) {
  const id = param(req.params.id);
  const asset = await prisma.media_assets.findUnique({ where: { id } });
  if (!asset) {
    return notFound("Asset not found.");
  }

  const { name } = validate(
    z.object({
      name: z.string().min(1).max(255),
    }),
    req.body
  );

  const updated = await prisma.media_assets.update({
    where: { id },
    data: {
      name,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "rename",
    resource_type: "MediaAsset",
    resource_id: id,
    payload: { old_name: asset.name, new_name: name },
  });

  sendData(res, serializeMediaAsset(updated));
}

export async function moveMediaAsset(req: Request, res: Response) {
  const id = param(req.params.id);
  const asset = await prisma.media_assets.findUnique({ where: { id } });
  if (!asset) {
    return notFound("Asset not found.");
  }

  const { folder } = validate(
    z.object({
      folder: FolderEnum,
    }),
    req.body
  );

  const updated = await prisma.media_assets.update({
    where: { id },
    data: {
      folder: folder as any,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "move",
    resource_type: "MediaAsset",
    resource_id: id,
    payload: { old_folder: asset.folder, new_folder: folder },
  });

  sendData(res, serializeMediaAsset(updated));
}

export async function replaceMediaAsset(req: Request, res: Response) {
  const id = param(req.params.id);
  const asset = await prisma.media_assets.findUnique({ where: { id } });
  if (!asset) {
    return notFound("Asset not found.");
  }

  const file = req.file;
  if (!file) {
    return validationError("file", "A file is required.");
  }

  // Delete old file on disk
  deleteStoredFile(asset.path);

  const newStoredPath = storedPathOf(file)!;
  const updated = await prisma.media_assets.update({
    where: { id },
    data: {
      path: newStoredPath,
      type: file.mimetype || "application/octet-stream",
      size: BigInt(file.size),
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "replace",
    resource_type: "MediaAsset",
    resource_id: id,
  });

  sendData(res, serializeMediaAsset(updated));
}

export async function deleteMediaAsset(req: Request, res: Response) {
  const id = param(req.params.id);
  const asset = await prisma.media_assets.findUnique({ where: { id } });
  if (!asset) {
    return notFound("Asset not found.");
  }

  deleteStoredFile(asset.path);
  await prisma.media_assets.delete({ where: { id } });

  await recordAudit(req, {
    action: "delete",
    resource_type: "MediaAsset",
    resource_id: id,
    payload: { name: asset.name },
  });

  sendMessage(res, "Asset deleted.");
}
