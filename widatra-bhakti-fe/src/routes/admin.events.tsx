import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataTable, StatusPill } from "@/components/admin-shell";
import { AdminEventReviewModal } from "@/components/community-events/admin-event-review-modal";
import { useAdminCommunityEvents } from "@/hooks/use-community-events";
import { useLanguage } from "@/hooks/use-language";
import { ADMIN_VISIBLE_STATUSES, getCommunityEventById, type CommunityEventStatus, type StoredCommunityEvent } from "@/lib/community-events-store";

export const Route = createFileRoute("/admin/events")({
  head: () => ({ meta: [{ title: "Community Event Approval — Widatra Admin" }] }),
  component: AdminEventsPage,
});

const FILTERS: Array<CommunityEventStatus | "All"> = ["All", ...ADMIN_VISIBLE_STATUSES];

function AdminEventsPage() {
  const { t } = useLanguage();
  const { events, refresh } = useAdminCommunityEvents();
  const [filter, setFilter] = useState<CommunityEventStatus | "All">("All");
  const [selected, setSelected] = useState<StoredCommunityEvent | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? events : events.filter((e) => e.status === filter)),
    [events, filter]
  );

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  }

  return (
    <AdminShell title={t("admin.events.title")} subtitle={t("admin.events.subtitle")}>
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-9 px-3.5 rounded text-[11px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
              filter === f ? "bg-primary text-white border-primary" : "border-hairline text-corporate-gray hover:border-primary hover:text-primary"
            }`}
          >
            {f === "All" ? t("admin.events.filters.all") : t(`admin.events.statusLabels.${f}`)}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          t("admin.events.table.id"),
          t("admin.events.table.title"),
          t("admin.events.table.community"),
          t("admin.events.table.submittedBy"),
          "Account Type",
          t("admin.events.table.eventDate"),
          t("admin.events.table.status"),
          t("admin.events.table.actions"),
        ]}
        rows={filtered.map((ev) => [
          <span className="font-mono text-[12px] text-corporate-gray">{ev.id}</span>,
          <span className="font-medium">{ev.title}</span>,
          ev.community,
          ev.submitterName,
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Internal
          </span>,
          ev.eventDate,
          <StatusPill status={ev.status} label={t(`admin.events.statusLabels.${ev.status}`)} />,
          <button
            onClick={() => setSelected(ev)}
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline"
          >
            {t("admin.events.review")}
          </button>,
        ])}
      />
      {filtered.length === 0 && (
        <div className="text-center text-sm text-corporate-gray py-14">{t("admin.events.empty")}</div>
      )}

      <AdminEventReviewModal
        event={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        onChanged={() => {
          refresh();
          if (selected) {
            const updated = getCommunityEventById(selected.id);
            if (updated) setSelected(updated);
          }
        }}
      />
    </AdminShell>
  );
}
