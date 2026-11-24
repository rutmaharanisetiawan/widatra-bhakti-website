import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { WidatraLogo } from "@/components/ui/widatra-logo";
import { OtsukaLogo } from "@/components/ui/otsuka-logo";

const NAV = [
  { labelKey: "nav.home", to: "/" },
  {
    labelKey: "nav.aboutUs",
    to: "/about",
    children: [
      { labelKey: "nav.companyProfile", to: "/about", hash: "profile" },
      { labelKey: "nav.management", to: "/management" },
      { labelKey: "nav.visionMission", to: "/about", hash: "vision-mission" },
      { labelKey: "nav.companyValues", to: "/about", hash: "values" },
      { labelKey: "nav.videoProfile", to: "/about", hash: "video" },
      { labelKey: "nav.awards", to: "/about", hash: "certifications" },
    ],
  },
  { labelKey: "nav.ourProducts", to: "/products" },
  { labelKey: "nav.factoryTour", to: "/factory-tour" },
  { labelKey: "nav.newsEvent", to: "/news" },
  { labelKey: "nav.csr", to: "/csr" },
  { labelKey: "nav.careers", to: "/careers" },
  { labelKey: "nav.contact", to: "/contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const isId = language === "id";
  const slogan = isId
    ? "Mitra Terpercaya untuk Kesehatan yang Lebih Baik"
    : "Reliable Partner for Better Health";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
    setMobileAccordion(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setActiveDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openDropdown = (key: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveDropdown(key);
  };
  const scheduleCloseDropdown = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveDropdown(null), 140);
  };

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-5 pointer-events-none">
      {/* Floating Pill Navbar */}
      <nav
        aria-label="Main navigation"
        className={`pointer-events-auto mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-[1420px] rounded-[50px] bg-white/95 dark:bg-popover/95 backdrop-blur-xl ring-1 ring-black/[0.06] dark:ring-white/[0.10] transition-all duration-300 ${
          scrolled
            ? "h-[54px] sm:h-[60px] shadow-[0_14px_44px_-10px_rgba(9,42,125,0.22)] dark:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.65)]"
            : "h-[58px] sm:h-[64px] shadow-[0_8px_36px_0_rgba(9,42,125,0.14)] dark:shadow-[0_8px_36px_0_rgba(0,0,0,0.55)]"
        }`}
      >
        <div className="h-full px-3.5 sm:px-5 flex items-center justify-between gap-2.5 xl:gap-3 2xl:gap-5">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0 min-w-0" aria-label="PT Widatra Bhakti Home">
            <WidatraLogo variant="horizontal" size="md" subtitle={slogan} showAccentAnimation={true} />
          </Link>

          {/* Desktop Centered Nav Links */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1 flex-1 justify-center min-w-0">
            {NAV.map((item) => {
              const hasChildren = "children" in item;
              const isActive = hasChildren
                ? pathname === item.to ||
                  pathname.startsWith(item.to) ||
                  item.children.some((c) => pathname === c.to || pathname.startsWith(c.to))
                : pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));

              if (hasChildren) {
                const isOpen = activeDropdown === item.labelKey;
                return (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => openDropdown(item.labelKey)}
                    onMouseLeave={scheduleCloseDropdown}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown((cur) => (cur === item.labelKey ? null : item.labelKey))
                      }
                      onFocus={() => openDropdown(item.labelKey)}
                      aria-expanded={isOpen}
                      className={`group/nav relative flex items-center gap-1 px-2 2xl:px-3 py-1.5 text-[11px] 2xl:text-[12.5px] font-semibold tracking-[-0.01em] whitespace-nowrap rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                        isActive
                          ? "text-primary bg-brand-tint/70 dark:bg-white/[0.08]"
                          : "text-corporate-black/75 dark:text-white/80 hover:text-primary hover:bg-brand-soft dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="transition-transform duration-200 group-hover/nav:-translate-y-[0.5px]">
                        {t(item.labelKey)}
                      </span>
                      <span
                        className={`inline-block w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-current transition-transform duration-200 ${
                          isOpen ? "-rotate-135 translate-y-[1px]" : "rotate-45 -translate-y-[1px]"
                        }`}
                      />
                      <span
                        className={`pointer-events-none absolute left-3.5 right-3.5 bottom-1 h-[2px] rounded-full bg-gradient-to-r from-primary via-brand-deep to-accent origin-left transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                        }`}
                      />
                    </button>

                    {/* Floating Dropdown Card */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[290px] transition-all duration-250 ease-out ${
                        isOpen
                          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white dark:bg-popover rounded-2xl shadow-[0_24px_60px_-15px_rgba(9,42,125,0.26)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-black/[0.06] dark:ring-white/[0.08] overflow-hidden p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.labelKey}
                            to={child.to}
                            hash={"hash" in child ? child.hash : undefined}
                            onClick={() => setActiveDropdown(null)}
                            className="group/item flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-corporate-black/80 dark:text-white/80 hover:bg-brand-tint dark:hover:bg-white/[0.06] hover:text-primary transition-all duration-200"
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/30 flex-shrink-0 transition-all duration-200 group-hover/item:bg-primary group-hover/item:scale-125" />
                              {t(child.labelKey)}
                            </span>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              className="opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 text-primary"
                            >
                              <path
                                d="M2.5 6h7M6.5 3l3 3-3 3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group/nav relative px-2 2xl:px-3 py-1.5 text-[11px] 2xl:text-[12.5px] font-semibold tracking-[-0.01em] whitespace-nowrap rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive
                      ? "text-primary bg-brand-tint/70 dark:bg-white/[0.08]"
                      : "text-corporate-black/75 dark:text-white/80 hover:text-primary hover:bg-brand-soft dark:hover:bg-white/[0.05]"
                  }`}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <span className="inline-block transition-transform duration-200 group-hover/nav:-translate-y-[0.5px]">
                    {t(item.labelKey)}
                  </span>
                  <span
                    className={`pointer-events-none absolute left-3.5 right-3.5 bottom-1 h-[2px] rounded-full bg-gradient-to-r from-primary via-brand-deep to-accent origin-left transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Utility Cluster */}
          <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2 flex-shrink-0">
            <div className="hidden 2xl:flex items-center mr-1.5">
              <OtsukaLogo variant="badge" size="md" href="https://www.otsuka.com/en/company/group/#asia" />
            </div>
            <div className="hidden xl:flex 2xl:hidden items-center mr-1">
              <OtsukaLogo variant="horizontal" size="md" href="https://www.otsuka.com/en/company/group/#asia" />
            </div>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to={isAuthenticated ? "/applicant" : "/auth/login"}
              aria-label={isAuthenticated ? t("nav.myAccount") : t("nav.signInRegister")}
              title={isAuthenticated ? t("nav.myAccount") : t("nav.signInRegister")}
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/[0.08] dark:border-white/[0.12] text-corporate-black/65 dark:text-white/75 hover:text-primary hover:border-primary/40 hover:bg-brand-tint dark:hover:bg-white/[0.06] transition-all duration-200 hover:scale-105"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8.5" r="3.75" />
                <path d="M4.5 20c1.5-3.5 4.5-5.25 7.5-5.25s6 1.75 7.5 5.25" />
              </svg>
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] whitespace-nowrap rounded-full bg-gradient-to-r from-primary via-brand-deep to-primary text-primary-foreground shadow-[0_8px_20px_-6px_rgba(14,49,146,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(14,49,146,0.65)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              {t("nav.joinUs")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6h7M6.5 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile & Tablet Utilities + Hamburger */}
          <div className="xl:hidden flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-tint/80 dark:bg-white/[0.08] text-primary dark:text-white border border-primary/15 dark:border-white/15 hover:bg-primary hover:text-white transition-all duration-200"
            >
              {open ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1.5 1.5l11 11M12.5 1.5l-11 11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <span className="flex flex-col gap-[4px] items-center justify-center">
                  <span className="block w-[16px] h-[1.6px] rounded-full bg-current" />
                  <span className="block w-[16px] h-[1.6px] rounded-full bg-current" />
                  <span className="block w-[11px] h-[1.6px] rounded-full bg-current self-end" />
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile / Tablet Floating Card Menu with Blurred Backdrop */}
      <div
        className={`xl:hidden fixed inset-0 z-[-1] transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Full-viewport Blurred Backdrop */}
        <div
          className="absolute inset-0 bg-corporate-black/45 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />

        {/* Floating Rounded Card below the Pill Navbar */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`absolute top-[74px] sm:top-[86px] inset-x-3 sm:inset-x-5 mx-auto max-w-[540px] max-h-[calc(100vh-96px)] bg-white dark:bg-popover rounded-[28px] shadow-[0_28px_70px_-12px_rgba(9,42,125,0.38)] dark:shadow-[0_28px_70px_-12px_rgba(0,0,0,0.75)] ring-1 ring-black/[0.06] dark:ring-white/[0.10] flex flex-col overflow-hidden transition-all duration-300 ease-out ${
            open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          {/* Mobile Drawer Header with Both Logos */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.02]">
            <WidatraLogo variant="horizontal" size="sm" showSubtitle={false} />
            <OtsukaLogo variant="badge" size="sm" href="https://www.otsuka.com/en/company/group/#asia" />
          </div>

          {/* Scrollable Menu List */}
          <nav className="flex-1 overflow-y-auto px-5 sm:px-6 py-3 divide-y divide-black/[0.06] dark:divide-white/[0.07]">
            {NAV.map((item) => {
              const hasChildren = "children" in item;

              if (hasChildren) {
                const isOpen = mobileAccordion === item.labelKey;
                const isActive =
                  pathname === item.to ||
                  pathname.startsWith(item.to) ||
                  item.children.some((c) => pathname === c.to || pathname.startsWith(c.to));
                return (
                  <div key={item.to}>
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(isOpen ? null : item.labelKey)}
                      aria-expanded={isOpen}
                      className={`w-full flex items-center justify-between py-3.5 text-[14.5px] font-semibold transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-corporate-black/85 dark:text-white/90"
                      }`}
                    >
                      <span>{t(item.labelKey)}</span>
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-soft dark:bg-white/[0.06] transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      >
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path
                            d="M1 1l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-3 pl-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.labelKey}
                              to={child.to}
                              hash={"hash" in child ? child.hash : undefined}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-corporate-black/75 dark:text-white/75 hover:bg-brand-tint dark:hover:bg-white/[0.06] hover:text-primary transition-colors duration-200"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                              {t(child.labelKey)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3.5 text-[14.5px] font-semibold text-corporate-black/85 dark:text-white/90 hover:text-primary transition-colors duration-200"
                  activeProps={{ className: "!text-primary" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <span>{t(item.labelKey)}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-corporate-gray/50"
                  >
                    <path
                      d="M4.5 2.5L8 6l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              );
            })}
          </nav>

          {/* Pinned Bottom Action Bar */}
          <div className="flex-shrink-0 bg-brand-soft/70 dark:bg-white/[0.03] border-t border-black/[0.06] dark:border-white/[0.08] px-5 sm:px-6 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <LanguageSwitcher />
              <Link
                to={isAuthenticated ? "/applicant" : "/auth/login"}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/15 dark:border-white/20 text-[11px] font-bold uppercase tracking-[0.12em] text-corporate-black dark:text-white hover:border-primary hover:text-primary transition-all"
              >
                {isAuthenticated ? t("nav.myAccount") : t("nav.signIn")}
              </Link>
            </div>
            <Link
              to="/careers"
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-gradient-to-r from-primary via-brand-deep to-primary text-primary-foreground text-[12px] font-bold uppercase tracking-[0.16em] shadow-[0_8px_20px_-6px_rgba(14,49,146,0.5)] hover:opacity-95 transition-all"
            >
              {t("nav.joinUs")}
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6h7M6.5 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
