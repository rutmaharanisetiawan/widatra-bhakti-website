import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminShell, StatCard, StatusPill, DataTable } from "@/components/admin-shell";
import { useContactInbox } from "@/hooks/use-contact-inbox";
import { useAtsApplications } from "@/hooks/use-ats-applications";
import { useTourBookings } from "@/hooks/use-tour-bookings";
import { getContactStatus, formatReceivedAgo } from "@/lib/contact-data";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Users, Package, Briefcase, CalendarCheck, Factory, CheckCircle2, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Widatra" }] }),
  component: AdminHome,
});

function AdminHome() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRoles: string[] = [
    user?.role || "",
    ...(Array.isArray((user as unknown as { roles?: string[] })?.roles)
      ? (user as unknown as { roles: string[] }).roles
      : []),
  ].filter(Boolean);

  const isSuperAdmin = userRoles.includes("Super Admin") || userRoles.includes("Administrator");
  const canManageContent = isSuperAdmin || userRoles.includes("Content Admin") || userRoles.includes("Content Editor");
  const canManageHR = isSuperAdmin || userRoles.includes("HR Manager");
  const canManageTours = isSuperAdmin || userRoles.includes("Factory Tour Admin");
  const canModerateEvents = isSuperAdmin || userRoles.includes("Event Moderator");

  const { inquiries, unreadCount } = useContactInbox(canManageContent);
  const { applications } = useAtsApplications();
  const { bookings } = useTourBookings(canManageTours);

  const isPv = (i: { source?: string; id: string; subject: string }) =>
    Boolean(
      i.source?.toLowerCase().includes("pharmacovigilance") ||
      i.source?.toLowerCase().includes("adr") ||
      i.id.startsWith("PV-") ||
      i.subject.toLowerCase().includes("[adr]")
    );

  const pvReports = inquiries.filter((i) => !i.archived && isPv(i));
  const unreadPvCount = pvReports.filter((r) => !r.read).length;

  const generalInquiries = inquiries.filter((i) => !i.archived && !isPv(i));
  const latestInquiries = generalInquiries.slice(0, 5);
  const totalContacts = generalInquiries.length;
  const generalUnreadCount = generalInquiries.filter((i) => !i.read).length;
  const recentApplicants = applications.slice(0, 5);

  const quickActions = [
    canManageContent && {
      label: "Farmakovigilans (ADR)",
      icon: HeartPulse,
      to: "/admin/pharmacovigilance",
    },
    canManageContent && { label: t("admin.index.quickActions.publishProduct"), icon: Package, to: "/admin/products" },
    canManageHR && { label: t("admin.index.quickActions.postJob"), icon: Briefcase, to: "/admin/careers" },
    canManageTours && { label: "Kelola Tur Pabrik", icon: Factory, to: "/admin/factory-tour" },
    canModerateEvents && { label: "Moderasi Event Komunitas", icon: CalendarCheck, to: "/admin/events" },
    isSuperAdmin && { label: t("admin.index.quickActions.inviteTeamMember"), icon: Users, to: "/admin/users" },
  ].filter(Boolean) as { label: string; icon: typeof Package; to: string }[];

  const statCards = [
    <StatCard key="visitors" label={t("admin.index.stats.visitors")} value="—" delta={t("admin.index.stats.visitorsDelta")} />,
    canManageContent && (
      <StatCard
        key="inquiries"
        label={t("admin.index.stats.inquiries")}
        value={totalContacts.toString()}
        delta={generalUnreadCount > 0 ? `${generalUnreadCount} unread` : t("admin.index.stats.inquiriesDelta")}
      />
    ),
    canManageContent && (
      <StatCard
        key="pv"
        label="Farmakovigilans (ADR)"
        value={pvReports.length.toString()}
        delta={unreadPvCount > 0 ? `${unreadPvCount} perlu evaluasi BPOM` : "Semua tertangani"}
      />
    ),
    canManageHR && (
      <StatCard key="applicants" label={t("admin.index.stats.applicants")} value={applications.length.toString()} delta={t("admin.index.stats.applicantsDelta")} />
    ),
    canManageTours && (
      <StatCard key="tours" label={t("admin.index.stats.tours")} value={bookings.length.toString()} delta={t("admin.index.stats.toursDelta")} />
    ),
  ].filter(Boolean);

  const statGridClass =
    statCards.length === 2
      ? "grid sm:grid-cols-2 gap-4 mb-6 items-stretch"
      : statCards.length === 3
        ? "grid sm:grid-cols-3 gap-4 mb-6 items-stretch"
        : "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-stretch";

  const showHRTable = canManageHR;
  const showContentTable = canManageContent;
  const showToursTable = canManageTours && !canManageContent && !canManageHR;
  const hasMultipleTables = (showHRTable ? 1 : 0) + (showContentTable ? 1 : 0) > 1;

  return (
    <AdminShell title={t("admin.index.title")} subtitle={t("admin.index.subtitle")}>
      <div className={statGridClass}>{statCards}</div>

      {/* Quick Actions Panel */}
      <div className="card-elevated p-6 mb-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline">
          <div>
            <div className="eyebrow text-primary">Aksi Cepat & Navigasi Modul</div>
            <h2 className="font-display text-lg font-semibold mt-0.5">{t("admin.index.quickActions.title")}</h2>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
            {user?.role || "Admin"}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate({ to: a.to })}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-hairline hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all text-left group cursor-pointer bg-surface/50 dark:bg-card/50"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-card border border-hairline flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-primary/40 shadow-xs transition-transform">
                <a.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate text-corporate-black dark:text-white group-hover:text-primary transition-colors">
                  {a.label}
                </div>
                <div className="text-[11px] text-corporate-gray truncate mt-0.5">Buka modul →</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pharmacovigilance (ADR) Dedicated Wadah Container */}
      {canManageContent && (
        <div className="card-elevated p-6 mb-6 border-l-4 border-l-rose-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-hairline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-600 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-corporate-black dark:text-white">
                    Laporan Farmakovigilans (ADR)
                  </h2>
                  {unreadPvCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold animate-pulse">
                      {unreadPvCount} Perlu Evaluasi Klinis
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold">
                      Semua Tertangani
                    </span>
                  )}
                </div>
                <p className="text-xs text-corporate-gray mt-0.5">
                  Wadah evaluasi Kejadian Tidak Diinginkan (KTD) &amp; Kepatuhan Regulasi BPOM No. 4/2026
                </p>
              </div>
            </div>
            <Link
              to="/admin/pharmacovigilance"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors shrink-0"
            >
              <span>Buka Modul Farmakovigilans</span>
              <span>→</span>
            </Link>
          </div>

          {pvReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-corporate-gray rounded-xl border border-dashed border-hairline">
              Belum ada laporan efek samping (ADR) masuk. Seluruh laporan yang dikirim melalui formulir publik akan otomatis tercatat di wadah ini.
            </div>
          ) : (
            <DataTable
              columns={["No. Referensi & Pasien", "Produk Terduga", "Pelapor / Faskes", "Waktu Terima", "Status"]}
              rows={pvReports.slice(0, 5).map((r) => [
                <div key={r.id}>
                  <div className="font-mono text-xs font-bold text-primary">{r.id}</div>
                  <div className="text-xs text-corporate-black dark:text-white font-medium mt-0.5">
                    {r.subject.replace(/\[ADR\]\s*/i, "")}
                  </div>
                </div>,
                <span key={r.id + "-p"} className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {r.subject.split("-")[0]?.replace(/\[ADR\]\s*/i, "").trim() || "Produk Infus"}
                </span>,
                <div key={r.id + "-rep"}>
                  <div className="text-xs font-medium">{r.name}</div>
                  <div className="text-[11px] text-corporate-gray truncate max-w-[180px]">{r.organization || "-"}</div>
                </div>,
                <span key={r.id + "-t"} className="text-[11px] text-corporate-gray whitespace-nowrap">
                  {formatReceivedAgo(r.receivedAt)}
                </span>,
                <StatusPill key={r.id + "-st"} status={getContactStatus(r)} />,
              ])}
            />
          )}
        </div>
      )}

      {/* Primary Data Tables */}
      <div className={hasMultipleTables ? "grid lg:grid-cols-2 gap-6" : "space-y-6"}>
        {showHRTable && (
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">{t("admin.index.recentApplicants")}</h2>
              <Link to="/admin/careers" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary hover:underline">
                Kelola ATS →
              </Link>
            </div>
            <DataTable
              columns={[t("admin.index.table.applicant"), t("admin.index.table.position"), t("admin.index.table.stage")]}
              rows={recentApplicants.map((a) => [
                a.fullName,
                <span key={a.id + "-j"} className="text-corporate-gray">{a.jobTitle}</span>,
                <StatusPill key={a.id + "-st"} status={a.status} />,
              ])}
            />
          </div>
        )}

        {showContentTable && (
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">{t("admin.index.latestInquiries")}</h2>
              <Link to="/admin/contact" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary hover:underline">
                View inbox →
              </Link>
            </div>
            <DataTable
              columns={[t("admin.index.table.from"), t("admin.index.table.subject"), t("admin.index.table.status")]}
              rows={latestInquiries.map((i) => [
                <div key={i.id}>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-[11px] text-corporate-gray">{formatReceivedAgo(i.receivedAt)}</div>
                </div>,
                <span key={i.id + "-s"} className="text-corporate-gray truncate block max-w-xs">{i.subject}</span>,
                <StatusPill key={i.id + "-st"} status={getContactStatus(i)} />,
              ])}
            />
          </div>
        )}

        {showToursTable && (
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Jadwal Booking Kunjungan Pabrik</h2>
              <Link to="/admin/factory-tour" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary hover:underline">
                Kelola Booking →
              </Link>
            </div>
            <DataTable
              columns={["Institusi / Pemohon", "Kontak", "Tanggal", "Status"]}
              rows={bookings.slice(0, 5).map((b) => [
                <div key={b.id}>
                  <div className="font-medium">{b.organization}</div>
                  <div className="text-[11px] text-corporate-gray">{b.pax} peserta</div>
                </div>,
                <span key={b.id + "-c"} className="text-corporate-gray">{b.visitorName}</span>,
                <span key={b.id + "-d"} className="text-corporate-gray">{b.tourDate}</span>,
                <StatusPill key={b.id + "-st"} status={b.status} />,
              ])}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
