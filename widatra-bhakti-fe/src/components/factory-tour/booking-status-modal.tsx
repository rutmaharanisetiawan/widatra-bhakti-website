import { ModalShell, CloseButton } from "@/components/career/career-flow";
import { StatusPill } from "@/components/admin-shell";
import type { StoredTourBooking, TourStatus } from "@/lib/tour-store";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1">{label}</div>
      <div className="text-sm font-medium text-corporate-black dark:text-foreground">{value || "—"}</div>
    </div>
  );
}

export function BookingStatusModal({
  booking,
  onClose,
  showAdminNotes = false,
}: {
  booking: StoredTourBooking;
  onClose: () => void;
  showAdminNotes?: boolean;
}) {
  const { t, language } = useLanguage();
  const locale = language === "id" ? "id-ID" : "en-GB";

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString(locale, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  }

  function formatTourDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString(language === "id" ? "id-ID" : "en", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    } catch {
      return iso;
    }
  }

  function statusLabel(status: TourStatus | string) {
    const map: Record<string, string> = {
      Pending: t("factoryTour.statusLabels.pending"),
      Reviewed: t("factoryTour.statusLabels.reviewed"),
      Approved: t("factoryTour.statusLabels.approved"),
      Completed: t("factoryTour.statusLabels.completed"),
      Rejected: t("factoryTour.statusLabels.rejected"),
    };
    return map[status] ?? status;
  }

  const isRejected = booking.status === "Rejected";
  const trackStages: TourStatus[] = isRejected
    ? ["Pending", "Reviewed", "Rejected"]
    : ["Pending", "Reviewed", "Approved", "Completed"];

  const reachedIndex = trackStages.indexOf(booking.status);

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-2xl" labelledBy="booking-status-modal-title">
      <CloseButton onClose={onClose} />
      <div className="max-h-[85vh] overflow-y-auto">
        <div className="px-8 pt-10 pb-6 border-b border-hairline bg-gradient-to-br from-brand-tint/60 to-white dark:to-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono text-corporate-gray">{booking.id}</span>
            <StatusPill status={booking.status} label={statusLabel(booking.status)} />
          </div>
          <h2 id="booking-status-modal-title" className="text-2xl font-semibold font-display tracking-tight mb-1">
            {t("factoryTour.statusModal.title")}
          </h2>
          <p className="text-sm text-corporate-gray">
            {formatTourDate(booking.tourDate)} · {booking.timeSlot} · {t("factoryTour.statusModal.submittedLabel")} {formatDate(booking.submittedAt)}
          </p>
        </div>

        <div className="px-8 py-8">
          {/* Stage tracker */}
          <div className="flex items-center mb-10">
            {trackStages.map((s, i) => {
              const done = i <= reachedIndex;
              const isRejectStage = s === "Rejected";
              return (
                <div key={s} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    {done ? (
                      isRejectStage ? (
                        <XCircle className="w-7 h-7 text-destructive" />
                      ) : (
                        <CheckCircle2 className="w-7 h-7 text-primary" />
                      )
                    ) : (
                      <Circle className="w-7 h-7 text-black/15 dark:text-white/15" />
                    )}
                    <span className={`text-[9px] font-bold uppercase tracking-[0.16em] text-center ${done ? (isRejectStage ? "text-destructive" : "text-primary") : "text-corporate-gray"}`}>
                      {statusLabel(s)}
                    </span>
                  </div>
                  {i < trackStages.length - 1 && (
                    <div className={`flex-1 h-px mx-1 ${i < reachedIndex ? "bg-primary" : "bg-black/10 dark:bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Booking details */}
          <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("factoryTour.statusModal.bookingDetails")}</h3>
          <div className="grid grid-cols-2 gap-4 mb-10">
            <Field label={t("factoryTour.statusModal.fields.visitor")} value={booking.visitorName} />
            <Field label={t("factoryTour.statusModal.fields.organization")} value={booking.organization} />
            <Field label={t("factoryTour.statusModal.fields.email")} value={booking.email} />
            <Field label={t("factoryTour.statusModal.fields.phone")} value={booking.phone} />
            <Field label={t("factoryTour.statusModal.fields.numberOfVisitors")} value={String(booking.pax)} />
            <Field label={t("factoryTour.statusModal.fields.purpose")} value={booking.purpose} />
          </div>

          {/* History log */}
          <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("factoryTour.statusModal.statusHistory")}</h3>
          <ol className="space-y-5">
            {[...booking.statusHistory].reverse().map((h, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                  {i < booking.statusHistory.length - 1 && <div className="flex-1 w-px bg-black/10 dark:bg-white/10 mt-1" />}
                </div>
                <div className="pb-1">
                  <div className="text-sm font-semibold text-corporate-black dark:text-foreground">{statusLabel(h.status)}</div>
                  <div className="text-[12px] text-corporate-gray mb-1">{formatDate(h.date)}</div>
                  {h.note && <p className="text-[13px] text-corporate-black dark:text-foreground bg-brand-soft rounded px-3 py-2 mt-1">{h.note}</p>}
                </div>
              </li>
            ))}
          </ol>

          {showAdminNotes && (
            <>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline mt-10">{t("factoryTour.statusModal.adminNotes")}</h3>
              {booking.internalNotes.length === 0 ? (
                <p className="text-[13px] text-corporate-gray">{t("factoryTour.statusModal.noNotes")}</p>
              ) : (
                <div className="space-y-3">
                  {booking.internalNotes.map((n) => (
                    <div key={n.id} className="p-3 rounded bg-brand-soft text-[12px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{n.author}</span>
                        <span className="text-corporate-gray">{formatDate(n.date)}</span>
                      </div>
                      <p className="text-corporate-black dark:text-foreground">{n.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
