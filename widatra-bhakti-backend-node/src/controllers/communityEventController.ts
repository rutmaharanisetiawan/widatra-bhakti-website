import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { storageUrl, deleteStoredFile } from "../config/storage.js";
import { storedPathOf } from "../middleware/upload.js";
import {
  validate,
  sendData,
  sendMessage,
  notFound,
  validationError,
  forbidden,
  param,
} from "../utils/http.js";
import { resolveMediaUrl } from "../utils/mediaResolver.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, toIso, toDateString, parseDateInput } from "../utils/dates.js";
import { IdGenerator } from "../utils/idGenerator.js";
import { sendNotification } from "../utils/notifier.js";
import { generateUniqueSlug } from "../utils/slug.js";
import { can } from "../policies/access.js";

const StoreCommunityEventSchema = z.object({
  title: z.string().min(1).max(255),
  community: z.string().min(1),
  category: z.string().min(1),
  event_date: z.string().min(1),
  location: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  cover_image: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  contact_person: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  agreement_accepted: z.boolean(),
});

function humanizeStatus(status: string): string {
  if (status === "Revision_Requested") return "Revision Requested";
  return status;
}

function prismaStatus(status: string): any {
  if (status === "Revision Requested") return "Revision_Requested";
  return status;
}

export async function serializeCommunityEvent(e: any) {
  const documents = (e.community_event_documents || []).map((d: any) => ({
    id: String(d.id),
    name: d.name,
    type: d.type,
    size: Number(d.size),
    url: storageUrl(d.path),
  }));

  const statusHistory = (e.community_event_status_histories || []).map((h: any) => ({
    status: humanizeStatus(h.status),
    date: toIso(h.happened_at),
    note: h.note,
  }));

  const adminNotes = (e.community_event_notes || []).map((n: any) => ({
    id: String(n.id),
    author: n.author_name,
    note: n.note,
    date: toIso(n.created_at),
  }));

  return {
    id: e.id,
    user_id: e.users?.public_id ?? null,
    submitter_name: e.submitter_name,
    submitter_email: e.submitter_email,
    title: e.title,
    community: e.community,
    category: e.category,
    event_date: toDateString(e.event_date),
    location: e.location,
    summary: e.summary,
    description: e.description,
    cover_image: e.cover_image,
    cover_image_url: await resolveMediaUrl(e.cover_image),
    gallery: typeof e.gallery === "string" ? JSON.parse(e.gallery) : e.gallery ?? [],
    documents,
    tags: typeof e.tags === "string" ? JSON.parse(e.tags) : e.tags ?? [],
    contact_person: e.contact_person,
    contact_phone: e.contact_phone,
    agreement_accepted: Boolean(e.agreement_accepted),
    status: humanizeStatus(e.status),
    status_history: statusHistory,
    admin_notes: adminNotes,
    created_at: toIso(e.created_at),
    updated_at: toIso(e.updated_at),
    submitted_at: toIso(e.submitted_at),
    published_article_slug: e.published_article_slug,
  };
}

export async function listCommunityEvents(req: Request, res: Response) {
  const showAll = req.query.all === "1" || req.query.all === "true";

  const where: any = showAll
    ? {}
    : {
        status: {
          in: ["Pending", "Revision_Requested", "Approved", "Rejected", "Published"],
        },
      };

  const list = await prisma.community_events.findMany({
    where,
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
    orderBy: { created_at: "desc" },
  });

  const serialized = await Promise.all(list.map(serializeCommunityEvent));
  sendData(res, serialized);
}

export async function myCommunityEvents(req: Request, res: Response) {
  if (!req.user) {
    return forbidden("Unauthenticated.");
  }

  const userId = BigInt(req.user.id);
  const list = await prisma.community_events.findMany({
    where: { user_id: userId },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
    orderBy: { created_at: "desc" },
  });

  const serialized = await Promise.all(list.map(serializeCommunityEvent));
  sendData(res, serialized);
}

