import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData, sendMessage, notFound, validationError, forbidden, param } from "../utils/http.js";
import { resolveMediaUrl } from "../utils/mediaResolver.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, parseDateInput } from "../utils/dates.js";
import { generateUniqueSlug } from "../utils/slug.js";
import { can } from "../policies/access.js";

const CategoryEnum = z.enum(["Corporate", "People", "Sustainability", "Events"]);
const StatusEnum = z.enum(["Published", "Draft"]);

const ArticleSchema = z.object({
  slug: z.string().regex(/^[\w-]+$/).optional().nullable(),
  cat: CategoryEnum,
  date: z.string().min(1),
  published_on: z.string().optional().nullable(),
  read: z.string().optional().nullable(),
  title: z.string().min(1).max(255),
  excerpt: z.string().min(1),
  img: z.string().optional().nullable(),
  content: z.string().min(1),
  gallery: z.array(z.any()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  author: z.string().optional().nullable(),
  author_role: z.string().optional().nullable(),
  status: StatusEnum,
});

const StatusOnlySchema = z.object({
  status: StatusEnum,
});

export async function serializeArticle(a: any) {
  return {
    slug: a.slug,
    cat: a.cat,
    date: a.date,
    read: a.read,
    title: a.title,
    excerpt: a.excerpt,
    img: a.img,
    img_url: await resolveMediaUrl(a.img),
    content: a.content,
    gallery: typeof a.gallery === "string" ? JSON.parse(a.gallery) : a.gallery,
    tags: typeof a.tags === "string" ? JSON.parse(a.tags) : a.tags,
    author: a.author,
    author_role: a.author_role,
    status: a.status,
  };
}

export async function listArticles(req: Request, res: Response) {
  const showAll = req.query.all === "1" || req.query.all === "true";

  if (showAll) {
    if (!req.user || !can(req.user, "articles")) {
      forbidden("This action is unauthorized.");
    }
    const list = await prisma.articles.findMany({
      orderBy: [{ published_on: "desc" }, { created_at: "desc" }],
    });
    const serialized = await Promise.all(list.map(serializeArticle));
    return sendData(res, serialized);
  }

  const list = await prisma.articles.findMany({
    where: { status: "Published" },
    orderBy: [{ published_on: "desc" }, { created_at: "desc" }],
  });
  const serialized = await Promise.all(list.map(serializeArticle));
  sendData(res, serialized);
}

export async function getArticle(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const article = await prisma.articles.findFirst({
    where: { slug, status: "Published" },
  });
  if (!article) {
    return notFound("Article not found.");
  }
  sendData(res, await serializeArticle(article));
}

export async function getRelatedArticles(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const article = await prisma.articles.findFirst({
    where: { slug, status: "Published" },
  });
  if (!article) {
    return notFound("Article not found.");
  }

  const related = await prisma.articles.findMany({
    where: {
      status: "Published",
      cat: article.cat,
      NOT: { slug },
    },
    orderBy: { published_on: "desc" },
    take: 3,
  });

  const serialized = await Promise.all(related.map(serializeArticle));
  sendData(res, serialized);
}

export async function showAdminArticle(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const article = await prisma.articles.findUnique({
    where: { slug },
  });
  if (!article) {
    return notFound("Article not found.");
  }
  sendData(res, await serializeArticle(article));
}

export async function createArticle(req: Request, res: Response) {
  const input = validate(ArticleSchema, req.body);

  let finalSlug = input.slug;
  if (!finalSlug) {
    finalSlug = await generateUniqueSlug(
      input.title,
      async (s) => (await prisma.articles.findUnique({ where: { slug: s } })) !== null,
      "article"
    );
  } else {
    const existing = await prisma.articles.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      validationError("slug", "The slug has already been taken.");
    }
  }

  const now = nowDb();
  const publishedDate = input.published_on ? parseDateInput(input.published_on) : null;

  const created = await prisma.articles.create({
    data: {
      slug: finalSlug,
      cat: input.cat as any,
      date: input.date,
      published_on: publishedDate,
      read: input.read ?? null,
      title: input.title,
      excerpt: input.excerpt,
      img: input.img ?? null,
      content: input.content,
      gallery: input.gallery ?? undefined,
      tags: input.tags ?? undefined,
      author: input.author ?? null,
      author_role: input.author_role ?? null,
      status: input.status as any,
      created_at: now,
      updated_at: now,
    },
  });

  await recordAudit(req, {
    action: "create",
    resource_type: "Article",
    resource_id: created.slug,
    payload: { title: created.title },
  });

  sendData(res, await serializeArticle(created), 201);
}

export async function updateArticle(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const article = await prisma.articles.findUnique({ where: { slug } });
  if (!article) {
    return notFound("Article not found.");
  }

  const input = validate(ArticleSchema.omit({ slug: true }), req.body);
  const publishedDate = input.published_on ? parseDateInput(input.published_on) : null;

  const updated = await prisma.articles.update({
    where: { slug },
    data: {
      cat: input.cat as any,
      date: input.date,
      published_on: publishedDate,
      read: input.read ?? null,
      title: input.title,
      excerpt: input.excerpt,
      img: input.img ?? null,
      content: input.content,
      gallery: input.gallery !== undefined ? input.gallery ?? undefined : undefined,
      tags: input.tags !== undefined ? input.tags ?? undefined : undefined,
      author: input.author ?? null,
      author_role: input.author_role ?? null,
      status: input.status as any,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "update",
    resource_type: "Article",
    resource_id: updated.slug,
    payload: { title: updated.title },
  });

  sendData(res, await serializeArticle(updated));
}

export async function deleteArticle(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const article = await prisma.articles.findUnique({ where: { slug } });
  if (!article) {
    return notFound("Article not found.");
  }

  await prisma.articles.delete({ where: { slug } });

  await recordAudit(req, {
    action: "delete",
    resource_type: "Article",
    resource_id: slug,
    payload: { title: article.title },
  });

  sendMessage(res, "Article deleted.");
}

export async function setArticleStatus(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const article = await prisma.articles.findUnique({ where: { slug } });
  if (!article) {
    return notFound("Article not found.");
  }

  const { status } = validate(StatusOnlySchema, req.body);
  const updated = await prisma.articles.update({
    where: { slug },
    data: {
      status: status as any,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "set_status",
    resource_type: "Article",
    resource_id: slug,
    payload: { status },
  });

  sendData(res, await serializeArticle(updated));
}
