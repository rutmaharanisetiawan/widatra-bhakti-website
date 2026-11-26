import { Request, Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData, notFound, param } from "../utils/http.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, toIso } from "../utils/dates.js";
import { sendPvReportEmail } from "../services/mailer.js";

const SubmitInquirySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1).max(255),
  organization: z.string().max(255).optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1),
  source: z.string().optional().nullable(),
});

const ReplySchema = z.object({
  message: z.string().min(1),
});

function serializeInquiry(i: any) {
  const replies = (i.contact_replies || []).map((r: any) => ({
    id: String(r.id),
    message: r.message,
    sent_at: toIso(r.sent_at),
  }));

  let derivedStatus = "Unread";
  if (i.archived) {
    derivedStatus = "Archived";
  } else if (replies.length > 0) {
    derivedStatus = "Replied";
  } else if (i.read) {
    derivedStatus = "Read";
  }

  return {
    id: i.id,
    name: i.name,
    organization: i.organization,
    email: i.email,
    phone: i.phone,
    subject: i.subject,
    message: i.message,
    source: i.source,
    received_at: toIso(i.received_at),
    read: Boolean(i.read),
    archived: Boolean(i.archived),
    status: derivedStatus,
    replies,
  };
}

export async function listInquiries(_req: Request, res: Response) {
  const list = await prisma.contact_inquiries.findMany({
    include: { contact_replies: { orderBy: { sent_at: "asc" } } },
    orderBy: { received_at: "desc" },
  });
  sendData(res, list.map(serializeInquiry));
}

export async function inquiryCounts(_req: Request, res: Response) {
  const [unread, total] = await Promise.all([
    prisma.contact_inquiries.count({
      where: { read: false, archived: false },
    }),
    prisma.contact_inquiries.count(),
  ]);
  res.json({ unread, total });
}

export async function getInquiry(req: Request, res: Response) {
  const id = param(req.params.id);
  const inquiry = await prisma.contact_inquiries.findUnique({
    where: { id },
    include: { contact_replies: { orderBy: { sent_at: "asc" } } },
  });
  if (!inquiry) {
    return notFound("Inquiry not found.");
  }

  if (!inquiry.read) {
    await prisma.contact_inquiries.update({
      where: { id },
      data: { read: true, updated_at: nowDb() },
    });
    inquiry.read = true;
  }

  sendData(res, serializeInquiry(inquiry));
}

export async function submitInquiry(req: Request, res: Response) {
  const input = validate(SubmitInquirySchema, req.body);
  const now = nowDb();
  const id = input.id?.trim() || `ci-${crypto.randomUUID()}`;

  const created = await prisma.contact_inquiries.create({
    data: {
      id,
      name: input.name,
      organization: input.organization ?? null,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject,
      message: input.message,
      source: input.source || "Contact Page",
      received_at: now,
      read: false,
      archived: false,
      created_at: now,
      updated_at: now,
    },
    include: { contact_replies: true },
  });

  // If this is a Pharmacovigilance / ADR report, dispatch email to the PV unit
  const isPvReport =
    input.source?.toLowerCase().includes("pharmacovigilance") ||
    input.source?.toLowerCase().includes("adr") ||
    input.source?.toLowerCase().includes("side effect") ||
    id.startsWith("PV-");

  if (isPvReport) {
    sendPvReportEmail({
      id,
      name: input.name,
      organization: input.organization,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      receivedAt: toIso(now) ?? new Date().toISOString(),
    }).catch((err) => {
      console.error("[PV Mail Dispatch Error]", err);
    });
  }

  sendData(res, serializeInquiry(created), 201);
}

export async function archiveInquiry(req: Request, res: Response) {
  const id = param(req.params.id);
  const inquiry = await prisma.contact_inquiries.findUnique({ where: { id } });
  if (!inquiry) {
    return notFound("Inquiry not found.");
  }

  const updated = await prisma.contact_inquiries.update({
    where: { id },
    data: { archived: true, updated_at: nowDb() },
    include: { contact_replies: true },
  });

  await recordAudit(req, {
    action: "archive",
    resource_type: "ContactInquiry",
    resource_id: id,
  });

  sendData(res, serializeInquiry(updated));
}

export async function unarchiveInquiry(req: Request, res: Response) {
  const id = param(req.params.id);
  const inquiry = await prisma.contact_inquiries.findUnique({ where: { id } });
  if (!inquiry) {
    return notFound("Inquiry not found.");
  }

  const updated = await prisma.contact_inquiries.update({
    where: { id },
    data: { archived: false, updated_at: nowDb() },
    include: { contact_replies: true },
  });

  await recordAudit(req, {
    action: "unarchive",
    resource_type: "ContactInquiry",
    resource_id: id,
  });

  sendData(res, serializeInquiry(updated));
}

export async function replyInquiry(req: Request, res: Response) {
  const id = param(req.params.id);
  const inquiry = await prisma.contact_inquiries.findUnique({ where: { id } });
  if (!inquiry) {
    return notFound("Inquiry not found.");
  }

  const { message } = validate(ReplySchema, req.body);
  const now = nowDb();
  const authorId = req.user ? BigInt(req.user.id) : null;

  await prisma.contact_replies.create({
    data: {
      contact_inquiry_id: id,
      author_id: authorId,
      message,
      sent_at: now,
      created_at: now,
      updated_at: now,
    },
  });

  const updated = await prisma.contact_inquiries.update({
    where: { id },
    data: { read: true, updated_at: now },
    include: { contact_replies: { orderBy: { sent_at: "asc" } } },
  });

  await recordAudit(req, {
    action: "reply",
    resource_type: "ContactInquiry",
    resource_id: id,
    payload: { message_length: message.length },
  });

  sendData(res, serializeInquiry(updated));
}
