import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { WidatraLogo } from "@/components/ui/widatra-logo";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser, type UserRole } from "@/lib/auth-store";
import { useUnreadContactCount } from "@/hooks/use-contact-inbox";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  HeartHandshake,
  Factory,
  Briefcase,
  Inbox,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Bell,
  Search,
  CalendarCheck,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

type NavItem = {
  labelKey: string;
  to: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  allowedRoles?: UserRole[];
};

const NAV: readonly NavItem[] = [
  { labelKey: "overview", to: "/admin", icon: LayoutDashboard, exact: true },
  {
    labelKey: "products",
    to: "/admin/products",
    icon: Package,
    allowedRoles: ["Super Admin", "Content Admin", "Administrator", "Content Editor"],
  },
  {
    labelKey: "newsEvents",
    to: "/admin/news",
    icon: Newspaper,
    allowedRoles: ["Super Admin", "Content Admin", "Administrator", "Content Editor", "CSR Coordinator"],
  },
  {
    labelKey: "communityEvents",
    to: "/admin/events",
    icon: CalendarCheck,
    allowedRoles: ["Super Admin", "Event Moderator", "Administrator"],
  },
  {
    labelKey: "csr",
    to: "/admin/csr",
    icon: HeartHandshake,
    allowedRoles: ["Super Admin", "Content Admin", "Administrator", "Content Editor", "CSR Coordinator"],
  },
  {
    labelKey: "factoryTour",
    to: "/admin/factory-tour",
    icon: Factory,
    allowedRoles: ["Super Admin", "Factory Tour Admin", "Administrator"],
  },
  {
    labelKey: "careersAts",
    to: "/admin/careers",
    icon: Briefcase,
    allowedRoles: ["Super Admin", "HR Manager", "Administrator"],
  },
  {
    labelKey: "contactInbox",
    to: "/admin/contact",
    icon: Inbox,
    allowedRoles: ["Super Admin", "Content Admin", "Administrator", "Content Editor"],
  },
  {
    labelKey: "companyCms",
    to: "/admin/cms",
    icon: FileText,
    allowedRoles: ["Super Admin", "Content Admin", "Administrator", "Content Editor"],
  },
  {
    labelKey: "mediaLibrary",
    to: "/admin/media",
    icon: ImageIcon,
    allowedRoles: ["Super Admin", "Content Admin", "Administrator", "Content Editor"],
  },
  {
    labelKey: "usersRoles",
    to: "/admin/users",
    icon: Users,
    allowedRoles: ["Super Admin", "Administrator"],
  },
  {
    labelKey: "analytics",
    to: "/admin/analytics",
    icon: BarChart3,
    allowedRoles: ["Super Admin", "Administrator"],
  },
  {
    labelKey: "settings",
    to: "/admin/settings",
    icon: Settings,
    allowedRoles: ["Super Admin", "Administrator"],
  },
];

