// Community Event Submission / Approval store — backed by the real Laravel
// /community-events API. Publishing to News & Event is handled entirely
// server-side by POST .../publish, so no client-side article-creation logic
// is needed anymore (the old localStorage version had to do that itself).

import { api } from "@/lib/api-client";

export type CommunityEventStatus =
  | "Draft"
  | "Pending"
  | "Revision Requested"
  | "Approved"
  | "Rejected"
  | "Published";

export const COMMUNITY_EVENT_STATUSES: CommunityEventStatus[] = [
  "Draft",
  "Pending",
  "Revision Requested",
  "Approved",
  "Rejected",
  "Published",
];

export const ADMIN_VISIBLE_STATUSES: CommunityEventStatus[] = [
  "Pending",
  "Revision Requested",
  "Approved",
  "Rejected",
  "Published",
];

export const COMMUNITY_OPTIONS = [
  "Sports",
  "Basketball",
  "House",
  "Volleyball",
  "Badminton",
  "Music & Arts",
  "Employee Club",
  "Others",
] as const;

export const EVENT_CATEGORIES = [
  "Tournament",
  "Workshop",
  "Celebration",
  "Competition",
  "Gathering",
  "Charity",
  "Other",
] as const;

export type CommunityEventStatusHistoryEntry = { status: CommunityEventStatus; date: string; note?: string };
export type CommunityEventNote = { id: string; author: string; note: string; date: string };

export type CommunityEventDocument = {
  name: string;
  type: string;
  size: number;
  /** Real backend URL once uploaded. Empty for a document staged locally but not yet uploaded. */
  dataUrl: string;
  /** Present only for a document just picked in this session, not yet sent to the server. */
  file?: File;
};

export type StoredCommunityEvent = {
  id: string;
  userId: string;
  submitterName: string;
  submitterEmail: string;
  title: string;
  community: string;
  category: string;
  eventDate: string;
  location: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  documents: CommunityEventDocument[];
  tags: string[];
  contactPerson: string;
  contactPhone: string;
  agreementAccepted: boolean;
  status: CommunityEventStatus;
  statusHistory: CommunityEventStatusHistoryEntry[];
  adminNotes: CommunityEventNote[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  publishedArticleSlug?: string;
};

type ApiCommunityEvent = {
  id: string;
  user_id: string | null;
  submitter_name: string;
  submitter_email: string;
  title: string;
  community: string;
  category: string;
  event_date: string;
  location: string;
  summary: string;
  description: string;
  cover_image: string;
  cover_image_url: string | null;
  gallery: string[] | null;
  documents: { name: string; type: string; size: number; url: string }[];
  tags: string[] | null;
  contact_person: string | null;
  contact_phone: string | null;
  agreement_accepted: boolean;
  status: CommunityEventStatus;
  status_history: { status: CommunityEventStatus; date: string | null; note: string | null }[];
  admin_notes: { id: string; author: string; note: string; date: string | null }[];
  created_at: string | null;
  updated_at: string | null;
  submitted_at: string | null;
  published_article_slug: string | null;
};

function mapEvent(e: ApiCommunityEvent): StoredCommunityEvent {
  return {
    id: e.id,
    userId: e.user_id ?? "",
    submitterName: e.submitter_name,
    submitterEmail: e.submitter_email,
    title: e.title,
    community: e.community,
    category: e.category,
    eventDate: e.event_date,
    location: e.location,
    summary: e.summary,
    description: e.description,
    coverImage: e.cover_image,
    gallery: e.gallery ?? [],
    documents: e.documents.map((d) => ({ name: d.name, type: d.type, size: d.size, dataUrl: d.url })),
    tags: e.tags ?? [],
    contactPerson: e.contact_person ?? "",
    contactPhone: e.contact_phone ?? "",
    agreementAccepted: e.agreement_accepted,
    status: e.status,
    statusHistory: e.status_history.map((h) => ({ status: h.status, date: h.date ?? "", note: h.note ?? undefined })),
    adminNotes: e.admin_notes.map((n) => ({ id: n.id, author: n.author, note: n.note, date: n.date ?? "" })),
    createdAt: e.created_at ?? "",
    updatedAt: e.updated_at ?? "",
    submittedAt: e.submitted_at ?? undefined,
    publishedArticleSlug: e.published_article_slug ?? undefined,
  };
}

function toApiPayload(input: CommunityEventFormInput) {
  return {
    title: input.title,
    community: input.community,
    category: input.category,
    event_date: input.eventDate,
    location: input.location,
    summary: input.summary,
    description: input.description,
    cover_image: input.coverImage,
    gallery: input.gallery ?? [],
    tags: input.tags ?? [],
    contact_person: input.contactPerson,
    contact_phone: input.contactPhone,
    agreement_accepted: input.agreementAccepted,
  };
}

async function uploadStagedDocuments(id: string, documents: CommunityEventDocument[]): Promise<void> {
  const staged = documents.filter((d) => d.file);
  for (const doc of staged) {
    const form = new FormData();
    form.append("file", doc.file as File, doc.name);
    await api.upload(`/community-events/${encodeURIComponent(id)}/documents`, form, "POST");
  }
}

const EVENT_NAME = "widatra-community-events-store-changed";

let adminCache: StoredCommunityEvent[] = [];
let mineCache: StoredCommunityEvent[] = [];
let adminLoaded = false;
let mineLoaded = false;
let adminInFlight: Promise<void> | null = null;
let mineInFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onCommunityEventsStoreChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

async function loadAdminQueue(): Promise<void> {
  try {
    const events = await api.get<ApiCommunityEvent[]>("/community-events");
    adminCache = events.map(mapEvent);
  } catch {
    adminCache = [];
  } finally {
    adminLoaded = true;
    emitChange();
  }
}

async function loadMine(): Promise<void> {
  try {
    const events = await api.get<ApiCommunityEvent[]>("/community-events/mine");
    mineCache = events.map(mapEvent);
  } catch {
    mineCache = [];
  } finally {
    mineLoaded = true;
    emitChange();
  }
}

/** Admin — Community Event Approval queue. */
export function initCommunityEventsStore() {
  if (typeof window === "undefined") return;
  if (!adminLoaded && !adminInFlight) {
    adminInFlight = loadAdminQueue().finally(() => (adminInFlight = null));
  }
}

/** Internal Employee — "My Event Submissions". */
export function initMyCommunityEventsStore() {
  if (typeof window === "undefined") return;
  if (!mineLoaded && !mineInFlight) {
    mineInFlight = loadMine().finally(() => (mineInFlight = null));
  }
}

export async function refreshCommunityEventsStore(): Promise<void> {
  await Promise.all([loadAdminQueue(), loadMine()]);
}

/** Every submission worth showing in the Admin approval queue. */
export function getAdminQueueEvents(): StoredCommunityEvent[] {
  return adminCache.filter((e) => ADMIN_VISIBLE_STATUSES.includes(e.status));
}

export function getEventsForUser(_userId: string): StoredCommunityEvent[] {
  return mineCache.slice().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getCommunityEventById(id: string): StoredCommunityEvent | undefined {
  return adminCache.find((e) => e.id === id) ?? mineCache.find((e) => e.id === id);
}

export type CommunityEventFormInput = {
  title: string;
  community: string;
  category: string;
  eventDate: string;
  location: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  documents: CommunityEventDocument[];
  tags: string[];
  contactPerson: string;
  contactPhone: string;
  agreementAccepted: boolean;
};

/** Create a new submission — always starts life as a Draft. */
export async function createDraftEvent(
  input: CommunityEventFormInput,
  _submitter: { id: string; name: string; email: string }
): Promise<StoredCommunityEvent> {
  let created = mapEvent(await api.post<ApiCommunityEvent>("/community-events", toApiPayload(input)));
  await uploadStagedDocuments(created.id, input.documents);
  const withDocs = await api.get<ApiCommunityEvent>(`/community-events/${encodeURIComponent(created.id)}`);
  created = mapEvent(withDocs);
  mineCache = [created, ...mineCache];
  emitChange();
  return created;
}

/** Edit an existing submission (Draft / Revision Requested by its owner). */
export async function updateEvent(id: string, input: CommunityEventFormInput): Promise<StoredCommunityEvent | undefined> {
  await api.put<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}`, toApiPayload(input));
  await uploadStagedDocuments(id, input.documents);
  const updated = mapEvent(await api.get<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}`));
  mineCache = mineCache.map((e) => (e.id === id ? updated : e));
  adminCache = adminCache.map((e) => (e.id === id ? updated : e));
  emitChange();
  return updated;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/community-events/${encodeURIComponent(id)}`);
  mineCache = mineCache.filter((e) => e.id !== id);
  adminCache = adminCache.filter((e) => e.id !== id);
  emitChange();
}

/** User submits a Draft / Revision Requested event for admin review. */
export async function submitForReview(id: string): Promise<StoredCommunityEvent | undefined> {
  const updated = mapEvent(await api.post<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}/submit`));
  mineCache = mineCache.map((e) => (e.id === id ? updated : e));
  emitChange();
  return updated;
}

