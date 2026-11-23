import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Product } from "@/lib/products-data";
import { useLanguage } from "@/hooks/use-language";
import { PRODUCT_CATEGORIES } from "@/lib/products-data";
import { MediaPickerField } from "@/components/media/media-picker-field";
import { toMediaRef } from "@/lib/media-store";

const CATEGORY_OPTIONS = PRODUCT_CATEGORIES.filter((c) => c !== "All") as Exclude<
  (typeof PRODUCT_CATEGORIES)[number],
  "All"
>[];

export type ProductFormValues = Omit<Product, "code"> & { code: string };

const EMPTY_FORM: ProductFormValues = {
  code: "",
  name: "",
  category: "Basic Intravenous",
  brand: "Generic",
  osmolarity: "",
  calorie: "",
  nie: "",
  packaging: [""],
  sizes: [""],
  indication: "",
  benefits: [""],
  applications: [""],
  storage: "",
  shelfLife: "",
  composition: "",
  manufacturingNote: "",
  img: toMediaRef("seed-iv-bag"),
  tagline: "",
};

function toLines(arr: string[]) {
  return arr.join("\n");
}
function fromLines(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AdminProductFormModal({
  open,
  onOpenChange,
  initialProduct,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct: Product | null;
  onSubmit: (values: ProductFormValues) => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);
  const isEdit = !!initialProduct;

  useEffect(() => {
    if (open) {
      setForm(initialProduct ? { ...initialProduct } : { ...EMPTY_FORM });
    }
  }, [open, initialProduct]);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      packaging: form.packaging.filter(Boolean).length ? form.packaging : ["—"],
      sizes: form.sizes.filter(Boolean).length ? form.sizes : ["—"],
      benefits: form.benefits.filter(Boolean).length ? form.benefits : ["—"],
      applications: form.applications.filter(Boolean).length ? form.applications : ["—"],
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
                {isEdit ? t("admin.products.form.editTitle") : t("admin.products.form.newTitle")}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-corporate-gray">
                {isEdit ? `${t("admin.products.form.editingPrefix")} ${initialProduct?.code}` : t("admin.products.form.newSubtitle")}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="w-9 h-9 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors">
              <X className="w-4 h-4" />
              <span className="sr-only">{t("admin.products.form.close")}</span>
            </DialogPrimitive.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("admin.products.form.fields.name")} required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. WIDA D5-NS"
                  className="admin-input"
                />
              </Field>
              <Field label={t("admin.products.form.fields.tagline")}>
                <input
                  value={form.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                  placeholder="e.g. Hydration with energy."
                  className="admin-input"
                />
              </Field>

              <Field label={t("admin.products.form.fields.category")} required>
                <select
                  required
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as ProductFormValues["category"])}
                  className="admin-input"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("admin.products.form.fields.type")} required>
                <div className="flex gap-2 h-10">
                  {(["Generic", "Branded"] as const).map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => set("brand", b)}
                      className={`flex-1 rounded text-[12px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
                        form.brand === b
                          ? "bg-primary text-white border-primary"
                          : "border-hairline text-corporate-gray hover:border-primary hover:text-primary"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t("admin.products.form.fields.image")}>
                <MediaPickerField value={form.img} onChange={(ref) => set("img", ref)} folder="Products" />
              </Field>
              <Field label={t("admin.products.form.fields.nie")}>
                <input
                  value={form.nie}
                  onChange={(e) => set("nie", e.target.value)}
                  placeholder="e.g. DKL9930500349A1"
                  className="admin-input"
                />
              </Field>

              <Field label={t("admin.products.form.fields.osmolarity")}>
                <input
                  value={form.osmolarity}
                  onChange={(e) => set("osmolarity", e.target.value)}
                  placeholder="e.g. 308 mOsm/L"
                  className="admin-input"
                />
              </Field>
              <Field label={t("admin.products.form.fields.calorie")}>
                <input
                  value={form.calorie}
                  onChange={(e) => set("calorie", e.target.value)}
                  placeholder="e.g. 190 kcal/L or —"
                  className="admin-input"
                />
              </Field>

              <Field label={t("admin.products.form.fields.shelfLife")}>
                <input
                  value={form.shelfLife}
                  onChange={(e) => set("shelfLife", e.target.value)}
                  placeholder="e.g. 24 months from manufacturing date."
                  className="admin-input"
                />
              </Field>
              <Field label={t("admin.products.form.fields.storage")}>
                <input
                  value={form.storage}
                  onChange={(e) => set("storage", e.target.value)}
                  placeholder="e.g. Store below 30°C."
                  className="admin-input"
                />
              </Field>
            </div>

            <Field label={t("admin.products.form.fields.indication")} required>
              <textarea
                required
                rows={2}
                value={form.indication}
                onChange={(e) => set("indication", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <Field label={t("admin.products.form.fields.composition")}>
              <textarea
                rows={2}
                value={form.composition}
                onChange={(e) => set("composition", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <Field label={t("admin.products.form.fields.manufacturingNote")}>
              <textarea
                rows={2}
                value={form.manufacturingNote}
                onChange={(e) => set("manufacturingNote", e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("admin.products.form.fields.packaging")} hint={t("admin.products.form.onePerLine")}>
                <textarea
                  rows={3}
                  value={toLines(form.packaging)}
                  onChange={(e) => set("packaging", fromLines(e.target.value))}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label={t("admin.products.form.fields.sizes")} hint={t("admin.products.form.onePerLine")}>
                <textarea
                  rows={3}
                  value={toLines(form.sizes)}
                  onChange={(e) => set("sizes", fromLines(e.target.value))}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label={t("admin.products.form.fields.benefits")} hint={t("admin.products.form.onePerLine")}>
                <textarea
                  rows={3}
                  value={toLines(form.benefits)}
                  onChange={(e) => set("benefits", fromLines(e.target.value))}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label={t("admin.products.form.fields.applications")} hint={t("admin.products.form.onePerLine")}>
                <textarea
                  rows={3}
                  value={toLines(form.applications)}
                  onChange={(e) => set("applications", fromLines(e.target.value))}
                  className="admin-input resize-none"
                />
              </Field>
            </div>
          </form>

          <div className="flex items-center justify-end gap-3 px-6 sm:px-8 h-16 border-t border-hairline shrink-0 bg-brand-soft/40">
            <DialogPrimitive.Close className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
              {t("admin.products.form.cancel")}
            </DialogPrimitive.Close>
            <button
              type="submit"
              onClick={handleSubmit}
              className="h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors"
            >
              {isEdit ? t("admin.products.form.saveChanges") : t("admin.products.form.createProduct")}
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
