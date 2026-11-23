import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { storageUrl } from "../config/storage.js";
import { storedPathOf } from "../middleware/upload.js";
import {
  validate,
  sendData,
  notFound,
  validationError,
  forbidden,
  param,
  parseMaybeJson,
  toBool,
} from "../utils/http.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, toIso, toDateString, parseDateInput, parseTimeInput, toTimeString } from "../utils/dates.js";
import { IdGenerator } from "../utils/idGenerator.js";
import { sendNotification } from "../utils/notifier.js";
import { can } from "../policies/access.js";

const ApplicationStatusEnum = z.enum([
  "Submitted",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
]);

const InterviewTypeEnum = z.enum(["Online", "Offline"]);

const ScheduleInterviewSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  type: InterviewTypeEnum,
  location_or_link: z.string().min(1),
  interviewer: z.string().min(1),
  notes: z.string().optional().nullable(),
});

function serializeInterview(i: any) {
  if (!i) return null;
  return {
    date: toDateString(i.date),
    time: typeof i.time === "string" ? i.time : toTimeString(i.time),
    type: i.type,
    location_or_link: i.location_or_link,
    interviewer: i.interviewer,
    notes: i.notes,
    status: i.status,
    scheduled_at: toIso(i.scheduled_at),
    updated_at: toIso(i.updated_at),
  };
}

export function serializeApplication(app: any) {
  const statusHistory = (app.application_status_histories || []).map((h: any) => ({
    status: h.status,
    date: toIso(h.happened_at),
    note: h.note,
  }));

  const hrNotes = (app.application_hr_notes || []).map((n: any) => ({
    id: String(n.id),
    author: n.author_name,
    note: n.note,
    date: toIso(n.created_at),
  }));

  return {
    id: app.id,
    user_id: app.users?.public_id ?? null,
    job_slug: app.job_slug,
    job_title: app.job_title,
    department: app.department,
    location: app.location,
    employment_type: app.employment_type,
    full_name: app.full_name,
    dob: toDateString(app.dob),
    gender: app.gender,
    email: app.email,
    phone: app.phone,
    address: app.address,
    city: app.city,
    education: typeof app.education === "string" ? JSON.parse(app.education) : app.education ?? [],
    experience: typeof app.experience === "string" ? JSON.parse(app.experience) : app.experience ?? [],
    has_no_experience: Boolean(app.has_no_experience),
    skills: app.skills,
    linkedin: app.linkedin,
    portfolio: app.portfolio,
    cv_file_name: app.cv_original_name,
    cv_file_type: app.cv_mime,
    cv_file_size: Number(app.cv_size),
    cv_url: storageUrl(app.cv_path),
    cover_letter: app.cover_letter,
    status: app.status,
    status_history: statusHistory,
    hr_notes: hrNotes,
    interview: serializeInterview(app.interviews),
    submitted_at: toIso(app.submitted_at),
  };
}

export async function listApplications(_req: Request, res: Response) {
  const list = await prisma.applications.findMany({
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
    orderBy: { submitted_at: "desc" },
  });

  sendData(res, list.map(serializeApplication));
}

export async function myApplications(req: Request, res: Response) {
  if (!req.user) {
    return forbidden("Unauthenticated.");
  }

  const userId = BigInt(req.user.id);
  const list = await prisma.applications.findMany({
    where: { user_id: userId },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
    orderBy: { submitted_at: "desc" },
  });

  sendData(res, list.map(serializeApplication));
}

export async function getApplication(req: Request, res: Response) {
  const id = param(req.params.id);
  const app = await prisma.applications.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
  });

  if (!app) {
    return notFound("Application not found.");
  }

  // Authorization: must be HR Manager / Super Admin OR the application owner
  const isOwner = req.user && BigInt(req.user.id) === app.user_id;
  const isHr = req.user && can(req.user, "hr");
  if (!isOwner && !isHr) {
    return forbidden("This action is unauthorized.");
  }

  sendData(res, serializeApplication(app));
}

