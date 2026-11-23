import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchProduct, relatedStoredProducts, initProductsStore } from "@/lib/products-store";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";
import { resolveMediaUrl } from "@/lib/media-store";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/products/$code")({
  loader: async ({ params }) => {
    initProductsStore();
    const product = await fetchProduct(params.code);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    return {
      meta: [
        { title: `${p?.name ?? "Product"} — PT Widatra Bhakti` },
        { name: "description", content: p?.indication ?? "Widatra Bhakti product detail." },
        { property: "og:title", content: `${p?.name ?? "Product"} — Widatra Bhakti` },
        ...(p?.img ? [{ property: "og:image", content: resolveMediaUrl(p.img) }] : []),
      ],
    };
  },
  notFoundComponent: () => {
    const { t } = useLanguage();
    return (
      <div className="py-32 text-center">
        <p className="text-corporate-gray">{t("products.detail.notFound")}</p>
        <Link to="/products" className="text-primary underline mt-4 inline-block">{t("products.detail.backToCatalog")}</Link>
      </div>
    );
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const related = relatedStoredProducts(product.code, product.category);
  const { t } = useLanguage();
  const brandLabel = product.brand === "Generic" ? t("products.brandLabels.generic") : t("products.brandLabels.branded");

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-surface border-b border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 text-xs font-mono text-corporate-gray flex gap-2">
          <Link to="/" className="hover:text-primary">{t("products.detail.breadcrumbHome")}</Link><span>/</span>
          <Link to="/products" className="hover:text-primary">{t("products.detail.breadcrumbProducts")}</Link><span>/</span>
          <span className="text-corporate-black dark:text-foreground">{product.name}</span>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white dark:bg-card py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-12">
          <ScrollReveal animation="fade-right" className="col-span-12 lg:col-span-7">
            <div className="aspect-[4/5] bg-surface flex items-center justify-center overflow-hidden rounded-[24px]">
              <MediaImage src={product.img} alt={product.name} className="h-[80%] w-auto object-contain" />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="col-span-12 lg:col-span-5">
            <div className="flex gap-3 mb-6">
              <span className="eyebrow text-primary px-3 py-1 bg-primary/10 rounded-full">{product.category}</span>
              <span className="eyebrow text-corporate-gray px-3 py-1 border border-black/10 rounded-full">{brandLabel}</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-light tracking-tighter mb-4">{product.name}</h1>
            <p className="text-2xl font-serif-italic text-primary mb-8">{product.tagline}</p>
            <p className="text-lg text-corporate-gray leading-relaxed mb-10">{product.indication}</p>

            <dl className="grid grid-cols-2 gap-y-6 mb-10 border-t border-black/10 pt-8">
              <div><dt className="eyebrow text-corporate-gray mb-2">{t("products.specLabels.osmolarity")}</dt><dd className="text-lg font-light">{product.osmolarity}</dd></div>
              <div><dt className="eyebrow text-corporate-gray mb-2">{t("products.specLabels.calorie")}</dt><dd className="text-lg font-light">{product.calorie}</dd></div>
              <div><dt className="eyebrow text-corporate-gray mb-2">{t("products.specLabels.nie")}</dt><dd className="text-lg font-light font-mono">{product.nie}</dd></div>
              <div><dt className="eyebrow text-corporate-gray mb-2">{t("products.specLabels.shelfLife")}</dt><dd className="text-lg font-light">{product.shelfLife.replace(" from manufacturing date.", "")}</dd></div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <button className="px-8 py-4 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-corporate-black dark:hover:bg-brand-deep transition-colors rounded-full">
                {t("products.detail.downloadBrochure")}
              </button>
              <Link to="/contact" className="px-8 py-4 border border-corporate-black dark:border-white/30 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-corporate-black hover:text-white dark:hover:bg-brand-deep dark:hover:text-white transition-colors rounded-full">
                {t("products.detail.requestInquiry")}
              </Link>
              <Link to="/contact" className="px-8 py-4 border border-corporate-black dark:border-white/30 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-corporate-black hover:text-white dark:hover:bg-brand-deep dark:hover:text-white transition-colors rounded-full">
                {t("products.detail.contactSales")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview / Composition */}
      <section className="bg-surface py-24">
        <ScrollReveal animation="fade-up" className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-5">
            <span className="eyebrow text-primary mb-4 block">{t("products.detail.overview.eyebrow")}</span>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-6">{t("products.detail.overview.title")}</h2>
            <p className="text-corporate-gray leading-relaxed">{product.composition}</p>
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden">
            <Block label={t("products.modal.blocks.packagingVariants")} items={product.packaging} />
            <Block label={t("products.modal.blocks.availableSizes")} items={product.sizes} />
            <Block label={t("products.modal.blocks.applications")} items={product.applications} />
            <Block label={t("products.modal.blocks.benefits")} items={product.benefits} />
          </div>
        </ScrollReveal>
      </section>

      {/* Specifications table */}
      <section className="py-24 bg-white dark:bg-card">
        <ScrollReveal animation="fade-up" className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <span className="eyebrow text-primary mb-4 block">{t("products.detail.specifications.eyebrow")}</span>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight">{t("products.detail.specifications.title")}</h2>
          </div>
          <table className="w-full text-sm border-t border-black/10">
            <tbody>
              {[
                [t("products.detail.table.productCode"), product.code],
                [t("products.detail.table.genericBranded"), brandLabel],
                [t("products.detail.table.category"), product.category],
                [t("products.detail.table.indication"), product.indication],
                [t("products.detail.table.composition"), product.composition],
                [t("products.detail.table.osmolarity"), product.osmolarity],
                [t("products.detail.table.calorie"), product.calorie],
                [t("products.detail.table.packaging"), product.packaging.join(" · ")],
                [t("products.detail.table.availableSizes"), product.sizes.join(" · ")],
                [t("products.detail.table.nieBpom"), product.nie],
                [t("products.detail.table.shelfLife"), product.shelfLife],
                [t("products.detail.table.storage"), product.storage],
                [t("products.detail.table.manufacturingStandard"), product.manufacturingNote],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-black/5">
                  <th className="text-left py-5 pr-8 align-top eyebrow text-corporate-gray w-1/4">{k}</th>
                  <td className="py-5 text-corporate-black dark:text-foreground leading-relaxed">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollReveal>
      </section>

      {/* Manufacturing quality + storage */}
      <section className="bg-corporate-black text-white py-24">
        <ScrollReveal animation="fade-up" className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-6">
            <span className="eyebrow text-white/50 mb-4 block">{t("products.detail.manufacturingQuality.eyebrow")}</span>
            <h3 className="text-3xl font-light mb-6">{t("products.detail.manufacturingQuality.title")}</h3>
            <p className="text-white/70 leading-relaxed">{product.manufacturingNote}</p>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <span className="eyebrow text-white/50 mb-4 block">{t("products.detail.storageInfo.eyebrow")}</span>
            <h3 className="text-3xl font-light mb-6">{t("products.detail.storageInfo.title")}</h3>
            <p className="text-white/70 leading-relaxed">{product.storage}</p>
          </div>
        </ScrollReveal>
      </section>

      {/* Related Products */}
      <section className="py-24 bg-white dark:bg-card">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="flex justify-between items-end mb-12">
            <div>
              <span className="eyebrow text-primary mb-4 block">{t("products.detail.related.eyebrow")}</span>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">{t("products.detail.related.titlePrefix")} {product.category}.</h2>
            </div>
            <Link to="/products" className="text-[11px] font-bold uppercase tracking-widest border-b border-corporate-black dark:border-white/30 pb-1">{t("products.detail.related.cta")}</Link>
          </ScrollReveal>
          {related.length === 0 ? (
            <p className="text-sm text-corporate-gray">{t("products.detail.related.empty")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r, idx) => (
                <ScrollReveal key={r.code} animation="fade-up" delay={idx * 100}>
                  <Link to="/products/$code" params={{ code: r.code }} className="block bg-surface dark:bg-card p-8 rounded-2xl hover:shadow-lg transition-all group border border-black/5 dark:border-white/5">
                    <div className="aspect-square mb-6 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                      <MediaImage src={r.img} alt={r.name} className="h-3/4 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <span className="eyebrow text-primary block mb-2">{r.category}</span>
                    <h3 className="text-xl font-light">{r.name}</h3>
                    <p className="text-xs text-corporate-gray mt-2 line-clamp-2">{r.indication}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Block({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="bg-white dark:bg-card p-8">
      <span className="eyebrow text-primary mb-5 block">{label}</span>
      <ul className="space-y-2.5">
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
