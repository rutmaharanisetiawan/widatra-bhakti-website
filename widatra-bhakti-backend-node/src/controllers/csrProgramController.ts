import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData, sendMessage, notFound, validationError, forbidden, param } from "../utils/http.js";
import { resolveMediaUrl } from "../utils/mediaResolver.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, parseDateInput } from "../utils/dates.js";
import { generateUniqueSlug } from "../utils/slug.js";
import { can } from "../policies/access.js";

const StatusEnum = z.enum(["Published", "Draft"]);

const CsrProgramSchema = z.object({
  slug: z.string().regex(/^[\w-]+$/).optional().nullable(),
  pillar: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  published_on: z.string().optional().nullable(),
  title: z.string().min(1).max(255),
  excerpt: z.string().min(1),
  img: z.string().optional().nullable(),
  content: z.string().min(1),
  gallery: z.array(z.any()).optional().nullable(),
  impact: z.string().optional().nullable(),
  status: StatusEnum,
});

const StatusOnlySchema = z.object({
  status: StatusEnum,
});

export async function serializeCsr(c: any) {
  return {
    slug: c.slug,
    pillar: c.pillar,
    location: c.location,
    date: c.date,
    title: c.title,
    excerpt: c.excerpt,
    img: c.img,
    img_url: await resolveMediaUrl(c.img),
    content: c.content,
    gallery: typeof c.gallery === "string" ? JSON.parse(c.gallery) : c.gallery,
    impact: c.impact,
    status: c.status,
  };
}

export async function listCsrPrograms(req: Request, res: Response) {
  const showAll = req.query.all === "1" || req.query.all === "true";

  if (showAll) {
    if (!req.user || !can(req.user, "articles")) {
      forbidden("This action is unauthorized.");
    }
    const list = await prisma.csr_programs.findMany({
      orderBy: [{ published_on: "desc" }, { created_at: "desc" }],
    });
    const serialized = await Promise.all(list.map(serializeCsr));
    return sendData(res, serialized);
  }

  const list = await prisma.csr_programs.findMany({
    where: { status: "Published" },
    orderBy: [{ published_on: "desc" }, { created_at: "desc" }],
  });
  const serialized = await Promise.all(list.map(serializeCsr));
  sendData(res, serialized);
}

export async function getCsrProgram(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const program = await prisma.csr_programs.findFirst({
    where: { slug, status: "Published" },
  });
  if (!program) {
    return notFound("CSR program not found.");
  }
  sendData(res, await serializeCsr(program));
}

export async function showAdminCsrProgram(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const program = await prisma.csr_programs.findUnique({
    where: { slug },
  });
  if (!program) {
    return notFound("CSR program not found.");
  }
  sendData(res, await serializeCsr(program));
}

export async function createCsrProgram(req: Request, res: Response) {
  const input = validate(CsrProgramSchema, req.body);

  let finalSlug = input.slug;
  if (!finalSlug) {
    finalSlug = await generateUniqueSlug(
      input.title,
      async (s) => (await prisma.csr_programs.findUnique({ where: { slug: s } })) !== null,
      "csr"
    );
  } else {
    const existing = await prisma.csr_programs.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      validationError("slug", "The slug has already been taken.");
    }
  }

  const now = nowDb();
  const publishedDate = input.published_on ? parseDateInput(input.published_on) : null;

  const created = await prisma.csr_programs.create({
    data: {
      slug: finalSlug,
      pillar: input.pillar,
      location: input.location,
      date: input.date,
      published_on: publishedDate,
      title: input.title,
      excerpt: input.excerpt,
      img: input.img ?? null,
      content: input.content,
      gallery: input.gallery ?? undefined,
      impact: input.impact ?? null,
      status: input.status as any,
      created_at: now,
      updated_at: now,
    },
  });

  await recordAudit(req, {
    action: "create",
    resource_type: "CsrProgram",
    resource_id: created.slug,
    payload: { title: created.title },
  });

  sendData(res, await serializeCsr(created), 201);
}

export async function updateCsrProgram(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const program = await prisma.csr_programs.findUnique({ where: { slug } });
  if (!program) {
    return notFound("CSR program not found.");
  }

  const input = validate(CsrProgramSchema.omit({ slug: true }), req.body);
  const publishedDate = input.published_on ? parseDateInput(input.published_on) : null;

  const updated = await prisma.csr_programs.update({
    where: { slug },
    data: {
      pillar: input.pillar,
      location: input.location,
      date: input.date,
      published_on: publishedDate,
      title: input.title,
      excerpt: input.excerpt,
      img: input.img ?? null,
      content: input.content,
      gallery: input.gallery !== undefined ? input.gallery ?? undefined : undefined,
      impact: input.impact ?? null,
      status: input.status as any,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "update",
    resource_type: "CsrProgram",
    resource_id: updated.slug,
    payload: { title: updated.title },
  });

  sendData(res, await serializeCsr(updated));
}

export async function deleteCsrProgram(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const program = await prisma.csr_programs.findUnique({ where: { slug } });
  if (!program) {
    return notFound("CSR program not found.");
  }

  await prisma.csr_programs.delete({ where: { slug } });

  await recordAudit(req, {
    action: "delete",
    resource_type: "CsrProgram",
    resource_id: slug,
    payload: { title: program.title },
  });

  sendMessage(res, "CSR program deleted.");
}

export async function setCsrProgramStatus(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const program = await prisma.csr_programs.findUnique({ where: { slug } });
  if (!program) {
    return notFound("CSR program not found.");
  }

  const { status } = validate(StatusOnlySchema, req.body);
  const updated = await prisma.csr_programs.update({
    where: { slug },
    data: {
      status: status as any,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "set_status",
    resource_type: "CsrProgram",
    resource_id: slug,
    payload: { status },
  });

  sendData(res, await serializeCsr(updated));
}
