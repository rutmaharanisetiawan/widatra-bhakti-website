import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Article } from "@/lib/news-data";
import { formatContent } from "@/lib/format-content";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";

export function NewsDetailModal({
  article,
  open,
  onOpenChange,
  related = [],
  onSelectRelated,
}: {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  related?: Article[];
  onSelectRelated?: (slug: string) => void;
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
            lg:w-full lg:max-w-4xl lg:h-[88vh] lg:max-h-[820px]
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4
            duration-300 ease-out focus:outline-none"
        >
          {article ? (
            <ModalBody article={article} related={related} onSelectRelated={onSelectRelated} />
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function ModalBody({
  article,
  related,
  onSelectRelated,
}: {
  article: Article;
  related: Article[];
  onSelectRelated?: (slug: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <>
      <DialogPrimitive.Close className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-surface-2/95 shadow-md border border-black/[0.06] dark:border-white/[0.06] grid place-items-center text-corporate-black dark:text-foreground hover:bg-corporate-black hover:text-white dark:hover:bg-brand-deep dark:hover:text-white transition-colors">
        <X className="w-4 h-4" />
        <span className="sr-only">{t("news.modal.close")}</span>
      </DialogPrimitive.Close>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Hero image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <MediaImage src={article.img} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/80 via-corporate-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                {article.cat}
              </span>
              {article.read && (
                <span className="text-white/70 text-[11px] font-mono">{article.read}</span>
              )}
            </div>
            <DialogPrimitive.Title asChild>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white leading-[1.05] text-balance pr-8">
                {article.title}
              </h2>
            </DialogPrimitive.Title>
          </div>
        </div>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 sm:px-10 py-5 border-b border-black/[0.06] dark:border-white/[0.06] bg-surface">
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
        </div>

        {/* Body */}
        <div className="p-6 sm:p-10">
          <DialogPrimitive.Description asChild>
            <p className="text-lg sm:text-xl font-light text-corporate-black dark:text-foreground leading-relaxed border-l-4 border-primary pl-6 mb-10">
              {article.excerpt}
            </p>
          </DialogPrimitive.Description>

          <div className="space-y-6">{formatContent(article.content)}</div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-black/[0.07] dark:border-white/[0.07]">
              <span className="eyebrow text-corporate-gray mb-4 block">{t("news.modal.topics")}</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 border border-black/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-gray rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery */}
        {article.gallery && article.gallery.length > 1 && (
          <div className="bg-surface p-6 sm:p-10 border-t border-black/5">
            <span className="eyebrow text-primary mb-5 block">{t("news.modal.gallery")}</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {article.gallery.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-md">
                  <MediaImage
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related news */}
        {related.length > 0 && (
          <div className="bg-white dark:bg-card p-6 sm:p-10 border-t border-black/5">
            <span className="eyebrow text-primary mb-5 block">{t("news.modal.relatedNews")}</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/5 dark:bg-white/5">
              {related.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => onSelectRelated?.(r.slug)}
                  className="bg-white dark:bg-card p-5 text-left hover:bg-surface transition-colors group"
                >
                  <div className="overflow-hidden mb-4 rounded-md">
                    <MediaImage
                      src={r.img}
                      alt={r.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="eyebrow text-primary block mb-1">{r.cat} · {r.date}</span>
                  <h4 className="text-base font-light leading-snug group-hover:text-primary transition-colors">
                    {r.title}
                  </h4>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
