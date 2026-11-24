import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ApplicantShell, RoleGate } from "@/components/applicant-shell";
import { ApplicantTimelineModal } from "@/components/career/applicant-timeline-modal";
import { useAtsApplications } from "@/hooks/use-ats-applications";
import { useAuth } from "@/hooks/use-auth";
import { mockApplicant } from "@/lib/applicant-mock";
import { belongsToUser, type StoredApplication } from "@/lib/ats-store";
import { useLanguage } from "@/hooks/use-language";
import { Search, Eye, Briefcase } from "lucide-react";

export const Route = createFileRoute("/applicant/applications")({
  head: () => ({ meta: [{ title: "My Applications — Widatra" }] }),
  component: ApplicationsPage,
});

const STATUS_TABS = ["ALL", "Submitted", "Screening", "Interview", "Offer", "Rejected"] as const;

function StatusBadge({ status, label }: { status: string; label: string }) {
  const map: Record<string, string> = {
    Submitted:
      "bg-slate-100 dark:bg-slate-700/90 text-slate-700 dark:text-slate-100 ring-1 ring-slate-300/60 dark:ring-slate-600",
    Screening:
      "bg-blue-50 dark:bg-sky-500/20 text-primary dark:text-sky-300 ring-1 ring-primary/20 dark:ring-sky-400/30",
    Interview:
      "bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/25",
    Offer:
      "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/25",
    Hired:
      "bg-primary dark:bg-sky-500 text-white dark:text-slate-950 font-bold",
    Rejected:
      "bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/25",
  };
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold ${
        map[status] ?? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
      }`}
    >
      {label}
    </span>
  );
}

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

function ApplicationsPage() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const { applications } = useAtsApplications();
  const { user } = useAuth();
  const [selected, setSelected] = useState<StoredApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const activeUser = user ?? { id: "", email: mockApplicant.email };

  const mine = applications.filter((a) => belongsToUser(a, activeUser));

  const filtered = useMemo(() => {
    return mine.filter((a) => {
      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "Offer"
            ? a.status === "Offer" || a.status === "Hired"
            : a.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        a.jobTitle.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [mine, statusFilter, searchQuery]);

  return (
    <ApplicantShell
      title={t("dashboard.applications.title")}
      subtitle={t("dashboard.applications.subtitle")}
      headerActions={
        <a
          href="/careers"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{isId ? "Lamar Posisi Baru" : "Apply New Role"}</span>
        </a>
      }
    >
      <RoleGate allow="external">
        {/* Interactive Filter & Search Toolbar */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab;
              const count =
                tab === "ALL"
                  ? mine.length
                  : tab === "Offer"
                    ? mine.filter((a) => a.status === "Offer" || a.status === "Hired").length
                    : mine.filter((a) => a.status === tab).length;
              const label =
                tab === "ALL" ? (isId ? "Semua" : "All") : t(`dashboard.statusLabels.${tab}`);
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-primary dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs"
                      : "bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-primary/40 dark:hover:border-sky-400/40"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      active
                        ? "bg-white/20 dark:bg-slate-950/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isId ? "Cari ID, posisi, departemen..." : "Search ID, role, dept..."}
              className="w-full sm:w-64 h-9 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13213a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary dark:focus:border-sky-400"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 bg-slate-50/90 dark:bg-[#192a48]">
                  <th className="text-left px-5 py-3.5">{t("dashboard.applications.table.id")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.applications.table.position")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.applications.table.department")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.applications.table.applied")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.applications.table.status")}</th>
                  <th className="text-left px-5 py-3.5">{t("dashboard.applications.table.timeline")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className="group hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 font-mono text-[12px] text-slate-500 dark:text-slate-300">
                      {a.id}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-sky-300 transition-colors">
                      {a.jobTitle}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{a.department}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDate(a.submittedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={a.status} label={t(`dashboard.statusLabels.${a.status}`)} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(a);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 hover:bg-primary hover:text-white dark:hover:bg-sky-400 dark:hover:text-slate-950 text-[11px] font-bold uppercase tracking-[0.14em] transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t("dashboard.applications.table.viewTimeline")}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-slate-500 dark:text-slate-300 py-14">
              {t("dashboard.applications.empty")}
            </div>
          )}
        </div>

        {selected && (
          <ApplicantTimelineModal
            key={selected.id}
            application={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </RoleGate>
    </ApplicantShell>
  );
}
