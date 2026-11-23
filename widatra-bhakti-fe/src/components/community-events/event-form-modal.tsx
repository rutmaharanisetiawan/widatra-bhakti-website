import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Paperclip, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { MediaPickerField, MediaPickerGalleryField } from "@/components/media/media-picker-field";
import { toMediaRef } from "@/lib/media-store";
import {
  COMMUNITY_OPTIONS,
  EVENT_CATEGORIES,
  fileToDataUrl,
  type CommunityEventDocument,
  type CommunityEventFormInput,
  type StoredCommunityEvent,
} from "@/lib/community-events-store";

const EMPTY_FORM: CommunityEventFormInput = {
  title: "",
  community: COMMUNITY_OPTIONS[0],
  category: EVENT_CATEGORIES[0],
  eventDate: "",
  location: "",
  summary: "",
  description: "",
  coverImage: toMediaRef("seed-team"),
  gallery: [],
  documents: [],
  tags: [],
  contactPerson: "",
  contactPhone: "",
  agreementAccepted: false,
};

function toLines(arr?: string[]) {
  return (arr ?? []).join("\n");
}
function fromLines(text: string) {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export function EventFormModal({
  open,
  onOpenChange,
  initialEvent,
  defaultContact,
  onSaveDraft,
  onSubmitForReview,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEvent: StoredCommunityEvent | null;
  defaultContact?: { name: string; phone?: string };
  onSaveDraft: (values: CommunityEventFormInput) => void;
  onSubmitForReview: (values: CommunityEventFormInput) => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<CommunityEventFormInput>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initialEvent;

  useEffect(() => {
    if (!open) return;
    if (initialEvent) {
      const { id, userId, submitterName, submitterEmail, status, statusHistory, adminNotes, createdAt, updatedAt, submittedAt, publishedArticleSlug, ...rest } = initialEvent;
      setForm({ ...rest, gallery: rest.gallery ?? [], tags: rest.tags ?? [], documents: rest.documents ?? [] });
    } else {
      setForm({
        ...EMPTY_FORM,
        contactPerson: defaultContact?.name ?? "",
        contactPhone: defaultContact?.phone ?? "",
      });
    }
  }, [open, initialEvent, defaultContact]);

  function set<K extends keyof CommunityEventFormInput>(key: K, value: CommunityEventFormInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateRequired(): string | null {
    if (!form.title.trim()) return t("dashboard.events.form.validation.title");
    if (!form.eventDate) return t("dashboard.events.form.validation.date");
    if (!form.location.trim()) return t("dashboard.events.form.validation.location");
    if (!form.summary.trim()) return t("dashboard.events.form.validation.summary");
    if (!form.description.trim()) return t("dashboard.events.form.validation.description");
    if (!form.contactPerson.trim()) return t("dashboard.events.form.validation.contact");
    return null;
  }

  function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error(t("dashboard.events.form.validation.title"));
      return;
    }
    onSaveDraft(form);
  }

  function handleSubmitForReview() {
    const error = validateRequired();
    if (error) {
      toast.error(error);
      return;
    }
    if (!form.agreementAccepted) {
      toast.error(t("dashboard.events.form.validation.agreement"));
      return;
    }
    onSubmitForReview(form);
  }

  async function handleDocumentUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const next: CommunityEventDocument[] = [...form.documents];
      for (const file of Array.from(fileList)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`"${file.name}" ${t("dashboard.events.form.fileTooLarge")}`);
          continue;
        }
        const dataUrl = await fileToDataUrl(file);
        next.push({ name: file.name, type: file.type || "application/octet-stream", size: file.size, dataUrl, file });
      }
      set("documents", next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("dashboard.events.form.fileError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeDocument(idx: number) {
    set("documents", form.documents.filter((_, i) => i !== idx));
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
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
        >
          <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-hairline shrink-0">
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold font-display">
                {isEdit ? t("dashboard.events.form.editTitle") : t("dashboard.events.form.newTitle")}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-corporate-gray">
                {t("dashboard.events.form.subtitle")}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="w-9 h-9 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors">
              <X className="w-4 h-4" />
              <span className="sr-only">{t("dashboard.events.form.close")}</span>
            </DialogPrimitive.Close>
          </div>

          <form onSubmit={handleSaveDraft} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("dashboard.events.form.fields.title")} required>
                <input
                  required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder={t("dashboard.events.form.placeholders.title")}
                  className="admin-input"
                />
              </Field>
              <Field label={t("dashboard.events.form.fields.community")} required>
                <select value={form.community} onChange={(e) => set("community", e.target.value)} className="admin-input">
                  {COMMUNITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label={t("dashboard.events.form.fields.category")} required>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className="admin-input">
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("dashboard.events.form.fields.eventDate")} required>
                <input
                  required
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => set("eventDate", e.target.value)}
                  className="admin-input"
                />
              </Field>

              <Field label={t("dashboard.events.form.fields.location")} required>
                <input
                  required
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder={t("dashboard.events.form.placeholders.location")}
                  className="admin-input"
                />
              </Field>
              <Field label={t("dashboard.events.form.fields.coverImage")}>
                <MediaPickerField value={form.coverImage} onChange={(ref) => set("coverImage", ref)} folder="News & Event" />
              </Field>
            </div>

            <Field label={t("dashboard.events.form.fields.summary")} required hint={t("dashboard.events.form.summaryHint")}>
              <textarea
                required
                rows={2}
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <Field label={t("dashboard.events.form.fields.description")} required hint={t("dashboard.events.form.descriptionHint")}>
              <textarea
                required
                rows={7}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("dashboard.events.form.fields.tags")} hint={t("dashboard.events.form.onePerLine")}>
                <textarea
                  rows={3}
                  value={toLines(form.tags)}
                  onChange={(e) => set("tags", fromLines(e.target.value))}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label={t("dashboard.events.form.fields.gallery")} hint={t("dashboard.events.form.galleryHint")}>
                <MediaPickerGalleryField value={form.gallery} onChange={(refs) => set("gallery", refs)} folder="News & Event" />
              </Field>
            </div>

            <Field label={t("dashboard.events.form.fields.documents")} hint={t("dashboard.events.form.documentsHint")}>
              <div className="space-y-2">
                {form.documents.map((doc, i) => (
                  <div key={`${doc.name}-${i}`} className="flex items-center justify-between gap-3 h-10 px-3 border border-hairline rounded text-[12px]">
                    <span className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 shrink-0 text-corporate-gray" />
                      <span className="truncate">{doc.name}</span>
                    </span>
                    <button type="button" onClick={() => removeDocument(i)} className="text-corporate-gray hover:text-destructive shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-hairline rounded text-[11px] font-semibold uppercase tracking-[0.14em] hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                  {t("dashboard.events.form.attachDocument")}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleDocumentUpload(e.target.files)}
                />
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("dashboard.events.form.fields.contactPerson")} required>
                <input
                  required
                  value={form.contactPerson}
                  onChange={(e) => set("contactPerson", e.target.value)}
                  placeholder={t("dashboard.events.form.placeholders.contactPerson")}
                  className="admin-input"
                />
              </Field>
              <Field label={t("dashboard.events.form.fields.contactPhone")}>
                <input
                  value={form.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value)}
                  placeholder="e.g. +62 812 3456 7890"
                  className="admin-input"
                />
              </Field>
            </div>

            <label className="flex items-start gap-2.5 text-[12.5px] text-corporate-gray leading-relaxed">
              <input
                type="checkbox"
                checked={form.agreementAccepted}
                onChange={(e) => set("agreementAccepted", e.target.checked)}
                className="mt-0.5 flex-shrink-0 accent-primary"
              />
              {t("dashboard.events.form.agreementLabel")}
            </label>
          </form>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 px-6 sm:px-8 py-4 sm:h-16 border-t border-hairline shrink-0 bg-brand-soft/40">
            <DialogPrimitive.Close className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
              {t("dashboard.events.form.cancel")}
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors"
            >
              {t("dashboard.events.form.saveDraft")}
            </button>
            <button
              type="button"
              onClick={handleSubmitForReview}
              className="h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors"
            >
              {t("dashboard.events.form.submitForReview")}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-corporate-black dark:text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </span>
        {hint && <span className="text-[10px] text-corporate-gray">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
