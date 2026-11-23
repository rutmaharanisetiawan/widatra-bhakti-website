import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { storageUrl, deleteStoredFile } from "../config/storage.js";
import { storedPathOf } from "../middleware/upload.js";
import { sendData, sendMessage, notFound, forbidden, validationError, param } from "../utils/http.js";
import { toIso, nowDb } from "../utils/dates.js";

function serializeDocument(d: any) {
  return {
    id: Number(d.id),
    name: d.name,
    url: storageUrl(d.path),
    type: d.type,
    size: Number(d.size),
    uploaded_at: toIso(d.created_at),
  };
}

export async function listDocuments(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return forbidden("Unauthenticated.");
  }
  const userId = BigInt(user.id);
  const docs = await prisma.documents.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
  sendData(res, docs.map(serializeDocument));
}

export async function uploadDocument(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return forbidden("Unauthenticated.");
  }
  const file = req.file;
  if (!file) {
    return validationError("file", "A file is required.");
  }

  const userId = BigInt(user.id);
  const storedPath = storedPathOf(file)!;
  const now = nowDb();

  const doc = await prisma.documents.create({
    data: {
      user_id: userId,
      name: file.originalname,
      path: storedPath,
      type: file.mimetype || "application/octet-stream",
      size: BigInt(file.size),
      created_at: now,
      updated_at: now,
    },
  });

  sendData(res, serializeDocument(doc), 201);
}

export async function deleteDocument(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return forbidden("Unauthenticated.");
  }
  const idStr = param(req.params.id);
  const id = BigInt(idStr);
  const doc = await prisma.documents.findUnique({ where: { id } });
  if (!doc) {
    return notFound("Document not found.");
  }

  if (doc.user_id !== BigInt(user.id) && user.role !== "Super Admin" && user.role !== "Administrator") {
    return forbidden("This action is unauthorized.");
  }

  deleteStoredFile(doc.path);
  await prisma.documents.delete({ where: { id } });

  sendMessage(res, "Document deleted.");
}
