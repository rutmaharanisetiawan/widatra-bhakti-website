import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ApplicantShell, RoleGate } from "@/components/applicant-shell";
import { BookingStatusModal } from "@/components/factory-tour/booking-status-modal";
import { StatusPill } from "@/components/admin-shell";
import { useTourBookings } from "@/hooks/use-tour-bookings";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import type { StoredTourBooking } from "@/lib/tour-store";

export const Route = createFileRoute("/applicant/tours")({
  head: () => ({ meta: [{ title: "My Factory Tour Bookings — Widatra Applicant" }] }),
  component: ToursPage,
});

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function ToursPage() {
  const { t } = useLanguage();
  const { bookings } = useTourBookings();
  const { user } = useAuth();
  const [selected, setSelected] = useState<StoredTourBooking | null>(null);

  const mine = user
    ? bookings.filter((b) => b.email.trim().toLowerCase() === user.email.trim().toLowerCase())
    : [];

  function tourStatusLabel(status: string) {
    const map: Record<string, string> = {
      Pending: t("factoryTour.statusLabels.pending"),
      Reviewed: t("factoryTour.statusLabels.reviewed"),
      Approved: t("factoryTour.statusLabels.approved"),
      Completed: t("factoryTour.statusLabels.completed"),
      Rejected: t("factoryTour.statusLabels.rejected"),
    };
    return map[status] ?? status;
  }

  return (
    <ApplicantShell title={t("dashboard.tours.title")} subtitle={t("dashboard.tours.subtitle")}>
      <RoleGate allow="external">
      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.18em] text-corporate-gray bg-brand-soft">
              <th className="text-left px-5 py-3">{t("dashboard.tours.table.reference")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.tours.table.visitDate")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.tours.table.timeSlot")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.tours.table.visitors")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.tours.table.status")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.tours.table.details")}</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((b) => (
              <tr key={b.id} className="border-t border-hairline hover:bg-brand-soft/50">
                <td className="px-5 py-3.5 font-mono text-[12px] text-corporate-gray">{b.id}</td>
                <td className="px-5 py-3.5 font-medium">{formatDate(b.tourDate)}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{b.timeSlot}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{b.pax}</td>
                <td className="px-5 py-3.5"><StatusPill status={b.status} label={tourStatusLabel(b.status)} /></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setSelected(b)} className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline">
                    {t("dashboard.tours.table.viewDetails")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mine.length === 0 && (
          <div className="text-center text-sm text-corporate-gray py-14">
            {t("dashboard.tours.emptyPrefix")}{" "}
            <Link to="/factory-tour" className="text-primary underline">{t("dashboard.tours.bookAVisit")}</Link>
          </div>
        )}
      </div>

      {selected && (
        <BookingStatusModal key={selected.id} booking={selected} showAdminNotes onClose={() => setSelected(null)} />
      )}
      </RoleGate>
    </ApplicantShell>
  );
}