export async function getCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  if (!event) {
    return notFound("Community event not found.");
  }

  const isOwner = req.user && BigInt(req.user.id) === event.user_id;
  const isModerator = req.user && can(req.user, "events");
  if (!isOwner && !isModerator) {
    return forbidden("This action is unauthorized.");
  }

  sendData(res, await serializeCommunityEvent(event));
}

export async function createCommunityEvent(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return forbidden("Unauthenticated.");
  }

  // RBAC rule: only internal employees may submit community events
  if (user.account_type !== "internal") {
    return forbidden("Hanya karyawan internal yang dapat mengajukan proposal Acara Komunitas.");
  }

  const input = validate(StoreCommunityEventSchema, req.body);
  const now = nowDb();
  const id = IdGenerator.make("EVT");
  const eventDate = parseDateInput(input.event_date)!;
  const userId = BigInt(user.id);

  const event = await prisma.community_events.create({
    data: {
      id,
      user_id: userId,
      submitter_name: user.name,
      submitter_email: user.email,
      title: input.title,
      community: input.community,
      category: input.category,
      event_date: eventDate,
      location: input.location,
      summary: input.summary,
      description: input.description,
      cover_image: input.cover_image ?? null,
      gallery: input.gallery ?? [],
      tags: input.tags ?? [],
      contact_person: input.contact_person ?? null,
      contact_phone: input.contact_phone ?? null,
      agreement_accepted: input.agreement_accepted,
      status: "Draft",
      created_at: now,
      updated_at: now,
    },
  });

  await prisma.community_event_status_histories.create({
    data: {
      community_event_id: id,
      status: "Draft",
      happened_at: now,
    },
  });

  await recordAudit(req, {
    action: "create_community_event",
    resource_type: "CommunityEvent",
    resource_id: id,
    payload: { title: input.title },
  });

  const complete = await prisma.community_events.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: true,
      community_event_notes: true,
    },
  });

  sendData(res, await serializeCommunityEvent(complete), 201);
}

export async function updateCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const isOwner = req.user && BigInt(req.user.id) === event.user_id;
  const isModerator = req.user && can(req.user, "events");

  if (!isModerator) {
    if (!isOwner) return forbidden("This action is unauthorized.");
    if (event.status !== "Draft" && event.status !== "Revision_Requested") {
      return validationError("status", "This submission can no longer be edited.");
    }
  }

  const input = validate(StoreCommunityEventSchema, req.body);
  const now = nowDb();
  const eventDate = parseDateInput(input.event_date)!;

  const updated = await prisma.community_events.update({
    where: { id },
    data: {
      title: input.title,
      community: input.community,
      category: input.category,
      event_date: eventDate,
      location: input.location,
      summary: input.summary,
      description: input.description,
      cover_image: input.cover_image ?? null,
      gallery: input.gallery ?? [],
      tags: input.tags ?? [],
      contact_person: input.contact_person ?? null,
      contact_phone: input.contact_phone ?? null,
      agreement_accepted: input.agreement_accepted,
      updated_at: now,
    },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, await serializeCommunityEvent(updated));
}

export async function deleteCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({
    where: { id },
    include: { community_event_documents: true },
  });
  if (!event) {
    return notFound("Community event not found.");
  }

  const isOwner = req.user && BigInt(req.user.id) === event.user_id;
  if (!isOwner || event.status !== "Draft") {
    return validationError("status", "Only draft submissions can be deleted.");
  }

  for (const doc of event.community_event_documents) {
    deleteStoredFile(doc.path);
  }

  await prisma.community_events.delete({ where: { id } });

  await recordAudit(req, {
    action: "delete_community_event",
    resource_type: "CommunityEvent",
    resource_id: id,
    payload: { title: event.title },
  });

  sendMessage(res, "Draft deleted.");
}

