import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SubNavbar } from "@/components/sub-navbar";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import productionImg from "@/assets/production-line.jpg";
import { useProducts } from "@/hooks/use-products";
import { useLanguage } from "@/hooks/use-language";
import { ProductDetailModal } from "@/components/products/product-detail-modal";
import { MediaImage } from "@/components/media/media-image";
import { OrbitProductsSection } from "@/components/products/orbit-products-section";
import { Floating3DImageStage } from "@/components/ui/flat-card-3d-image";
import { resolveMediaUrl } from "@/lib/media-store";
import ivBagCutout from "@/assets/iv-bag-cutout.png";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Product — PT Widatra Bhakti" },
      {
        name: "description",
        content:
          "WIDATRA portfolio of basic intravenous, specialty parenteral, and irrigation solutions for Indonesian and Asian hospitals.",
      },
      { property: "og:title", content: "Our Product — PT Widatra Bhakti" },
    ],
  }),
  component: ProductsPage,
});

const BRAND_FILTERS = ["All", "Generic", "Branded"] as const;

function ProductsPage() {
  const { products } = useProducts();
  const { t } = useLanguage();
  const [active, setActive] = useState<string>("All");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = active === "All" ? products : products.filter((p) => p.brand === active);
  const flagship = products[0];

  const selectedProduct = useMemo(
    () => products.find((p) => p.code === selectedCode) ?? null,
    [products, selectedCode]
  );
  const related = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter((p) => p.category === selectedProduct.category && p.code !== selectedProduct.code)
      .slice(0, 3);
  }, [products, selectedProduct]);

  function openProduct(code: string) {
    setSelectedCode(code);
    setModalOpen(true);
  }

  function filterLabel(f: (typeof BRAND_FILTERS)[number]) {
    if (f === "All") return t("products.filters.all");
    if (f === "Generic") return t("products.filters.generic");
    return t("products.filters.branded");
  }

  function brandLabel(brand: "Generic" | "Branded") {
    return brand === "Generic"
      ? t("products.brandLabels.generic")
      : t("products.brandLabels.branded");
  }

  const filterItems = BRAND_FILTERS.map((c) => ({
    id: c,
    label: filterLabel(c),
    count: c === "All" ? products.length : products.filter((p) => p.brand === c).length,
  }));

  return (
    <>
      <PageHero
        variant="products"
        eyebrow={t("products.hero.eyebrow")}
        title={t("products.hero.title")}
        italic={t("products.hero.italic")}
        description={t("products.hero.description")}
        image={productionImg}
      />

      {/* Featured flagship */}
      {flagship && (
        <section className="bg-surface py-16 sm:py-24">
          <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <ScrollReveal animation="fade-right" className="lg:col-span-6">
              <Floating3DImageStage
                src={resolveMediaUrl(flagship.img) || ivBagCutout}
                alt={flagship.name}
                maxTilt={8}
                elevation={44}
                scale={1.06}
                className="aspect-[4/4.2] max-h-[540px] rounded-[28px] border-2 border-black/[0.06] dark:border-white/[0.08] shadow-md p-8"
                imageClassName="max-h-[380px] sm:max-h-[440px]"
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-left" className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("products.flagship.label")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
                {flagship.name}{" "}
                <span className="font-serif-italic font-normal text-primary block sm:inline">
                  {flagship.tagline}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-corporate-gray leading-relaxed mb-8">
                {flagship.indication}
              </p>

              {/* Unified Interactive Spec Cards */}
              <dl className="grid grid-cols-2 gap-3.5 sm:gap-4 mb-8">
                <div className="rounded-[20px] bg-white dark:bg-card p-4 sm:p-5 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray mb-1">
                    {t("products.specLabels.osmolarity")}
                  </dt>
                  <dd className="text-base sm:text-lg font-bold text-primary">
                    {flagship.osmolarity}
                  </dd>
                </div>
                <div className="rounded-[20px] bg-white dark:bg-card p-4 sm:p-5 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray mb-1">
                    {t("products.specLabels.nie")}
                  </dt>
                  <dd className="text-sm sm:text-base font-bold font-mono text-corporate-black dark:text-white">
                    {flagship.nie}
                  </dd>
                </div>
                <div className="rounded-[20px] bg-white dark:bg-card p-4 sm:p-5 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray mb-1">
                    {t("products.specLabels.packaging")}
                  </dt>
                  <dd className="text-sm sm:text-base font-semibold">
                    {flagship.sizes.join(" · ")}
                  </dd>
                </div>
                <div className="rounded-[20px] bg-white dark:bg-card p-4 sm:p-5 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray mb-1">
                    {t("products.specLabels.shelfLife")}
                  </dt>
                  <dd className="text-sm sm:text-base font-semibold">
                    {flagship.shelfLife.replace(" from manufacturing date.", "")}
                  </dd>
                </div>
              </dl>

              <button
                onClick={() => openProduct(flagship.code)}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_10px_24px_-6px_rgba(14,49,146,0.5)] hover:bg-brand-deep hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>{t("products.flagship.cta")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 3D Drag-to-Orbit Product Showcase (Split Layout: Orbit on Left, Detail Card on Right) */}
      <section id="product-catalog" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up">
            <OrbitProductsSection
              products={products}
              activeFilter={active}
              onFilterChange={(val) => setActive(val)}
              onOpenDetail={openProduct}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* OEM CTA */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="zoom-in">
            <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-primary via-brand-deep to-brand-ink text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between shadow-xl">
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] max-w-2xl text-balance">
                {t("products.oemCta.title")}
              </h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-accent hover:text-white transition-all shadow-lg flex-shrink-0"
              >
                <span>{t("products.oemCta.button")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        related={related}
        onSelectRelated={(code) => setSelectedCode(code)}
      />
    </>
  );
}
