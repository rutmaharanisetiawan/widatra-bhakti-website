import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminShell, StatCard, StatusPill, DataTable } from "@/components/admin-shell";
import { useContactInbox } from "@/hooks/use-contact-inbox";
import { useAtsApplications } from "@/hooks/use-ats-applications";
import { useTourBookings } from "@/hooks/use-tour-bookings";
import { getContactStatus, formatReceivedAgo } from "@/lib/contact-data";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Users, Package, Briefcase, CalendarCheck, Factory, CheckCircle2 } from "lucide-react";

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

  const latestInquiries = inquiries.filter((i) => !i.archived).slice(0, 5);
  const totalContacts = inquiries.filter((i) => !i.archived).length;
  const recentApplicants = applications.slice(0, 5);

  const quickActions = [
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
        delta={unreadCount > 0 ? `${unreadCount} unread` : t("admin.index.stats.inquiriesDelta")}
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
      ? "grid sm:grid-cols-2 gap-4 mb-6"
      : statCards.length === 3
        ? "grid sm:grid-cols-3 gap-4 mb-6"
        : "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6";

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
