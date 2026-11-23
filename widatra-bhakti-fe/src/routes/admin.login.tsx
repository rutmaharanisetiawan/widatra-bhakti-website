import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { adminLogin } from "@/lib/auth-store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Widatra" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const employeeId = String(data.get("employeeId") || "").trim();
    const password = String(data.get("password") || "");
    const result = await adminLogin(employeeId, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16 overflow-hidden gradient-navy text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 mb-10 w-fit">
          <div className="w-9 h-9 bg-white dark:bg-card flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rotate-45" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-tight font-display">WIDATRA</div>
            <div className="text-[9px] font-medium tracking-[0.25em] text-white/60 uppercase">
              Admin · HR Console
            </div>
          </div>
        </Link>

        <div className="bg-white dark:bg-card text-corporate-black dark:text-foreground p-8 lg:p-10 shadow-elegant rounded-md">
          <div className="eyebrow text-destructive mb-3">Restricted Area</div>
          <h1 className="text-2xl font-semibold font-display leading-tight mb-2">
            Admin & HR sign in
          </h1>
          <p className="text-sm text-corporate-gray mb-8">
            Authorized personnel only. All activity is logged and monitored.
          </p>
          {error && (
            <div className="mb-5 px-4 py-3 border border-destructive/30 bg-destructive/[0.06] text-destructive text-[13px] rounded">
              {error}
            </div>
          )}

          <div className="mb-6 p-3.5 rounded bg-brand-tint/60 dark:bg-white/[0.04] border border-primary/20 text-[12px] text-corporate-black/85 dark:text-foreground/85">
            <div className="font-semibold text-primary mb-1">🔑 Akun Login Admin:</div>
            <div>ID / Email: <span className="font-mono font-medium text-primary">WBK-00001</span> atau <span className="font-mono text-primary">andi.wijaya@widatra.co.id</span></div>
            <div>Password: <span className="font-mono font-medium text-primary">admin123</span></div>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">
              Employee ID / Email
            </label>
            <input
              name="employeeId"
              required
              placeholder="WBK-00001 atau andi.wijaya@widatra.co.id"
              className="w-full h-11 px-3.5 border border-hairline text-sm mb-5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-black/70 dark:text-foreground/70 mb-2">
              Password
            </label>
            <input
              name="password"
              required
              type="password"
              className="w-full h-11 px-3.5 border border-hairline text-sm mb-6 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <button disabled={submitting} className="w-full h-11 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep disabled:opacity-50">
              {submitting ? "Signing in..." : "Sign in securely"}
            </button>
          </form>
          <button
            type="button"
            disabled
            className="w-full mt-3 h-11 border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em] text-corporate-gray/70"
          >
            SSO · Azure AD (coming soon)
          </button>
          <div className="mt-8 pt-6 border-t border-hairline flex justify-between text-[11px] text-corporate-gray">
            <Link to="/" className="hover:text-primary">← Return to public site</Link>
            <Link to="/auth/login" className="hover:text-primary">Applicant portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
