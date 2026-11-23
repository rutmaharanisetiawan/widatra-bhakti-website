// Factory Tour booking store — backed by the real Laravel /tour-bookings
// API. Booking + public status lookup work for anonymous visitors; the
// admin "all bookings" list requires an HR/Admin/CSR Coordinator session.

import { api } from "@/lib/api-client";

export type TourStatus = "Pending" | "Reviewed" | "Approved" | "Rejected" | "Completed";

export const TOUR_STATUSES: TourStatus[] = ["Pending", "Reviewed", "Approved", "Rejected", "Completed"];

export type TourStatusHistoryEntry = { status: TourStatus; date: string; note?: string };
export type TourNote = { id: string; author: string; note: string; date: string };

export type StoredTourBooking = {
  id: string;
  tourDate: string;
  timeSlot: string;
  visitorName: string;
  organization: string;
  email: string;
  phone: string;
  pax: number;
  purpose: string;
  status: TourStatus;
  statusHistory: TourStatusHistoryEntry[];
  internalNotes: TourNote[];
  submittedAt: string;
};

type ApiTourBooking = {
  id: string;
  tour_date: string;
  time_slot: string;
  visitor_name: string;
  organization: string;
  email: string;
  phone: string;
  pax: number;
  purpose: string;
  status: TourStatus;
  status_history: { status: TourStatus; date: string | null; note: string | null }[];
  internal_notes: { id: string; author: string; note: string; date: string | null }[];
  submitted_at: string | null;
};

function mapBooking(b: ApiTourBooking): StoredTourBooking {
  return {
    id: b.id,
    tourDate: b.tour_date,
    timeSlot: b.time_slot,
    visitorName: b.visitor_name,
    organization: b.organization,
    email: b.email,
    phone: b.phone,
    pax: b.pax,
    purpose: b.purpose,
    status: b.status,
    statusHistory: b.status_history.map((h) => ({ status: h.status, date: h.date ?? "", note: h.note ?? undefined })),
    internalNotes: b.internal_notes.map((n) => ({ id: n.id, author: n.author, note: n.note, date: n.date ?? "" })),
    submittedAt: b.submitted_at ?? "",
  };
}

const EVENT_NAME = "widatra-tour-store-changed";

let cache: StoredTourBooking[] = [];
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onTourStoreChange(cb: () => void) {
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
    const bookings = await api.get<ApiTourBooking[]>("/tour-bookings");
    cache = bookings.map(mapBooking);
  } catch {
    cache = [];
  } finally {
    loaded = true;
    emitChange();
  }
}

/** Admin — call from the Factory Tour Management module. */
export function initTourStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadAll().finally(() => (inFlight = null));
}

export async function refreshTourStore(): Promise<void> {
  inFlight = loadAll();
  await inFlight;
  inFlight = null;
}

/** Admin — every booking. */
export function getAllBookings(): StoredTourBooking[] {
  return cache
    .slice()
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getBookingById(id: string): StoredTourBooking | undefined {
  return cache.find((b) => b.id.toLowerCase() === id.trim().toLowerCase());
}

/** Public — confirmation-code + email lookup, used by visitors to check their own booking status. */
export async function lookupBooking(id: string, email: string): Promise<StoredTourBooking | undefined> {
  try {
    const booking = await api.get<ApiTourBooking>(
      `/tour-bookings/lookup?id=${encodeURIComponent(id.trim())}&email=${encodeURIComponent(email.trim())}`
    );
    return mapBooking(booking);
  } catch {
    return undefined;
  }
}

export type NewTourBookingInput = Omit<
  StoredTourBooking,
  "id" | "status" | "statusHistory" | "internalNotes" | "submittedAt"
>;

export async function addBooking(input: NewTourBookingInput): Promise<StoredTourBooking> {
  const created = mapBooking(
    await api.post<ApiTourBooking>("/tour-bookings", {
      tour_date: input.tourDate,
      time_slot: input.timeSlot,
      visitor_name: input.visitorName,
      organization: input.organization,
      email: input.email,
      phone: input.phone,
      pax: input.pax,
      purpose: input.purpose,
    })
  );
  cache = [created, ...cache];
  emitChange();
  return created;
}

export async function updateBookingStatus(
  id: string,
  status: TourStatus,
  note?: string
): Promise<StoredTourBooking | undefined> {
  const updated = mapBooking(
    await api.patch<ApiTourBooking>(`/tour-bookings/${encodeURIComponent(id)}/status`, { status, note })
  );
  cache = cache.map((b) => (b.id === id ? updated : b));
  emitChange();
  return updated;
}

export async function addInternalNote(id: string, note: string): Promise<StoredTourBooking | undefined> {
  const updated = mapBooking(
    await api.post<ApiTourBooking>(`/tour-bookings/${encodeURIComponent(id)}/notes`, { note })
  );
  cache = cache.map((b) => (b.id === id ? updated : b));
  emitChange();
  return updated;
}
