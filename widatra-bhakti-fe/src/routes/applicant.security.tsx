import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ApplicantShell } from "@/components/applicant-shell";
import { useAuth } from "@/hooks/use-auth";
import { changePassword, logoutUser, updateProfile } from "@/lib/auth-store";
import { useLanguage } from "@/hooks/use-language";
import { Eye, EyeOff, KeyRound, ShieldCheck, UserCog, AlertTriangle } from "lucide-react";

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
  const [showPasswords, setShowPasswords] = useState(false);

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

  const inputCls =
    "w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-400 focus:ring-2 focus:ring-primary/15 dark:focus:ring-sky-400/20 transition-all";

  return (
    <ApplicantShell title={t("dashboard.security.title")} subtitle={t("dashboard.security.subtitle")}>
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Contact Information Card */}
        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 lg:col-span-2 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 flex items-center justify-center">
              <UserCog className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-sky-300">
              {t("dashboard.security.contactInformation")}
            </h2>
          </div>

          {profileMsg && (
            <div
              className={`mb-4 px-4 py-3 text-[13px] rounded-xl border font-medium ${
                profileMsg.type === "ok"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300"
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300 mb-2">
                {t("dashboard.security.fullName")}
              </label>
              <input name="name" defaultValue={user?.name} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300 mb-2">
                {t("dashboard.security.email")}
              </label>
              <input name="email" type="email" defaultValue={user?.email} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300 mb-2">
                {t("dashboard.security.phone")}
              </label>
              <input name="phone" defaultValue={user?.phone} className={inputCls} />
            </div>
            <div className="sm:col-span-3 pt-1">
              <button
                type="submit"
                disabled={savingProfile}
                className="h-11 px-6 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-50 transition-all cursor-pointer"
              >
                {savingProfile ? t("dashboard.security.saving") : t("dashboard.security.saveChanges")}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-sky-300">
                {t("dashboard.security.changePassword")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswords((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-sky-300 cursor-pointer"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPasswords ? "Hide" : "Show"}</span>
            </button>
          </div>

          {pwMsg && (
            <div
              className={`mb-4 px-4 py-3 text-[13px] rounded-xl border font-medium ${
                pwMsg.type === "ok"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300"
              }`}
            >
              {pwMsg.text}
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handlePasswordSubmit}>
            {[
              { label: t("dashboard.security.currentPassword"), name: "current" },
              { label: t("dashboard.security.newPassword"), name: "next" },
              { label: t("dashboard.security.confirmNewPassword"), name: "confirm" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300 mb-2">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type={showPasswords ? "text" : "password"}
                  required
                  className={inputCls}
                />
              </div>
            ))}
            <div className="pt-1">
              <button
                type="submit"
                disabled={savingPw}
                className="h-11 px-6 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-50 transition-all cursor-pointer"
              >
                {savingPw ? t("dashboard.security.updating") : t("dashboard.security.updatePassword")}
              </button>
            </div>
          </form>
        </div>

        {/* Active Sessions & Danger Zone Card */}
        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-sky-300">
                {t("dashboard.security.activeSessions")}
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
                <span className="font-medium text-slate-900 dark:text-white">
                  {t("dashboard.security.thisBrowser")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t("dashboard.security.currentSession")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {t("dashboard.security.allOtherDevices")}
                </span>
                <button
                  type="button"
                  onClick={handleSignOutEverywhere}
                  className="text-primary dark:text-sky-300 text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                >
                  {t("dashboard.security.signOutEverywhere")}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t("dashboard.security.dangerZone")}</span>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              {t("dashboard.security.deleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </ApplicantShell>
  );
}
