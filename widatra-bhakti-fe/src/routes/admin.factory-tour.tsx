import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataTable, StatusPill } from "@/components/admin-shell";
import { AdminBookingModal } from "@/components/factory-tour/admin-booking-modal";
import { useTourBookings } from "@/hooks/use-tour-bookings";
import { useLanguage } from "@/hooks/use-language";
import { TOUR_STATUSES } from "@/lib/tour-store";
import { Search, Save } from "lucide-react";
import { useFactoryTourContent } from "@/hooks/use-factory-tour-content";
import { saveFactoryTourContent } from "@/lib/factory-tour-content-store";
import { MediaPickerField, MediaPickerGalleryField } from "@/components/media/media-picker-field";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/factory-tour")({
  head: () => ({ meta: [{ title: "Factory Tour — Admin" }] }),
  component: FactoryTourAdmin,
});

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function FactoryTourAdmin() {
  const { t } = useLanguage();
  const { bookings, refresh } = useTourBookings();
  const { content, refresh: refreshContent } = useFactoryTourContent();
  const [contentDraft, setContentDraft] = useState(content);

  useEffect(() => {
    if (content) setContentDraft(content);
  }, [content]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => bookings.find((b) => b.id === selectedId) ?? null,
    [bookings, selectedId]
  );

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesQuery =
        !query.trim() ||
        [b.visitorName, b.organization, b.email, b.id].some((v) =>
          v.toLowerCase().includes(query.trim().toLowerCase())
        );
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, query, statusFilter]);

  const pendingCount = bookings.filter((b) => b.status === "Pending" || b.status === "Reviewed").length;
  const approvedCount = bookings.filter((b) => b.status === "Approved").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const totalVisitors = bookings
    .filter((b) => b.status === "Approved" || b.status === "Completed")
    .reduce((sum, b) => sum + b.pax, 0);

  async function handleSaveContent() {
    try {
      await saveFactoryTourContent(contentDraft);
      refreshContent();
      toast.success("Factory Tour page imagery updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the imagery.");
    }
  }

  return (
    <AdminShell
      title={t("admin.factoryTour.title")}
      subtitle={t("admin.factoryTour.subtitle")}
    >
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <div className="card-elevated p-5"><div className="eyebrow text-primary">{t("admin.factoryTour.stats.awaitingReview")}</div><div className="mt-2 text-3xl font-semibold font-display">{pendingCount}</div></div>
        <div className="card-elevated p-5"><div className="eyebrow text-primary">{t("admin.factoryTour.stats.approved")}</div><div className="mt-2 text-3xl font-semibold font-display">{approvedCount}</div></div>
        <div className="card-elevated p-5"><div className="eyebrow text-primary">{t("admin.factoryTour.stats.completed")}</div><div className="mt-2 text-3xl font-semibold font-display">{completedCount}</div></div>
        <div className="card-elevated p-5"><div className="eyebrow text-primary">{t("admin.factoryTour.stats.confirmedVisitors")}</div><div className="mt-2 text-3xl font-semibold font-display">{totalVisitors}</div></div>
      </div>

      <div className="card-elevated p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="eyebrow text-primary mb-1">Public page imagery</div>
            <p className="text-[12px] text-corporate-gray">Hero background and schedule gallery shown on /factory-tour — sourced from the Media Library.</p>
          </div>
          <button
            onClick={handleSaveContent}
            className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep rounded shrink-0"
          >
            <Save className="w-4 h-4" /> Save imagery
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-corporate-gray mb-2 block">Hero image</label>
            <MediaPickerField
              value={contentDraft.heroImage}
              onChange={(ref) => setContentDraft((d) => ({ ...d, heroImage: ref }))}
              folder="Factory Tour"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-corporate-gray mb-2 block">Schedule gallery</label>
            <MediaPickerGalleryField
              value={contentDraft.gallery}
              onChange={(refs) => setContentDraft((d) => ({ ...d, gallery: refs }))}
              folder="Factory Tour"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 h-10 px-3 border border-hairline rounded bg-white dark:bg-card flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-corporate-gray" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.factoryTour.searchPlaceholder")}
            className="flex-1 h-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 border border-hairline rounded bg-white dark:bg-card text-sm focus:outline-none focus:border-primary"
        >
          <option value="All">{t("admin.factoryTour.allStatuses")}</option>
          {TOUR_STATUSES.map((s) => (
            <option key={s} value={s}>{t(`admin.statusLabels.${s}`)}</option>
          ))}
        </select>
        <span className="text-[12px] text-corporate-gray ml-auto">
          {filtered.length} {filtered.length === 1 ? t("admin.factoryTour.countSuffixSingular") : t("admin.factoryTour.countSuffixPlural")}
        </span>
      </div>

      <DataTable
        columns={[
          t("admin.factoryTour.table.visitor"),
          t("admin.factoryTour.table.organization"),
          t("admin.factoryTour.table.tourDate"),
          t("admin.factoryTour.table.timeSlot"),
          t("admin.factoryTour.table.pax"),
          t("admin.factoryTour.table.status"),
          t("admin.factoryTour.table.action"),
        ]}
        rows={filtered.map((b) => [
          <div>
            <div className="font-medium">{b.visitorName}</div>
            <div className="text-[11px] text-corporate-gray font-mono">{b.id}</div>
          </div>,
          <span className="text-corporate-gray">{b.organization || "—"}</span>,
          <span className="text-corporate-gray">{formatDate(b.tourDate)}</span>,
          <span className="text-corporate-gray">{b.timeSlot}</span>,
          <span className="text-corporate-gray">{b.pax}</span>,
          <StatusPill status={b.status} />,
          <button
            onClick={() => setSelectedId(b.id)}
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline"
          >
            {t("admin.common.view")}
          </button>,
        ])}
      />
      {filtered.length === 0 && (
        <p className="text-center text-sm text-corporate-gray py-10">{t("admin.factoryTour.noMatch")}</p>
      )}

      {selected && (
        <AdminBookingModal
          key={selected.id}
          booking={selected}
          onClose={() => setSelectedId(null)}
          onChanged={refresh}
        />
      )}
    </AdminShell>
  );
}
