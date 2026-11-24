import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ApplicantShell, RoleGate } from "@/components/applicant-shell";
import { BookingStatusModal } from "@/components/factory-tour/booking-status-modal";
import { StatusPill } from "@/components/admin-shell";
import { useTourBookings } from "@/hooks/use-tour-bookings";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import type { StoredTourBooking } from "@/lib/tour-store";
import { Factory, Eye, Search } from "lucide-react";

export const Route = createFileRoute("/applicant/tours")({
  head: () => ({ meta: [{ title: "My Factory Tour Bookings — Widatra Applicant" }] }),
  component: ToursPage,
});

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function ToursPage() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const { bookings } = useTourBookings();
  const { user } = useAuth();
  const [selected, setSelected] = useState<StoredTourBooking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const mine = user
    ? bookings.filter((b) => b.email.trim().toLowerCase() === user.email.trim().toLowerCase())
    : [];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mine;
    return mine.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.timeSlot.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
    );
  }, [mine, searchQuery]);

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
    <ApplicantShell
      title={t("dashboard.tours.title")}
      subtitle={t("dashboard.tours.subtitle")}
      headerActions={
        <a
          href="/factory-tour"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Factory className="w-3.5 h-3.5" />
          <span>{t("dashboard.tours.bookAVisit")}</span>
        </a>
      }
    >
      <RoleGate allow="external">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {isId
              ? `Menampilkan ${filtered.length} jadwal kunjungan`
              : `Showing ${filtered.length} tour bookings`}
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isId ? "Cari kode booking..." : "Search booking code..."}
              className="w-56 h-9 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13213a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary dark:focus:border-sky-400"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 bg-slate-50/90 dark:bg-[#192a48]">
                  <th className="text-left px-5 py-3.5">{t("dashboard.tours.table.reference")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.tours.table.visitDate")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.tours.table.timeSlot")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.tours.table.visitors")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.tours.table.status")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.tours.table.details")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className="group hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 font-mono text-[12px] text-slate-500 dark:text-slate-300">
                      {b.id}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {formatDate(b.tourDate)}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{b.timeSlot}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{b.pax} pax</td>
                    <td className="px-5 py-4">
                      <StatusPill status={b.status} label={tourStatusLabel(b.status)} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(b);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 hover:bg-primary hover:text-white dark:hover:bg-sky-400 dark:hover:text-slate-950 text-[11px] font-bold uppercase tracking-[0.14em] transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t("dashboard.tours.table.viewDetails")}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-slate-500 dark:text-slate-300 py-14">
              {t("dashboard.tours.emptyPrefix")}{" "}
              <a
                href="/factory-tour"
                className="text-primary dark:text-sky-300 font-semibold underline"
              >
                {t("dashboard.tours.bookAVisit")}
              </a>
            </div>
          )}
        </div>

        {selected && (
          <BookingStatusModal
            key={selected.id}
            booking={selected}
            showAdminNotes
            onClose={() => setSelected(null)}
          />
        )}
      </RoleGate>
    </ApplicantShell>
  );
}
