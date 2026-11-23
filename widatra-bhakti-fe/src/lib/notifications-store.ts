// Applicant "Notifications" store — backed by the real Laravel
// /notifications API.

import { api } from "@/lib/api-client";

export type StoredNotification = {
  id: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warning" | "danger";
  link: string | null;
  read: boolean;
  createdAt: string;
};

type ApiNotification = {
  id: string;
  title: string;
  body: string;
  tone: StoredNotification["tone"];
  link: string | null;
  read: boolean;
  created_at: string | null;
};

function mapNotification(n: ApiNotification): StoredNotification {
  return { id: n.id, title: n.title, body: n.body, tone: n.tone, link: n.link, read: n.read, createdAt: n.created_at ?? "" };
}

const EVENT_NAME = "widatra-notifications-store-changed";

let cache: StoredNotification[] = [];
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onNotificationsStoreChange(cb: () => void) {
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
    const notifications = await api.get<ApiNotification[]>("/notifications");
    cache = notifications.map(mapNotification);
  } catch {
    cache = [];
  } finally {
    loaded = true;
    emitChange();
  }
}

export function initNotificationsStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadAll().finally(() => (inFlight = null));
}

export async function refreshNotificationsStore(): Promise<void> {
  inFlight = loadAll();
  await inFlight;
  inFlight = null;
}

export function getAllNotifications(): StoredNotification[] {
  return cache
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadNotificationCount(): number {
  return cache.filter((n) => !n.read).length;
}

export async function markNotificationRead(id: string): Promise<void> {
  const updated = mapNotification(await api.post<ApiNotification>(`/notifications/${encodeURIComponent(id)}/read`));
  cache = cache.map((n) => (n.id === id ? updated : n));
  emitChange();
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/notifications/read-all");
  cache = cache.map((n) => ({ ...n, read: true }));
  emitChange();
}
