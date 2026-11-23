// ATS (Applicant Tracking System) store — backed by the real Laravel
// /applications API. HR/Admin see everything via GET /applications;
// applicants see only their own via GET /applications/mine (server-scoped,
// so no client-side filtering is required for that view — belongsToUser()
// is kept only for backward-compatible call sites).

import { api } from "@/lib/api-client";

export type ApplicationStatus = "Submitted" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Submitted",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export type EducationEntry = { degree: string; major: string; institution: string; year: string };
export type ExperienceEntry = { company: string; role: string; period: string; description: string };
export type StatusHistoryEntry = { status: ApplicationStatus; date: string; note?: string };
export type HrNote = { id: string; author: string; note: string; date: string };
export type InterviewType = "Online" | "Offline";
export type InterviewStatus = "Scheduled" | "Cancelled";

export type InterviewSchedule = {
  date: string;
  time: string;
  type: InterviewType;
  locationOrLink: string;
  interviewer: string;
  notes: string;
  status: InterviewStatus;
  scheduledAt: string;
  updatedAt: string;
};

export type InterviewScheduleInput = {
  date: string;
  time: string;
  type: InterviewType;
  locationOrLink: string;
  interviewer: string;
  notes: string;
};

export type StoredApplication = {
  id: string;
  userId: string;
  jobSlug: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  hasNoExperience: boolean;
  skills: string;
  linkedin: string;
  portfolio: string;
  cvFileName: string;
  cvFileType: string;
  cvFileSize: number;
  /** Real, absolute backend URL to the stored CV file (used directly as a link/iframe `src`). */
  cvDataUrl: string;
  coverLetter: string;
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  hrNotes: HrNote[];
  submittedAt: string;
  interview?: InterviewSchedule;
};

type ApiApplication = {
  id: string;
  user_id: string | null;
  job_slug: string;
  job_title: string;
  department: string;
  location: string;
  employment_type: string;
  full_name: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  education: EducationEntry[] | null;
  experience: ExperienceEntry[] | null;
  has_no_experience: boolean;
  skills: string | null;
  linkedin: string | null;
  portfolio: string | null;
  cv_file_name: string;
  cv_file_type: string;
  cv_file_size: number;
  cv_url: string;
  cover_letter: string | null;
  status: ApplicationStatus;
  status_history: { status: ApplicationStatus; date: string | null; note: string | null }[];
  hr_notes: { id: string; author: string; note: string; date: string | null }[];
  interview: {
    date: string | null;
    time: string;
    type: InterviewType;
    location_or_link: string;
    interviewer: string;
    notes: string | null;
    status: InterviewStatus;
    scheduled_at: string | null;
    updated_at: string | null;
  } | null;
  submitted_at: string | null;
};

function mapApplication(a: ApiApplication): StoredApplication {
  return {
    id: a.id,
    userId: a.user_id ?? "",
    jobSlug: a.job_slug,
    jobTitle: a.job_title,
    department: a.department,
    location: a.location,
    employmentType: a.employment_type,
    fullName: a.full_name,
    dob: a.dob,
    gender: a.gender,
    email: a.email,
    phone: a.phone,
    address: a.address,
    city: a.city,
    education: a.education ?? [],
    experience: a.experience ?? [],
    hasNoExperience: a.has_no_experience,
    skills: a.skills ?? "",
    linkedin: a.linkedin ?? "",
    portfolio: a.portfolio ?? "",
    cvFileName: a.cv_file_name,
    cvFileType: a.cv_file_type,
    cvFileSize: a.cv_file_size,
    cvDataUrl: a.cv_url,
    coverLetter: a.cover_letter ?? "",
    status: a.status,
    statusHistory: a.status_history.map((h) => ({ status: h.status, date: h.date ?? "", note: h.note ?? undefined })),
    hrNotes: a.hr_notes.map((n) => ({ id: n.id, author: n.author, note: n.note, date: n.date ?? "" })),
    submittedAt: a.submitted_at ?? "",
    interview: a.interview
      ? {
          date: a.interview.date ?? "",
          time: a.interview.time,
          type: a.interview.type,
          locationOrLink: a.interview.location_or_link,
          interviewer: a.interview.interviewer,
          notes: a.interview.notes ?? "",
          status: a.interview.status,
          scheduledAt: a.interview.scheduled_at ?? "",
          updatedAt: a.interview.updated_at ?? "",
        }
      : undefined,
  };
}

