import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData, sendMessage, notFound, validationError, param } from "../utils/http.js";
import { resolveMediaUrl } from "../utils/mediaResolver.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb } from "../utils/dates.js";

const CategoryEnum = z.enum([
  "Basic Intravenous",
  "Specialty Solution",
  "Irrigation",
  "Medical Device",
]);

const BrandEnum = z.enum(["Generic", "Branded"]);

const ProductSchema = z.object({
  code: z.string().regex(/^[\w-]+$/).optional().nullable(),
  name: z.string().min(1).max(255),
  category: CategoryEnum,
  brand: BrandEnum,
  osmolarity: z.string().optional().nullable(),
  calorie: z.string().optional().nullable(),
  nie: z.string().optional().nullable(),
  packaging: z.array(z.any()),
  sizes: z.array(z.any()),
  indication: z.string().min(1),
  benefits: z.array(z.any()),
  applications: z.array(z.any()),
  storage: z.string().min(1),
  shelf_life: z.string().min(1),
  composition: z.string().min(1),
  manufacturing_note: z.string().optional().nullable(),
  img: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
});

export async function serializeProduct(p: any) {
  return {
    code: p.code,
    name: p.name,
    category: typeof p.category === "string" ? p.category.replace(/_/g, " ") : p.category,
    brand: p.brand,
    osmolarity: p.osmolarity,
    calorie: p.calorie,
    nie: p.nie,
    packaging: typeof p.packaging === "string" ? JSON.parse(p.packaging) : p.packaging,
    sizes: typeof p.sizes === "string" ? JSON.parse(p.sizes) : p.sizes,
    indication: p.indication,
    benefits: typeof p.benefits === "string" ? JSON.parse(p.benefits) : p.benefits,
    applications: typeof p.applications === "string" ? JSON.parse(p.applications) : p.applications,
    storage: p.storage,
    shelf_life: p.shelf_life,
    composition: p.composition,
    manufacturing_note: p.manufacturing_note,
    img: p.img,
    img_url: await resolveMediaUrl(p.img),
    tagline: p.tagline,
  };
}

async function generateUniqueCode(name: string): Promise<string> {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let code = base;
  let counter = 2;
  while (await prisma.products.findUnique({ where: { code } })) {
    code = `${base}-${counter}`;
    counter++;
  }
  return code;
}

export async function listProducts(_req: Request, res: Response) {
  const list = await prisma.products.findMany({
    orderBy: { name: "asc" },
  });
  const serialized = await Promise.all(list.map(serializeProduct));
  sendData(res, serialized);
}

export async function getProduct(req: Request, res: Response) {
  const code = param(req.params.code);
  const product = await prisma.products.findUnique({
    where: { code },
  });
  if (!product) {
    return notFound("Product not found.");
  }
  sendData(res, await serializeProduct(product));
}

export async function createProduct(req: Request, res: Response) {
  const input = validate(ProductSchema, req.body);

  let finalCode = input.code;
  if (!finalCode) {
    finalCode = await generateUniqueCode(input.name);
  } else {
    const existing = await prisma.products.findUnique({ where: { code: finalCode } });
    if (existing) {
      validationError("code", "The code has already been taken.");
    }
  }

  const now = nowDb();
  const created = await prisma.products.create({
    data: {
      code: finalCode,
      name: input.name,
      category: input.category as any,
      brand: input.brand as any,
      osmolarity: input.osmolarity ?? null,
      calorie: input.calorie ?? null,
      nie: input.nie ?? null,
      packaging: input.packaging,
      sizes: input.sizes,
      indication: input.indication,
      benefits: input.benefits,
      applications: input.applications,
      storage: input.storage,
      shelf_life: input.shelf_life,
      composition: input.composition,
      manufacturing_note: input.manufacturing_note ?? null,
      img: input.img ?? null,
      tagline: input.tagline ?? null,
      created_at: now,
      updated_at: now,
    },
  });

  await recordAudit(req, {
    action: "create",
    resource_type: "Product",
    resource_id: created.code,
    payload: { name: created.name },
  });

  sendData(res, await serializeProduct(created), 201);
}

export async function updateProduct(req: Request, res: Response) {
  const code = param(req.params.code);
  const product = await prisma.products.findUnique({ where: { code } });
  if (!product) {
    return notFound("Product not found.");
  }

  const input = validate(ProductSchema.omit({ code: true }), req.body);
  const updated = await prisma.products.update({
    where: { code },
    data: {
      name: input.name,
      category: input.category as any,
      brand: input.brand as any,
      osmolarity: input.osmolarity ?? null,
      calorie: input.calorie ?? null,
      nie: input.nie ?? null,
      packaging: input.packaging,
      sizes: input.sizes,
      indication: input.indication,
      benefits: input.benefits,
      applications: input.applications,
      storage: input.storage,
      shelf_life: input.shelf_life,
      composition: input.composition,
      manufacturing_note: input.manufacturing_note ?? null,
      img: input.img ?? null,
      tagline: input.tagline ?? null,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "update",
    resource_type: "Product",
    resource_id: updated.code,
    payload: { name: updated.name },
  });

  sendData(res, await serializeProduct(updated));
}

export async function deleteProduct(req: Request, res: Response) {
  const code = param(req.params.code);
  const product = await prisma.products.findUnique({ where: { code } });
  if (!product) {
    return notFound("Product not found.");
  }

  await prisma.products.delete({ where: { code } });

  await recordAudit(req, {
    action: "delete",
    resource_type: "Product",
    resource_id: code,
    payload: { name: product.name },
  });

  sendMessage(res, "Product deleted.");
}
