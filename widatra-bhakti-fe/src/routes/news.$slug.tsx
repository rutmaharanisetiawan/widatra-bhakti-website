import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatContent } from "@/lib/format-content";
import { fetchArticle, fetchRelatedArticles } from "@/lib/news-store";
import { MediaImage } from "@/components/media/media-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const article = await fetchArticle(params.slug);
    if (!article) throw notFound();
    const related = await fetchRelatedArticles(params.slug);
    return { article, related };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    return {
      meta: [
        { title: `${a?.title ?? "Article"} — PT Widatra Bhakti` },
        { name: "description", content: a?.excerpt ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <p className="text-corporate-gray">Article not found.</p>
      <Link to="/news" className="text-primary underline mt-4 inline-block">Back to News</Link>
    </div>
  ),
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { article, related } = Route.useLoaderData();

  return (
    <>
      {/* Hero / Banner */}
      <section className="relative min-h-[55vh] -mt-20 flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MediaImage
            src={article.img}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-corporate-black via-corporate-black/60 to-corporate-black/20" />
        </div>
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-10 pb-16 pt-40">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                {article.cat}
              </span>
              {article.read && (
                <span className="text-white/60 text-[11px] font-mono">{article.read}</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.0] text-balance">
              {article.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Publication info bar */}
      <section className="bg-white dark:bg-card border-b border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-corporate-gray">
            <span className="font-mono">{article.date}</span>
            {article.author && (
              <>
                <span className="w-px h-4 bg-black/15 dark:bg-white/15" />
                <span>
                  <span className="font-semibold text-corporate-black dark:text-foreground">{article.author}</span>
                  {article.authorRole && ` — ${article.authorRole}`}
                </span>
              </>
            )}
          </div>
          <Link
            to="/news"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-corporate-gray hover:text-primary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to News
          </Link>
        </div>
      </section>

      {/* Article body */}
      <section className="py-16 sm:py-20 bg-white dark:bg-card">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            {/* Main content */}
            <ScrollReveal animation="fade-right" className="col-span-1 lg:col-span-7 xl:col-span-8">
              {/* Excerpt / lead */}
              <p className="text-xl lg:text-2xl font-light text-corporate-black dark:text-foreground leading-relaxed border-l-4 border-primary pl-6 mb-12">
                {article.excerpt}
              </p>

              {/* Body */}
              <div className="space-y-6">
                {formatContent(article.content)}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-black/[0.07] dark:border-white/[0.07]">
                  <span className="eyebrow text-corporate-gray mb-4 block">Topics</span>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 border border-black/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-gray rounded-full hover:border-primary hover:text-primary transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </ScrollReveal>

            {/* Sidebar */}
            <ScrollReveal animation="fade-left" className="col-span-12 lg:col-span-5 xl:col-span-4">
              <div className="sticky top-28 space-y-8">
                {/* Article meta card */}
                <div className="bg-surface border border-black/[0.06] dark:border-white/[0.06] p-8 rounded-xl">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-corporate-gray mb-6">About This Article</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-corporate-gray">Published</dt>
                      <dd className="font-medium font-mono text-right">{article.date}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-corporate-gray">Category</dt>
                      <dd className="font-medium text-primary">{article.cat}</dd>
                    </div>
                    {article.read && (
                      <div className="flex justify-between">
                        <dt className="text-corporate-gray">Read time</dt>
                        <dd className="font-medium">{article.read}</dd>
                      </div>
                    )}
                    {article.author && (
                      <div className="flex justify-between">
                        <dt className="text-corporate-gray">Author</dt>
                        <dd className="font-medium text-right">{article.author}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Share */}
                <div className="bg-surface border border-black/[0.06] dark:border-white/[0.06] p-8 rounded-xl">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-corporate-gray mb-5">Share</h3>
                  <div className="flex gap-3">
                    {["LinkedIn", "X (Twitter)", "Email"].map((s) => (
                      <button
                        key={s}
                        className="flex-1 h-10 border border-black/10 text-[10px] font-bold uppercase tracking-wider text-corporate-gray hover:border-primary hover:text-primary transition-colors rounded"
                      >
                        {s === "X (Twitter)" ? "X" : s === "Email" ? "Mail" : s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {article.gallery && article.gallery.length > 1 && (
        <section className="py-20 bg-surface border-t border-black/5">
          <ScrollReveal animation="fade-up" className="max-w-[1600px] mx-auto px-6 lg:px-10">
            <span className="eyebrow text-primary mb-8 block">Gallery</span>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {article.gallery.map((img, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-md ${
                    i === 0
                      ? "col-span-1 md:col-span-12 lg:col-span-7"
                      : "col-span-1 md:col-span-6 lg:col-span-5"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-20 bg-white dark:bg-card border-t border-black/5">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
            <ScrollReveal animation="fade-up" className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-light tracking-tight">
                Related <span className="font-serif-italic">dispatches.</span>
              </h2>
              <Link
                to="/news"
                className="text-[11px] font-bold uppercase tracking-widest border-b border-corporate-black dark:border-white/30 pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                All News →
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((a, idx) => (
                <ScrollReveal key={a.slug} animation="fade-up" delay={idx * 100}>
                  <Link
                    to="/news/$slug"
                    params={{ slug: a.slug }}
                    className="group cursor-pointer block"
                  >
                    <div className="overflow-hidden mb-5 rounded-md">
                      <MediaImage
                        src={a.img}
                        alt={a.title}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <span className="eyebrow text-primary mb-3 block">{a.cat} · {a.date}</span>
                    <h3 className="text-xl font-light leading-snug group-hover:text-primary transition-colors">
                      {a.title}
                    </h3>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back nav */}
      <section className="py-12 bg-surface border-t border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-corporate-gray hover:text-primary transition-colors group"
          >
            <span className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Back to all news
          </Link>
        </div>
      </section>
    </>
  );
}
