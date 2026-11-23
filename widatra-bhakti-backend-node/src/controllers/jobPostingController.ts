import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData, sendMessage, notFound, validationError, forbidden, param } from "../utils/http.js";
import { resolveMediaUrl } from "../utils/mediaResolver.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb, toDateString, parseDateInput } from "../utils/dates.js";
import { generateUniqueSlug } from "../utils/slug.js";
import { can } from "../policies/access.js";

const DepartmentEnum = z.enum([
  "Production",
  "Quality",
  "R&D",
  "Engineering",
  "Supply Chain",
  "Corporate",
  "Sales & Marketing",
]);

const WorkModeEnum = z.enum(["On-site", "Hybrid", "Remote"]);
const EmploymentTypeEnum = z.enum(["Full-time", "Contract", "Internship"]);
const LevelEnum = z.enum(["Entry", "Mid", "Senior", "Lead"]);
const StatusEnum = z.enum(["Draft", "Published"]);

const JobPostingSchema = z.object({
  slug: z.string().regex(/^[\w-]+$/).optional().nullable(),
  title: z.string().min(1).max(255),
  department: DepartmentEnum,
  location: z.string().min(1).max(255),
  work_mode: WorkModeEnum,
  employment_type: EmploymentTypeEnum,
  level: LevelEnum,
  salary: z.string().optional().nullable(),
  deadline: z.string().min(1),
  posted: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  responsibilities: z.array(z.string()),
  qualifications: z.array(z.string()),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()),
  status: StatusEnum,
  featured: z.boolean().optional(),
  cover_image: z.string().optional().nullable(),
});

function humanizeDept(val: string): string {
  const map: Record<string, string> = {
    R_D: "R&D",
    Supply_Chain: "Supply Chain",
    Sales___Marketing: "Sales & Marketing",
  };
  return map[val] || val;
}

function prismaDept(val: string): any {
  const map: Record<string, string> = {
    "R&D": "R_D",
    "Supply Chain": "Supply_Chain",
    "Sales & Marketing": "Sales___Marketing",
  };
  return map[val] || val;
}

function humanizeWorkMode(val: string): string {
  return val === "On_site" ? "On-site" : val;
}

function prismaWorkMode(val: string): any {
  return val === "On-site" ? "On_site" : val;
}

function humanizeEmpType(val: string): string {
  return val === "Full_time" ? "Full-time" : val;
}

function prismaEmpType(val: string): any {
  return val === "Full-time" ? "Full_time" : val;
}

export async function serializeJobPosting(j: any) {
  return {
    slug: j.slug,
    title: j.title,
    department: humanizeDept(j.department),
    location: j.location,
    work_mode: humanizeWorkMode(j.work_mode),
    employment_type: humanizeEmpType(j.employment_type),
    level: j.level,
    salary: j.salary,
    deadline: toDateString(j.deadline),
    posted: toDateString(j.posted),
    summary: j.summary,
    description: j.description,
    responsibilities: typeof j.responsibilities === "string" ? JSON.parse(j.responsibilities) : j.responsibilities,
    qualifications: typeof j.qualifications === "string" ? JSON.parse(j.qualifications) : j.qualifications,
    requirements: typeof j.requirements === "string" ? JSON.parse(j.requirements) : j.requirements,
    benefits: typeof j.benefits === "string" ? JSON.parse(j.benefits) : j.benefits,
    status: j.status,
    featured: Boolean(j.featured),
    cover_image: j.cover_image,
    cover_image_url: await resolveMediaUrl(j.cover_image),
  };
}

export async function listJobPostings(req: Request, res: Response) {
  const showAll = req.query.all === "1" || req.query.all === "true";

  if (showAll) {
    if (!req.user || !can(req.user, "hr")) {
      return forbidden("This action is unauthorized.");
    }
    const list = await prisma.job_postings.findMany({
      orderBy: { posted: "desc" },
    });
    const serialized = await Promise.all(list.map(serializeJobPosting));
    return sendData(res, serialized);
  }

  const list = await prisma.job_postings.findMany({
    where: { status: "Published" },
    orderBy: { posted: "desc" },
  });
  const serialized = await Promise.all(list.map(serializeJobPosting));
  sendData(res, serialized);
}

export async function getJobPosting(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const job = await prisma.job_postings.findFirst({
    where: { slug, status: "Published" },
  });
  if (!job) {
    return notFound("Job posting not found.");
  }
  sendData(res, await serializeJobPosting(job));
}

