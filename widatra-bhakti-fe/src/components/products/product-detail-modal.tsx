import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Product } from "@/lib/products-data";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
  onSelectRelated,
  related = [],
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRelated?: (code: string) => void;
  related?: Product[];
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[100] bg-corporate-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300"
        />
        <DialogPrimitive.Content
          className="fixed z-[101] bg-white dark:bg-card shadow-2xl overflow-hidden flex flex-col
            inset-x-0 bottom-0 top-6 rounded-t-2xl
            sm:inset-x-4 sm:bottom-4 sm:top-10 sm:rounded-2xl
            lg:left-1/2 lg:top-1/2 lg:bottom-auto lg:right-auto lg:-translate-x-1/2 lg:-translate-y-1/2
            lg:w-full lg:max-w-5xl lg:h-[88vh] lg:max-h-[820px]
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4
            duration-300 ease-out focus:outline-none"
        >
          {product ? <ModalBody product={product} related={related} onSelectRelated={onSelectRelated} /> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function ModalBody({
  product,
  related,
  onSelectRelated,
}: {
  product: Product;
  related: Product[];
  onSelectRelated?: (code: string) => void;
}) {
  const { t } = useLanguage();
  const brandLabel = product.brand === "Generic" ? t("products.brandLabels.generic") : t("products.brandLabels.branded");

  return (
    <>
      <DialogPrimitive.Close className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-surface-2/95 shadow-md border border-black/[0.06] dark:border-white/[0.06] grid place-items-center text-corporate-black dark:text-foreground hover:bg-corporate-black hover:text-white dark:hover:bg-brand-deep dark:hover:text-white transition-colors">
        <X className="w-4 h-4" />
        <span className="sr-only">{t("products.modal.close")}</span>
      </DialogPrimitive.Close>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 bg-gradient-to-br from-[#F6F8FD] to-[#EEF2FB] flex items-center justify-center p-10 lg:min-h-[360px]">
            <MediaImage src={product.img} alt={product.name} className="h-48 lg:h-64 w-auto object-contain" />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="eyebrow text-primary px-3 py-1 bg-primary/10 rounded-full">{product.category}</span>
              <span
                className={`eyebrow px-3 py-1 rounded-full border ${
                  product.brand === "Generic"
                    ? "bg-slate-100 dark:bg-surface-2 text-slate-600 dark:text-muted-foreground border-slate-200 dark:border-border"
                    : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200"
                }`}
              >
                {brandLabel}
              </span>
            </div>
            <DialogPrimitive.Title asChild>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tighter mb-2 pr-10">{product.name}</h2>
            </DialogPrimitive.Title>
            <DialogPrimitive.Description asChild>
              <p className="text-lg font-serif-italic text-primary mb-5">{product.tagline}</p>
            </DialogPrimitive.Description>
            <p className="text-sm text-corporate-gray leading-relaxed mb-6">{product.indication}</p>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4 mb-6 border-t border-black/10 pt-6">
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-corporate-gray/70 mb-1">{t("products.specLabels.osmolarity")}</dt>
                <dd className="text-sm font-medium">{product.osmolarity}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-corporate-gray/70 mb-1">{t("products.specLabels.calorie")}</dt>
                <dd className="text-sm font-medium">{product.calorie}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-corporate-gray/70 mb-1">{t("products.specLabels.nie")}</dt>
                <dd className="text-sm font-medium font-mono">{product.nie}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-corporate-gray/70 mb-1">{t("products.specLabels.shelfLife")}</dt>
                <dd className="text-sm font-medium">{product.shelfLife.replace(" from manufacturing date.", "")}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3.5 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-corporate-black dark:hover:bg-brand-deep transition-colors">
                {t("products.modal.downloadBrochure")}
              </button>
              <a
                href="/contact"
                className="px-6 py-3.5 border border-corporate-black dark:border-white/30 text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-corporate-black hover:text-white dark:hover:bg-brand-deep dark:hover:text-white transition-colors"
              >
                {t("products.modal.requestInquiry")}
              </a>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 dark:bg-white/5 border-y border-black/5">
          <Block label={t("products.modal.blocks.packagingVariants")} items={product.packaging} />
          <Block label={t("products.modal.blocks.availableSizes")} items={product.sizes} />
          <Block label={t("products.modal.blocks.applications")} items={product.applications} />
          <Block label={t("products.modal.blocks.benefits")} items={product.benefits} />
        </div>

        {/* Composition & spec table */}
        <div className="p-6 sm:p-10">
          <span className="eyebrow text-primary mb-3 block">{t("products.modal.composition")}</span>
          <p className="text-sm text-corporate-gray leading-relaxed mb-8">{product.composition}</p>

          <span className="eyebrow text-primary mb-3 block">{t("products.modal.fullTechnicalSheet")}</span>
          <table className="w-full text-sm border-t border-black/10">
            <tbody>
              {[
                [t("products.modal.table.productCode"), product.code],
                [t("products.modal.table.genericBranded"), brandLabel],
                [t("products.modal.table.category"), product.category],
                [t("products.modal.table.manufacturingStandard"), product.manufacturingNote],
                [t("products.modal.table.storage"), product.storage],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-black/5">
                  <th className="text-left py-4 pr-6 align-top eyebrow text-corporate-gray w-1/3">{k}</th>
                  <td className="py-4 text-corporate-black dark:text-foreground leading-relaxed">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="bg-surface p-6 sm:p-10 border-t border-black/5">
            <span className="eyebrow text-primary mb-5 block">{t("products.modal.relatedProducts")}</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/5 dark:bg-white/5">
              {related.map((r) => (
                <button
                  key={r.code}
                  onClick={() => onSelectRelated?.(r.code)}
                  className="bg-white dark:bg-card p-6 text-left hover:bg-surface transition-colors group"
                >
                  <div className="aspect-square mb-4 flex items-center justify-center bg-surface">
                    <MediaImage src={r.img} alt={r.name} className="h-3/4 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <span className="eyebrow text-primary block mb-1">{r.category}</span>
                  <h4 className="text-base font-light">{r.name}</h4>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Block({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="bg-white dark:bg-card p-6 sm:p-8">
      <span className="eyebrow text-primary mb-4 block">{label}</span>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="text-sm text-corporate-black dark:text-foreground leading-relaxed flex gap-3">
            <span className="text-accent flex-shrink-0">•</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
