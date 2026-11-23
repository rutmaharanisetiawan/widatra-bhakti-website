import { useState } from "react";
import { ModalShell, CloseButton } from "@/components/career/career-flow";
import { StatusPill } from "@/components/admin-shell";
import { useLanguage } from "@/hooks/use-language";
import {
  TOUR_STATUSES,
  addInternalNote,
  updateBookingStatus,
  type TourStatus,
  type StoredTourBooking,
} from "@/lib/tour-store";
import { Check, X, CheckCheck } from "lucide-react";
import { toast } from "sonner";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1">{label}</div>
      <div className="text-sm font-medium text-corporate-black dark:text-foreground">{value || "—"}</div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function formatTourDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export function AdminBookingModal({
  booking,
  onClose,
  onChanged,
}: {
  booking: StoredTourBooking;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t } = useLanguage();
  const [b, setB] = useState(booking);
  const [note, setNote] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState<TourStatus>(booking.status);

  const applyStatus = async (status: TourStatus, defaultNote?: string) => {
    const updated = await updateBookingStatus(b.id, status, statusNote || defaultNote);
    if (updated) {
      setB(updated);
      setPendingStatus(status);
      setStatusNote("");
      onChanged();
      toast.success(`${t("admin.factoryTour.modal.toastMarkedPrefix")} ${b.id} ${t("admin.factoryTour.modal.toastMarkedMiddle")} ${t(`admin.statusLabels.${status}`)}`);
    }
  };

  const submitNote = async () => {
    if (!note.trim()) return;
    const updated = await addInternalNote(b.id, note.trim());
    if (updated) {
      setB(updated);
      setNote("");
      onChanged();
      toast.success(t("admin.factoryTour.modal.addNote"));
    }
  };

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-4xl" labelledBy="admin-booking-title">
      <CloseButton onClose={onClose} />
      <div className="max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-hairline bg-gradient-to-br from-brand-tint/60 to-white dark:to-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono text-corporate-gray">{b.id}</span>
            <StatusPill status={b.status} />
          </div>
          <h2 id="admin-booking-title" className="text-2xl lg:text-3xl font-semibold font-display tracking-tight mb-1">{b.visitorName}</h2>
          <p className="text-sm text-corporate-gray">
            {formatTourDate(b.tourDate)} · {b.timeSlot} · {b.organization || t("admin.factoryTour.modal.individualVisitor")}
          </p>
        </div>

        <div className="px-8 py-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.factoryTour.modal.sections.visitInfo")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("admin.factoryTour.modal.fields.requestedDate")} value={formatTourDate(b.tourDate)} />
                <Field label={t("admin.factoryTour.modal.fields.timeSlot")} value={b.timeSlot} />
                <Field label={t("admin.factoryTour.modal.fields.numberOfVisitors")} value={String(b.pax)} />
                <Field label={t("admin.factoryTour.modal.fields.submitted")} value={formatDate(b.submittedAt)} />
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.factoryTour.modal.sections.visitorInfo")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("admin.factoryTour.modal.fields.fullName")} value={b.visitorName} />
                <Field label={t("admin.factoryTour.modal.fields.organization")} value={b.organization} />
                <Field label={t("admin.factoryTour.modal.fields.email")} value={b.email} />
                <Field label={t("admin.factoryTour.modal.fields.phone")} value={b.phone} />
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.factoryTour.modal.sections.purpose")}</h3>
              <p className="text-sm text-corporate-black dark:text-foreground leading-relaxed whitespace-pre-wrap">{b.purpose || "—"}</p>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.factoryTour.modal.sections.quickActions")}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => applyStatus("Approved")}
                  disabled={b.status === "Approved"}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-emerald-700 disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" /> {t("admin.factoryTour.modal.approve")}
                </button>
                <button
                  onClick={() => applyStatus("Rejected")}
                  disabled={b.status === "Rejected"}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded bg-destructive text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-destructive/90 disabled:opacity-40"
                >
                  <X className="w-3.5 h-3.5" /> {t("admin.factoryTour.modal.reject")}
                </button>
                <button
                  onClick={() => applyStatus("Completed")}
                  disabled={b.status === "Completed" || b.status === "Rejected"}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-brand-deep disabled:opacity-40"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> {t("admin.factoryTour.modal.markCompleted")}
                </button>
              </div>
              <p className="text-[11px] text-corporate-gray mt-2">
                {t("admin.factoryTour.modal.quickActionsNote")}
              </p>
            </div>
          </div>

          {/* Sidebar — status + notes */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-display text-sm font-semibold mb-4">{t("admin.factoryTour.modal.sections.bookingStatus")}</h3>
              <div className="space-y-3">
                <select
                  value={pendingStatus}
                  onChange={(e) => setPendingStatus(e.target.value as TourStatus)}
                  className="w-full h-10 rounded border border-hairline px-3 text-sm bg-white dark:bg-card focus:outline-none focus:border-primary"
                >
                  {TOUR_STATUSES.map((s) => (
                    <option key={s} value={s}>{t(`admin.statusLabels.${s}`)}</option>
                  ))}
                </select>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={t("admin.factoryTour.modal.statusNotePlaceholder")}
                  className="w-full rounded border border-hairline px-3 py-2 text-[13px] focus:outline-none focus:border-primary resize-none"
                />
                <button
                  onClick={() => applyStatus(pendingStatus)}
                  disabled={pendingStatus === b.status}
                  className="w-full h-10 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep disabled:opacity-40"
                >
                  {t("admin.factoryTour.modal.updateStatus")}
                </button>
              </div>

              <div className="mt-5 pt-5 border-t border-hairline">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-3">{t("admin.factoryTour.modal.sections.timeline")}</div>
                <ol className="space-y-3">
                  {b.statusHistory.map((h, i) => (
                    <li key={i} className="flex gap-3 text-[12px]">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-corporate-black dark:text-foreground">{t(`admin.statusLabels.${h.status}`)}</div>
                        <div className="text-corporate-gray">{formatDate(h.date)}</div>
                        {h.note && <div className="text-corporate-gray mt-0.5">{h.note}</div>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className="font-display text-sm font-semibold mb-4">{t("admin.factoryTour.modal.sections.internalNotes")}</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {b.internalNotes.length === 0 && <p className="text-[12px] text-corporate-gray">{t("admin.factoryTour.modal.noNotesYet")}</p>}
                {b.internalNotes.map((n) => (
                  <div key={n.id} className="p-3 rounded bg-brand-soft text-[12px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{n.author}</span>
                      <span className="text-corporate-gray">{formatDate(n.date)}</span>
                    </div>
                    <p className="text-corporate-black dark:text-foreground">{n.note}</p>
                  </div>
                ))}
              </div>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("admin.factoryTour.modal.addNotePlaceholder")}
                className="w-full rounded border border-hairline px-3 py-2 text-[13px] focus:outline-none focus:border-primary resize-none mb-2"
              />
              <button
                onClick={submitNote}
                disabled={!note.trim()}
                className="w-full h-10 rounded border border-hairline text-[11px] font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary disabled:opacity-40"
              >
                {t("admin.factoryTour.modal.addNote")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
