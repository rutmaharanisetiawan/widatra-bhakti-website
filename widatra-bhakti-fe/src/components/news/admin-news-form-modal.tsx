import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Article, ArticleStatus } from "@/lib/news-data";
import { useLanguage } from "@/hooks/use-language";
import { NEWS_CATEGORIES } from "@/lib/news-data";
import { MediaPickerField, MediaPickerGalleryField } from "@/components/media/media-picker-field";
import { toMediaRef } from "@/lib/media-store";

export type ArticleFormValues = Omit<Article, "slug"> & { slug: string };

const EMPTY_FORM: ArticleFormValues = {
  slug: "",
  title: "",
  cat: "Corporate",
  date: "",
  read: "",
  excerpt: "",
  img: toMediaRef("seed-office-building"),
  content: "",
  gallery: [],
  tags: [],
  author: "",
  authorRole: "",
  status: "Draft",
};

function toLines(arr?: string[]) {
  return (arr ?? []).join("\n");
}
function fromLines(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AdminNewsFormModal({
  open,
  onOpenChange,
  initialArticle,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialArticle: Article | null;
  onSubmit: (values: ArticleFormValues) => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<ArticleFormValues>(EMPTY_FORM);
  const isEdit = !!initialArticle;

  useEffect(() => {
    if (open) {
      setForm(
        initialArticle
          ? { ...initialArticle, gallery: initialArticle.gallery ?? [], tags: initialArticle.tags ?? [] }
          : { ...EMPTY_FORM, date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) }
      );
    }
  }, [open, initialArticle]);

  function set<K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      gallery: form.gallery && form.gallery.length ? form.gallery : [form.img],
    });
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
            lg:w-full lg:max-w-3xl lg:h-[88vh] lg:max-h-[820px]
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4
            duration-300 ease-out focus:outline-none"
        >
          <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-hairline shrink-0">
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold font-display">
                {isEdit ? t("admin.news.form.editTitle") : t("admin.news.form.newTitle")}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-corporate-gray">
                {isEdit ? `${t("admin.news.form.editingPrefix")} ${initialArticle?.slug}` : t("admin.news.form.newSubtitle")}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="w-9 h-9 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors">
              <X className="w-4 h-4" />
              <span className="sr-only">{t("admin.news.form.close")}</span>
            </DialogPrimitive.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("admin.news.form.fields.title")} required>
                <input
                  required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Widatra expands export reach"
                  className="admin-input"
                />
              </Field>
              <Field label={t("admin.news.form.fields.category")} required>
                <select
                  required
                  value={form.cat}
                  onChange={(e) => set("cat", e.target.value)}
                  className="admin-input"
                >
                  {NEWS_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label={t("admin.news.form.fields.date")} required>
                <input
                  required
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  placeholder="e.g. Oct 14, 2026"
                  className="admin-input"
                />
              </Field>
              <Field label={t("admin.news.form.fields.readTime")}>
                <input
                  value={form.read}
                  onChange={(e) => set("read", e.target.value)}
                  placeholder="e.g. 6 min read"
                  className="admin-input"
                />
              </Field>

              <Field label={t("admin.news.form.fields.heroImage")}>
                <MediaPickerField value={form.img} onChange={(ref) => set("img", ref)} folder="News & Event" />
              </Field>
              <Field label={t("admin.news.form.fields.status")} required>
                <div className="flex gap-2 h-10">
                  {(["Published", "Draft"] as ArticleStatus[]).map((s) => (
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

              <Field label={t("admin.news.form.fields.author")}>
                <input
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="e.g. Corporate Communications"
                  className="admin-input"
                />
              </Field>
              <Field label={t("admin.news.form.fields.authorRole")}>
                <input
                  value={form.authorRole}
                  onChange={(e) => set("authorRole", e.target.value)}
                  placeholder="e.g. PT Widatra Bhakti"
                  className="admin-input"
                />
              </Field>
            </div>

            <Field label={t("admin.news.form.fields.excerpt")} required>
              <textarea
                required
                rows={2}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <Field label={t("admin.news.form.fields.fullContent")} required hint={t("admin.news.form.contentHint")}>
              <textarea
                required
                rows={8}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                className="admin-input resize-none font-mono text-xs"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("admin.news.form.fields.tags")} hint={t("admin.news.form.onePerLine")}>
                <textarea
                  rows={3}
                  value={toLines(form.tags)}
                  onChange={(e) => set("tags", fromLines(e.target.value))}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label={t("admin.news.form.fields.galleryImages")} hint={t("admin.news.form.galleryHint")}>
                <MediaPickerGalleryField
                  value={form.gallery ?? []}
                  onChange={(refs) => set("gallery", refs)}
                  folder="News & Event"
                />
              </Field>
            </div>
          </form>

          <div className="flex items-center justify-end gap-3 px-6 sm:px-8 h-16 border-t border-hairline shrink-0 bg-brand-soft/40">
            <DialogPrimitive.Close className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
              {t("admin.news.form.cancel")}
            </DialogPrimitive.Close>
            <button
              type="submit"
              onClick={handleSubmit}
              className="h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors"
            >
              {isEdit ? t("admin.news.form.saveChanges") : t("admin.news.form.createArticle")}
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
