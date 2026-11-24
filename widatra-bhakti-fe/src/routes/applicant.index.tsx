import { useEffect, useMemo, useState } from "react";
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
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  CalendarPlus,
  Briefcase,
  Factory,
  FolderUp,
  UserCheck,
  Search,
  Send,
  Clock,
  CalendarCheck,
  Award,
  Eye,
  Sparkles,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/applicant/")({
  head: () => ({ meta: [{ title: "Dashboard — Widatra Applicant" }] }),
  component: ApplicantHome,
});

function InternalDashboard({ name }: { name: string }) {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const { user } = useAuth();
  const { events } = useMyCommunityEvents(user?.id);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      key: "ALL",
      label: isId ? "Total Pengajuan" : "Total submissions",
      value: events.length,
      icon: Send,
      accent: "bg-primary dark:bg-sky-400",
      iconBg: "bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300",
    },
    {
      key: "Pending",
      label: isId ? "Menunggu Review" : "Pending review",
      value: events.filter((e) => e.status === "Pending").length,
      icon: Clock,
      accent: "bg-amber-500",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300",
    },
    {
      key: "Approved",
      label: isId ? "Disetujui / Terbit" : "Approved",
      value: events.filter((e) => e.status === "Approved" || e.status === "Published").length,
      icon: Award,
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",
    },
    {
      key: "Revision Requested",
      label: isId ? "Perlu Revisi" : "Needs revision",
      value: events.filter((e) => e.status === "Revision Requested").length,
      icon: CalendarCheck,
      accent: "bg-rose-500",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300",
    },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "Approved"
            ? ev.status === "Approved" || ev.status === "Published"
            : ev.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.community.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [events, statusFilter, searchQuery]);

  return (
    <ApplicantShell
      title={`${t("dashboard.overview.welcomeBackPrefix")} ${name.split(" ")[0]}`}
      subtitle={
        isId
          ? "Ajukan dan pantau status proposal Kegiatan Komunitas internal PT Widatra Bhakti."
          : "Submit and track your internal Community Event proposals."
      }
      headerActions={
        <Link
          to="/applicant/events"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>{isId ? "Ajukan Event" : "New Submission"}</span>
        </Link>
      }
    >
      {/* Interactive Filter Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-stretch">
        {stats.map((s) => {
          const Icon = s.icon;
          const isActive = statusFilter === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setStatusFilter((prev) => (prev === s.key ? "ALL" : s.key))}
              className={`group relative text-left rounded-2xl bg-white dark:bg-[#13213a] border p-5 transition-all duration-200 cursor-pointer overflow-hidden h-full min-h-[120px] flex flex-col justify-between ${
                isActive
                  ? "border-primary dark:border-sky-400 ring-2 ring-primary/20 dark:ring-sky-400/25 shadow-md -translate-y-0.5"
                  : "border-slate-200/80 dark:border-slate-700/80 hover:border-primary/50 dark:hover:border-sky-400/50 hover:-translate-y-0.5 shadow-xs"
              }`}
            >
              <span className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${s.accent}`} />
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                  {s.label}
                </span>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg} group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                {s.value}
              </div>
            </button>
          );
        })}
      </div>

      {/* Submissions Table Card */}
      <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700/80">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isId ? "Pengajuan Terbaru" : "Recent submissions"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
              {isId ? "Klik kartu statistik di atas untuk memfilter status" : "Click a stat card above to filter by status"}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isId ? "Cari pengajuan..." : "Search event..."}
                className="h-9 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary dark:focus:border-sky-400"
              />
            </div>
            <Link
              to="/applicant/events"
              className="text-xs font-bold text-primary dark:text-sky-300 hover:underline whitespace-nowrap"
            >
              {isId ? "Kelola Semua →" : "Manage All →"}
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300 bg-slate-50/90 dark:bg-[#192a48]">
                <th className="text-left px-5 py-3.5">Title</th>
                <th className="text-left px-5 py-3.5">Community</th>
                <th className="text-left px-5 py-3.5">Event date</th>
                <th className="text-left px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
              {filteredEvents.slice(0, 6).map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{ev.title}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{ev.community}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{ev.eventDate}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300">
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEvents.length === 0 && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-300 py-14">
            {isId ? "Belum ada pengajuan kegiatan." : "No submissions found."}{" "}
            <Link to="/applicant/events" className="text-primary dark:text-sky-300 font-semibold underline">
              {isId ? "Ajukan Kegiatan Komunitas" : "Submit a Community Event"}
            </Link>
          </div>
        )}
      </div>
    </ApplicantShell>
  );
}

