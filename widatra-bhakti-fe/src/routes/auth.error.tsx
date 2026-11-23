import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/auth/error")({
  head: () => ({ meta: [{ title: "Something went wrong — Widatra" }] }),
  component: () => {
    const { t } = useLanguage();
    return (
      <AuthShell eyebrow={t("auth.error.eyebrow")} title={t("auth.error.title")} subtitle={t("auth.error.subtitle")}>
        <div className="flex flex-wrap gap-3">
          <Link to="/auth/login" className="inline-flex px-6 h-11 items-center justify-center bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em]">
            {t("auth.error.backToSignIn")}
          </Link>
          <Link to="/contact" className="inline-flex px-6 h-11 items-center justify-center border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em]">
            {t("auth.error.contactSupport")}
          </Link>
        </div>
      </AuthShell>
    );
  },
});
