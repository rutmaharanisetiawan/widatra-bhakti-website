import { ModalShell, CloseButton } from "@/components/career/career-flow";
import type { StoredTourBooking } from "@/lib/tour-store";
import { useLanguage } from "@/hooks/use-language";

export function BookingConfirmationModal({
  booking,
  onClose,
  onViewStatus,
}: {
  booking: StoredTourBooking;
  onClose: () => void;
  onViewStatus: () => void;
}) {
  const { t, language } = useLanguage();
  const locale = language === "id" ? "id-ID" : "en";

  function formatTourDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    } catch {
      return iso;
    }
  }

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-lg" labelledBy="booking-confirmation-title">
      <CloseButton onClose={onClose} />
      <div className="text-center px-8 py-14">
        <div className="w-20 h-20 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-3xl mb-6 shadow-[0_10px_28px_-6px_rgba(14,49,146,0.55)]">✓</div>
        <span className="eyebrow text-primary block mb-2">{t("factoryTour.confirmationModal.eyebrow")}</span>
        <h3 id="booking-confirmation-title" className="text-2xl font-semibold mb-3">{t("factoryTour.confirmationModal.title")}</h3>
        <p className="text-corporate-gray max-w-md mx-auto text-sm leading-relaxed mb-6">
          <span className="font-semibold text-corporate-black dark:text-foreground">{formatTourDate(booking.tourDate)}</span>,{" "}
          <span className="font-semibold text-corporate-black dark:text-foreground">{booking.timeSlot}</span> {t("factoryTour.confirmationModal.bodyMiddle")}{" "}
          <span className="font-medium">{booking.email}</span>.
        </p>
        <div className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-lg bg-brand-tint border border-primary/10 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray">{t("factoryTour.confirmationModal.referenceLabel")}</span>
          <span className="text-lg font-mono font-semibold text-primary">{booking.id}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mt-1">{t("factoryTour.confirmationModal.pendingLabel")}</span>
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={onClose} className="px-8 py-3 rounded border border-black/15 text-[11px] font-bold uppercase tracking-[0.25em] hover:border-primary hover:text-primary transition-colors">
            {t("factoryTour.confirmationModal.close")}
          </button>
          <button onClick={onViewStatus} className="px-8 py-3 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors">
            {t("factoryTour.confirmationModal.viewStatus")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