const PIPELINE_STEPS = ["Submitted", "Screening", "Interview", "Offer", "Hired"] as const;

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
        map[status] ??
        "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
      }`}
    >
      {label}
    </span>
  );
}

function PipelineProgress({ status }: { status: string }) {
  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-1 mt-1.5" title="Application closed">
        <span className="h-1.5 w-16 rounded-full bg-rose-500/40" />
      </div>
    );
  }
  const idx = Math.max(0, PIPELINE_STEPS.indexOf(status as any));
  return (
    <div className="flex items-center gap-1 mt-1.5" title={`Stage ${idx + 1} of ${PIPELINE_STEPS.length}`}>
      {PIPELINE_STEPS.map((step, i) => (
        <span
          key={step}
          className={`h-1.5 w-3.5 rounded-full transition-colors ${
            i <= idx
              ? "bg-primary dark:bg-sky-400"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
      ))}
    </div>
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

const CHECKLIST_STORAGE_KEY = "widatra_profile_checklist_v1";

function ApplicantHome() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const { applications } = useAtsApplications();
  const { user } = useAuth();
  const [selected, setSelected] = useState<StoredApplication | null>(null);
  const [activeStatFilter, setActiveStatFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive checklist state persisted per session/localStorage
  const [checkedItems, setCheckedItems] = useState<boolean[]>([true, true, false, false]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          setCheckedItems(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  function toggleChecklistItem(index: number) {
    setCheckedItems((prev) => {
      const next = prev.map((v, i) => (i === index ? !v : v));
      try {
        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      const doneCount = next.filter(Boolean).length;
      const pct = Math.min(100, 34 + doneCount * 16 + (doneCount === 4 ? 2 : 0));
      toast.success(
        isId
          ? `Kelengkapan profil diperbarui menjadi ${pct}%`
          : `Profile completion updated to ${pct}%`
      );
      return next;
    });
  }

  if (user?.accountType === "internal") {
    return <InternalDashboard name={user.name} />;
  }

  const activeUser = user ?? { id: "", email: mockApplicant.email };
  const mine = applications.filter((a) => belongsToUser(a, activeUser));

  const completedCount = checkedItems.filter(Boolean).length;
  const completionPct = Math.min(100, 34 + completedCount * 16 + (completedCount === 4 ? 2 : 0));

  function statusLabel(status: string) {
    return t(`dashboard.statusLabels.${status}`);
  }

  const stats = [
    {
      key: "ALL",
      label: t("dashboard.overview.stats.submitted"),
      value: mine.length,
      icon: Send,
      accent: "bg-primary dark:bg-sky-400",
      iconBg: "bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300",
      hint: isId ? "Semua lamaran terkirim" : "All submitted roles",
    },
    {
      key: "Screening",
      label: t("dashboard.overview.stats.inReview"),
      value: mine.filter((a) => a.status === "Screening").length,
      icon: Clock,
      accent: "bg-blue-500 dark:bg-blue-400",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300",
      hint: isId ? "Sedang ditinjau HR" : "Under HR evaluation",
    },
    {
      key: "Interview",
      label: t("dashboard.overview.stats.interviews"),
      value: mine.filter((a) => a.status === "Interview").length,
      icon: CalendarCheck,
      accent: "bg-amber-500",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300",
      hint: isId ? "Tahap wawancara" : "Interview stage",
    },
    {
      key: "Offer",
      label: t("dashboard.overview.stats.offers"),
      value: mine.filter((a) => a.status === "Offer" || a.status === "Hired").length,
      icon: Award,
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",
      hint: isId ? "Penawaran kerja" : "Job offers received",
    },
  ];

  const filteredApplications = useMemo(() => {
    return mine.filter((a) => {
      const matchStatus =
        activeStatFilter === "ALL"
          ? true
          : activeStatFilter === "Offer"
            ? a.status === "Offer" || a.status === "Hired"
            : a.status === activeStatFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        a.jobTitle.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [mine, activeStatFilter, searchQuery]);

  const upcomingInterviewApp = mine
    .filter((a) => a.interview && a.interview.status === "Scheduled")
    .sort((a, b) => {
      const aTime = new Date(`${a.interview!.date}T${a.interview!.time || "00:00"}:00`).getTime();
      const bTime = new Date(`${b.interview!.date}T${b.interview!.time || "00:00"}:00`).getTime();
      return aTime - bTime;
    })[0];

  const quickActions = [
    {
      title: isId ? "Lowongan Karier" : "Browse Open Roles",
      desc: isId ? "Lamar posisi baru di Widatra" : "Apply to new positions at Widatra",
      to: "/careers",
      external: true,
      icon: Briefcase,
      color: "bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300",
    },
    {
      title: isId ? "Booking Kunjungan Pabrik" : "Book Factory Tour",
      desc: isId ? "Jadwalkan kunjungan ke Pandaan" : "Schedule a Pandaan plant visit",
      to: "/factory-tour",
      external: true,
      icon: Factory,
      color: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",
    },
    {
      title: isId ? "Unggah CV & Dokumen" : "Upload CV & Documents",
      desc: isId ? "Kelola berkas lamaran Anda" : "Manage your application files",
      to: "/applicant/documents",
      external: false,
      icon: FolderUp,
      color: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300",
    },
    {
      title: isId ? "Edit Profil & Kontak" : "Update Profile Info",
      desc: isId ? "Perbarui data diri & kontak" : "Keep your contact info current",
      to: "/applicant/profile",
      external: false,
      icon: UserCheck,
      color: "bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300",
    },
  ];

  return (
    <ApplicantShell
      title={`${t("dashboard.overview.welcomeBackPrefix")} ${(user?.name ?? mockApplicant.name).split(" ")[0]}`}
      subtitle={t("dashboard.overview.subtitle")}
      headerActions={
        <a
          href="/careers"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{isId ? "Cari Lowongan" : "Explore Careers"}</span>
        </a>
      }
    >
      {/* Top Row: Interactive Profile Completion + Upcoming Interview */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6 items-stretch">
        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 lg:col-span-2 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary dark:text-sky-300">
                {t("dashboard.overview.profileCompletion")}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-300">
                {isId ? "Klik item untuk menandai selesai" : "Click items to toggle completion"}
              </span>
            </div>

            <div className="flex items-end justify-between mb-3">
              <div className="flex items-baseline gap-2.5">
                <div className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white transition-all">
                  {completionPct}%
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    completionPct === 100
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                      : "bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300"
                  }`}
                >
                  {completionPct === 100
                    ? isId
                      ? "Profil Lengkap!"
                      : "All Complete!"
                    : `${completedCount}/4 ${isId ? "Selesai" : "Completed"}`}
                </span>
              </div>
              <Link
                to="/applicant/profile"
                className="text-xs text-primary dark:text-sky-300 font-semibold flex items-center gap-1 hover:underline"
              >
                {t("dashboard.overview.completeProfile")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Animated Progress Bar */}
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-sky-400 transition-all duration-500 ease-out"
                style={{ width: `${completionPct}%` }}
              />
            </div>

            {/* Interactive Checklist Buttons */}
            <div className="mt-5 grid sm:grid-cols-2 gap-2.5 text-[13px]">
              {[0, 1, 2, 3].map((idx) => {
                const isDone = checkedItems[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleChecklistItem(idx)}
                    className={`group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/30 text-slate-900 dark:text-slate-100"
                        : "bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-primary/40 dark:hover:border-sky-400/50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 font-medium">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-sky-400 shrink-0" />
                      )}
                      <span>{t(`dashboard.overview.checklist.${idx}`)}</span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isDone ? (isId ? "Selesai" : "Done") : isId ? "Tandai" : "Check"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Interview Card */}
        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary dark:text-sky-300">
                {t("dashboard.overview.upcomingInterview")}
              </span>
              <CalendarCheck className="w-4 h-4 text-primary dark:text-sky-400" />
            </div>
            {upcomingInterviewApp?.interview ? (
              <UpcomingInterviewCard
                schedule={upcomingInterviewApp.interview}
                jobTitle={upcomingInterviewApp.jobTitle}
              />
            ) : (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-dashed border-slate-200 dark:border-slate-700 p-4 mt-2">
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t("dashboard.overview.noUpcomingInterview")}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {isId ? "Notifikasi jadwal aktif" : "Schedule alerts active"}
            </span>
            <Link
              to="/applicant/notifications"
              className="font-semibold text-primary dark:text-sky-300 hover:underline"
            >
              {isId ? "Cek Notifikasi →" : "Check Alerts →"}
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Filter Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-stretch">
        {stats.map((s) => {
          const Icon = s.icon;
          const isActive = activeStatFilter === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveStatFilter((prev) => (prev === s.key ? "ALL" : s.key))}
              className={`group relative text-left rounded-2xl bg-white dark:bg-[#13213a] border p-5 transition-all duration-200 cursor-pointer overflow-hidden h-full min-h-[120px] flex flex-col justify-between ${
                isActive
                  ? "border-primary dark:border-sky-400 ring-2 ring-primary/20 dark:ring-sky-400/25 shadow-md -translate-y-0.5"
                  : "border-slate-200/80 dark:border-slate-700/80 hover:border-primary/40 dark:hover:border-sky-400/50 hover:-translate-y-0.5 shadow-xs"
              }`}
            >
              <span className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${s.accent}`} />
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                  {s.label}
                </span>
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg} group-hover:scale-110 transition-transform shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                  {s.value}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-sky-300 transition-colors">
                  {s.hint}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Quick Actions Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6 items-stretch">
        {quickActions.map((qa) => {
          const Icon = qa.icon;
          const content = (
            <>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${qa.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-sky-300 transition-colors truncate">
                  {qa.title}
                </div>
                <div className="text-[11.5px] text-slate-500 dark:text-slate-300 truncate">
                  {qa.desc}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary dark:group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all shrink-0" />
            </>
          );
          const cls =
            "group flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 hover:border-primary/40 dark:hover:border-sky-400/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all h-full";
          return qa.external ? (
            <a key={qa.title} href={qa.to} className={cls}>
              {content}
            </a>
          ) : (
            <Link key={qa.title} to={qa.to} className={cls}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* Recent Applications Interactive Table */}
      <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t("dashboard.overview.recentApplications")}
            </h2>
            {activeStatFilter !== "ALL" && (
              <button
                type="button"
                onClick={() => setActiveStatFilter("ALL")}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 text-[11px] font-semibold hover:bg-primary/20 cursor-pointer"
              >
                <Filter className="w-3 h-3" />
                <span>{statusLabel(activeStatFilter)} ✕</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isId ? "Cari posisi / departemen..." : "Search role or dept..."}
                className="h-9 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary dark:focus:border-sky-400"
              />
            </div>
            <Link
              to="/applicant/applications"
              className="text-xs text-primary dark:text-sky-300 font-bold hover:underline whitespace-nowrap"
            >
              {t("dashboard.overview.viewAll")}
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 bg-slate-50/90 dark:bg-[#192a48]">
                <th className="text-left px-5 py-3.5">{t("dashboard.overview.table.position")}</th>
                <th className="text-left px-5 py-3.5">{t("dashboard.overview.table.department")}</th>
                <th className="text-left px-5 py-3.5">{t("dashboard.overview.table.applied")}</th>
                <th className="text-left px-5 py-3.5">{t("dashboard.overview.table.status")}</th>
                <th className="text-left px-5 py-3.5">{t("dashboard.overview.table.timeline")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
              {filteredApplications.slice(0, 5).map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="group hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-sky-300 transition-colors">
                      {a.jobTitle}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 dark:text-slate-400 mt-0.5">
                      ID: {a.id}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{a.department}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {formatDate(a.submittedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={a.status} label={statusLabel(a.status)} />
                    <PipelineProgress status={a.status} />
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
                      <span>{t("dashboard.overview.table.view")}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-300 py-14">
            {t("dashboard.overview.emptyPrefix")}{" "}
            <a href="/careers" className="text-primary dark:text-sky-300 font-semibold underline">
              {t("dashboard.overview.browseOpenRoles")}
            </a>
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
    </ApplicantShell>
  );
}
