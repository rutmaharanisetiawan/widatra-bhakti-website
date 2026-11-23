import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ApplicantShell } from "@/components/applicant-shell";
import {
  getAllNotifications,
  getUnreadNotificationCount,
  initNotificationsStore,
  markAllNotificationsRead,
  markNotificationRead,
  onNotificationsStoreChange,
  type StoredNotification,
} from "@/lib/notifications-store";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/applicant/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Widatra Applicant" }] }),
  component: NotificationsPage,
});

function useNotifications() {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  useEffect(() => {
    initNotificationsStore();
    setNotifications(getAllNotifications());
    return onNotificationsStoreChange(() => setNotifications(getAllNotifications()));
  }, []);
  return notifications;
}

function timeAgo(iso: string): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const unread = getUnreadNotificationCount();

  async function handleView(n: StoredNotification) {
    if (!n.read) await markNotificationRead(n.id);
    if (n.link) navigate({ to: n.link });
  }

  return (
    <ApplicantShell title={t("dashboard.notifications.title")} subtitle={t("dashboard.notifications.subtitle")}>
      {unread > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => markAllNotificationsRead()}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
      )}
      <div className="card-elevated divide-y divide-hairline">
        {notifications.length === 0 && (
          <div className="p-8 text-center text-[13px] text-corporate-gray">No notifications yet.</div>
        )}
        {notifications.map((n) => (
          <div key={n.id} className="p-5 flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div
                className={`w-2 h-2 mt-2 rounded-full ${
                  n.read ? "bg-corporate-gray/30" : n.tone === "success" ? "bg-emerald-500" : "bg-primary"
                }`}
              />
              <div>
                <div className={`font-semibold ${n.read ? "text-corporate-gray" : ""}`}>{n.title}</div>
                {n.body && <div className="text-[12px] text-corporate-gray mt-0.5">{n.body}</div>}
                <div className="text-[12px] text-corporate-gray mt-0.5">{timeAgo(n.createdAt)}</div>
              </div>
            </div>
            <button
              onClick={() => handleView(n)}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
            >
              {t("dashboard.notifications.view")}
            </button>
          </div>
        ))}
      </div>
    </ApplicantShell>
  );
}
