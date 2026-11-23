import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ApplicantShell, RoleGate } from "@/components/applicant-shell";
import { ApplicantTimelineModal } from "@/components/career/applicant-timeline-modal";
import { useAtsApplications } from "@/hooks/use-ats-applications";
import { useAuth } from "@/hooks/use-auth";
import { mockApplicant } from "@/lib/applicant-mock";
import { belongsToUser, type StoredApplication } from "@/lib/ats-store";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/applicant/applications")({
  head: () => ({ meta: [{ title: "My Applications — Widatra" }] }),
  component: ApplicationsPage,
});

function StatusBadge({ status, label }: { status: string; label: string }) {
  const map: Record<string, string> = {
    Submitted: "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground",
    Screening: "bg-brand-tint text-primary",
    Interview: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Offer: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Hired: "bg-primary text-white",
    Rejected: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400",
  };
  return <span className={`inline-flex h-6 px-2.5 rounded-full text-[11px] font-semibold ${map[status] ?? "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground"}`}>{label}</span>;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function ApplicationsPage() {
  const { t } = useLanguage();
  const { applications } = useAtsApplications();
  const { user } = useAuth();
  const [selected, setSelected] = useState<StoredApplication | null>(null);
  const activeUser = user ?? { id: "", email: mockApplicant.email };

  const mine = applications.filter((a) => belongsToUser(a, activeUser));

  return (
    <ApplicantShell title={t("dashboard.applications.title")} subtitle={t("dashboard.applications.subtitle")}>
      <RoleGate allow="external">
      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.18em] text-corporate-gray bg-brand-soft">
              <th className="text-left px-5 py-3">{t("dashboard.applications.table.id")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.applications.table.position")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.applications.table.department")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.applications.table.applied")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.applications.table.status")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.applications.table.timeline")}</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((a) => (
              <tr key={a.id} className="border-t border-hairline hover:bg-brand-soft/50">
                <td className="px-5 py-3.5 font-mono text-[12px] text-corporate-gray">{a.id}</td>
                <td className="px-5 py-3.5 font-medium">{a.jobTitle}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{a.department}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{formatDate(a.submittedAt)}</td>
                <td className="px-5 py-3.5"><StatusBadge status={a.status} label={t(`dashboard.statusLabels.${a.status}`)} /></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setSelected(a)} className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline">
                    {t("dashboard.applications.table.viewTimeline")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mine.length === 0 && (
          <div className="text-center text-sm text-corporate-gray py-14">
            {t("dashboard.applications.empty")}
          </div>
        )}
      </div>

      {selected && (
        <ApplicantTimelineModal key={selected.id} application={selected} onClose={() => setSelected(null)} />
      )}
      </RoleGate>
    </ApplicantShell>
  );
}