export async function submitApplication(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return forbidden("Unauthenticated.");
  }

  // RBAC gate: Only external applicants may submit applications. Internal employees are blocked (403).
  if (user.account_type !== "external") {
    return forbidden("Karyawan internal tidak diizinkan melamar lowongan kerja melalui portal pelamar eksternal.");
  }

  const file = req.file;
  if (!file) {
    return validationError("cv", "The CV file is required.");
  }

  // Parse fields that might be stringified in multipart/form-data
  const body = req.body;
  const education = parseMaybeJson(body.education, body.education || []);
  const experience = parseMaybeJson(body.experience, body.experience || []);
  const hasNoExp = toBool(body.has_no_experience);

  const {
    job_slug,
    job_title,
    department,
    location,
    employment_type,
    full_name,
    dob,
    gender,
    email,
    phone,
    address,
    city,
    skills,
    linkedin,
    portfolio,
    cover_letter,
  } = body;

  if (!job_slug) return validationError("job_slug", "The job slug is required.");
  if (!full_name) return validationError("full_name", "The full name field is required.");
  if (!email) return validationError("email", "The email field is required.");
  if (!phone) return validationError("phone", "The phone field is required.");
  if (!dob) return validationError("dob", "The date of birth is required.");

  const userId = BigInt(user.id);

  // Check duplicate application
  const existing = await prisma.applications.findFirst({
    where: { user_id: userId, job_slug },
  });
  if (existing) {
    return validationError("job_slug", "You have already applied for this position. Check My Job Applications for its status.");
  }

  const appId = IdGenerator.make("APP");
  const storedPath = storedPathOf(file)!;
  const now = nowDb();
  const dobDate = parseDateInput(dob)!;

  const app = await prisma.applications.create({
    data: {
      id: appId,
      user_id: userId,
      job_slug,
      job_title: job_title || "Job Application",
      department: department || "General",
      location: location || "Pandaan",
      employment_type: employment_type || "Full-time",
      full_name,
      dob: dobDate,
      gender: gender || "Not Specified",
      email,
      phone,
      address: address || "",
      city: city || "",
      education,
      experience,
      has_no_experience: hasNoExp,
      skills: skills || "",
      linkedin: linkedin || null,
      portfolio: portfolio || null,
      cv_path: storedPath,
      cv_original_name: file.originalname,
      cv_mime: file.mimetype || "application/pdf",
      cv_size: BigInt(file.size),
      cover_letter: cover_letter || null,
      status: "Submitted",
      submitted_at: now,
      created_at: now,
      updated_at: now,
    },
  });

  // Create initial status history entry
  await prisma.application_status_histories.create({
    data: {
      application_id: appId,
      status: "Submitted",
      happened_at: now,
    },
  });

  // Send notification to applicant
  await sendNotification({
    userId,
    title: `Application received — ${app.job_title}`,
    body: "We have received your application and it is now under review.",
    tone: "success",
    link: "/applicant/applications",
  });

  await recordAudit(req, {
    action: "submit_application",
    resource_type: "Application",
    resource_id: appId,
    payload: { job_slug, job_title: app.job_title },
  });

  const complete = await prisma.applications.findUnique({
    where: { id: appId },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: true,
      application_hr_notes: true,
      interviews: true,
    },
  });

  sendData(res, serializeApplication(complete), 201);
}

export async function updateApplicationStatus(req: Request, res: Response) {
  const id = param(req.params.id);
  const app = await prisma.applications.findUnique({
    where: { id },
    include: { users: true },
  });
  if (!app) {
    return notFound("Application not found.");
  }

  const { status, note } = validate(
    z.object({
      status: ApplicationStatusEnum,
      note: z.string().optional().nullable(),
    }),
    req.body
  );

  const now = nowDb();
  await prisma.applications.update({
    where: { id },
    data: {
      status,
      updated_at: now,
    },
  });

  await prisma.application_status_histories.create({
    data: {
      application_id: id,
      status,
      note: note || null,
      happened_at: now,
    },
  });

  // Notify applicant
  await sendNotification({
    userId: app.user_id,
    title: `Application update — ${app.job_title}`,
    body: `Your application status changed to "${status}".`,
    tone: status === "Rejected" ? "warning" : "info",
    link: "/applicant/applications",
  });

  await recordAudit(req, {
    action: "update_status",
    resource_type: "Application",
    resource_id: id,
    payload: { status, note },
  });

  const updated = await prisma.applications.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
  });

  sendData(res, serializeApplication(updated));
}

