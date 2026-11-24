import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FileText,
  User,
  Folder,
  MapPin,
  Settings,
  Bell,
  LogOut,
  CalendarPlus,
  Briefcase,
  Factory,
  ShieldAlert,
  Menu,
  X,
  Globe,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { WidatraLogo } from "@/components/ui/widatra-logo";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser, type AccountType } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";
import {
  getUnreadNotificationCount,
  initNotificationsStore,
  onNotificationsStoreChange,
} from "@/lib/notifications-store";
import { useAtsApplications } from "@/hooks/use-ats-applications";
import { belongsToUser } from "@/lib/ats-store";
import { useTourBookings } from "@/hooks/use-tour-bookings";
import {
  getAllDocuments,
  initDocumentsStore,
  onDocumentsStoreChange,
} from "@/lib/documents-store";

type NavItem = {
  labelKey: string;
  to: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  external?: boolean;
  badgeKey?: "applications" | "tours" | "documents" | "notifications";
};

/** Internal Employee — no Career ATS / Factory Tour access. */
const NAV_INTERNAL: NavItem[] = [
  { labelKey: "overview", to: "/applicant", icon: LayoutDashboard, exact: true },
  { labelKey: "profile", to: "/applicant/profile", icon: User },
  { labelKey: "myEventSubmissions", to: "/applicant/events", icon: CalendarPlus },
  { labelKey: "notifications", to: "/applicant/notifications", icon: Bell, badgeKey: "notifications" },
  { labelKey: "settings", to: "/applicant/security", icon: Settings },
];

/** External User — no Community Event Submission access. */
const NAV_EXTERNAL: NavItem[] = [
  { labelKey: "overview", to: "/applicant", icon: LayoutDashboard, exact: true },
  { labelKey: "profile", to: "/applicant/profile", icon: User },
  { labelKey: "careerAts", to: "/careers", icon: Briefcase, external: true },
  { labelKey: "factoryTourBooking", to: "/factory-tour", icon: Factory, external: true },
  { labelKey: "myApplications", to: "/applicant/applications", icon: FileText, badgeKey: "applications" },
  { labelKey: "myTourBookings", to: "/applicant/tours", icon: MapPin, badgeKey: "tours" },
  { labelKey: "documents", to: "/applicant/documents", icon: Folder, badgeKey: "documents" },
  { labelKey: "notifications", to: "/applicant/notifications", icon: Bell, badgeKey: "notifications" },
  { labelKey: "settings", to: "/applicant/security", icon: Settings },
];

