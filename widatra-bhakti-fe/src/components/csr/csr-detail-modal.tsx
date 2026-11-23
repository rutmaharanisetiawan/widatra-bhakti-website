import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, MapPin, Calendar } from "lucide-react";
import type { CsrProgram } from "@/lib/csr-data";
import { formatContent } from "@/lib/format-content";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";

export function CsrDetailModal({
  program,
  open,
  onOpenChange,
}: {
  program: CsrProgram | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
          {program ? <ModalBody program={program} /> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function ModalBody({ program }: { program: CsrProgram }) {
  const { t } = useLanguage();
  return (
    <>
      <DialogPrimitive.Close className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-surface-2/95 shadow-md border border-black/[0.06] dark:border-white/[0.06] grid place-items-center text-corporate-black dark:text-foreground hover:bg-corporate-black hover:text-white dark:hover:bg-brand-deep dark:hover:text-white transition-colors">
        <X className="w-4 h-4" />
        <span className="sr-only">{t("csr.modal.close")}</span>
      </DialogPrimitive.Close>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Hero image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <MediaImage src={program.img} alt={program.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/80 via-corporate-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <span className="inline-block px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              {program.pillar}
            </span>
            <DialogPrimitive.Title asChild>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white leading-[1.05] text-balance pr-8">
                {program.title}
              </h2>
            </DialogPrimitive.Title>
          </div>
        </div>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-6 px-6 sm:px-10 py-5 border-b border-black/[0.06] dark:border-white/[0.06] bg-surface text-sm text-corporate-gray">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> {program.location}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> {program.date}
          </span>
          {program.impact && (
            <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.15em]">
              {program.impact}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-6 sm:p-10">
          <DialogPrimitive.Description asChild>
            <p className="text-lg sm:text-xl font-light text-corporate-black dark:text-foreground leading-relaxed border-l-4 border-accent pl-6 mb-10">
              {program.excerpt}
            </p>
          </DialogPrimitive.Description>

          <div className="space-y-6">{formatContent(program.content)}</div>
        </div>

        {/* Gallery */}
        {program.gallery && program.gallery.length > 0 && (
          <div className="bg-surface p-6 sm:p-10 border-t border-black/5">
            <span className="eyebrow text-primary mb-5 block">{t("csr.modal.gallery")}</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {program.gallery.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-md">
                  <MediaImage
                    src={img}
                    alt={`${program.title} gallery ${i + 1}`}
                    className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
