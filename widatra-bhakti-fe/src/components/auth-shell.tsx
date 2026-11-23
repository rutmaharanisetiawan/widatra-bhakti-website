import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WidatraLogo } from "@/components/ui/widatra-logo";
import { useLanguage } from "@/hooks/use-language";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  quote,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  quote?: string;
}) {
  const { t } = useLanguage();
  const resolvedQuote = quote ?? t("auth.shell.defaultQuote");

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-white dark:bg-card">
      {/* Left form */}
      <div className="flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group w-fit" aria-label="Home">
            <WidatraLogo variant="horizontal" size="md" />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[480px] mx-auto py-12">
            <div className="eyebrow text-primary mb-3">{eyebrow}</div>
            <h1 className="text-3xl lg:text-4xl font-semibold font-display leading-tight text-corporate-black dark:text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-sm text-corporate-gray leading-relaxed">{subtitle}</p>
            )}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 text-sm text-corporate-gray">{footer}</div>}

            <div className="mt-10 pt-6 border-t border-hairline flex items-center gap-6 text-[10px] uppercase tracking-[0.25em] text-corporate-gray/80">
              <span>{t("auth.shell.iso")}</span>
              <span>·</span>
              <span>{t("auth.shell.dataPrivacy")}</span>
              <span>·</span>
              <span>{t("auth.shell.otsukaGroup")}</span>
            </div>
          </div>
        </div>
        <div className="text-[11px] text-corporate-gray">
          {t("auth.shell.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>

      {/* Right visual */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 gradient-navy" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="eyebrow opacity-70">{t("auth.shell.visualEyebrow")}</div>
          <div className="max-w-md">
            <div className="text-white/80 text-5xl font-serif-italic leading-none mb-4">“</div>
            <p className="text-2xl font-display font-medium leading-snug">{resolvedQuote}</p>
            <div className="mt-8 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.25em]">
              {["GMP", "ISO 9001", "ISO 14001", "Halal", "BPOM"].map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 border border-white/20 bg-white/5 backdrop-blur"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] opacity-70">
            {t("auth.shell.plantLabel")}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthField({
  label,
  id,
  type = "text",
  placeholder,
  hint,
  required,
  autoComplete,
  defaultValue,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="w-full h-11 px-3.5 border border-hairline bg-white dark:bg-card text-sm text-corporate-black dark:text-foreground placeholder:text-corporate-gray/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
      />
      {hint && <p className="mt-1.5 text-[11px] text-corporate-gray">{hint}</p>}
    </div>
  );
}

export function AuthButton({
  children,
  type = "submit",
  variant = "primary",
  onClick,
}: {
  children: ReactNode;
  type?: "submit" | "button";
  variant?: "primary" | "ghost";
  onClick?: () => void;
}) {
  const cls =
    variant === "primary"
      ? "w-full h-11 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors"
      : "w-full h-11 border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em] text-corporate-black dark:text-foreground hover:border-primary hover:text-primary transition";
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function RoleSwitcher({ value }: { value: "applicant" | "admin" }) {
  const { t } = useLanguage();
  return (
    <div className="mb-6 inline-flex p-1 bg-brand-tint rounded-md">
      <Link
        to="/auth/login"
        className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] rounded ${
          value === "applicant" ? "bg-white dark:bg-card text-primary shadow-sm" : "text-corporate-gray"
        }`}
      >
        {t("auth.shell.roleApplicant")}
      </Link>
      <Link
        to="/admin/login"
        className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] rounded ${
          value === "admin" ? "bg-white dark:bg-card text-primary shadow-sm" : "text-corporate-gray"
        }`}
      >
        {t("auth.shell.roleAdmin")}
      </Link>
    </div>
  );
}
