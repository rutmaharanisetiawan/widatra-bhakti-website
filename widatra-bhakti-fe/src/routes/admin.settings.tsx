import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, AdminButton } from "@/components/admin-shell";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: () => (
    <AdminShell
      title="Settings"
      subtitle="General preferences, integrations and security defaults for the Widatra console."
      actions={<AdminButton><Save className="w-4 h-4" /> Save</AdminButton>}
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card-elevated p-6">
          <div className="eyebrow text-primary mb-4">Organization</div>
          <div className="space-y-4 text-sm">
            <Row label="Company name" value="PT Widatra Bhakti" />
            <Row label="Head office" value="Jakarta, Indonesia" />
            <Row label="Plant" value="Pandaan, East Java" />
            <Row label="Timezone" value="Asia/Jakarta (UTC+7)" />
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="eyebrow text-primary mb-4">Security</div>
          <div className="space-y-4 text-sm">
            {[
              ["Enforce 2FA for admins", true],
              ["Require SSO for HR module", false],
              ["Auto sign-out after 30 min idle", true],
              ["IP allowlist for admin console", false],
            ].map(([l, v]) => (
              <div key={l as string} className="flex items-center justify-between border-b border-hairline pb-3">
                <span>{l}</span>
                <div className={`w-10 h-5 rounded-full p-0.5 ${v ? "bg-primary" : "bg-hairline"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white dark:bg-card transition ${v ? "translate-x-5" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  ),
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-hairline pb-3">
      <span className="text-corporate-gray">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