export async function uploadCommunityEventDocument(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const file = req.file;
  if (!file) {
    return validationError("file", "A file is required.");
  }

  const storedPath = storedPathOf(file)!;
  const now = nowDb();

  const doc = await prisma.community_event_documents.create({
    data: {
      community_event_id: id,
      name: file.originalname,
      path: storedPath,
      type: file.mimetype || "application/pdf",
      size: BigInt(file.size),
      created_at: now,
      updated_at: now,
    },
  });

  res.json({
    id: String(doc.id),
    name: doc.name,
    type: doc.type,
    size: Number(doc.size),
    url: storageUrl(doc.path),
  });
}

export async function submitForReview(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const isOwner = req.user && BigInt(req.user.id) === event.user_id;
  if (!isOwner) {
    return forbidden("This action is unauthorized.");
  }

  if (event.status !== "Draft" && event.status !== "Revision_Requested") {
    return validationError("status", "Only drafts or revisions can be submitted for review.");
  }

  const now = nowDb();
  await prisma.community_events.update({
    where: { id },
    data: { status: "Pending", submitted_at: now, updated_at: now },
  });

  await prisma.community_event_status_histories.create({
    data: {
      community_event_id: id,
      status: "Pending",
      happened_at: now,
    },
  });

  const complete = await prisma.community_events.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, await serializeCommunityEvent(complete));
}

export async function approveCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const now = nowDb();
  await prisma.community_events.update({
    where: { id },
    data: { status: "Approved", updated_at: now },
  });

  await prisma.community_event_status_histories.create({
    data: {
      community_event_id: id,
      status: "Approved",
      happened_at: now,
    },
  });

  await sendNotification({
    userId: event.user_id,
    title: `Event approved — ${event.title}`,
    body: "Your community event submission has been approved.",
    tone: "success",
    link: "/applicant/events",
  });

  await recordAudit(req, {
    action: "approve_community_event",
    resource_type: "CommunityEvent",
    resource_id: id,
  });

  const complete = await prisma.community_events.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, await serializeCommunityEvent(complete));
}

export async function rejectCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const { reason } = validate(z.object({ reason: z.string().min(1) }), req.body);
  const now = nowDb();
  const authorId = req.user ? BigInt(req.user.id) : null;
  const authorName = req.user?.name || "Moderator";

  await prisma.community_events.update({
    where: { id },
    data: { status: "Rejected", updated_at: now },
  });

  await prisma.community_event_status_histories.create({
    data: {
      community_event_id: id,
      status: "Rejected",
      note: reason,
      happened_at: now,
    },
  });

  await prisma.community_event_notes.create({
    data: {
      community_event_id: id,
      author_id: authorId,
      author_name: authorName,
      note: reason,
      created_at: now,
      updated_at: now,
    },
  });

  await sendNotification({
    userId: event.user_id,
    title: `Event rejected — ${event.title}`,
    body: reason,
    tone: "danger" as any,
    link: "/applicant/events",
  });

  await recordAudit(req, {
    action: "reject_community_event",
    resource_type: "CommunityEvent",
    resource_id: id,
    payload: { reason },
  });

  const complete = await prisma.community_events.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, await serializeCommunityEvent(complete));
}

export async function requestRevisionCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const { reason } = validate(z.object({ reason: z.string().min(1) }), req.body);
  const now = nowDb();
  const authorId = req.user ? BigInt(req.user.id) : null;
  const authorName = req.user?.name || "Moderator";

  await prisma.community_events.update({
    where: { id },
    data: { status: "Revision_Requested", updated_at: now },
  });

  await prisma.community_event_status_histories.create({
    data: {
      community_event_id: id,
      status: "Revision_Requested",
      note: reason,
      happened_at: now,
    },
  });

  await prisma.community_event_notes.create({
    data: {
      community_event_id: id,
      author_id: authorId,
      author_name: authorName,
      note: reason,
      created_at: now,
      updated_at: now,
    },
  });

  await sendNotification({
    userId: event.user_id,
    title: `Revision requested — ${event.title}`,
    body: reason,
    tone: "warning",
    link: "/applicant/events",
  });

  await recordAudit(req, {
    action: "request_revision_community_event",
    resource_type: "CommunityEvent",
    resource_id: id,
    payload: { reason },
  });

  const complete = await prisma.community_events.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, await serializeCommunityEvent(complete));
}