export async function scheduleInterview(req: Request, res: Response) {
  const id = param(req.params.id);
  const app = await prisma.applications.findUnique({
    where: { id },
    include: { users: true },
  });
  if (!app) {
    return notFound("Application not found.");
  }

  const input = validate(ScheduleInterviewSchema, req.body);
  const now = nowDb();
  const interviewDate = parseDateInput(input.date)!;
  const interviewTime = parseTimeInput(input.time);

  // Upsert interview
  await prisma.interviews.upsert({
    where: { application_id: id },
    create: {
      application_id: id,
      date: interviewDate,
      time: interviewTime,
      type: input.type,
      location_or_link: input.location_or_link,
      interviewer: input.interviewer,
      notes: input.notes || null,
      status: "Scheduled",
      scheduled_at: now,
      created_at: now,
      updated_at: now,
    },
    update: {
      date: interviewDate,
      time: interviewTime,
      type: input.type,
      location_or_link: input.location_or_link,
      interviewer: input.interviewer,
      notes: input.notes || null,
      status: "Scheduled",
      scheduled_at: now,
      updated_at: now,
    },
  });

  await prisma.applications.update({
    where: { id },
    data: { status: "Interview", updated_at: now },
  });

  await prisma.application_status_histories.create({
    data: {
      application_id: id,
      status: "Interview",
      note: `Interview scheduled (${input.type}) with ${input.interviewer}.`,
      happened_at: now,
    },
  });

  await sendNotification({
    userId: app.user_id,
    title: `Interview scheduled — ${app.job_title}`,
    body: `Your interview is scheduled for ${input.date} ${input.time}.`,
    tone: "info",
    link: "/applicant/applications",
  });

  await recordAudit(req, {
    action: "schedule_interview",
    resource_type: "Application",
    resource_id: id,
    payload: { date: input.date, time: input.time, type: input.type },
  });

  const updated = await prisma.applications.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
  });

  sendData(res, serializeApplication(updated));
}

export async function updateInterview(req: Request, res: Response) {
  const id = param(req.params.id);
  const existingInterview = await prisma.interviews.findUnique({ where: { application_id: id } });
  if (!existingInterview) {
    return validationError("interview", "No interview has been scheduled for this application yet.");
  }

  const input = validate(ScheduleInterviewSchema, req.body);
  const now = nowDb();
  const interviewDate = parseDateInput(input.date)!;
  const interviewTime = parseTimeInput(input.time);

  await prisma.interviews.update({
    where: { application_id: id },
    data: {
      date: interviewDate,
      time: interviewTime,
      type: input.type,
      location_or_link: input.location_or_link,
      interviewer: input.interviewer,
      notes: input.notes || null,
      status: "Scheduled",
      updated_at: now,
    },
  });

  await prisma.application_status_histories.create({
    data: {
      application_id: id,
      status: "Interview",
      note: `Interview rescheduled (${input.type}) with ${input.interviewer}.`,
      happened_at: now,
    },
  });

  const updated = await prisma.applications.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
  });

  sendData(res, serializeApplication(updated));
}

export async function cancelInterview(req: Request, res: Response) {
  const id = param(req.params.id);
  const existingInterview = await prisma.interviews.findUnique({ where: { application_id: id } });
  if (!existingInterview) {
    return validationError("interview", "No interview has been scheduled for this application yet.");
  }

  const note = req.body.note || "Interview cancelled by HR.";
  const now = nowDb();

  await prisma.interviews.update({
    where: { application_id: id },
    data: { status: "Cancelled", updated_at: now },
  });

  await prisma.application_status_histories.create({
    data: {
      application_id: id,
      status: "Screening",
      note,
      happened_at: now,
    },
  });

  const updated = await prisma.applications.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
  });

  sendData(res, serializeApplication(updated));
}

export async function addHrNote(req: Request, res: Response) {
  const id = param(req.params.id);
  const app = await prisma.applications.findUnique({ where: { id } });
  if (!app) {
    return notFound("Application not found.");
  }

  const { note } = validate(z.object({ note: z.string().min(1) }), req.body);
  const authorId = req.user ? BigInt(req.user.id) : null;
  const authorName = req.user?.name || "HR Staff";
  const now = nowDb();

  await prisma.application_hr_notes.create({
    data: {
      application_id: id,
      author_id: authorId,
      author_name: authorName,
      note,
      created_at: now,
      updated_at: now,
    },
  });

  const updated = await prisma.applications.findUnique({
    where: { id },
    include: {
      users: { select: { public_id: true } },
      application_status_histories: { orderBy: { happened_at: "asc" } },
      application_hr_notes: { orderBy: { created_at: "desc" } },
      interviews: true,
    },
  });

  sendData(res, serializeApplication(updated));
}
