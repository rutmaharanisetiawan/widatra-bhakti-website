import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ApplicantShell } from "@/components/applicant-shell";
import { useAuth } from "@/hooks/use-auth";
import { changePassword, logoutUser, updateProfile } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/applicant/security")({
  head: () => ({ meta: [{ title: "Settings — Widatra Applicant" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useLanguage();
  const { user, refresh } = useAuth();

  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setProfileMsg(null);
    setSavingProfile(true);
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const result = await updateProfile(user.id, { name, phone, email });
    setSavingProfile(false);
    if (!result.ok) {
      setProfileMsg({ type: "error", text: result.error });
      return;
    }
    refresh();
    setProfileMsg({ type: "ok", text: t("dashboard.security.messages.contactUpdated") });
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setPwMsg(null);
    const data = new FormData(e.currentTarget);
    const current = String(data.get("current") || "");
    const next = String(data.get("next") || "");
    const confirm = String(data.get("confirm") || "");
    if (next !== confirm) {
      setPwMsg({ type: "error", text: t("dashboard.security.messages.passwordMismatch") });
      return;
    }
    setSavingPw(true);
    const result = await changePassword(user.id, current, next);
    setSavingPw(false);
    if (!result.ok) {
      setPwMsg({ type: "error", text: result.error });
      return;
    }
    setPwMsg({ type: "ok", text: t("dashboard.security.messages.passwordUpdated") });
    e.currentTarget.reset();
  }

  async function handleSignOutEverywhere() {
    await logoutUser();
    window.location.href = "/auth/login";
  }

  return (
    <ApplicantShell title={t("dashboard.security.title")} subtitle={t("dashboard.security.subtitle")}>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card-elevated p-6 lg:col-span-2">
          <div className="eyebrow text-primary mb-3">{t("dashboard.security.contactInformation")}</div>
          {profileMsg && (
            <div className={`mb-4 px-4 py-3 text-[13px] rounded border ${profileMsg.type === "ok" ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-400" : "border-destructive/30 bg-destructive/[0.06] text-destructive"}`}>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleProfileSubmit} className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">{t("dashboard.security.fullName")}</label>
              <input name="name" defaultValue={user?.name} className="w-full h-11 px-3.5 border border-hairline text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">{t("dashboard.security.email")}</label>
              <input name="email" type="email" defaultValue={user?.email} className="w-full h-11 px-3.5 border border-hairline text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">{t("dashboard.security.phone")}</label>
              <input name="phone" defaultValue={user?.phone} className="w-full h-11 px-3.5 border border-hairline text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>
            <div className="sm:col-span-3">
              <button type="submit" disabled={savingProfile} className="h-11 px-6 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50">
                {savingProfile ? t("dashboard.security.saving") : t("dashboard.security.saveChanges")}
              </button>
            </div>
          </form>
        </div>

        <div className="card-elevated p-6">
          <div className="eyebrow text-primary mb-3">{t("dashboard.security.changePassword")}</div>
          {pwMsg && (
            <div className={`mb-4 px-4 py-3 text-[13px] rounded border ${pwMsg.type === "ok" ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-400" : "border-destructive/30 bg-destructive/[0.06] text-destructive"}`}>
              {pwMsg.text}
            </div>
          )}
          <form className="space-y-3" onSubmit={handlePasswordSubmit}>
            {[
              { label: t("dashboard.security.currentPassword"), name: "current" },
              { label: t("dashboard.security.newPassword"), name: "next" },
              { label: t("dashboard.security.confirmNewPassword"), name: "confirm" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">{f.label}</label>
                <input name={f.name} type="password" required className="w-full h-11 px-3.5 border border-hairline text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </div>
            ))}
            <button type="submit" disabled={savingPw} className="h-11 px-6 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50">
              {savingPw ? t("dashboard.security.updating") : t("dashboard.security.updatePassword")}
            </button>
          </form>
        </div>

        <div className="card-elevated p-6">
          <div className="eyebrow text-primary mb-3">{t("dashboard.security.activeSessions")}</div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-hairline pb-3"><span>{t("dashboard.security.thisBrowser")}</span><span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold uppercase tracking-[0.18em]">{t("dashboard.security.currentSession")}</span></div>
            <div className="flex justify-between"><span>{t("dashboard.security.allOtherDevices")}</span><button onClick={handleSignOutEverywhere} className="text-primary text-[11px] font-semibold uppercase tracking-[0.18em]">{t("dashboard.security.signOutEverywhere")}</button></div>
          </div>
          <div className="mt-8 pt-6 border-t border-hairline">
            <div className="eyebrow text-destructive mb-2">{t("dashboard.security.dangerZone")}</div>
            <button className="text-sm text-destructive hover:underline">{t("dashboard.security.deleteAccount")}</button>
          </div>
        </div>
      </div>
    </ApplicantShell>
  );
}