export async function adminUpdateCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const input = validate(StoreCommunityEventSchema.partial(), req.body);
  const now = nowDb();
  const eventDate = input.event_date ? parseDateInput(input.event_date)! : event.event_date;

  const updated = await prisma.community_events.update({
    where: { id },
    data: {
      title: input.title ?? event.title,
      community: input.community ?? event.community,
      category: input.category ?? event.category,
      event_date: eventDate,
      location: input.location ?? event.location,
      summary: input.summary ?? event.summary,
      description: input.description ?? event.description,
      cover_image: input.cover_image !== undefined ? input.cover_image : event.cover_image,
      gallery: input.gallery !== undefined ? input.gallery : (event.gallery as any),
      tags: input.tags !== undefined ? input.tags : (event.tags as any),
      contact_person: input.contact_person !== undefined ? input.contact_person : event.contact_person,
      contact_phone: input.contact_phone !== undefined ? input.contact_phone : event.contact_phone,
      updated_at: now,
    },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, await serializeCommunityEvent(updated));
}

export async function publishCommunityEvent(req: Request, res: Response) {
  const id = param(req.params.id);
  const event = await prisma.community_events.findUnique({ where: { id } });
  if (!event) {
    return notFound("Community event not found.");
  }

  const now = nowDb();
  const authorId = req.user ? BigInt(req.user.id) : null;
  const authorName = req.user?.name || "Moderator";

  // Formatted date string for articles (e.g. "August 07, 2026")
  const dateFormatted = event.event_date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  let articleSlug = event.published_article_slug;
  if (!articleSlug) {
    articleSlug = await generateUniqueSlug(
      event.title,
      async (s) => (await prisma.articles.findUnique({ where: { slug: s } })) !== null,
      "event"
    );

    await prisma.articles.create({
      data: {
        slug: articleSlug,
        title: event.title,
        cat: "Events",
        date: dateFormatted,
        published_on: event.event_date,
        read: "2 min read",
        excerpt: event.summary,
        img: event.cover_image || "media:seed-team",
        content: event.description,
        gallery: event.gallery ?? [],
        tags: event.tags ?? [],
        author: event.contact_person || event.submitter_name,
        author_role: event.community,
        status: "Published",
        created_at: now,
        updated_at: now,
      },
    });
  } else {
    await prisma.articles.update({
      where: { slug: articleSlug },
      data: {
        title: event.title,
        date: dateFormatted,
        published_on: event.event_date,
        excerpt: event.summary,
        img: event.cover_image || "media:seed-team",
        content: event.description,
        gallery: event.gallery ?? [],
        tags: event.tags ?? [],
        author: event.contact_person || event.submitter_name,
        author_role: event.community,
        status: "Published",
        updated_at: now,
      },
    });
  }

  await prisma.community_events.update({
    where: { id },
    data: {
      status: "Published",
      published_article_slug: articleSlug,
      updated_at: now,
    },
  });

  await prisma.community_event_status_histories.create({
    data: {
      community_event_id: id,
      status: "Published",
      happened_at: now,
    },
  });

  await prisma.community_event_notes.create({
    data: {
      community_event_id: id,
      author_id: authorId,
      author_name: authorName,
      note: "Published to News & Event.",
      created_at: now,
      updated_at: now,
    },
  });

  await sendNotification({
    userId: event.user_id,
    title: `Event published — ${event.title}`,
    body: "Your community event is now live on News & Event.",
    tone: "success",
    link: `/news/${articleSlug}`,
  });

  await recordAudit(req, {
    action: "publish_community_event",
    resource_type: "CommunityEvent",
    resource_id: id,
    payload: { article_slug: articleSlug },
  });

  const complete = await prisma.community_events.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      community_event_documents: true,
      community_event_status_histories: { orderBy: { happened_at: "asc" } },
      community_event_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, await serializeCommunityEvent(complete));
}
