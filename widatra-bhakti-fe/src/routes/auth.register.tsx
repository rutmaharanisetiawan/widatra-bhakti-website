import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, AuthField, AuthButton, RoleSwitcher } from "@/components/auth-shell";
import { registerUser, registerInternalUser } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";
import { Building2, UserRound } from "lucide-react";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Register — PT Widatra Bhakti" },
      { name: "description", content: "Create an account to access the Widatra Bhakti portal." },
    ],
  }),
  validateSearch: z.object({
    redirect: z.string().optional(),
    accountType: z.enum(["internal", "external"]).optional(),
  }),
  component: RegisterPage,
});

type AccountType = "internal" | "external";

function strengthScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function PasswordStrength({ pw, t }: { pw: string; t: (k: string) => string }) {
  const s = strengthScore(pw);
  const labels = [
    t("auth.register.strengthLabels.0"),
    t("auth.register.strengthLabels.1"),
    t("auth.register.strengthLabels.2"),
    t("auth.register.strengthLabels.3"),
    t("auth.register.strengthLabels.4"),
  ];
  return (
    <>
      <div className="mt-2 flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < s ? (s <= 1 ? "bg-destructive" : s === 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-hairline"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-corporate-gray">{t("auth.register.strengthPrefix")} {labels[s]}</p>
    </>
  );
}

function AccountTypeSelector({ value, onChange, t }: { value: AccountType; onChange: (v: AccountType) => void; t: (k: string) => string }) {
  const options: { value: AccountType; icon: typeof Building2; titleKey: string; descKey: string }[] = [
    { value: "internal", icon: Building2, titleKey: "auth.register.accountType.internalTitle", descKey: "auth.register.accountType.internalDesc" },
    { value: "external", icon: UserRound, titleKey: "auth.register.accountType.externalTitle", descKey: "auth.register.accountType.externalDesc" },
  ];
  return (
    <div className="mb-6">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">
        {t("auth.register.accountType.label")}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`text-left p-4 border rounded transition-colors ${
                active ? "border-primary bg-brand-tint" : "border-hairline hover:border-primary/50"
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${active ? "text-primary" : "text-corporate-gray"}`} />
              <div className={`text-[13px] font-semibold ${active ? "text-primary" : "text-corporate-black dark:text-foreground"}`}>
                {t(opt.titleKey)}
              </div>
              <div className="text-[11px] text-corporate-gray mt-0.5">{t(opt.descKey)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RegisterPage() {
  const { t } = useLanguage();
  const { redirect, accountType: accountTypeParam } = Route.useSearch();
  // Career / Factory Tour flows redirect here for External Users; everything
  // else (manual visits) defaults to External too, since Internal Employees
  // are expected to register from an HR-provided link or by switching the
  // toggle below explicitly.
  const [accountType, setAccountType] = useState<AccountType>(accountTypeParam ?? "external");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function finishSuccess() {
    if (redirect) {
      window.location.href = redirect;
      return;
    }
    window.location.href = "/auth/verify-email";
  }

  async function handleExternalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const confirm = String(data.get("confirm") || "");

    if (pw !== confirm) {
      setError(t("auth.register.errors.passwordMismatch"));
      return;
    }

    setSubmitting(true);
    const result = await registerUser({ name, phone, email, password: pw });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    finishSuccess();
  }

  async function handleInternalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const employeeId = String(data.get("employeeId") || "").trim();
    const department = String(data.get("department") || "").trim();
    const position = String(data.get("position") || "").trim();
    const email = String(data.get("email") || "").trim();
    const confirm = String(data.get("confirm") || "");

    if (pw !== confirm) {
      setError(t("auth.register.errors.passwordMismatch"));
      return;
    }

    setSubmitting(true);
    const result = await registerInternalUser({ name, employeeId, department, position, email, password: pw });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    finishSuccess();
  }

  return (
    <AuthShell
      eyebrow={t("auth.register.eyebrow")}
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
    >
      <RoleSwitcher value="applicant" />
      {error && (
        <div className="mb-5 px-4 py-3 border border-destructive/30 bg-destructive/[0.06] text-destructive text-[13px] rounded">
          {error}
        </div>
      )}

      <AccountTypeSelector value={accountType} onChange={setAccountType} t={t} />

      {accountType === "external" ? (
        <form key="external" onSubmit={handleExternalSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <AuthField label={t("auth.register.fullName")} id="name" placeholder={t("auth.register.fullNamePlaceholder")} required />
            <AuthField label={t("auth.register.phone")} id="phone" placeholder={t("auth.register.phonePlaceholder")} required />
          </div>
          <AuthField label={t("auth.register.email")} id="email" type="email" placeholder="you@example.com" required />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">
              {t("auth.register.password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder={t("auth.register.passwordPlaceholder")}
              className="w-full h-11 px-3.5 border border-hairline bg-white dark:bg-card text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <PasswordStrength pw={pw} t={t} />
          </div>
          <div className="mt-5">
            <AuthField label={t("auth.register.confirmPassword")} id="confirm" type="password" required />
          </div>
          <div className="space-y-2 mb-6 text-[12px] text-corporate-gray">
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-primary" />
              <span>
                {t("auth.register.agreeTermsPrefix")}{" "}
                <a className="text-primary hover:underline" href="#">{t("auth.register.termsOfService")}</a>{" "}
                {t("auth.register.and")}{" "}
                <a className="text-primary hover:underline" href="#">{t("auth.register.privacyPolicy")}</a>.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-0.5 w-4 h-4 accent-primary" />
              <span>{t("auth.register.updatesOptIn")}</span>
            </label>
          </div>
          <AuthButton type="submit">{submitting ? t("auth.register.creatingAccount") : t("auth.register.createAccount")}</AuthButton>
        </form>
      ) : (
        <form key="internal" onSubmit={handleInternalSubmit}>
          <AuthField label={t("auth.register.fullName")} id="name" placeholder={t("auth.register.fullNamePlaceholder")} required />
          <div className="grid grid-cols-2 gap-4">
            <AuthField label={t("auth.register.employeeId")} id="employeeId" placeholder={t("auth.register.employeeIdPlaceholder")} required />
            <AuthField label={t("auth.register.department")} id="department" placeholder={t("auth.register.departmentPlaceholder")} required />
          </div>
          <AuthField label={t("auth.register.position")} id="position" placeholder={t("auth.register.positionPlaceholder")} required />
          <AuthField label={t("auth.register.companyEmail")} id="email" type="email" placeholder="you@widatra.co.id" required />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">
              {t("auth.register.password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder={t("auth.register.passwordPlaceholder")}
              className="w-full h-11 px-3.5 border border-hairline bg-white dark:bg-card text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <PasswordStrength pw={pw} t={t} />
          </div>
          <div className="mt-5">
            <AuthField label={t("auth.register.confirmPassword")} id="confirm" type="password" required />
          </div>
          <div className="space-y-2 mb-6 text-[12px] text-corporate-gray">
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-primary" />
              <span>
                {t("auth.register.agreeTermsPrefix")}{" "}
                <a className="text-primary hover:underline" href="#">{t("auth.register.termsOfService")}</a>{" "}
                {t("auth.register.and")}{" "}
                <a className="text-primary hover:underline" href="#">{t("auth.register.privacyPolicy")}</a>.
              </span>
            </label>
          </div>
          <AuthButton type="submit">{submitting ? t("auth.register.creatingAccount") : t("auth.register.createAccount")}</AuthButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-corporate-gray">
        {t("auth.register.alreadyHaveAccount")}{" "}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">{t("auth.register.signIn")}</Link>
      </p>
    </AuthShell>
  );
}
