import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Eye, Pencil, Trash2, Send } from "lucide-react";
import { ApplicantShell, RoleGate } from "@/components/applicant-shell";
import { EventFormModal } from "@/components/community-events/event-form-modal";
import { EventDetailModal } from "@/components/community-events/event-detail-modal";
import { useMyCommunityEvents } from "@/hooks/use-community-events";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import {
  createDraftEvent,
  deleteEvent,
  submitForReview,
  updateEvent,
  type CommunityEventFormInput,
  type StoredCommunityEvent,
} from "@/lib/community-events-store";

export const Route = createFileRoute("/applicant/events")({
  head: () => ({ meta: [{ title: "My Event Submissions — Widatra" }] }),
  component: MyEventSubmissionsPage,
});

const EDITABLE_STATUSES = ["Draft", "Revision Requested"];

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const map: Record<string, string> = {
    Draft: "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground",
    Pending: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    "Revision Requested": "bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400",
    Approved: "bg-brand-tint text-primary",
    Rejected: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400",
    Published: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  };
  return (
    <span className={`inline-flex h-6 px-2.5 rounded-full text-[11px] font-semibold ${map[status] ?? "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground"}`}>
      {t(`dashboard.events.statusLabels.${status}`)}
    </span>
  );
}

function MyEventSubmissionsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { events, refresh } = useMyCommunityEvents(user?.id);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StoredCommunityEvent | null>(null);
  const [viewing, setViewing] = useState<StoredCommunityEvent | null>(null);

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(ev: StoredCommunityEvent) {
    setEditing(ev);
    setFormOpen(true);
  }

  async function handleSaveDraft(values: CommunityEventFormInput) {
    if (!user) return;
    try {
      if (editing) {
        await updateEvent(editing.id, values);
        toast.success(t("dashboard.events.toast.draftUpdated"));
      } else {
        await createDraftEvent(values, { id: user.id, name: user.name, email: user.email });
        toast.success(t("dashboard.events.toast.draftSaved"));
      }
      await refresh();
      setFormOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the draft.");
    }
  }

  async function handleSubmitForReview(values: CommunityEventFormInput) {
    if (!user) return;
    try {
      if (editing) {
        await updateEvent(editing.id, values);
        await submitForReview(editing.id);
      } else {
        const created = await createDraftEvent(values, { id: user.id, name: user.name, email: user.email });
        await submitForReview(created.id);
      }
      toast.success(t("dashboard.events.toast.submitted"));
      await refresh();
      setFormOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't submit for review.");
    }
  }

  async function handleDelete(ev: StoredCommunityEvent) {
    if (ev.status !== "Draft") return;
    if (!window.confirm(t("dashboard.events.confirmDelete"))) return;
    await deleteEvent(ev.id);
    toast.success(t("dashboard.events.toast.deleted"));
    await refresh();
  }

  async function handleQuickSubmit(ev: StoredCommunityEvent) {
    await submitForReview(ev.id);
    toast.success(t("dashboard.events.toast.submitted"));
    await refresh();
  }

  return (
    <ApplicantShell
      title={t("dashboard.events.title")}
      subtitle={t("dashboard.events.subtitle")}
    >
      <RoleGate allow="internal">
      <div className="flex justify-end mb-4">
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep rounded"
        >
          <Plus className="w-4 h-4" /> {t("dashboard.events.newEvent")}
        </button>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.18em] text-corporate-gray bg-brand-soft">
              <th className="text-left px-5 py-3">{t("dashboard.events.table.title")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.events.table.community")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.events.table.eventDate")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.events.table.status")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.events.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-t border-hairline hover:bg-brand-soft/50">
                <td className="px-5 py-3.5 font-medium max-w-[220px] truncate">{ev.title}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{ev.community}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{ev.eventDate}</td>
                <td className="px-5 py-3.5"><StatusBadge status={ev.status} /></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewing(ev)} title={t("dashboard.events.actions.view")} className="text-corporate-gray hover:text-primary">
                      <Eye className="w-4 h-4" />
                    </button>
                    {EDITABLE_STATUSES.includes(ev.status) && (
                      <button onClick={() => openEdit(ev)} title={t("dashboard.events.actions.edit")} className="text-corporate-gray hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {EDITABLE_STATUSES.includes(ev.status) && (
                      <button onClick={() => handleQuickSubmit(ev)} title={t("dashboard.events.actions.submit")} className="text-corporate-gray hover:text-primary">
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    {ev.status === "Draft" && (
                      <button onClick={() => handleDelete(ev)} title={t("dashboard.events.actions.delete")} className="text-corporate-gray hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <div className="text-center text-sm text-corporate-gray py-14">{t("dashboard.events.empty")}</div>
        )}
      </div>

      <EventFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initialEvent={editing}
        defaultContact={user ? { name: user.name, phone: user.phone } : undefined}
        onSaveDraft={handleSaveDraft}
        onSubmitForReview={handleSubmitForReview}
      />

      <EventDetailModal event={viewing} open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} />
      </RoleGate>
    </ApplicantShell>
  );
}
