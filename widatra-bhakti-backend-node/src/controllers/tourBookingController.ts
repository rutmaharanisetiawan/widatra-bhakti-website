import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import {
  validate,
  sendData,
  notFound,
  validationError,
  forbidden,
  param,
} from "../utils/http.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, toIso, toDateString, parseDateInput } from "../utils/dates.js";
import { IdGenerator } from "../utils/idGenerator.js";
import { sendNotification } from "../utils/notifier.js";
import { can } from "../policies/access.js";

export const TOUR_STATUSES = [
  "Pending",
  "Reviewed",
  "Approved",
  "Rejected",
  "Completed",
] as const;

const TourStatusEnum = z.enum(TOUR_STATUSES);

const SubmitTourBookingSchema = z.object({
  tour_date: z.string().min(1),
  time_slot: z.string().min(1),
  visitor_name: z.string().min(1).max(255),
  organization: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().min(1),
  pax: z.coerce.number().int().min(1).max(100),
  purpose: z.string().min(1),
});

export function serializeTourBooking(b: any) {
  const statusHistory = (b.tour_status_histories || []).map((h: any) => ({
    status: h.status,
    date: toIso(h.happened_at),
    note: h.note,
  }));

  const internalNotes = (b.tour_notes || []).map((n: any) => ({
    id: String(n.id),
    author: n.author_name,
    note: n.note,
    date: toIso(n.created_at),
  }));

  return {
    id: b.id,
    tour_date: toDateString(b.tour_date),
    time_slot: b.time_slot,
    visitor_name: b.visitor_name,
    organization: b.organization,
    email: b.email,
    phone: b.phone,
    pax: Number(b.pax),
    purpose: b.purpose,
    status: b.status,
    status_history: statusHistory,
    internal_notes: internalNotes,
    submitted_at: toIso(b.submitted_at),
  };
}

export async function listTourBookings(_req: Request, res: Response) {
  const list = await prisma.tour_bookings.findMany({
    include: {
      tour_status_histories: { orderBy: { happened_at: "asc" } },
      tour_notes: { orderBy: { created_at: "desc" } },
    },
    orderBy: { submitted_at: "desc" },
  });

  sendData(res, list.map(serializeTourBooking));
}

export async function lookupTourBooking(req: Request, res: Response) {
  const { id, email } = validate(
    z.object({
      id: z.string().min(1),
      email: z.string().email(),
    }),
    req.query
  );

  const booking = await prisma.tour_bookings.findFirst({
    where: { id, email },
    include: {
      tour_status_histories: { orderBy: { happened_at: "asc" } },
      tour_notes: { orderBy: { created_at: "desc" } },
    },
  });

  if (!booking) {
    return notFound("No booking found for that confirmation code and email.");
  }

  sendData(res, serializeTourBooking(booking));
}

export async function submitTourBooking(req: Request, res: Response) {
  // If user is signed in and is internal employee, block with 403
  if (req.user && req.user.account_type === "internal") {
    return forbidden("Karyawan internal tidak diizinkan melakukan reservasi Tur Pabrik.");
  }

  const input = validate(SubmitTourBookingSchema, req.body);
  const now = nowDb();
  const id = IdGenerator.make("FT");
  const tourDate = parseDateInput(input.tour_date)!;
  const userId = req.user ? BigInt(req.user.id) : null;

  const booking = await prisma.tour_bookings.create({
    data: {
      id,
      user_id: userId,
      tour_date: tourDate,
      time_slot: input.time_slot,
      visitor_name: input.visitor_name,
      organization: input.organization,
      email: input.email,
      phone: input.phone,
      pax: input.pax,
      purpose: input.purpose,
      status: "Pending",
      submitted_at: now,
      created_at: now,
      updated_at: now,
    },
  });

  await prisma.tour_status_histories.create({
    data: {
      tour_booking_id: id,
      status: "Pending",
      happened_at: now,
    },
  });

  if (userId) {
    await sendNotification({
      userId,
      title: "Reservasi Kunjungan Pabrik Diterima",
      body: `Permohonan kunjungan untuk ${input.organization} (${input.tour_date}) sedang ditinjau.`,
      tone: "success",
      link: "/factory-tour",
    });
  }

  await recordAudit(req, {
    action: "submit_tour_booking",
    resource_type: "TourBooking",
    resource_id: id,
    payload: { organization: input.organization, pax: input.pax },
  });

  const complete = await prisma.tour_bookings.findUnique({
    where: { id },
    include: {
      tour_status_histories: true,
      tour_notes: true,
    },
  });

  sendData(res, serializeTourBooking(complete), 201);
}

export async function getTourBooking(req: Request, res: Response) {
  const id = param(req.params.id);
  const booking = await prisma.tour_bookings.findUnique({
    where: { id },
    include: {
      tour_status_histories: { orderBy: { happened_at: "asc" } },
      tour_notes: { orderBy: { created_at: "desc" } },
    },
  });

  if (!booking) {
    return notFound("Tour booking not found.");
  }

  // Authorization: Factory Tour Admin / Super Admin OR booking owner
  const isOwner = req.user && booking.user_id && BigInt(req.user.id) === booking.user_id;
  const isTourAdmin = req.user && can(req.user, "tours");
  if (!isOwner && !isTourAdmin) {
    return forbidden("This action is unauthorized.");
  }

  sendData(res, serializeTourBooking(booking));
}

export async function updateTourStatus(req: Request, res: Response) {
  const id = param(req.params.id);
  const booking = await prisma.tour_bookings.findUnique({ where: { id } });
  if (!booking) {
    return notFound("Tour booking not found.");
  }

  const { status, note } = validate(
    z.object({
      status: TourStatusEnum,
      note: z.string().optional().nullable(),
    }),
    req.body
  );

  const now = nowDb();
  await prisma.tour_bookings.update({
    where: { id },
    data: { status: status as any, updated_at: now },
  });

  await prisma.tour_status_histories.create({
    data: {
      tour_booking_id: id,
      status: status as any,
      note: note || null,
      happened_at: now,
    },
  });

  if (booking.user_id) {
    await sendNotification({
      userId: booking.user_id,
      title: "Update Kunjungan Pabrik",
      body: `Status reservasi kunjungan Anda telah diperbarui menjadi "${status}".`,
      tone: status === "Rejected" ? "warning" : "info",
      link: "/factory-tour",
    });
  }

  await recordAudit(req, {
    action: "update_status",
    resource_type: "TourBooking",
    resource_id: id,
    payload: { status, note },
  });

  const updated = await prisma.tour_bookings.findUnique({
    where: { id },
    include: {
      tour_status_histories: { orderBy: { happened_at: "asc" } },
      tour_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, serializeTourBooking(updated));
}

export async function addTourNote(req: Request, res: Response) {
  const id = param(req.params.id);
  const booking = await prisma.tour_bookings.findUnique({ where: { id } });
  if (!booking) {
    return notFound("Tour booking not found.");
  }

  const { note } = validate(z.object({ note: z.string().min(1) }), req.body);
  const authorId = req.user ? BigInt(req.user.id) : null;
  const authorName = req.user?.name || "Tour Admin";
  const now = nowDb();

  await prisma.tour_notes.create({
    data: {
      tour_booking_id: id,
      author_id: authorId,
      author_name: authorName,
      note,
      created_at: now,
      updated_at: now,
    },
  });

  const updated = await prisma.tour_bookings.findUnique({
    where: { id },
    include: {
      tour_status_histories: { orderBy: { happened_at: "asc" } },
      tour_notes: { orderBy: { created_at: "desc" } },
    },
  });

  sendData(res, serializeTourBooking(updated));
}
