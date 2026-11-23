import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, AuthField, AuthButton } from "@/components/auth-shell";
import { requestPasswordReset } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Widatra" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <AuthShell
        eyebrow={t("auth.forgotPassword.sentEyebrow")}
        title={t("auth.forgotPassword.sentTitle")}
        subtitle={t("auth.forgotPassword.sentSubtitle")}
      >
        <div className="flex flex-col gap-3">
          <Link
            to="/auth/reset-password"
            search={{ email }}
            className="inline-flex items-center justify-center px-6 h-11 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors"
          >
            {t("auth.forgotPassword.continueToReset")}
          </Link>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center px-6 h-11 border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            {t("auth.forgotPassword.backToSignIn")}
          </Link>
        </div>
        <p className="mt-6 text-[11px] text-corporate-gray/70">
          {t("auth.forgotPassword.demoNote")}
        </p>
      </AuthShell>
    );
  }
  return (
    <AuthShell
      eyebrow={t("auth.forgotPassword.eyebrow")}
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
    >
      {error && (
        <div className="mb-5 px-4 py-3 border border-destructive/30 bg-destructive/[0.06] text-destructive text-[13px] rounded">
          {error}
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          const data = new FormData(e.currentTarget);
          const em = String(data.get("email") || "").trim();
          setEmail(em);
          setSubmitting(true);
          const result = await requestPasswordReset(em);
          setSubmitting(false);
          if (!result.ok) {
            setError(result.error || "Could not send reset link.");
            return;
          }
          setSent(true);
        }}
      >
        <AuthField label={t("auth.forgotPassword.email")} id="email" type="email" required />
        <AuthButton>{submitting ? "..." : t("auth.forgotPassword.sendResetLink")}</AuthButton>
      </form>
      <p className="mt-6 text-center text-sm text-corporate-gray">
        {t("auth.forgotPassword.rememberedPrefix")}{" "}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">{t("auth.forgotPassword.signIn")}</Link>
      </p>
    </AuthShell>
  );
}
