import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WidatraLogo } from "@/components/ui/widatra-logo";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser, type AccountType } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";

type NavItem = {
  labelKey: string;
  to: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  external?: boolean; // renders as a plain <a> instead of a router <Link> (public pages)
};

/** Internal Employee — no Career ATS / Factory Tour access. */
const NAV_INTERNAL: NavItem[] = [
  { labelKey: "overview", to: "/applicant", icon: LayoutDashboard, exact: true },
  { labelKey: "profile", to: "/applicant/profile", icon: User },
  { labelKey: "myEventSubmissions", to: "/applicant/events", icon: CalendarPlus },
  { labelKey: "notifications", to: "/applicant/notifications", icon: Bell },
  { labelKey: "settings", to: "/applicant/security", icon: Settings },
];

/** External User — no Community Event Submission access. */
const NAV_EXTERNAL: NavItem[] = [
  { labelKey: "overview", to: "/applicant", icon: LayoutDashboard, exact: true },
  { labelKey: "profile", to: "/applicant/profile", icon: User },
  { labelKey: "careerAts", to: "/careers", icon: Briefcase, external: true },
  { labelKey: "factoryTourBooking", to: "/factory-tour", icon: Factory, external: true },
  { labelKey: "myApplications", to: "/applicant/applications", icon: FileText },
  { labelKey: "myTourBookings", to: "/applicant/tours", icon: MapPin },
  { labelKey: "documents", to: "/applicant/documents", icon: Folder },
  { labelKey: "notifications", to: "/applicant/notifications", icon: Bell },
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

export function ApplicantShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { t } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const displayName = user?.name ?? t("dashboard.shell.brandLabel");
  const firstName = displayName.split(" ")[0];
  const NAV = navFor(user?.accountType);
  const roleLabel =
    user?.accountType === "internal" ? t("dashboard.shell.roleInternal") : t("dashboard.shell.roleExternal");

  async function handleSignOut() {
    await logoutUser();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-brand-soft flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-hairline bg-white dark:bg-card">
        <Link to="/" className="flex items-center px-6 h-16 border-b border-hairline" aria-label="Home">
          <WidatraLogo variant="horizontal" size="sm" />
        </Link>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map((item, i) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to) && !item.external;
            const Icon = item.icon;
            const label = t(`dashboard.shell.nav.${item.labelKey}`);
            const cls = `flex items-center gap-3 px-3 h-10 rounded text-[13px] font-medium ${
              active ? "bg-brand-tint text-primary" : "text-corporate-black/75 dark:text-foreground/75 hover:bg-brand-soft hover:text-primary"
            }`;
            if (item.external) {
              return (
                <a key={`${item.to}-${i}`} href={item.to} className={cls}>
                  <Icon className="w-4 h-4" /> {label}
                </a>
              );
            }
            return (
              <Link key={`${item.to}-${i}`} to={item.to} className={cls}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-hairline">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[12px] text-corporate-gray hover:text-primary"
          >
            <LogOut className="w-4 h-4" /> {t("dashboard.shell.signOut")}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-hairline bg-white dark:bg-card flex items-center justify-between px-4 lg:px-8">
          <div className="text-[12px] text-corporate-gray">{t("dashboard.shell.welcomeBackPrefix")} <span className="text-corporate-black dark:text-foreground font-semibold">{firstName}</span></div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-primary text-white grid place-items-center text-[11px] font-semibold">{initials(displayName)}</div>
            <div className="hidden sm:block text-[12px] leading-tight">
              <div className="font-semibold">{displayName}</div>
              <div className="text-corporate-gray">{roleLabel}</div>
            </div>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 border-b border-hairline bg-white dark:bg-card">
          <div className="eyebrow text-primary mb-2">{t("dashboard.shell.eyebrow")}</div>
          <h1 className="text-2xl lg:text-3xl font-semibold font-display">{title}</h1>
          {subtitle && <p className="text-sm text-corporate-gray mt-1">{subtitle}</p>}
        </div>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

/**
 * Restricts a User Dashboard page to a specific account type. Renders a
 * friendly "not available" panel (instead of the page content) when the
 * signed-in user's accountType doesn't match — used to keep Career ATS /
 * Factory Tour External-only, and Community Event Submission Internal-only,
 * even if someone navigates to the URL directly.
 */
export function RoleGate({ allow, children }: { allow: AccountType; children: ReactNode }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user || user.accountType === allow) return <>{children}</>;

  return (
    <div className="card-elevated p-10 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 mx-auto rounded-full bg-brand-tint text-primary grid place-items-center mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold mb-2">{t("dashboard.roleGate.title")}</h2>
      <p className="text-sm text-corporate-gray mb-6">{t("dashboard.roleGate.description")}</p>
      <Link
        to="/applicant"
        className="inline-flex items-center justify-center h-10 px-5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep rounded"
      >
        {t("dashboard.roleGate.backToDashboard")}
      </Link>
    </div>
  );
}
