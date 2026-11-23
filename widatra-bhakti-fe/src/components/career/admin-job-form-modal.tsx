import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Job, JobStatus } from "@/lib/jobs-data";
import {
  JOB_DEPARTMENTS,
  WORK_MODES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_LOCATIONS,
} from "@/lib/jobs-data";
import { useLanguage } from "@/hooks/use-language";
import { MediaPickerField } from "@/components/media/media-picker-field";
import { toMediaRef } from "@/lib/media-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type JobFormValues = Omit<Job, "slug"> & { slug: string };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function defaultDeadlineIso() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function emptyForm(): JobFormValues {
  return {
    slug: "",
    title: "",
    department: "Production",
    location: JOB_LOCATIONS[0],
    workMode: "On-site",
    employmentType: "Full-time",
    level: "Entry",
    salary: "",
    deadline: defaultDeadlineIso(),
    posted: todayIso(),
    summary: "",
    description: "",
    responsibilities: [],
    qualifications: [],
    requirements: [],
    benefits: [],
    status: "Draft",
    featured: false,
    coverImage: toMediaRef("seed-office-building"),
  };
}

function toLines(arr?: string[]) {
  return (arr ?? []).join("\n");
}
function fromLines(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AdminJobFormModal({
  open,
  onOpenChange,
  initialJob,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialJob: Job | null;
  onSubmit: (values: JobFormValues, publish: boolean) => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<JobFormValues>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!initialJob;

  useEffect(() => {
    if (open) {
      setForm(initialJob ? { ...initialJob } : emptyForm());
      setErrors({});
      setSubmitting(false);
    }
  }, [open, initialJob]);

  function set<K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function isDirty() {
    const baseline = initialJob ? JSON.stringify(initialJob) : JSON.stringify(emptyForm());
    return JSON.stringify(form) !== baseline;
  }

  function requestClose() {
    if (isDirty()) {
      setConfirmCancel(true);
    } else {
      onOpenChange(false);
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = t("admin.ats.jobForm.errors.required");
    if (!form.department) next.department = t("admin.ats.jobForm.errors.required");
    if (!form.employmentType) next.employmentType = t("admin.ats.jobForm.errors.required");
    if (!form.workMode) next.workMode = t("admin.ats.jobForm.errors.required");
    if (!form.location.trim()) next.location = t("admin.ats.jobForm.errors.required");
    if (!form.level) next.level = t("admin.ats.jobForm.errors.required");
    if (!form.summary.trim()) next.summary = t("admin.ats.jobForm.errors.required");
    if (!form.deadline) next.deadline = t("admin.ats.jobForm.errors.required");
    if (form.responsibilities.length === 0) next.responsibilities = t("admin.ats.jobForm.errors.atLeastOne");
    if (form.requirements.length === 0) next.requirements = t("admin.ats.jobForm.errors.atLeastOne");
    if (form.benefits.length === 0) next.benefits = t("admin.ats.jobForm.errors.atLeastOne");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent, publish?: boolean) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const finalStatus: JobStatus = publish ? "Published" : form.status === "Published" ? "Published" : "Draft";
    // Simulate a brief save to give the loading state real presence.
    await new Promise((r) => setTimeout(r, 450));
    onSubmit({ ...form, status: finalStatus, description: form.description || form.summary }, !!publish);
    setSubmitting(false);
  }

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={(o) => (!o ? requestClose() : onOpenChange(o))}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-corporate-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />
          <DialogPrimitive.Content
            className="fixed z-[101] bg-white dark:bg-card shadow-2xl overflow-hidden flex flex-col
              inset-x-0 bottom-0 top-6 rounded-t-2xl
              sm:inset-x-4 sm:bottom-4 sm:top-10 sm:rounded-2xl
              lg:left-1/2 lg:top-1/2 lg:bottom-auto lg:right-auto lg:-translate-x-1/2 lg:-translate-y-1/2
              lg:w-full lg:max-w-3xl lg:h-[88vh] lg:max-h-[860px]
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
              data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4
              duration-300 ease-out focus:outline-none"
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              requestClose();
            }}
            onInteractOutside={(e) => {
              e.preventDefault();
              requestClose();
            }}
          >
            <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-hairline shrink-0">
              <div>
                <DialogPrimitive.Title className="text-lg font-semibold font-display">
                  {isEdit ? t("admin.ats.jobForm.editTitle") : t("admin.ats.jobForm.newTitle")}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-xs text-corporate-gray">
                  {isEdit ? `${t("admin.ats.jobForm.editingPrefix")} ${initialJob?.slug}` : t("admin.ats.jobForm.newSubtitle")}
                </DialogPrimitive.Description>
              </div>
              <button
                type="button"
                onClick={requestClose}
                className="w-9 h-9 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">{t("admin.ats.jobForm.close")}</span>
              </button>
            </div>

            <form onSubmit={(e) => handleSubmit(e)} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label={t("admin.ats.jobForm.fields.title")} required error={errors.title}>
                  <input
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Production Supervisor — Sterile Filling"
                    className="admin-input"
                  />
                </Field>
                <Field label={t("admin.ats.jobForm.fields.department")} required error={errors.department}>
                  <select
                    value={form.department}
                    onChange={(e) => set("department", e.target.value as Job["department"])}
                    className="admin-input"
                  >
                    {JOB_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t("admin.ats.jobForm.fields.employmentType")} required error={errors.employmentType}>
                  <select
                    value={form.employmentType}
                    onChange={(e) => set("employmentType", e.target.value as Job["employmentType"])}
                    className="admin-input"
                  >
                    {EMPLOYMENT_TYPES.map((et) => (
                      <option key={et} value={et}>{et}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t("admin.ats.jobForm.fields.workMode")} required error={errors.workMode}>
                  <select
                    value={form.workMode}
                    onChange={(e) => set("workMode", e.target.value as Job["workMode"])}
                    className="admin-input"
                  >
                    {WORK_MODES.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t("admin.ats.jobForm.fields.location")} required error={errors.location}>
                  <input
                    list="job-location-suggestions"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g. Pandaan, East Java"
                    className="admin-input"
                  />
                  <datalist id="job-location-suggestions">
                    {JOB_LOCATIONS.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                </Field>
                <Field label={t("admin.ats.jobForm.fields.experienceLevel")} required error={errors.level}>
                  <select
                    value={form.level}
                    onChange={(e) => set("level", e.target.value as Job["level"])}
                    className="admin-input"
                  >
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t("admin.ats.jobForm.fields.salary")} hint={t("admin.ats.jobForm.optional")}>
                  <input
                    value={form.salary ?? ""}
                    onChange={(e) => set("salary", e.target.value)}
                    placeholder="e.g. Rp 8.000.000 – Rp 12.000.000"
                    className="admin-input"
                  />
                </Field>
                <Field label={t("admin.ats.jobForm.fields.deadline")} required error={errors.deadline}>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                    className="admin-input"
                  />
                </Field>
              </div>

              <Field label={t("admin.ats.jobForm.fields.shortDescription")} required error={errors.summary}>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  className="admin-input resize-none"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label={t("admin.ats.jobForm.fields.responsibilities")}
                  required
                  error={errors.responsibilities}
                  hint={t("admin.ats.jobForm.onePerLine")}
                >
                  <textarea
                    rows={5}
                    value={toLines(form.responsibilities)}
                    onChange={(e) => set("responsibilities", fromLines(e.target.value))}
                    className="admin-input resize-none"
                  />
                </Field>
                <Field
                  label={t("admin.ats.jobForm.fields.requirements")}
                  required
                  error={errors.requirements}
                  hint={t("admin.ats.jobForm.onePerLine")}
                >
                  <textarea
                    rows={5}
                    value={toLines(form.requirements)}
                    onChange={(e) => set("requirements", fromLines(e.target.value))}
                    className="admin-input resize-none"
                  />
                </Field>
              </div>

              <Field
                label={t("admin.ats.jobForm.fields.benefits")}
                required
                error={errors.benefits}
                hint={t("admin.ats.jobForm.onePerLine")}
              >
                <textarea
                  rows={4}
                  value={toLines(form.benefits)}
                  onChange={(e) => set("benefits", fromLines(e.target.value))}
                  className="admin-input resize-none"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label={t("admin.ats.jobForm.fields.coverImage")}>
                  <MediaPickerField value={form.coverImage} onChange={(ref) => set("coverImage", ref)} folder="Others" />
                </Field>

                <div className="grid grid-cols-2 gap-5">
                  <Field label={t("admin.ats.jobForm.fields.status")} required>
                    <div className="flex gap-2 h-10">
                      {(["Published", "Draft"] as JobStatus[]).map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => set("status", s)}
                          className={`flex-1 rounded text-[12px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
                            form.status === s
                              ? "bg-primary text-white border-primary"
                              : "border-hairline text-corporate-gray hover:border-primary hover:text-primary"
                          }`}
                        >
                          {t(`admin.statusLabels.${s}`)}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={t("admin.ats.jobForm.fields.featured")}>
                    <button
                      type="button"
                      onClick={() => set("featured", !form.featured)}
                      className={`h-10 w-full rounded text-[12px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
                        form.featured
                          ? "bg-primary text-white border-primary"
                          : "border-hairline text-corporate-gray hover:border-primary hover:text-primary"
                      }`}
                    >
                      {form.featured ? t("admin.ats.jobForm.featuredOn") : t("admin.ats.jobForm.featuredOff")}
                    </button>
                  </Field>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-6 sm:px-8 h-16 border-t border-hairline shrink-0 bg-brand-soft/40">
              <button
                type="button"
                onClick={requestClose}
                disabled={submitting}
                className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              >
                {t("admin.ats.jobForm.cancel")}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                className="h-10 px-5 rounded border border-primary text-primary text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary/[0.06] transition-colors disabled:opacity-50"
              >
                {submitting ? t("admin.ats.jobForm.saving") : t("admin.ats.jobForm.saveDraft")}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
                className="h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors disabled:opacity-50"
              >
                {submitting ? t("admin.ats.jobForm.saving") : t("admin.ats.jobForm.publish")}
              </button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.ats.jobForm.cancelConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("admin.ats.jobForm.cancelConfirm.body")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.ats.jobForm.cancelConfirm.keepEditing")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmCancel(false);
                onOpenChange(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("admin.ats.jobForm.cancelConfirm.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-corporate-black dark:text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </span>
        {hint && !error && <span className="text-[10px] text-corporate-gray">{hint}</span>}
      </span>
      {children}
      {error && <span className="block mt-1 text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
