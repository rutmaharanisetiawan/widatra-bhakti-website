import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/auth/success")({
  head: () => ({ meta: [{ title: "Success — Widatra" }] }),
  component: () => {
    const { t } = useLanguage();
    return (
      <AuthShell eyebrow={t("auth.success.eyebrow")} title={t("auth.success.title")} subtitle={t("auth.success.subtitle")}>
        <div className="flex flex-wrap gap-3">
          <Link to="/applicant" className="inline-flex px-6 h-11 items-center justify-center bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep">
            {t("auth.success.goToDashboard")}
          </Link>
          <Link to="/careers" className="inline-flex px-6 h-11 items-center justify-center border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em]">
            {t("auth.success.browseJobs")}
          </Link>
        </div>
      </AuthShell>
    );
  },
});
