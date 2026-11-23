import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SubNavbar } from "@/components/sub-navbar";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import officeImg from "@/assets/office-building.jpg";
import { usePublishedArticles } from "@/hooks/use-news";
import { NewsDetailModal } from "@/components/news/news-detail-modal";
import { MediaImage } from "@/components/media/media-image";
import { useLanguage } from "@/hooks/use-language";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { Article } from "@/lib/news-data";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Event — PT Widatra Bhakti" },
      {
        name: "description",
        content:
          "Insights, announcements, and milestones from PT Widatra Bhakti — Indonesia's pharmaceutical manufacturer of record.",
      },
      { property: "og:title", content: "News & Event — PT Widatra Bhakti" },
    ],
  }),
  component: NewsPage,
});

const CATEGORIES = ["All", "Corporate", "Science", "Sustainability", "Events"] as const;

function NewsPage() {
  const { articles } = usePublishedArticles();
  const { t } = useLanguage();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const feature: Article | undefined = articles[0];
  const filtered = useMemo(
    () => (cat === "All" ? articles : articles.filter((a) => a.cat === cat)),
    [cat, articles]
  );

  const selectedArticle = useMemo(
    () => articles.find((a) => a.slug === selectedSlug) ?? null,
    [articles, selectedSlug]
  );
  const related = useMemo(() => {
    if (!selectedArticle) return [];
    return articles
      .filter((a) => a.cat === selectedArticle.cat && a.slug !== selectedArticle.slug)
      .slice(0, 3);
  }, [articles, selectedArticle]);

  function openArticle(slug: string) {
    setSelectedSlug(slug);
    setModalOpen(true);
  }

  function categoryLabel(c: (typeof CATEGORIES)[number]) {
    const map = {
      All: t("news.categories.all"),
      Corporate: t("news.categories.corporate"),
      Science: t("news.categories.science"),
      Sustainability: t("news.categories.sustainability"),
      Events: t("news.categories.events"),
    } as const;
    return map[c];
  }

  const categoryNavItems = CATEGORIES.map((c) => ({
    id: c,
    label: categoryLabel(c),
    count: c === "All" ? articles.length : articles.filter((a) => a.cat === c).length,
  }));

  return (
    <>
      <PageHero
        variant="news"
        eyebrow={t("news.hero.eyebrow")}
        title={t("news.hero.title")}
        italic={t("news.hero.italic")}
        description={t("news.hero.description")}
        image={officeImg}
      />

      {/* Featured Article Card */}
      {feature && (
        <section className="py-16 sm:py-24 bg-white dark:bg-card">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
            <ScrollReveal animation="fade-up" className="mb-8 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em]">
                {t("news.featuredLabel")}
              </span>
              <span className="font-mono text-xs text-corporate-gray">{feature.date}</span>
            </ScrollReveal>
            <ScrollReveal animation="zoom-in" duration={700}>
              <button onClick={() => openArticle(feature.slug)} className="w-full text-left cursor-pointer">
                <article className="group rounded-[28px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-8 hover:border-primary/40 hover:shadow-[0_24px_50px_-16px_rgba(9,42,125,0.2)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-7 overflow-hidden rounded-[22px]">
                    <MediaImage
                      src={feature.img}
                      alt={feature.title}
                      className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                      {feature.cat} &middot; {feature.read}
                    </span>
                    <h2 className="text-[24px] sm:text-[32px] lg:text-[38px] font-semibold leading-[1.15] tracking-[-0.025em] mb-4 text-balance group-hover:text-primary transition-colors">
                      {feature.title}
                    </h2>
                    <p className="text-corporate-gray leading-relaxed text-sm sm:text-base mb-6">
                      {feature.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-[0.18em] group-hover:bg-brand-deep transition-all">
                      <span>{t("news.readMore")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              </button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Articles Grid — Header + SubNavbar matching Screenshot */}
      <section id="news-grid" className="py-16 sm:py-24 bg-surface scroll-mt-32">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("home.news.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("news.allPrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("news.allHighlight")}
                </span>
              </h2>
            </div>

            <SubNavbar
              activeId={cat}
              onSelect={(c) => setCat(c)}
              items={categoryNavItems}
            />
          </ScrollReveal>

          {filtered.length === 0 ? (
            <div className="text-center py-24 rounded-[24px] border border-dashed border-black/10">
              <p className="text-corporate-gray">{t("news.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((a, idx) => (
                <ScrollReveal key={a.slug} animation="fade-up" delay={idx * 80}>
                  <article
                    onClick={() => openArticle(a.slug)}
                    className="group cursor-pointer relative bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] rounded-[24px] p-5 sm:p-6 shadow-[0_6px_24px_-12px_rgba(9,42,125,0.08)] hover:shadow-[0_22px_44px_-14px_rgba(9,42,125,0.22)] hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Protruding Left-Edge Vertical Brand Tab */}
                    <span
                      className={`absolute -left-[2px] top-6 h-8 w-[4px] rounded-r-full transition-all duration-300 group-hover:h-14 ${
                        idx % 2 === 0 ? "bg-primary" : "bg-accent"
                      }`}
                    />

                    <div>
                      <div className="overflow-hidden mb-5 rounded-[18px] aspect-[16/10]">
                        <MediaImage
                          src={a.img}
                          alt={a.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary text-[10px] font-bold uppercase tracking-wider">
                          {a.cat}
                        </span>
                        <span className="font-mono text-xs text-corporate-gray">{a.date}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-balance leading-snug group-hover:text-primary transition-colors mb-2">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed line-clamp-2">
                          {a.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {t("news.readMore")}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 bg-white dark:bg-card">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="zoom-in">
            <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-primary via-brand-deep to-brand-ink text-white p-7 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
              <div className="lg:col-span-7">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                  {t("news.newsletter.eyebrow")}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] text-balance">
                  {t("news.newsletter.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-blue-200">
                    {t("news.newsletter.titleHighlight")}
                  </span>
                </h2>
              </div>
              <form
                className="lg:col-span-5 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder={t("news.newsletter.placeholder")}
                  className="flex-1 rounded-full bg-white/15 border border-white/25 px-5 py-3.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white"
                />
                <button className="px-7 py-3.5 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-[0.18em] hover:bg-accent hover:text-white transition-all cursor-pointer">
                  {t("news.newsletter.button")}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <NewsDetailModal
        article={selectedArticle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        related={related}
        onSelectRelated={(slug) => setSelectedSlug(slug)}
      />
    </>
  );
}
