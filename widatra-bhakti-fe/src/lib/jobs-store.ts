// Job Postings store — backed by the real Laravel /jobs API.
// Same public/admin dual-cache pattern as news-store.ts / csr-store.ts.

import { api } from "@/lib/api-client";
import type { Job } from "@/lib/jobs-data";

const EVENT_NAME = "widatra-jobs-store-changed";

type ApiJob = {
  slug: string;
  title: string;
  department: Job["department"];
  location: string;
  work_mode: Job["workMode"];
  employment_type: Job["employmentType"];
  level: Job["level"];
  salary: string | null;
  deadline: string;
  posted: string;
  summary: string;
  description: string;
  responsibilities: string[] | null;
  qualifications: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  status: Job["status"];
  featured: boolean;
  cover_image: string;
  cover_image_url: string | null;
};

function mapJob(j: ApiJob): Job {
  return {
    slug: j.slug,
    title: j.title,
    department: j.department,
    location: j.location,
    workMode: j.work_mode,
    employmentType: j.employment_type,
    level: j.level,
    salary: j.salary ?? undefined,
    deadline: j.deadline,
    posted: j.posted,
    summary: j.summary,
    description: j.description,
    responsibilities: j.responsibilities ?? [],
    qualifications: j.qualifications ?? [],
    requirements: j.requirements ?? [],
    benefits: j.benefits ?? [],
    status: j.status,
    featured: j.featured,
    coverImage: j.cover_image,
  };
}

function toApiPayload(input: Omit<Job, "slug"> & { slug?: string }) {
  return {
    slug: input.slug,
    title: input.title,
    department: input.department,
    location: input.location,
    work_mode: input.workMode,
    employment_type: input.employmentType,
    level: input.level,
    salary: input.salary,
    deadline: input.deadline,
    posted: input.posted,
    summary: input.summary,
    description: input.description,
    responsibilities: input.responsibilities ?? [],
    qualifications: input.qualifications ?? [],
    requirements: input.requirements ?? [],
    benefits: input.benefits ?? [],
    status: input.status,
    featured: input.featured,
    cover_image: input.coverImage,
  };
}

let allCache: Job[] = [];
let publishedCache: Job[] = [];
let allLoaded = false;
let publishedLoaded = false;
let allInFlight: Promise<void> | null = null;
let publishedInFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onJobsStoreChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

async function loadPublished(): Promise<void> {
  try {
    const jobs = await api.get<ApiJob[]>("/jobs");
    publishedCache = jobs.map(mapJob);
  } catch {
    publishedCache = [];
  } finally {
    publishedLoaded = true;
    emitChange();
  }
}

async function loadAll(): Promise<void> {
  try {
    const jobs = await api.get<ApiJob[]>("/jobs?all=1");
    allCache = jobs.map(mapJob);
  } catch {
    allCache = [];
  } finally {
    allLoaded = true;
    emitChange();
  }
}

export function initJobsStore() {
  if (typeof window === "undefined") return;
  if (!publishedLoaded && !publishedInFlight) {
    publishedInFlight = loadPublished().finally(() => (publishedInFlight = null));
  }
}

export function initJobsAdminStore() {
  if (typeof window === "undefined") return;
  if (!allLoaded && !allInFlight) {
    allInFlight = loadAll().finally(() => (allInFlight = null));
  }
}

export async function refreshJobsStore(): Promise<void> {
  await Promise.all([loadPublished(), loadAll()]);
}

/** All jobs, including drafts — used by the Admin module. */
export function getAllJobs(): Job[] {
  return allLoaded ? allCache : publishedCache;
}

/** Only published jobs — used by the public Careers page and job detail page. */
export function getPublishedJobs(): Job[] {
  return publishedCache;
}

/** Any job by slug (admin — includes drafts). */
export function getStoredJob(slug: string): Job | undefined {
  return getAllJobs().find((j) => j.slug === slug);
}

/** A published job by slug — used by the public job detail page. */
export function getPublishedJob(slug: string): Job | undefined {
  return getPublishedJobs().find((j) => j.slug === slug);
}

export async function fetchPublishedJob(slug: string): Promise<Job | undefined> {
  try {
    return mapJob(await api.get<ApiJob>(`/jobs/${encodeURIComponent(slug)}`));
  } catch {
    return undefined;
  }
}

export type NewJobInput = Omit<Job, "slug"> & { slug?: string };

export async function addJob(input: NewJobInput): Promise<Job> {
  const created = mapJob(await api.post<ApiJob>("/jobs", toApiPayload(input)));
  allCache = [created, ...allCache];
  if (created.status === "Published") publishedCache = [created, ...publishedCache];
  emitChange();
  return created;
}

export async function updateJob(originalSlug: string, input: Job): Promise<Job | undefined> {
  const updated = mapJob(await api.put<ApiJob>(`/jobs/${encodeURIComponent(originalSlug)}`, toApiPayload(input)));
  allCache = allCache.map((j) => (j.slug === originalSlug ? updated : j));
  publishedCache =
    updated.status === "Published"
      ? [updated, ...publishedCache.filter((j) => j.slug !== originalSlug && j.slug !== updated.slug)]
      : publishedCache.filter((j) => j.slug !== originalSlug);
  emitChange();
  return updated;
}

export async function deleteJob(slug: string): Promise<void> {
  await api.delete(`/jobs/${encodeURIComponent(slug)}`);
  allCache = allCache.filter((j) => j.slug !== slug);
  publishedCache = publishedCache.filter((j) => j.slug !== slug);
  emitChange();
}

export async function setJobStatus(slug: string, status: Job["status"]): Promise<void> {
  const updated = mapJob(await api.patch<ApiJob>(`/jobs/${encodeURIComponent(slug)}/status`, { status }));
  allCache = allCache.map((j) => (j.slug === slug ? updated : j));
  publishedCache =
    updated.status === "Published"
      ? [updated, ...publishedCache.filter((j) => j.slug !== slug)]
      : publishedCache.filter((j) => j.slug !== slug);
  emitChange();
}

export async function setJobFeatured(slug: string, featured: boolean): Promise<void> {
  const updated = mapJob(await api.patch<ApiJob>(`/jobs/${encodeURIComponent(slug)}/featured`, { featured }));
  allCache = allCache.map((j) => (j.slug === slug ? updated : j));
  publishedCache = publishedCache.map((j) => (j.slug === slug ? updated : j));
  emitChange();
}
