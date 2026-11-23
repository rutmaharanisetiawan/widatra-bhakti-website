import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ApplicantShell } from "@/components/applicant-shell";
import { ApplicantTimelineModal } from "@/components/career/applicant-timeline-modal";
import { UpcomingInterviewCard } from "@/components/career/interview-card";
import { useAtsApplications } from "@/hooks/use-ats-applications";
import { useAuth } from "@/hooks/use-auth";
import { mockApplicant } from "@/lib/applicant-mock";
import { belongsToUser, type StoredApplication } from "@/lib/ats-store";
import { useLanguage } from "@/hooks/use-language";
import { useMyCommunityEvents } from "@/hooks/use-community-events";
import { ArrowRight, CheckCircle2, CalendarPlus } from "lucide-react";

export const Route = createFileRoute("/applicant/")({
  head: () => ({ meta: [{ title: "Dashboard — Widatra Applicant" }] }),
  component: ApplicantHome,
});

function InternalDashboard({ name }: { name: string }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { events } = useMyCommunityEvents(user?.id);

  const stats = [
    { label: "Total submissions", value: events.length },
    { label: "Pending review", value: events.filter((e) => e.status === "Pending").length },
    { label: "Approved", value: events.filter((e) => e.status === "Approved" || e.status === "Published").length },
    { label: "Needs revision", value: events.filter((e) => e.status === "Revision Requested").length },
  ];

  return (
    <ApplicantShell title={`${t("dashboard.overview.welcomeBackPrefix")} ${name.split(" ")[0]}`} subtitle="Submit and track your Community Event submissions.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="card-elevated p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-corporate-gray">{s.label}</div>
            <div className="mt-2 text-3xl font-semibold font-display">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-hairline">
          <h2 className="font-display text-lg font-semibold">Recent submissions</h2>
          <Link to="/applicant/events" className="text-[12px] text-primary font-semibold flex items-center gap-1 hover:underline">
            <CalendarPlus className="w-3.5 h-3.5" /> New submission
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.18em] text-corporate-gray bg-brand-soft">
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-left px-5 py-3">Community</th>
              <th className="text-left px-5 py-3">Event date</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(0, 5).map((ev) => (
              <tr key={ev.id} className="border-t border-hairline">
                <td className="px-5 py-3.5 font-medium">{ev.title}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{ev.community}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{ev.eventDate}</td>
                <td className="px-5 py-3.5">{ev.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <div className="text-center text-sm text-corporate-gray py-14">
            No submissions yet. <Link to="/applicant/events" className="text-primary underline">Submit a Community Event</Link>
          </div>
        )}
      </div>
    </ApplicantShell>
  );
}

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

function ApplicantHome() {
  const { t } = useLanguage();
  const { applications } = useAtsApplications();
  const { user } = useAuth();
  const [selected, setSelected] = useState<StoredApplication | null>(null);

  if (user?.accountType === "internal") {
    return <InternalDashboard name={user.name} />;
  }

  const activeUser = user ?? { id: "", email: mockApplicant.email };
  const mine = applications.filter((a) => belongsToUser(a, activeUser));

  function statusLabel(status: string) {
    return t(`dashboard.statusLabels.${status}`);
  }

  const stats = [
    { label: t("dashboard.overview.stats.submitted"), value: mine.length },
    { label: t("dashboard.overview.stats.inReview"), value: mine.filter((a) => a.status === "Screening").length },
    { label: t("dashboard.overview.stats.interviews"), value: mine.filter((a) => a.status === "Interview").length },
    { label: t("dashboard.overview.stats.offers"), value: mine.filter((a) => a.status === "Offer" || a.status === "Hired").length },
  ];

  const upcomingInterviewApp = mine
    .filter((a) => a.interview && a.interview.status === "Scheduled")
    .sort((a, b) => {
      const aTime = new Date(`${a.interview!.date}T${a.interview!.time || "00:00"}:00`).getTime();
      const bTime = new Date(`${b.interview!.date}T${b.interview!.time || "00:00"}:00`).getTime();
      return aTime - bTime;
    })[0];

  return (
    <ApplicantShell title={`${t("dashboard.overview.welcomeBackPrefix")} ${(user?.name ?? mockApplicant.name).split(" ")[0]}`} subtitle={t("dashboard.overview.subtitle")}>
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="card-elevated p-6 lg:col-span-2">
          <div className="eyebrow text-primary mb-2">{t("dashboard.overview.profileCompletion")}</div>
          <div className="flex items-end justify-between mb-3">
            <div className="text-3xl font-semibold font-display">{mockApplicant.profileCompletion}%</div>
            <Link to="/applicant/profile" className="text-[12px] text-primary font-semibold flex items-center gap-1 hover:underline">
              {t("dashboard.overview.completeProfile")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-2 bg-brand-tint rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${mockApplicant.profileCompletion}%` }} />
          </div>
          <ul className="mt-5 grid sm:grid-cols-2 gap-2 text-[13px]">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t("dashboard.overview.checklist.0")}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t("dashboard.overview.checklist.1")}</li>
            <li className="flex items-center gap-2 text-corporate-gray"><CheckCircle2 className="w-4 h-4 text-hairline" /> {t("dashboard.overview.checklist.2")}</li>
            <li className="flex items-center gap-2 text-corporate-gray"><CheckCircle2 className="w-4 h-4 text-hairline" /> {t("dashboard.overview.checklist.3")}</li>
          </ul>
        </div>
        <div className="card-elevated p-6">
          <div className="eyebrow text-primary mb-2">{t("dashboard.overview.upcomingInterview")}</div>
          {upcomingInterviewApp?.interview ? (
            <UpcomingInterviewCard schedule={upcomingInterviewApp.interview} jobTitle={upcomingInterviewApp.jobTitle} />
          ) : (
            <p className="text-[13px] text-corporate-gray mt-3">{t("dashboard.overview.noUpcomingInterview")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="card-elevated p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-corporate-gray">{s.label}</div>
            <div className="mt-2 text-3xl font-semibold font-display">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-hairline">
          <h2 className="font-display text-lg font-semibold">{t("dashboard.overview.recentApplications")}</h2>
          <Link to="/applicant/applications" className="text-[12px] text-primary font-semibold hover:underline">{t("dashboard.overview.viewAll")}</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.18em] text-corporate-gray bg-brand-soft">
              <th className="text-left px-5 py-3">{t("dashboard.overview.table.position")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.overview.table.department")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.overview.table.applied")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.overview.table.status")}</th>
              <th className="text-left px-5 py-3">{t("dashboard.overview.table.timeline")}</th>
            </tr>
          </thead>
          <tbody>
            {mine.slice(0, 4).map((a) => (
              <tr key={a.id} className="border-t border-hairline">
                <td className="px-5 py-3.5 font-medium">{a.jobTitle}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{a.department}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{formatDate(a.submittedAt)}</td>
                <td className="px-5 py-3.5"><StatusBadge status={a.status} label={statusLabel(a.status)} /></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setSelected(a)} className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline">
                    {t("dashboard.overview.table.view")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mine.length === 0 && (
          <div className="text-center text-sm text-corporate-gray py-14">
            {t("dashboard.overview.emptyPrefix")} <Link to="/careers" className="text-primary underline">{t("dashboard.overview.browseOpenRoles")}</Link>
          </div>
        )}
      </div>

      {selected && (
        <ApplicantTimelineModal key={selected.id} application={selected} onClose={() => setSelected(null)} />
      )}
    </ApplicantShell>
  );
}
