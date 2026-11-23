import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, AuthField, AuthButton } from "@/components/auth-shell";
import { resetPassword } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Widatra" }] }),
  validateSearch: z.object({ email: z.string().optional(), token: z.string().optional() }),
  component: ResetPage,
});

function ResetPage() {
  const { t } = useLanguage();
  const { email, token: tokenFromLink } = Route.useSearch();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (done) {
    return (
      <AuthShell eyebrow={t("auth.resetPassword.doneEyebrow")} title={t("auth.resetPassword.doneTitle")} subtitle={t("auth.resetPassword.doneSubtitle")}>
        <Link to="/auth/login" className="inline-flex px-6 h-11 items-center justify-center bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em]">
          {t("auth.resetPassword.continueToSignIn")}
        </Link>
      </AuthShell>
    );
  }
  return (
    <AuthShell eyebrow={t("auth.resetPassword.eyebrow")} title={t("auth.resetPassword.title")} subtitle={t("auth.resetPassword.subtitle")}>
      {error && (
        <div className="mb-5 px-4 py-3 border border-destructive/30 bg-destructive/[0.06] text-destructive text-[13px] rounded">
          {error}
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);

          if (!email) {
            setError(t("auth.resetPassword.errors.noAccount"));
            return;
          }

          const data = new FormData(e.currentTarget);
          const password = String(data.get("password") || "");
          const confirm = String(data.get("confirm") || "");
          const token = tokenFromLink || String(data.get("token") || "");

          if (password !== confirm) {
            setError(t("auth.resetPassword.errors.passwordMismatch"));
            return;
          }
          if (!token) {
            setError("Please enter the reset code sent to your email.");
            return;
          }

          setSubmitting(true);
          const result = await resetPassword(email, token, password);
          setSubmitting(false);

          if (!result.ok) {
            setError(result.error);
            return;
          }
          setDone(true);
        }}
      >
        {!tokenFromLink && (
          <AuthField label="Reset code" id="token" type="text" placeholder="Code from your email" required />
        )}
        <AuthField label={t("auth.resetPassword.newPassword")} id="password" type="password" required />
        <AuthField label={t("auth.resetPassword.confirmNewPassword")} id="confirm" type="password" required />
        <AuthButton type="submit">{submitting ? t("auth.resetPassword.updating") : t("auth.resetPassword.updatePassword")}</AuthButton>
      </form>
      {!email && (
        <p className="mt-6 text-sm text-corporate-gray">
          {t("auth.resetPassword.missingEmailPrefix")}{" "}
          <Link to="/auth/forgot-password" className="text-primary font-medium hover:underline">{t("auth.resetPassword.startOver")}</Link>.
        </p>
      )}
    </AuthShell>
  );
}
