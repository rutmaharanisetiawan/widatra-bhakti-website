import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, CalendarDays, MapPin, Tag, User2, Paperclip, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";
import { MediaPickerField, MediaPickerGalleryField } from "@/components/media/media-picker-field";
import { formatContent } from "@/lib/format-content";
import { StatusPill } from "@/components/admin-shell";
import {
  COMMUNITY_OPTIONS,
  EVENT_CATEGORIES,
  adminApprove,
  adminPublish,
  adminReject,
  adminRequestRevision,
  adminUpdateEvent,
  type StoredCommunityEvent,
} from "@/lib/community-events-store";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function AdminEventReviewModal({
  event,
  open,
  onOpenChange,
  onChanged,
}: {
  event: StoredCommunityEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}) {
  const { t } = useLanguage();
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<StoredCommunityEvent | null>(null);

  if (!event) return null;

  const current = draft ?? event;
  const actionable = current.status === "Pending" || current.status === "Approved";

  function startEdit() {
    setDraft(event ? { ...event } : null);
    setEditing(true);
  }

  function set<K extends keyof StoredCommunityEvent>(key: K, value: StoredCommunityEvent[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function saveEdit() {
    if (!draft) return;
    await adminUpdateEvent(draft.id, draft);
    toast.success(t("admin.events.toast.saved"));
    setEditing(false);
    onChanged();
  }

  async function handleApprove() {
    await adminApprove(current.id);
    toast.success(t("admin.events.toast.approved"));
    onChanged();
  }

  async function handleReject() {
    if (!note.trim()) {
      toast.error(t("admin.events.validation.noteRequired"));
      return;
    }
    await adminReject(current.id, note.trim());
    toast.success(t("admin.events.toast.rejected"));
    setNote("");
    onChanged();
  }

  async function handleRequestRevision() {
    if (!note.trim()) {
      toast.error(t("admin.events.validation.noteRequired"));
      return;
    }
    await adminRequestRevision(current.id, note.trim());
    toast.success(t("admin.events.toast.revisionRequested"));
    setNote("");
    onChanged();
  }

  async function handlePublish() {
    await adminPublish(current.id);
    toast.success(t("admin.events.toast.published"));
    onChanged();
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
            lg:w-full lg:max-w-4xl lg:h-[90vh] lg:max-h-[880px]
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4
            duration-300 ease-out focus:outline-none"
        >
          <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-hairline shrink-0">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-lg font-semibold font-display truncate">{current.title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-corporate-gray font-mono">{current.id} &middot; {current.submitterName}</DialogPrimitive.Description>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StatusPill status={current.status} label={t(`admin.events.statusLabels.${current.status}`)} />
              <DialogPrimitive.Close className="w-9 h-9 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors">
                <X className="w-4 h-4" />
                <span className="sr-only">{t("admin.events.close")}</span>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            {!editing ? (
              <>
                <div className="aspect-[21/9] w-full bg-brand-soft rounded overflow-hidden">
                  <MediaImage src={current.coverImage} alt={current.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-corporate-gray">
                  <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {current.eventDate}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {current.location}</span>
                  <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {current.community} &middot; {current.category}</span>
                  <span className="flex items-center gap-1.5"><User2 className="w-3.5 h-3.5" /> {current.contactPerson} {current.contactPhone && `· ${current.contactPhone}`}</span>
                </div>

                <p className="text-corporate-black dark:text-foreground font-medium">{current.summary}</p>
                <div>{formatContent(current.description)}</div>

                {current.gallery.length > 0 && (
                  <div>
                    <div className="eyebrow text-primary mb-2">{t("admin.events.gallery")}</div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {current.gallery.map((ref, i) => (
                        <div key={`${ref}-${i}`} className="aspect-square rounded overflow-hidden bg-brand-soft">
                          <MediaImage src={ref} alt="Gallery" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {current.documents.length > 0 && (
                  <div>
                    <div className="eyebrow text-primary mb-2">{t("admin.events.documents")}</div>
                    <div className="space-y-1.5">
                      {current.documents.map((doc, i) => (
                        <a key={`${doc.name}-${i}`} href={doc.dataUrl} download={doc.name} className="flex items-center gap-2 text-[13px] text-primary hover:underline">
                          <Paperclip className="w-3.5 h-3.5" /> {doc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {current.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {current.tags.map((tag) => (
                      <span key={tag} className="px-2.5 h-6 inline-flex items-center rounded-full bg-brand-soft text-[11px] text-corporate-gray">#{tag}</span>
                    ))}
                  </div>
                )}

                {current.status === "Published" && current.publishedArticleSlug && (
                  <div className="rounded border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-700 dark:text-emerald-400">
                    {t("admin.events.publishedNotice")} <span className="font-mono">/news/{current.publishedArticleSlug}</span>
                  </div>
                )}

                {current.adminNotes.length > 0 && (
                  <div>
                    <div className="eyebrow text-primary mb-2">{t("admin.events.notesHistory")}</div>
                    <ol className="space-y-2">
                      {current.adminNotes.map((n) => (
                        <li key={n.id} className="text-[13px] bg-brand-soft rounded px-3 py-2">
                          <span className="font-semibold">{n.author}</span> &middot; <span className="text-corporate-gray">{formatDate(n.date)}</span>
                          <div>{n.note}</div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            ) : (
              draft && (
                <div className="space-y-5">
                  <Field label={t("admin.events.editForm.title")}>
                    <input value={draft.title} onChange={(e) => set("title", e.target.value)} className="admin-input" />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t("admin.events.editForm.community")}>
                      <select value={draft.community} onChange={(e) => set("community", e.target.value)} className="admin-input">
                        {COMMUNITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label={t("admin.events.editForm.category")}>
                      <select value={draft.category} onChange={(e) => set("category", e.target.value)} className="admin-input">
                        {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label={t("admin.events.editForm.eventDate")}>
                      <input type="date" value={draft.eventDate} onChange={(e) => set("eventDate", e.target.value)} className="admin-input" />
                    </Field>
                    <Field label={t("admin.events.editForm.location")}>
                      <input value={draft.location} onChange={(e) => set("location", e.target.value)} className="admin-input" />
                    </Field>
                    <Field label={t("admin.events.editForm.coverImage")}>
                      <MediaPickerField value={draft.coverImage} onChange={(ref) => set("coverImage", ref)} folder="News & Event" />
                    </Field>
                  </div>
                  <Field label={t("admin.events.editForm.summary")}>
                    <textarea rows={2} value={draft.summary} onChange={(e) => set("summary", e.target.value)} className="admin-input resize-none" />
                  </Field>
                  <Field label={t("admin.events.editForm.description")}>
                    <textarea rows={7} value={draft.description} onChange={(e) => set("description", e.target.value)} className="admin-input resize-none" />
                  </Field>
                  <Field label={t("admin.events.editForm.gallery")}>
                    <MediaPickerGalleryField value={draft.gallery} onChange={(refs) => set("gallery", refs)} folder="News & Event" />
                  </Field>
                </div>
              )
            )}
          </div>

          <div className="border-t border-hairline shrink-0 bg-brand-soft/40 px-6 sm:px-8 py-4 space-y-3">
            {editing ? (
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setEditing(false)} className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
                  {t("admin.events.editForm.cancel")}
                </button>
                <button onClick={saveEdit} className="h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors">
                  {t("admin.events.editForm.save")}
                </button>
              </div>
            ) : (
              <>
                {actionable && (
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("admin.events.notePlaceholder")}
                    rows={2}
                    className="admin-input resize-none w-full"
                  />
                )}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {current.status !== "Published" && (
                    <button onClick={startEdit} className="inline-flex items-center gap-1.5 h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> {t("admin.events.actions.editBeforePublish")}
                    </button>
                  )}
                  {current.status === "Pending" && (
                    <>
                      <button onClick={handleRequestRevision} className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
                        {t("admin.events.actions.requestRevision")}
                      </button>
                      <button onClick={handleReject} className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors">
                        {t("admin.events.actions.reject")}
                      </button>
                      <button onClick={handleApprove} className="h-10 px-4 rounded bg-brand-tint text-primary text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-soft transition-colors">
                        {t("admin.events.actions.approve")}
                      </button>
                    </>
                  )}
                  {actionable && (
                    <button onClick={handlePublish} className="h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors">
                      {t("admin.events.actions.publish")}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-corporate-black dark:text-foreground">{label}</span>
      {children}
    </label>
  );
}
