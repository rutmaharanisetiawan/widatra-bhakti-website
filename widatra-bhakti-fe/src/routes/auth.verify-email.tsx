import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AuthShell, AuthButton } from "@/components/auth-shell";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({ meta: [{ title: "Verify email — Widatra" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { t } = useLanguage();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(45);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const setAt = (i: number, v: string) => {
    const next = [...digits];
    next[i] = v.slice(-1);
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const complete = digits.every((d) => d);

  return (
    <AuthShell
      eyebrow={t("auth.verifyEmail.eyebrow")}
      title={t("auth.verifyEmail.title")}
      subtitle={t("auth.verifyEmail.subtitle")}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = "/auth/success";
        }}
      >
        <div className="flex gap-2 mb-6 justify-between max-w-sm">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => setAt(i, e.target.value.replace(/\D/g, ""))}
              className="w-12 h-14 text-center text-xl font-semibold border border-hairline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          ))}
        </div>
        <AuthButton>{t("auth.verifyEmail.verify")}</AuthButton>
      </form>
      <p className="mt-5 text-sm text-corporate-gray">
        {t("auth.verifyEmail.didntGetItPrefix")}{" "}
        {seconds > 0 ? (
          <span>{t("auth.verifyEmail.resendAvailableIn", { seconds })}</span>
        ) : (
          <button className="text-primary font-medium hover:underline" onClick={() => setSeconds(45)}>
            {t("auth.verifyEmail.resendCode")}
          </button>
        )}
      </p>
      <p className="mt-3 text-sm text-corporate-gray">
        <Link to="/auth/login" className="text-primary hover:underline">{t("auth.verifyEmail.backToSignIn")}</Link>
      </p>
      {complete && <input type="hidden" />}
    </AuthShell>
  );
}
