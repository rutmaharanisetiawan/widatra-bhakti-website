import { createFileRoute, Link } from "@tanstack/react-router";
import { ApplicantShell } from "@/components/applicant-shell";
import { useAuth } from "@/hooks/use-auth";
import { mockApplicant } from "@/lib/applicant-mock";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/applicant/profile")({
  head: () => ({ meta: [{ title: "Profile — Widatra Applicant" }] }),
  component: ProfilePage,
});

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const name = user?.name ?? mockApplicant.name;
  const email = user?.email ?? mockApplicant.email;
  const phone = user?.phone ?? mockApplicant.phone;
  const isInternal = user?.accountType === "internal";

  return (
    <ApplicantShell title={t("dashboard.profile.title")} subtitle={t("dashboard.profile.subtitle")}>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card-elevated p-6 lg:col-span-2 space-y-6">
          <Section title={t("dashboard.profile.personalInformation")}>
            <Field label={t("dashboard.profile.fullName")} value={name} />
            <Field label={isInternal ? "Company email" : t("dashboard.profile.email")} value={email} />
            {isInternal ? (
              <Field label="Account type" value="Internal Employee" />
            ) : (
              <>
                <Field label={t("dashboard.profile.phone")} value={phone} />
                <Field label={t("dashboard.profile.location")} value={mockApplicant.location} />
              </>
            )}
          </Section>
          {isInternal ? (
            <Section title="Employment Information">
              <Field label="Employee ID (NIK)" value={user?.employeeId || "—"} />
              <Field label="Department" value={user?.department || "—"} />
              <Field label="Position" value={user?.position || "—"} />
            </Section>
          ) : (
            <>
              <Section title={t("dashboard.profile.education")}>
                {mockApplicant.education.map((e) => (
                  <div key={e.school} className="p-4 border border-hairline rounded">
                    <div className="font-semibold">{e.school}</div>
                    <div className="text-[13px] text-corporate-gray">{e.degree} · {e.year}</div>
                  </div>
                ))}
              </Section>
              <Section title={t("dashboard.profile.experience")}>
                {mockApplicant.experience.map((e) => (
                  <div key={e.company} className="p-4 border border-hairline rounded">
                    <div className="font-semibold">{e.role} · {e.company}</div>
                    <div className="text-[13px] text-corporate-gray">{e.period}</div>
                  </div>
                ))}
              </Section>
            </>
          )}
        </div>
        <div className="card-elevated p-6 text-center h-fit">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary text-white grid place-items-center text-3xl font-display">{initials(name)}</div>
          <div className="mt-4 font-semibold">{name}</div>
          <div className="text-[12px] text-corporate-gray">{isInternal ? (user?.department || "") : mockApplicant.location}</div>
          <button className="mt-4 w-full h-10 border border-hairline text-[11px] font-semibold uppercase tracking-[0.18em]">{t("dashboard.profile.changePhoto")}</button>
          <Link
            to="/applicant/security"
            className="mt-3 block w-full h-10 grid place-items-center border border-hairline text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-primary hover:text-primary"
          >
            {t("dashboard.profile.editContactInfo")}
          </Link>
        </div>
      </div>
    </ApplicantShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow text-primary mb-3">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2 border-b border-hairline/70 text-sm">
      <div className="text-corporate-gray">{label}</div>
      <div className="col-span-2 font-medium">{value}</div>
    </div>
  );
}