function applyLocalUpdate(updated: StoredCommunityEvent) {
  mineCache = mineCache.map((e) => (e.id === updated.id ? updated : e));
  adminCache = adminCache.map((e) => (e.id === updated.id ? updated : e));
  emitChange();
}

export async function adminApprove(id: string): Promise<StoredCommunityEvent | undefined> {
  const updated = mapEvent(await api.post<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}/approve`));
  applyLocalUpdate(updated);
  return updated;
}

export async function adminReject(id: string, reason: string): Promise<StoredCommunityEvent | undefined> {
  const updated = mapEvent(
    await api.post<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}/reject`, { reason })
  );
  applyLocalUpdate(updated);
  return updated;
}

export async function adminRequestRevision(id: string, note: string): Promise<StoredCommunityEvent | undefined> {
  const updated = mapEvent(
    await api.post<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}/request-revision`, { reason: note })
  );
  applyLocalUpdate(updated);
  return updated;
}

/** Admin edits fields directly (e.g. "Edit before publishing") without changing status. */
export async function adminUpdateEvent(
  id: string,
  input: CommunityEventFormInput
): Promise<StoredCommunityEvent | undefined> {
  const updated = mapEvent(
    await api.put<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}/admin`, toApiPayload(input))
  );
  applyLocalUpdate(updated);
  return updated;
}

/** Publishes straight to News & Event — handled server-side. */
export async function adminPublish(id: string): Promise<StoredCommunityEvent | undefined> {
  const updated = mapEvent(await api.post<ApiCommunityEvent>(`/community-events/${encodeURIComponent(id)}/publish`));
  applyLocalUpdate(updated);
  return updated;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) reject(new Error(`Couldn't read "${file.name}".`));
      else resolve(result);
    };
    reader.onerror = () => reject(new Error(`Couldn't read "${file.name}".`));
    reader.readAsDataURL(file);
  });
}