export async function showAdminJobPosting(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const job = await prisma.job_postings.findUnique({
    where: { slug },
  });
  if (!job) {
    return notFound("Job posting not found.");
  }
  sendData(res, await serializeJobPosting(job));
}

export async function createJobPosting(req: Request, res: Response) {
  const input = validate(JobPostingSchema, req.body);

  let finalSlug = input.slug;
  if (!finalSlug) {
    finalSlug = await generateUniqueSlug(
      input.title,
      async (s) => (await prisma.job_postings.findUnique({ where: { slug: s } })) !== null,
      "job"
    );
  } else {
    const existing = await prisma.job_postings.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return validationError("slug", "The slug has already been taken.");
    }
  }

  const now = nowDb();
  const deadlineDate = parseDateInput(input.deadline)!;
  const postedDate = parseDateInput(input.posted)!;

  const created = await prisma.job_postings.create({
    data: {
      slug: finalSlug,
      title: input.title,
      department: prismaDept(input.department),
      location: input.location,
      work_mode: prismaWorkMode(input.work_mode),
      employment_type: prismaEmpType(input.employment_type),
      level: input.level,
      salary: input.salary ?? null,
      deadline: deadlineDate,
      posted: postedDate,
      summary: input.summary,
      description: input.description,
      responsibilities: input.responsibilities,
      qualifications: input.qualifications,
      requirements: input.requirements,
      benefits: input.benefits,
      status: input.status,
      featured: input.featured ?? false,
      cover_image: input.cover_image ?? null,
      created_at: now,
      updated_at: now,
    },
  });

  await recordAudit(req, {
    action: "create",
    resource_type: "JobPosting",
    resource_id: created.slug,
    payload: { title: created.title },
  });

  sendData(res, await serializeJobPosting(created), 201);
}

export async function updateJobPosting(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const job = await prisma.job_postings.findUnique({ where: { slug } });
  if (!job) {
    return notFound("Job posting not found.");
  }

  const input = validate(JobPostingSchema.omit({ slug: true }), req.body);
  const deadlineDate = parseDateInput(input.deadline)!;
  const postedDate = parseDateInput(input.posted)!;

  const updated = await prisma.job_postings.update({
    where: { slug },
    data: {
      title: input.title,
      department: prismaDept(input.department),
      location: input.location,
      work_mode: prismaWorkMode(input.work_mode),
      employment_type: prismaEmpType(input.employment_type),
      level: input.level,
      salary: input.salary ?? null,
      deadline: deadlineDate,
      posted: postedDate,
      summary: input.summary,
      description: input.description,
      responsibilities: input.responsibilities,
      qualifications: input.qualifications,
      requirements: input.requirements,
      benefits: input.benefits,
      status: input.status,
      featured: input.featured !== undefined ? input.featured : job.featured,
      cover_image: input.cover_image ?? null,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "update",
    resource_type: "JobPosting",
    resource_id: updated.slug,
    payload: { title: updated.title },
  });

  sendData(res, await serializeJobPosting(updated));
}

export async function deleteJobPosting(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const job = await prisma.job_postings.findUnique({ where: { slug } });
  if (!job) {
    return notFound("Job posting not found.");
  }

  await prisma.job_postings.delete({ where: { slug } });

  await recordAudit(req, {
    action: "delete",
    resource_type: "JobPosting",
    resource_id: slug,
    payload: { title: job.title },
  });

  sendMessage(res, "Job posting deleted.");
}

export async function setJobPostingStatus(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const job = await prisma.job_postings.findUnique({ where: { slug } });
  if (!job) {
    return notFound("Job posting not found.");
  }

  const { status } = validate(z.object({ status: StatusEnum }), req.body);
  const updated = await prisma.job_postings.update({
    where: { slug },
    data: {
      status,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "set_status",
    resource_type: "JobPosting",
    resource_id: slug,
    payload: { status },
  });

  sendData(res, await serializeJobPosting(updated));
}

export async function setJobPostingFeatured(req: Request, res: Response) {
  const slug = param(req.params.slug);
  const job = await prisma.job_postings.findUnique({ where: { slug } });
  if (!job) {
    return notFound("Job posting not found.");
  }

  const { featured } = validate(z.object({ featured: z.boolean() }), req.body);
  const updated = await prisma.job_postings.update({
    where: { slug },
    data: {
      featured,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "set_featured",
    resource_type: "JobPosting",
    resource_id: slug,
    payload: { featured },
  });

  sendData(res, await serializeJobPosting(updated));
}
