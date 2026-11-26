// Contact Inbox store — backed by the real Laravel /contact-inquiries API.
//
// Two real-backend limitations, handled explicitly rather than faked:
//  - There is no "mark unread" endpoint (only viewing an inquiry marks it
//    read, server-side). toggleContactRead() only ever moves Unread -> Read.
//  - There is no destroy endpoint. deleteContactInquiry() archives the
//    inquiry instead (the closest real action) so it drops out of the
//    active inbox rather than silently vanishing only on the client.

import { api } from "@/lib/api-client";
import type { ContactInquiry } from "@/lib/contact-data";

type ApiContactInquiry = {
  id: string;
  name: string;
  organization: string | null;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  source: string | null;
  received_at: string | null;
  read: boolean;
  archived: boolean;
  status: string;
  replies: { id: string; message: string; sent_at: string | null }[];
};

function mapInquiry(i: ApiContactInquiry): ContactInquiry {
  return {
    id: i.id,
    name: i.name,
    organization: i.organization ?? undefined,
    email: i.email,
    phone: i.phone ?? undefined,
    subject: i.subject,
    message: i.message,
    source: i.source ?? "Contact Page",
    receivedAt: i.received_at ?? "",
    read: i.read,
    archived: i.archived,
    replies: i.replies.map((r) => ({ id: r.id, message: r.message, sentAt: r.sent_at ?? "" })),
  };
}

const EVENT_NAME = "widatra-contact-store-changed";

let cache: ContactInquiry[] = [];
let counts = { unread: 0, total: 0 };
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onContactStoreChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

async function loadAll(): Promise<void> {
  try {
    const [inquiries, countsRes] = await Promise.all([
      api.get<ApiContactInquiry[]>("/contact-inquiries"),
      api.get<{ unread: number; total: number }>("/contact-inquiries/counts"),
    ]);
    cache = inquiries.map(mapInquiry);
    counts = countsRes;
  } catch {
    cache = [];
    counts = { unread: 0, total: 0 };
  } finally {
    loaded = true;
    emitChange();
  }
}

/** Admin — call from the Contact Inbox module / sidebar badge / dashboard. */
export function initContactStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadAll().finally(() => (inFlight = null));
}

export async function refreshContactStore(): Promise<void> {
  inFlight = loadAll();
  await inFlight;
  inFlight = null;
}

function sortByReceivedDesc(inquiries: ContactInquiry[]): ContactInquiry[] {
  return [...inquiries].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

/** All inbox items, newest first — used by the Admin Contact Inbox module. */
export function getAllContactInquiries(): ContactInquiry[] {
  return sortByReceivedDesc(cache);
}

export function getContactInquiry(id: string): ContactInquiry | undefined {
  return cache.find((i) => i.id === id);
}

export function getUnreadContactCount(): number {
  return loaded ? counts.unread : cache.filter((i) => !i.read && !i.archived).length;
}

export function getTotalContactCount(): number {
  return loaded ? counts.total : cache.filter((i) => !i.archived).length;
}

export type NewContactInput = {
  id?: string;
  name: string;
  organization?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  /** Which form on the site this came from, e.g. "Contact Page". */
  source?: string;
};

/** Called by every Contact form on the public site. */
export async function addContactInquiry(input: NewContactInput): Promise<ContactInquiry> {
  const created = mapInquiry(
    await api.post<ApiContactInquiry>("/contact-inquiries", {
      id: input.id?.trim() || undefined,
      name: input.name.trim(),
      organization: input.organization?.trim() || undefined,
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      subject: input.subject.trim(),
      message: input.message.trim(),
      source: input.source?.trim() || "Contact Page",
    })
  );
  return created;
}

function applyUpdate(updated: ContactInquiry) {
  cache = cache.map((i) => (i.id === updated.id ? updated : i));
  if (!updated.read) counts = { ...counts, unread: counts.unread + 1 };
  emitChange();
}

/** Fetches full detail — the backend marks the inquiry as read as a side effect. */
export async function openContactInquiry(id: string): Promise<ContactInquiry | undefined> {
  try {
    const wasUnread = cache.find((i) => i.id === id)?.read === false;
    const updated = mapInquiry(await api.get<ApiContactInquiry>(`/contact-inquiries/${encodeURIComponent(id)}`));
    cache = cache.map((i) => (i.id === id ? updated : i));
    if (wasUnread) counts = { ...counts, unread: Math.max(0, counts.unread - 1) };
    emitChange();
    return updated;
  } catch {
    return undefined;
  }
}

/** Only ever transitions Unread -> Read (viewing is the only "read" trigger the backend exposes). */
export async function toggleContactRead(id: string): Promise<void> {
  const inquiry = getContactInquiry(id);
  if (!inquiry || inquiry.read) return;
  await openContactInquiry(id);
}

export async function setContactArchived(id: string, archived: boolean): Promise<ContactInquiry | undefined> {
  const updated = mapInquiry(
    await api.post<ApiContactInquiry>(
      `/contact-inquiries/${encodeURIComponent(id)}/${archived ? "archive" : "unarchive"}`
    )
  );
  applyUpdate(updated);
  return updated;
}

/** No destroy endpoint exists on the backend — archiving is the closest real equivalent. */
export async function deleteContactInquiry(id: string): Promise<void> {
  await setContactArchived(id, true);
}

export async function replyToContactInquiry(id: string, message: string): Promise<ContactInquiry | undefined> {
  const trimmed = message.trim();
  if (!trimmed) return undefined;
  const updated = mapInquiry(
    await api.post<ApiContactInquiry>(`/contact-inquiries/${encodeURIComponent(id)}/reply`, { message: trimmed })
  );
  applyUpdate(updated);
  return updated;
}