function navFor(accountType: AccountType | undefined): NavItem[] {
  return accountType === "internal" ? NAV_INTERNAL : NAV_EXTERNAL;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ApplicantShell({
  title,
  subtitle,
  headerActions,
  children,
}: {
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  children: ReactNode;
}) {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Live badge counts for interactive navigation
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const { applications } = useAtsApplications();
  const { bookings } = useTourBookings();

  useEffect(() => {
    initNotificationsStore();
    setUnreadNotifs(getUnreadNotificationCount());
    return onNotificationsStoreChange(() => setUnreadNotifs(getUnreadNotificationCount()));
  }, []);

  useEffect(() => {
    initDocumentsStore();
    setDocCount(getAllDocuments().length);
    return onDocumentsStoreChange(() => setDocCount(getAllDocuments().length));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const myAppCount = user ? applications.filter((a) => belongsToUser(a, user)).length : 0;
  const myTourCount = user
    ? bookings.filter((b) => b.email.trim().toLowerCase() === user.email.trim().toLowerCase()).length
    : 0;

  const badgeCounts: Record<NonNullable<NavItem["badgeKey"]>, number> = {
    applications: myAppCount,
    tours: myTourCount,
    documents: docCount,
    notifications: unreadNotifs,
  };

  const displayName = user?.name ?? t("dashboard.shell.brandLabel");
  const firstName = displayName.split(" ")[0];
  const NAV = navFor(user?.accountType);
  const roleLabel =
    user?.accountType === "internal" ? t("dashboard.shell.roleInternal") : t("dashboard.shell.roleExternal");

  async function handleSignOut() {
    await logoutUser();
    window.location.href = "/";
  }

  function renderNavList() {
    return (
      <nav className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-400">
          {isId ? "Menu Akun" : "Account Menu"}
        </div>
        {NAV.map((item, i) => {
          const active = item.exact
            ? pathname === item.to
            : pathname.startsWith(item.to) && !item.external;
          const Icon = item.icon;
          const label = t(`dashboard.shell.nav.${item.labelKey}`);
          const count = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          const isAlertBadge = item.badgeKey === "notifications" && count > 0;

          const cls = `group relative flex items-center justify-between gap-2.5 px-3.5 h-11 rounded-xl text-[13px] font-medium transition-all duration-200 ${
            active
              ? "bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 font-semibold shadow-xs ring-1 ring-primary/15 dark:ring-sky-400/25"
              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/75 hover:text-primary dark:hover:text-sky-300 hover:translate-x-0.5"
          }`;

          const inner = (
            <>
              {active && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-primary dark:bg-sky-400" />
              )}
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    active
                      ? "text-primary dark:text-sky-300"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-sky-300"
                  }`}
                />
                <span className="truncate">{label}</span>
              </span>

              {count > 0 ? (
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-colors ${
                    isAlertBadge
                      ? "bg-rose-500 text-white shadow-xs"
                      : active
                        ? "bg-primary text-white dark:bg-sky-400 dark:text-slate-950"
                        : "bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {count}
                </span>
              ) : item.external ? (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              ) : null}
            </>
          );

          if (item.external) {
            return (
              <a key={`${item.to}-${i}`} href={item.to} className={cls}>
                {inner}
              </a>
            );
          }
          return (
            <Link key={`${item.to}-${i}`} to={item.to} className={cls}>
              {inner}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#091120] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-68 shrink-0 flex-col border-r border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-[#101b31] shadow-xs">
        <div className="px-5 h-16 border-b border-slate-200/80 dark:border-slate-800/90 flex items-center">
          <Link to="/" className="flex items-center min-w-0" aria-label="Home">
            <WidatraLogo variant="horizontal" size="sm" showSubtitle={false} />
          </Link>
        </div>

        {renderNavList()}

        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/90 space-y-1.5">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-primary dark:hover:text-sky-300 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-primary dark:text-sky-400" />
              {isId ? "Ke Beranda Utama" : "Back to Main Website"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t("dashboard.shell.signOut")}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-white dark:bg-[#101b31] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl">
            <div className="px-5 h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Link to="/" className="flex items-center" aria-label="Home">
                <WidatraLogo variant="horizontal" size="sm" showSubtitle={false} />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderNavList()}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              <Link
                to="/"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Globe className="w-4 h-4 text-primary dark:text-sky-400" />
                {isId ? "Ke Beranda Utama" : "Back to Main Website"}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15"
              >
                <LogOut className="w-4 h-4" />
                {t("dashboard.shell.signOut")}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/90 bg-white/90 dark:bg-[#101b31]/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-[12.5px] text-slate-600 dark:text-slate-300">
              {t("dashboard.shell.welcomeBackPrefix")}{" "}
              <span className="text-slate-900 dark:text-white font-semibold">{firstName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Interactive Quick Notification Bell */}
            <Link
              to="/applicant/notifications"
              className="relative w-9 h-9 rounded-full border border-slate-200/90 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/70 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-sky-300 hover:border-primary/40 dark:hover:border-sky-400/40 transition-all"
              aria-label={t("dashboard.shell.nav.notifications")}
              title={t("dashboard.shell.nav.notifications")}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#101b31]">
                  {unreadNotifs}
                </span>
              )}
            </Link>

            {/* Interactive User Profile Chip */}
            <Link
              to="/applicant/profile"
              className="group flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-slate-200/90 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/70 hover:border-primary/40 dark:hover:border-sky-400/50 transition-all"
            >
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-primary to-brand-deep dark:from-sky-500 dark:to-blue-600 text-white grid place-items-center text-[11px] font-bold shadow-xs">
                {initials(displayName)}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#101b31]" />
              </div>
              <div className="hidden sm:block text-[11.5px] leading-tight">
                <div className="font-semibold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-sky-300 transition-colors">
                  {displayName}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400">{roleLabel}</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Hero Header Banner */}
        <div className="relative overflow-hidden px-4 lg:px-8 py-6 sm:py-7 border-b border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-[#101b31]">
          <div className="pointer-events-none absolute -right-16 -top-20 w-72 h-72 rounded-full bg-primary/[0.04] dark:bg-sky-500/[0.07] blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 text-[10px] font-bold uppercase tracking-[0.22em] mb-2.5">
                <Sparkles className="w-3 h-3" />
                <span>{t("dashboard.shell.eyebrow")}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">{subtitle}</p>
              )}
            </div>
            {headerActions && <div className="flex items-center gap-2.5 shrink-0">{headerActions}</div>}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 max-w-[1440px] w-full mx-auto">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

/**
 * Restricts a User Dashboard page to a specific account type.
 */
export function RoleGate({ allow, children }: { allow: AccountType; children: ReactNode }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user || user.accountType === allow) return <>{children}</>;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-800 p-10 text-center max-w-lg mx-auto shadow-sm">
      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 grid place-items-center mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {t("dashboard.roleGate.title")}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
        {t("dashboard.roleGate.description")}
      </p>
      <Link
        to="/applicant"
        className="inline-flex items-center justify-center h-10 px-5 bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-colors"
      >
        {t("dashboard.roleGate.backToDashboard")}
      </Link>
    </div>
  );
}
