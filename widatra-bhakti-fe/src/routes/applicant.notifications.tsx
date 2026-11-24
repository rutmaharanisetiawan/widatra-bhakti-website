import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { Bell, CheckCheck, CheckCircle2, Info, ArrowRight } from "lucide-react";

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
  const { t, language } = useLanguage();
  const isId = language === "id";
  const navigate = useNavigate();
  const notifications = useNotifications();
  const unread = getUnreadNotificationCount();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = useMemo(
    () => (filter === "unread" ? notifications.filter((n) => !n.read) : notifications),
    [filter, notifications]
  );

  async function handleView(n: StoredNotification) {
    if (!n.read) await markNotificationRead(n.id);
    if (n.link) navigate({ to: n.link });
  }

  return (
    <ApplicantShell
      title={t("dashboard.notifications.title")}
      subtitle={t("dashboard.notifications.subtitle")}
      headerActions={
        unread > 0 ? (
          <button
            type="button"
            onClick={() => markAllNotificationsRead()}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 hover:bg-primary hover:text-white dark:hover:bg-sky-400 dark:hover:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{isId ? "Tandai Semua Dibaca" : "Mark All Read"}</span>
          </button>
        ) : undefined
      }
    >
      {/* Interactive Filter Tabs */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-primary dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs"
              : "bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300"
          }`}
        >
          <span>{isId ? "Semua" : "All"}</span>
          <span className="px-1.5 rounded-full text-[10px] font-bold bg-black/10 dark:bg-white/10">
            {notifications.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "unread"
              ? "bg-primary dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs"
              : "bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300"
          }`}
        >
          <span>{isId ? "Belum Dibaca" : "Unread"}</span>
          <span className="px-1.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
            {unread}
          </span>
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 shadow-xs divide-y divide-slate-200/70 dark:divide-slate-700/70 overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-300">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
            {isId ? "Tidak ada notifikasi." : "No notifications yet."}
          </div>
        )}
        {filtered.map((n) => {
          const isSuccess = n.tone === "success";
          return (
            <div
              key={n.id}
              onClick={() => handleView(n)}
              className={`group p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !n.read
                  ? "bg-blue-50/40 dark:bg-sky-500/[0.08] hover:bg-blue-50/80 dark:hover:bg-sky-500/[0.14]"
                  : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSuccess
                      ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                      : "bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300"
                  }`}
                >
                  {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-sm ${
                        n.read
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary dark:bg-sky-400 shrink-0" />
                    )}
                  </div>
                  {n.body && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {n.body}
                    </div>
                  )}
                  <div className="text-[11px] font-mono text-slate-400 dark:text-slate-400 mt-1.5">
                    {timeAgo(n.createdAt)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(n);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-sky-400 dark:group-hover:text-slate-950 text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer"
              >
                <span>{t("dashboard.notifications.view")}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </ApplicantShell>
  );
}
