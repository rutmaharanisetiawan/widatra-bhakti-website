import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, AuthField, AuthButton, RoleSwitcher } from "@/components/auth-shell";
import { loginUser } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PT Widatra Bhakti" },
      { name: "description", content: "Sign in to your Widatra applicant account." },
    ],
  }),
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useLanguage();
  const { redirect } = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    const result = await loginUser(email, password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    const adminRoles = [
      "Super Admin",
      "Content Admin",
      "HR Manager",
      "Event Moderator",
      "Factory Tour Admin",
      "Administrator",
      "Content Editor",
      "CSR Coordinator",
    ];
    const target = redirect || (result.user && adminRoles.includes(result.user.role) ? "/admin" : "/applicant");
    window.location.href = target;
  }

  return (
    <AuthShell
      eyebrow={t("auth.login.eyebrow")}
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
    >
      <RoleSwitcher value="applicant" />
      {error && (
        <div className="mb-5 px-4 py-3 border border-destructive/30 bg-destructive/[0.06] text-destructive text-[13px] rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <AuthField
          label={t("auth.login.email")}
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthField
          label={t("auth.login.password")}
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between mb-6 text-[12px]">
          <label className="flex items-center gap-2 text-corporate-gray">
            <input type="checkbox" className="w-4 h-4 accent-primary" />
            {t("auth.login.rememberMe")}
          </label>
          <Link to="/auth/forgot-password" className="text-primary font-medium hover:underline">
            {t("auth.login.forgotPassword")}
          </Link>
        </div>
        <AuthButton type="submit">{submitting ? t("auth.login.signingIn") : t("auth.login.signIn")}</AuthButton>
      </form>

      <div className="relative my-6 text-center">
        <div className="hairline" />
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white dark:bg-card px-3 text-[10px] uppercase tracking-[0.25em] text-corporate-gray">
          {t("auth.login.orContinueWith")}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          className="h-11 border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em] text-corporate-gray/70"
        >
          {t("auth.login.google")}
        </button>
        <button
          type="button"
          disabled
          className="h-11 border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em] text-corporate-gray/70"
        >
          {t("auth.login.microsoft")}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-corporate-gray">
        {t("auth.login.noAccount")}{" "}
        <Link to="/auth/register" className="text-primary font-medium hover:underline">
          {t("auth.login.registerAsApplicant")}
        </Link>
      </p>

      <p className="mt-4 text-center text-[11px] text-corporate-gray/70">
        {t("auth.login.demoAccount")}
      </p>
    </AuthShell>
  );
}