export function AdminShell({ title, subtitle, actions, children }: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ADMIN_ROLES: UserRole[] = [
    "Super Admin",
    "Content Admin",
    "HR Manager",
    "Event Moderator",
    "Factory Tour Admin",
    "Administrator",
    "Content Editor",
    "CSR Coordinator",
  ];

  const userRoles: string[] = [
    user?.role || "",
    ...(Array.isArray((user as unknown as { roles?: string[] })?.roles)
      ? (user as unknown as { roles: string[] }).roles
      : []),
  ].filter(Boolean);

  const isSuperAdmin = userRoles.includes("Super Admin") || userRoles.includes("Administrator");
  const canManageContact = isSuperAdmin || userRoles.includes("Content Admin") || userRoles.includes("Content Editor");
  const unreadContactCount = useUnreadContactCount(canManageContact);

  // Filter modules: if not permitted, completely exclude it from the menu
  const visibleNav = NAV.filter((item) => {
    if (isSuperAdmin) return true;
    if (!item.allowedRoles) return true;
    return item.allowedRoles.some((role) => userRoles.includes(role));
  });

  // Check if current route is unauthorized for this user
  const currentNav = NAV.find((item) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to)
  );

  const isDenied =
    Boolean(currentNav?.allowedRoles) &&
    !isSuperAdmin &&
    !currentNav?.allowedRoles?.some((role) => userRoles.includes(role));

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (ready && (!user || !ADMIN_ROLES.includes(user.role))) {
      navigate({ to: "/admin/login" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  async function handleSignOut() {
    await logoutUser();
    window.location.href = "/admin/login";
  }

  const initials = (user?.name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-brand-soft text-corporate-black dark:text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-hairline bg-white dark:bg-card">
        <Link to="/admin" className="flex items-center px-6 h-16 border-b border-hairline" aria-label="Admin Dashboard">
          <WidatraLogo variant="horizontal" size="sm" subtitle="Admin Portal" />
        </Link>
        <div className="px-4 py-2 border-b border-hairline/60 bg-brand-soft/40">
          <div className="text-[10px] uppercase font-bold tracking-wider text-corporate-gray">Role Akses Aktif</div>
          <div className="text-xs font-semibold text-primary truncate mt-0.5">{user?.role || "Admin"}</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {visibleNav.map((item) => {
            const active = (item as {exact?:boolean}).exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            const showBadge = item.labelKey === "contactInbox" && unreadContactCount > 0;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 h-10 rounded text-[13px] font-medium transition ${
                  active ? "bg-brand-tint text-primary font-semibold" : "text-corporate-black/75 dark:text-foreground/75 hover:bg-brand-soft hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{t(`admin.shell.nav.${item.labelKey}`)}</span>
                {showBadge && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-bold grid place-items-center">
                    {unreadContactCount > 99 ? "99+" : unreadContactCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-hairline">
          <button onClick={handleSignOut} className="flex items-center gap-2 text-[12px] text-corporate-gray hover:text-primary">
            <LogOut className="w-4 h-4" /> {t("admin.shell.signOut")}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-corporate-black/60 backdrop-blur-xs flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] bg-white dark:bg-card h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 border-b border-hairline px-5 flex items-center justify-between">
              <WidatraLogo variant="horizontal" size="sm" subtitle="Admin Portal" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg grid place-items-center text-corporate-gray hover:bg-brand-soft"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-2.5 border-b border-hairline/60 bg-brand-soft/40">
              <div className="text-[10px] uppercase font-bold tracking-wider text-corporate-gray">Role Akses Aktif</div>
              <div className="text-xs font-semibold text-primary truncate mt-0.5">{user?.role || "Admin"}</div>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {visibleNav.map((item) => {
                const active = (item as {exact?:boolean}).exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                const showBadge = item.labelKey === "contactInbox" && unreadContactCount > 0;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 h-10 rounded text-[13px] font-medium transition ${
                      active ? "bg-brand-tint text-primary font-semibold" : "text-corporate-black/75 dark:text-foreground/75 hover:bg-brand-soft hover:text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{t(`admin.shell.nav.${item.labelKey}`)}</span>
                    {showBadge && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-bold grid place-items-center">
                        {unreadContactCount > 99 ? "99+" : unreadContactCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-hairline">
              <button onClick={handleSignOut} className="flex items-center gap-2 text-[12px] text-corporate-gray hover:text-primary">
                <LogOut className="w-4 h-4" /> {t("admin.shell.signOut")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-hairline bg-white dark:bg-card flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-corporate-gray hover:bg-brand-soft"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Search className="w-4 h-4 text-corporate-gray" />
            <input
              placeholder={t("admin.shell.searchPlaceholder")}
              className="w-full h-10 bg-transparent text-sm focus:outline-none placeholder:text-corporate-gray"
            />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative w-9 h-9 grid place-items-center rounded-full hover:bg-brand-soft">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-hairline">
              <div className="w-8 h-8 rounded-full bg-primary text-white grid place-items-center text-[11px] font-semibold">{initials || "—"}</div>
              <div className="leading-tight text-[12px]">
                <div className="font-semibold">{user?.name ?? "—"}</div>
                <div className="text-corporate-gray">{user?.role ?? t("admin.shell.userRole")}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 lg:py-8 border-b border-hairline bg-white dark:bg-card flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-primary mb-2">{t("admin.shell.eyebrow")}</div>
            <h1 className="text-2xl lg:text-3xl font-semibold font-display">{title}</h1>
            {subtitle && <p className="text-sm text-corporate-gray mt-1 max-w-2xl">{subtitle}</p>}
          </div>
          {actions && !isDenied && <div className="flex gap-2">{actions}</div>}
        </div>

        <main className="flex-1 p-4 lg:p-8">
          {isDenied ? (
            <div className="card-elevated p-8 lg:p-12 text-center max-w-lg mx-auto my-10 border border-destructive/20 bg-white dark:bg-card rounded-2xl shadow-sm">
              <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive mx-auto grid place-items-center mb-4">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold font-display text-corporate-black dark:text-foreground">
                Akses Modul Dibatasi
              </h2>
              <p className="text-sm text-corporate-gray mt-2 leading-relaxed">
                Akun Anda terdaftar dengan role <strong>{user?.role}</strong> yang tidak memiliki kewenangan untuk mengakses atau mengelola modul ini.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center h-10 px-5 bg-primary text-white text-xs font-semibold rounded hover:bg-brand-deep transition shadow-sm"
                >
                  Kembali ke Dashboard Utama
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="card-elevated p-5">
      <div className="text-[11px] uppercase tracking-[0.2em] text-corporate-gray">{label}</div>
      <div className="mt-2 text-3xl font-semibold font-display text-corporate-black dark:text-foreground">{value}</div>
      {delta && <div className="mt-1 text-[12px] text-emerald-600 dark:text-emerald-400">{delta}</div>}
    </div>
  );
}

export function AdminButton({ children, variant = "primary", onClick }: {
  children: ReactNode; variant?: "primary" | "ghost"; onClick?: () => void;
}) {
  const cls = variant === "primary"
    ? "inline-flex items-center gap-2 h-10 px-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep rounded"
    : "inline-flex items-center gap-2 h-10 px-4 border border-hairline text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-primary hover:text-primary rounded";
  return <button onClick={onClick} className={cls}>{children}</button>;
}

export function DataTable({ columns, rows }: {
  columns: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="card-elevated overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-soft text-[11px] uppercase tracking-[0.18em] text-corporate-gray">
            {columns.map((c) => <th key={c} className="text-left px-5 py-3 font-semibold">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-hairline hover:bg-brand-soft/50">
              {row.map((cell, j) => <td key={j} className="px-5 py-3.5">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const { t } = useLanguage();
  const map: Record<string, string> = {
    Published: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Draft: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Archived: "bg-slate-100 dark:bg-surface-2 text-slate-600 dark:text-muted-foreground",
    Active: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Inactive: "bg-slate-100 dark:bg-surface-2 text-slate-600 dark:text-muted-foreground",
    New: "bg-brand-tint text-primary",
    Unread: "bg-brand-tint text-primary",
    Read: "bg-slate-100 dark:bg-surface-2 text-slate-600 dark:text-muted-foreground",
    "In Progress": "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Replied: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Applied: "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground",
    Screening: "bg-brand-tint text-primary",
    Interview: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Offer: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Hired: "bg-primary text-white",
    Rejected: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400",
    Submitted: "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground",
    Pending: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Reviewed: "bg-brand-tint text-primary",
    Approved: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Completed: "bg-primary text-white",
    "Revision Requested": "bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400",
  };
  return (
    <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold ${map[status] ?? "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground"}`}>
      {label ?? t(`admin.statusLabels.${status}`)}
    </span>
  );
}
