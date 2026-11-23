import { useEffect, useMemo, useState } from "react";
import type { Job } from "@/lib/jobs-data";
import { formatJobDate } from "@/lib/jobs-data";
import { getPublishedJobs } from "@/lib/jobs-store";
import { addApplication, hasUserAppliedToJob, initMyApplicationsStore, type EducationEntry, type ExperienceEntry } from "@/lib/ats-store";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Lock } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared modal shell                                                  */
/* ------------------------------------------------------------------ */

export function ModalShell({
  onClose,
  children,
  maxWidth = "max-w-4xl",
  labelledBy,
}: {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  labelledBy?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] bg-corporate-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className={`bg-white dark:bg-card ${maxWidth} w-full my-6 sm:my-10 rounded-2xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200`}>
        {children}
      </div>
    </div>
  );
}

export function CloseButton({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClose}
      aria-label={t("apply.close")}
      className="absolute top-4 right-5 w-9 h-9 grid place-items-center rounded-full text-corporate-gray hover:text-corporate-black dark:hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors z-10 text-xl"
    >
      ×
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Auth gate — shown when an unauthenticated visitor tries to apply    */
/* ------------------------------------------------------------------ */

export function AuthRequiredModal({
  onClose,
  redirectPath,
  message,
}: {
  onClose: () => void;
  redirectPath: string;
  message?: string;
}) {
  const { t } = useLanguage();
  const encoded = encodeURIComponent(redirectPath);
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-md" labelledBy="auth-required-title">
      <CloseButton onClose={onClose} />
      <div className="p-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-brand-tint text-primary grid place-items-center mb-5">
          <Lock className="w-6 h-6" />
        </div>
        <h2 id="auth-required-title" className="text-xl font-semibold tracking-tight mb-2">
          {t("apply.authRequired.title")}
        </h2>
        <p className="text-sm text-corporate-gray mb-8">{message ?? t("apply.authRequired.defaultMessage")}</p>
        <div className="flex flex-col gap-3">
          <a
            href={`/auth/login?redirect=${encoded}`}
            className="h-11 inline-flex items-center justify-center bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors"
          >
            {t("apply.authRequired.signIn")}
          </a>
          <a
            href={`/auth/register?redirect=${encoded}`}
            className="h-11 inline-flex items-center justify-center border border-black/10 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors"
          >
            {t("apply.authRequired.createAccount")}
          </a>
        </div>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/* Role gate — shown when an Internal Employee tries to use Career ATS */
/* ------------------------------------------------------------------ */

export function RoleBlockedModal({ onClose, message }: { onClose: () => void; message: string }) {
  const { t } = useLanguage();
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-md" labelledBy="role-blocked-title">
      <CloseButton onClose={onClose} />
      <div className="p-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-brand-tint text-primary grid place-items-center mb-5">
          <Lock className="w-6 h-6" />
        </div>
        <h2 id="role-blocked-title" className="text-xl font-semibold tracking-tight mb-2">
          {t("apply.roleBlocked.title")}
        </h2>
        <p className="text-sm text-corporate-gray mb-8">{message}</p>
        <button
          onClick={onClose}
          className="h-11 w-full inline-flex items-center justify-center border border-black/10 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors"
        >
          {t("apply.close")}
        </button>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/* Duplicate guard — shown when the signed-in user already applied     */
/* ------------------------------------------------------------------ */

function AlreadyAppliedModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-md" labelledBy="already-applied-title">
      <CloseButton onClose={onClose} />
      <div className="p-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-brand-tint text-primary grid place-items-center mb-5">
          <span className="text-2xl">✓</span>
        </div>
        <h2 id="already-applied-title" className="text-xl font-semibold tracking-tight mb-2">
          {t("apply.alreadyApplied.title")}
        </h2>
        <p className="text-sm text-corporate-gray mb-8">
          {t("apply.alreadyApplied.bodyPrefix")} <span className="font-medium text-corporate-black dark:text-foreground">{job.title}</span>.
          {" "}{t("apply.alreadyApplied.bodySuffix")}
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="/applicant/applications"
            className="h-11 inline-flex items-center justify-center bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors"
          >
            {t("apply.alreadyApplied.viewApplications")}
          </a>
          <button
            onClick={onClose}
            className="h-11 inline-flex items-center justify-center border border-black/10 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors"
          >
            {t("apply.alreadyApplied.close")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/* Stage 1 — Job Detail Modal                                          */
/* ------------------------------------------------------------------ */

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray mb-1">{k}</dt>
      <dd className="text-sm font-medium">{v}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">{title}</h3>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i} className="text-[13.5px] text-corporate-black dark:text-foreground leading-relaxed flex gap-3">
          <span className="text-primary mt-1.5 flex-shrink-0 text-[8px]">●</span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

function JobDetailModal({
  job,
  onClose,
  onApply,
  onSelectRelated,
}: {
  job: Job;
  onClose: () => void;
  onApply: () => void;
  onSelectRelated: (job: Job) => void;
}) {
  const { t } = useLanguage();
  const related = useMemo(() => {
    const all = getPublishedJobs();
    const sameDept = all.filter((j) => j.slug !== job.slug && j.department === job.department);
    const others = all.filter((j) => j.slug !== job.slug && j.department !== job.department);
    return [...sameDept, ...others].slice(0, 3);
  }, [job]);

  return (
    <ModalShell onClose={onClose} labelledBy="job-detail-title">
      <CloseButton onClose={onClose} />
      <div className="max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-10 pb-8 border-b border-black/[0.06] dark:border-white/[0.06] bg-gradient-to-br from-brand-tint/60 to-white">
          <span className="eyebrow text-primary mb-3 block">{job.department} · {job.level}</span>
          <h2 id="job-detail-title" className="text-3xl lg:text-4xl font-light tracking-tight text-balance mb-6">
            {job.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Row k={t("apply.detailModal.department")} v={job.department} />
            <Row k={t("apply.detailModal.location")} v={job.location} />
            <Row k={t("apply.detailModal.employmentType")} v={job.employmentType} />
            <Row k={t("apply.detailModal.deadline")} v={formatJobDate(job.deadline)} />
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-10 space-y-10">
          <Section title={t("apply.detailModal.jobDescription")}>
            <p className="text-[15px] text-corporate-black dark:text-foreground leading-relaxed">{job.description}</p>
          </Section>
          <Section title={t("apply.detailModal.responsibilities")}>
            <BulletList items={job.responsibilities} />
          </Section>
          <Section title={t("apply.detailModal.qualifications")}>
            <BulletList items={job.qualifications} />
          </Section>
          <Section title={t("apply.detailModal.benefits")}>
            <BulletList items={job.benefits} />
          </Section>

          {/* Related Jobs */}
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">{t("apply.detailModal.relatedJobs")}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => onSelectRelated(r)}
                  className="text-left p-4 border border-black/[0.07] dark:border-white/[0.07] rounded-lg hover:border-primary/40 hover:shadow-[0_8px_20px_-10px_rgba(9,42,125,0.25)] transition-all"
                >
                  <span className="inline-flex items-center h-5 px-2 rounded-full bg-primary/[0.08] text-primary text-[9px] font-bold uppercase tracking-[0.18em] mb-2">
                    {r.department}
                  </span>
                  <div className="text-sm font-semibold leading-snug mb-1">{r.title}</div>
                  <div className="text-[11px] text-corporate-gray">{r.location}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-[#F7F8FB] border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-4 sticky bottom-0">
          <span className="text-[11px] text-corporate-gray hidden sm:block">{t("apply.detailModal.postedPrefix")} {formatJobDate(job.posted)}</span>
          <div className="flex gap-3 ml-auto">
            <button onClick={onClose} className="px-6 h-11 rounded border border-black/15 text-[11px] font-bold uppercase tracking-[0.22em] hover:border-primary hover:text-primary transition-colors">
              {t("apply.detailModal.close")}
            </button>
            <button onClick={onApply} className="px-8 h-11 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep shadow-[0_10px_24px_-8px_rgba(14,49,146,0.55)] transition-colors">
              {t("apply.detailModal.applyNow")}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/* Stage 2 — ATS Application Modal                                     */
/* ------------------------------------------------------------------ */

type ApplyForm = {
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  hasNoExperience: boolean;
  skills: string;
  linkedin: string;
  portfolio: string;
  cvFile: File | null;
  coverLetter: string;
  consent: boolean;
};

const emptyEducation = (): EducationEntry => ({ degree: "", major: "", institution: "", year: "" });
const emptyExperience = (): ExperienceEntry => ({ company: "", role: "", period: "", description: "" });

function emptyForm(): ApplyForm {
  return {
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    education: [emptyEducation()],
    experience: [emptyExperience()],
    hasNoExperience: false,
    skills: "",
    linkedin: "",
    portfolio: "",
    cvFile: null,
    coverLetter: "",
    consent: false,
  };
}

function Field({
  label,
  type = "text",
  textarea = false,
  required = false,
  value,
  onChange,
  placeholder,
  options,
  selectPlaceholder,
}: {
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options?: string[];
  selectPlaceholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
        />
      ) : options ? (
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 rounded border border-black/10 px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 bg-white dark:bg-card"
        >
          <option value="">{selectPlaceholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 rounded border border-black/10 px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      )}
    </label>
  );
}

function RepeatCard({
  title,
  onRemove,
  removeLabel,
  children,
}: {
  title: string;
  onRemove?: () => void;
  removeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-lg p-5 relative bg-[#FAFBFE]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{title}</span>
        {onRemove && (
          <button onClick={onRemove} className="text-[11px] text-corporate-gray hover:text-red-500 font-semibold uppercase tracking-wide">
            {removeLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ApplyModal({
  job,
  userId,
  initialForm,
  onClose,
  onBack,
  onSuccess,
}: {
  job: Job;
  userId: string;
  initialForm?: ApplyForm;
  onClose: () => void;
  onBack: () => void;
  onSuccess: (applicationId: string) => void;
}) {
  const { t } = useLanguage();
  const APPLY_STEPS = [
    t("apply.steps.0"), t("apply.steps.1"), t("apply.steps.2"), t("apply.steps.3"),
    t("apply.steps.4"), t("apply.steps.5"), t("apply.steps.6"), t("apply.steps.7"),
  ];
  const GENDER_OPTIONS = [t("apply.form.genderOptions.0"), t("apply.form.genderOptions.1"), t("apply.form.genderOptions.2")];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ApplyForm>(initialForm ?? emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof ApplyForm>(key: K, value: ApplyForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(form.fullName && form.dob && form.gender);
      case 1:
        return Boolean(form.email && /\S+@\S+\.\S+/.test(form.email) && form.phone && form.address && form.city);
      case 2:
        return form.education.every((e) => e.degree && e.institution);
      case 3:
        return form.hasNoExperience || form.experience.every((e) => e.company && e.role);
      case 4:
        return Boolean(form.skills.trim());
      case 5:
        return true;
      case 6:
        return Boolean(form.cvFile && form.coverLetter.trim());
      case 7:
        return form.consent;
      default:
        return true;
    }
  }, [step, form]);

  const goNext = () => {
    if (!stepValid) {
      setError(t("apply.form.errors.incompleteStep"));
      return;
    }
    setError(null);
    setStep((s) => Math.min(APPLY_STEPS.length - 1, s + 1));
  };
  const goBack = () => {
    setError(null);
    if (step === 0) onBack();
    else setStep((s) => s - 1);
  };

  const handleFile = (file: File | null) => {
    if (!file) return set("cvFile", null);
    const okType = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!okType) {
      setError(t("apply.form.errors.cvType"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("apply.form.errors.cvSize"));
      return;
    }
    setError(null);
    set("cvFile", file);
  };

  const handleSubmit = async () => {
    if (!stepValid || !form.cvFile) {
      setError(t("apply.form.errors.consentRequired"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const record = await addApplication({
        userId,
        jobSlug: job.slug,
        jobTitle: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        fullName: form.fullName,
        dob: form.dob,
        gender: form.gender,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        education: form.education,
        experience: form.hasNoExperience ? [] : form.experience,
        hasNoExperience: form.hasNoExperience,
        skills: form.skills,
        linkedin: form.linkedin,
        portfolio: form.portfolio,
        coverLetter: form.coverLetter,
        cvFile: form.cvFile,
      });
      onSuccess(record.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("apply.form.errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((step + 1) / APPLY_STEPS.length) * 100;

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-3xl" labelledBy="apply-modal-title">
      <CloseButton onClose={onClose} />
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
        <span className="eyebrow text-primary block mb-2">{t("apply.form.applyFor")}</span>
        <h2 id="apply-modal-title" className="text-2xl font-semibold tracking-tight">{job.title}</h2>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{APPLY_STEPS[step]}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-corporate-gray">{t("apply.form.stepOfPrefix")} {step + 1} {t("apply.form.stepOfMiddle")} {APPLY_STEPS.length}</span>
          </div>
          <div className="h-1.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="p-8 max-h-[60vh] overflow-y-auto">
        {step === 0 && (
          <div className="space-y-5">
            <p className="text-sm text-corporate-gray -mt-1">{t("apply.form.step0.intro")}</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t("apply.form.step0.fullName")} required value={form.fullName} onChange={(v) => set("fullName", v)} />
              <Field label={t("apply.form.step0.dob")} type="date" required value={form.dob} onChange={(v) => set("dob", v)} />
              <Field label={t("apply.form.step0.gender")} required value={form.gender} onChange={(v) => set("gender", v)} options={GENDER_OPTIONS} selectPlaceholder={t("apply.form.selectPlaceholder")} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <p className="text-sm text-corporate-gray -mt-1">{t("apply.form.step1.intro")}</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t("apply.form.step1.email")} type="email" required value={form.email} onChange={(v) => set("email", v)} />
              <Field label={t("apply.form.step1.phone")} type="tel" required value={form.phone} onChange={(v) => set("phone", v)} />
              <Field label={t("apply.form.step1.city")} required value={form.city} onChange={(v) => set("city", v)} />
              <Field label={t("apply.form.step1.address")} required value={form.address} onChange={(v) => set("address", v)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-corporate-gray -mt-1">{t("apply.form.step2.intro")}</p>
            {form.education.map((edu, i) => (
              <RepeatCard
                key={i}
                title={`${t("apply.form.step2.educationLabel")} ${i + 1}`}
                removeLabel={t("apply.form.step2.remove")}
                onRemove={form.education.length > 1 ? () => set("education", form.education.filter((_, idx) => idx !== i)) : undefined}
              >
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t("apply.form.step2.degree")} required value={edu.degree} onChange={(v) => set("education", form.education.map((e, idx) => (idx === i ? { ...e, degree: v } : e)))} placeholder={t("apply.form.step2.degreePlaceholder")} />
                  <Field label={t("apply.form.step2.major")} value={edu.major} onChange={(v) => set("education", form.education.map((e, idx) => (idx === i ? { ...e, major: v } : e)))} />
                  <Field label={t("apply.form.step2.institution")} required value={edu.institution} onChange={(v) => set("education", form.education.map((e, idx) => (idx === i ? { ...e, institution: v } : e)))} />
                  <Field label={t("apply.form.step2.graduationYear")} value={edu.year} onChange={(v) => set("education", form.education.map((e, idx) => (idx === i ? { ...e, year: v } : e)))} />
                </div>
              </RepeatCard>
            ))}
            <button onClick={() => set("education", [...form.education, emptyEducation()])} className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:underline">
              {t("apply.form.step2.addAnother")}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between -mt-1">
              <p className="text-sm text-corporate-gray">{t("apply.form.step3.intro")}</p>
              <label className="flex items-center gap-2 text-[12px] text-corporate-gray cursor-pointer">
                <input type="checkbox" checked={form.hasNoExperience} onChange={(e) => set("hasNoExperience", e.target.checked)} className="accent-primary" />
                {t("apply.form.step3.noExperience")}
              </label>
            </div>
            {!form.hasNoExperience && (
              <>
                {form.experience.map((exp, i) => (
                  <RepeatCard
                    key={i}
                    title={`${t("apply.form.step3.experienceLabel")} ${i + 1}`}
                    removeLabel={t("apply.form.step3.remove")}
                    onRemove={form.experience.length > 1 ? () => set("experience", form.experience.filter((_, idx) => idx !== i)) : undefined}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Field label={t("apply.form.step3.company")} required value={exp.company} onChange={(v) => set("experience", form.experience.map((e, idx) => (idx === i ? { ...e, company: v } : e)))} />
                      <Field label={t("apply.form.step3.role")} required value={exp.role} onChange={(v) => set("experience", form.experience.map((e, idx) => (idx === i ? { ...e, role: v } : e)))} />
                      <Field label={t("apply.form.step3.period")} value={exp.period} onChange={(v) => set("experience", form.experience.map((e, idx) => (idx === i ? { ...e, period: v } : e)))} placeholder={t("apply.form.step3.periodPlaceholder")} />
                    </div>
                    <div className="mt-4">
                      <Field label={t("apply.form.step3.description")} textarea value={exp.description} onChange={(v) => set("experience", form.experience.map((e, idx) => (idx === i ? { ...e, description: v } : e)))} />
                    </div>
                  </RepeatCard>
                ))}
                <button onClick={() => set("experience", [...form.experience, emptyExperience()])} className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:underline">
                  {t("apply.form.step3.addAnother")}
                </button>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-corporate-gray -mt-1">{t("apply.form.step4.intro")}</p>
            <Field label={t("apply.form.step4.skills")} required textarea value={form.skills} onChange={(v) => set("skills", v)} placeholder={t("apply.form.step4.skillsPlaceholder")} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p className="text-sm text-corporate-gray -mt-1">{t("apply.form.step5.intro")}</p>
            <div className="grid grid-cols-1 gap-4">
              <Field label={t("apply.form.step5.linkedin")} value={form.linkedin} onChange={(v) => set("linkedin", v)} placeholder={t("apply.form.step5.linkedinPlaceholder")} />
              <Field label={t("apply.form.step5.portfolio")} value={form.portfolio} onChange={(v) => set("portfolio", v)} placeholder={t("apply.form.step5.portfolioPlaceholder")} />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray mb-1.5 block">
                {t("apply.form.step6.uploadLabel")} <span className="text-red-500">*</span>
              </span>
              <label className="mt-1 block border border-dashed border-black/15 rounded-lg p-6 hover:border-primary transition-colors cursor-pointer bg-[#FAFBFE] text-center">
                <span className="text-xs text-corporate-gray block">
                  {form.cvFile ? (
                    <span className="text-corporate-black dark:text-foreground font-medium">{form.cvFile.name} · {(form.cvFile.size / 1024).toFixed(0)} KB</span>
                  ) : (
                    t("apply.form.step6.clickToSelect")
                  )}
                </span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
              </label>
            </div>
            <Field label={t("apply.form.step6.coverLetter")} required textarea value={form.coverLetter} onChange={(v) => set("coverLetter", v)} placeholder={t("apply.form.step6.coverLetterPlaceholder")} />
          </div>
        )}

        {step === 7 && (
          <div>
            <h3 className="text-lg font-semibold mb-1">{t("apply.form.step7.title")}</h3>
            <p className="text-sm text-corporate-gray mb-6">{t("apply.form.step7.intro")}</p>
            <dl className="divide-y divide-black/[0.06] dark:divide-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] rounded-lg overflow-hidden">
              {[
                [t("apply.form.step7.fields.position"), job.title],
                [t("apply.form.step7.fields.fullName"), form.fullName || "—"],
                [t("apply.form.step7.fields.dob"), form.dob || "—"],
                [t("apply.form.step7.fields.email"), form.email || "—"],
                [t("apply.form.step7.fields.phone"), form.phone || "—"],
                [t("apply.form.step7.fields.city"), form.city || "—"],
                [t("apply.form.step7.fields.education"), form.education.map((e) => [e.degree, e.major, e.institution].filter(Boolean).join(" · ")).join("; ") || "—"],
                [t("apply.form.step7.fields.experience"), form.hasNoExperience ? t("apply.form.step7.fields.noExperienceValue") : form.experience.map((e) => [e.role, e.company].filter(Boolean).join(" @ ")).join("; ") || "—"],
                [t("apply.form.step7.fields.skills"), form.skills || "—"],
                [t("apply.form.step7.fields.linkedin"), form.linkedin || "—"],
                [t("apply.form.step7.fields.cv"), form.cvFile?.name || t("apply.form.step7.fields.notUploaded")],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 px-4 py-3 bg-white dark:bg-card">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray">{k}</dt>
                  <dd className="col-span-2 text-sm">{v}</dd>
                </div>
              ))}
            </dl>
            <label className="mt-6 flex gap-3 text-sm text-corporate-gray cursor-pointer">
              <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 flex-shrink-0 accent-primary" />
              <span>{t("apply.form.step7.consent")}</span>
            </label>
          </div>
        )}

        {error && (
          <div className="mt-6 px-4 py-3 rounded bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-[13px] font-medium">{error}</div>
        )}
      </div>

      {/* Footer nav */}
      <div className="px-8 py-5 bg-[#F7F8FB] border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
        <button onClick={goBack} className="px-5 h-10 text-[11px] font-bold uppercase tracking-[0.22em] text-corporate-gray hover:text-primary">
          {t("apply.form.back")}
        </button>
        {step < APPLY_STEPS.length - 1 ? (
          <button onClick={goNext} className="px-6 h-10 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-brand-deep">
            {t("apply.form.continue")}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!stepValid || submitting}
            className="px-6 h-10 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-brand-deep disabled:opacity-40"
          >
            {submitting ? t("apply.form.submitting") : t("apply.form.submit")}
          </button>
        )}
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/* Stage 3 — Success Modal                                             */
/* ------------------------------------------------------------------ */

function SuccessModal({
  applicationId,
  job,
  onClose,
}: {
  applicationId: string;
  job: Job;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-lg" labelledBy="success-modal-title">
      <CloseButton onClose={onClose} />
      <div className="text-center px-8 py-14">
        <div className="w-20 h-20 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-3xl mb-6 shadow-[0_10px_28px_-6px_rgba(14,49,146,0.55)]">✓</div>
        <span className="eyebrow text-primary block mb-2">{t("apply.success.eyebrow")}</span>
        <h3 id="success-modal-title" className="text-2xl font-semibold mb-3">{t("apply.success.title")}</h3>
        <p className="text-corporate-gray max-w-md mx-auto text-sm leading-relaxed mb-6">
          {t("apply.form.applyFor")} <span className="font-semibold text-corporate-black dark:text-foreground">{job.title}</span> {t("apply.success.bodyMiddle")}
        </p>
        <div className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-lg bg-brand-tint border border-primary/10 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray">{t("apply.success.applicationIdLabel")}</span>
          <span className="text-lg font-mono font-semibold text-primary">{applicationId}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mt-1">{t("apply.success.submittedLabel")}</span>
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={onClose} className="px-8 py-3 rounded border border-black/15 text-[11px] font-bold uppercase tracking-[0.25em] hover:border-primary hover:text-primary transition-colors">
            {t("apply.success.close")}
          </button>
          <a href="/applicant/applications" className="px-8 py-3 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors">
            {t("apply.success.trackApplication")}
          </a>
        </div>
      </div>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/* Orchestrator                                                        */
/* ------------------------------------------------------------------ */

export type CareerFlowMode = "detail" | "apply";

export function CareerFlow({
  job: initialJob,
  mode,
  onClose,
}: {
  job: Job;
  mode: CareerFlowMode;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const { user, isAuthenticated, ready } = useAuth();
  const [job, setJob] = useState(initialJob);
  const [stage, setStage] = useState<"detail" | "apply" | "success">(mode);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    initMyApplicationsStore();
  }, []);

  useEffect(() => {
    setJob(initialJob);
    setStage(mode);
    setApplicationId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialJob.slug]);

  if (stage === "detail") {
    return (
      <JobDetailModal
        job={job}
        onClose={onClose}
        onApply={() => setStage("apply")}
        onSelectRelated={(r) => {
          setJob(r);
          setStage("detail");
        }}
      />
    );
  }

  if (stage === "apply") {
    // Only registered applicants who are signed in may apply.
    if (ready && !isAuthenticated) {
      return (
        <AuthRequiredModal
          onClose={onClose}
          redirectPath={`/careers/${job.slug}?apply=1`}
          message={t("apply.authRequired.applyMessage")}
        />
      );
    }

    // Career ATS is reserved for External Users — Internal Employees use
    // the Community Event Submission module instead.
    if (user && user.accountType === "internal") {
      return <RoleBlockedModal onClose={onClose} message={t("apply.roleBlocked.internalMessage")} />;
    }

    // A signed-in user may apply to any number of different jobs, but only
    // once per job — this check is scoped to THIS user's account id, so it
    // never blocks other users from applying to the same role.
    if (user && hasUserAppliedToJob(user.id, job.slug)) {
      return <AlreadyAppliedModal job={job} onClose={onClose} />;
    }

    return (
      <ApplyModal
        job={job}
        userId={user?.id ?? ""}
        initialForm={
          user
            ? { ...emptyForm(), fullName: user.name, email: user.email, phone: user.phone }
            : undefined
        }
        onClose={onClose}
        onBack={() => setStage("detail")}
        onSuccess={(id) => {
          setApplicationId(id);
          setStage("success");
        }}
      />
    );
  }

  return <SuccessModal applicationId={applicationId ?? ""} job={job} onClose={onClose} />;
}
