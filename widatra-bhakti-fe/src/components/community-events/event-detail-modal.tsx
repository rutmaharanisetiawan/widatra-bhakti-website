import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, CalendarDays, MapPin, Tag, User2, Paperclip, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";
import { formatContent } from "@/lib/format-content";
import type { StoredCommunityEvent } from "@/lib/community-events-store";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function EventDetailModal({
  event,
  open,
  onOpenChange,
}: {
  event: StoredCommunityEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();

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
          {event && (
            <>
              <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-hairline shrink-0">
                <div className="min-w-0">
                  <DialogPrimitive.Title className="text-lg font-semibold font-display truncate">{event.title}</DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-xs text-corporate-gray font-mono">{event.id}</DialogPrimitive.Description>
                </div>
                <DialogPrimitive.Close className="w-9 h-9 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors shrink-0">
                  <X className="w-4 h-4" />
                  <span className="sr-only">{t("dashboard.events.form.close")}</span>
                </DialogPrimitive.Close>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="aspect-[21/9] w-full bg-brand-soft">
                  <MediaImage src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                </div>

                <div className="px-6 sm:px-8 py-6 space-y-6">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-corporate-gray">
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {event.eventDate}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {event.community} &middot; {event.category}</span>
                    <span className="flex items-center gap-1.5"><User2 className="w-3.5 h-3.5" /> {event.contactPerson}</span>
                  </div>

                  <p className="text-corporate-black dark:text-foreground font-medium">{event.summary}</p>

                  <div>{formatContent(event.description)}</div>

                  {event.gallery.length > 0 && (
                    <div>
                      <div className="eyebrow text-primary mb-2">{t("dashboard.events.detail.gallery")}</div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {event.gallery.map((ref, i) => (
                          <div key={`${ref}-${i}`} className="aspect-square rounded overflow-hidden bg-brand-soft">
                            <MediaImage src={ref} alt="Gallery" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.documents.length > 0 && (
                    <div>
                      <div className="eyebrow text-primary mb-2">{t("dashboard.events.detail.documents")}</div>
                      <div className="space-y-1.5">
                        {event.documents.map((doc, i) => (
                          <a key={`${doc.name}-${i}`} href={doc.dataUrl} download={doc.name} className="flex items-center gap-2 text-[13px] text-primary hover:underline">
                            <Paperclip className="w-3.5 h-3.5" /> {doc.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="px-2.5 h-6 inline-flex items-center rounded-full bg-brand-soft text-[11px] text-corporate-gray">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div>
                    <div className="eyebrow text-primary mb-3">{t("dashboard.events.detail.statusTimeline")}</div>
                    <ol className="space-y-3">
                      {event.statusHistory.map((h, i) => (
                        <li key={i} className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          <div className="text-[13px]">
                            <div className="font-semibold">{t(`dashboard.events.statusLabels.${h.status}`)}</div>
                            <div className="text-corporate-gray">{formatDate(h.date)}</div>
                            {h.note && <div className="mt-1 text-corporate-black dark:text-foreground bg-brand-soft rounded px-3 py-2">{h.note}</div>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