const EVENT_NAME = "widatra-ats-store-changed";

let allCache: StoredApplication[] = [];
let mineCache: StoredApplication[] = [];
let allLoaded = false;
let mineLoaded = false;
let allInFlight: Promise<void> | null = null;
let mineInFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onAtsStoreChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

function sortBySubmitted(apps: StoredApplication[]) {
  return apps.slice().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

async function loadAll(): Promise<void> {
  try {
    const apps = await api.get<ApiApplication[]>("/applications");
    allCache = apps.map(mapApplication);
  } catch {
    allCache = [];
  } finally {
    allLoaded = true;
    emitChange();
  }
}

async function loadMine(): Promise<void> {
  try {
    const apps = await api.get<ApiApplication[]>("/applications/mine");
    mineCache = apps.map(mapApplication);
  } catch {
    mineCache = [];
  } finally {
    mineLoaded = true;
    emitChange();
  }
}

/** Admin/HR — every application. */
export function initAtsStore() {
  if (typeof window === "undefined") return;
  if (!allLoaded && !allInFlight) {
    allInFlight = loadAll().finally(() => (allInFlight = null));
  }
}

/** Applicant — only their own applications. */
export function initMyApplicationsStore() {
  if (typeof window === "undefined") return;
  if (!mineLoaded && !mineInFlight) {
    mineInFlight = loadMine().finally(() => (mineInFlight = null));
  }
}

export async function refreshAtsStore(): Promise<void> {
  await Promise.all([loadAll(), loadMine()]);
}

/** Admin/HR — every application (requires manage-content-equivalent role). */
export function getAllApplications(): StoredApplication[] {
  return sortBySubmitted(allCache);
}

/** The signed-in applicant's own applications. */
export function getMyApplications(): StoredApplication[] {
  return sortBySubmitted(mineCache);
}

export function getApplicationsByUserId(userId: string): StoredApplication[] {
  return getAllApplications().filter((a) => a.userId === userId);
}

export function belongsToUser(app: StoredApplication, user: { id: string; email: string }): boolean {
  if (app.userId) return app.userId === user.id;
  return app.email.trim().toLowerCase() === user.email.trim().toLowerCase();
}

export function getApplicationsForUser(user: { id: string; email: string }): StoredApplication[] {
  // Prefer the server-scoped "mine" cache when populated (works for any
  // logged-in applicant); fall back to filtering the admin cache when an
  // HR/Admin viewer is looking up a specific applicant.
  if (mineLoaded) return getMyApplications().filter((a) => belongsToUser(a, user));
  return getAllApplications().filter((a) => belongsToUser(a, user));
}

export function hasUserAppliedToJob(userId: string, jobSlug: string): boolean {
  const pool = mineLoaded ? mineCache : allCache;
  return pool.some((a) => a.userId === userId && a.jobSlug === jobSlug);
}

export function getApplicationById(id: string): StoredApplication | undefined {
  return (
    allCache.find((a) => a.id === id) ??
    mineCache.find((a) => a.id === id)
  );
}

export async function fetchApplication(id: string): Promise<StoredApplication | undefined> {
  try {
    return mapApplication(await api.get<ApiApplication>(`/applications/${encodeURIComponent(id)}`));
  } catch {
    return undefined;
  }
}

export type NewApplicationInput = {
  userId: string;
  jobSlug: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  hasNoExperience: boolean;
  skills: string;
  linkedin: string;
  portfolio: string;
  coverLetter: string;
  /** The actual CV file to upload (PDF/DOC/DOCX, max 10MB). */
  cvFile: File;
};

export async function addApplication(input: NewApplicationInput): Promise<StoredApplication> {
  const form = new FormData();
  form.append("job_slug", input.jobSlug);
  form.append("job_title", input.jobTitle);
  form.append("department", input.department);
  form.append("location", input.location);
  form.append("employment_type", input.employmentType);
  form.append("full_name", input.fullName);
  form.append("dob", input.dob);
  form.append("gender", input.gender);
  form.append("email", input.email);
  form.append("phone", input.phone);
  form.append("address", input.address);
  form.append("city", input.city);
  form.append("has_no_experience", input.hasNoExperience ? "1" : "0");
  form.append("skills", input.skills);
  form.append("linkedin", input.linkedin);
  form.append("portfolio", input.portfolio);
  form.append("cover_letter", input.coverLetter);
  form.append("cv", input.cvFile);
  input.education.forEach((e, i) => {
    form.append(`education[${i}][degree]`, e.degree);
    form.append(`education[${i}][major]`, e.major);
    form.append(`education[${i}][institution]`, e.institution);
    form.append(`education[${i}][year]`, e.year);
  });
  if (!input.hasNoExperience) {
    input.experience.forEach((e, i) => {
      form.append(`experience[${i}][company]`, e.company);
      form.append(`experience[${i}][role]`, e.role);
      form.append(`experience[${i}][period]`, e.period);
      form.append(`experience[${i}][description]`, e.description);
    });
  }

  const created = mapApplication(await api.upload<ApiApplication>("/applications", form, "POST"));
  mineCache = [created, ...mineCache];
  allCache = [created, ...allCache];
  emitChange();
  return created;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  note?: string
): Promise<StoredApplication | undefined> {
  const updated = mapApplication(
    await api.patch<ApiApplication>(`/applications/${encodeURIComponent(id)}/status`, { status, note })
  );
  allCache = allCache.map((a) => (a.id === id ? updated : a));
  mineCache = mineCache.map((a) => (a.id === id ? updated : a));
  emitChange();
  return updated;
}

export async function scheduleInterview(
  id: string,
  input: InterviewScheduleInput
): Promise<StoredApplication | undefined> {
  const updated = mapApplication(
    await api.post<ApiApplication>(`/applications/${encodeURIComponent(id)}/interview`, {
      date: input.date,
      time: input.time,
      type: input.type,
      location_or_link: input.locationOrLink,
      interviewer: input.interviewer,
      notes: input.notes,
    })
  );
  allCache = allCache.map((a) => (a.id === id ? updated : a));
  mineCache = mineCache.map((a) => (a.id === id ? updated : a));
  emitChange();
  return updated;
}

export async function updateInterview(
  id: string,
  input: InterviewScheduleInput
): Promise<StoredApplication | undefined> {
  const updated = mapApplication(
    await api.patch<ApiApplication>(`/applications/${encodeURIComponent(id)}/interview`, {
      date: input.date,
      time: input.time,
      type: input.type,
      location_or_link: input.locationOrLink,
      interviewer: input.interviewer,
      notes: input.notes,
    })
  );
  allCache = allCache.map((a) => (a.id === id ? updated : a));
  mineCache = mineCache.map((a) => (a.id === id ? updated : a));
  emitChange();
  return updated;
}

export async function cancelInterview(id: string, note?: string): Promise<StoredApplication | undefined> {
  const updated = mapApplication(
    await api.post<ApiApplication>(`/applications/${encodeURIComponent(id)}/interview/cancel`, { note })
  );
  allCache = allCache.map((a) => (a.id === id ? updated : a));
  mineCache = mineCache.map((a) => (a.id === id ? updated : a));
  emitChange();
  return updated;
}

export async function addHrNote(id: string, note: string): Promise<StoredApplication | undefined> {
  const updated = mapApplication(
    await api.post<ApiApplication>(`/applications/${encodeURIComponent(id)}/hr-notes`, { note })
  );
  allCache = allCache.map((a) => (a.id === id ? updated : a));
  mineCache = mineCache.map((a) => (a.id === id ? updated : a));
  emitChange();
  return updated;
}
