import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import darkFactoryImg from "@/assets/dark-factory.jpg";
import aerialImg from "@/assets/factory-aerial.jpg";
import productionImg from "@/assets/production-line.jpg";
import scientistImg from "@/assets/scientist.jpg";
import officeImg from "@/assets/office-building.jpg";
import teamImg from "@/assets/team.jpg";
import { addBooking, lookupBooking, type StoredTourBooking } from "@/lib/tour-store";
import { BookingConfirmationModal } from "@/components/factory-tour/booking-confirmation-modal";
import { BookingStatusModal } from "@/components/factory-tour/booking-status-modal";
import { StatusPill } from "@/components/admin-shell";
import { Search, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useFactoryTourContent } from "@/hooks/use-factory-tour-content";
import { resolveMediaUrl } from "@/lib/media-store";
import { MediaImage } from "@/components/media/media-image";
import { PageHero } from "@/components/page-hero";
import { SubNavbar } from "@/components/sub-navbar";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/factory-tour")({
  head: () => ({
    meta: [
      { title: "Factory Tour — PT Widatra Bhakti" },
      { name: "description", content: "Book a guided visit to our Pandaan sterile manufacturing campus. Interactive calendar, visitor journey, safety briefing, and virtual factory preview." },
      { property: "og:title", content: "Factory Tour — PT Widatra Bhakti" },
    ],
  }),
  component: FactoryTourPage,
});

const WHY_VISIT_ITEMS = [0, 1, 2, 3] as const;
const JOURNEY_ITEMS = [0, 1, 2, 3, 4, 5] as const;
const SCHEDULE_ITEMS = [0, 1, 2, 3, 4] as const;
const TESTIMONIAL_ITEMS = [0, 1, 2] as const;
const FAQ_ITEMS = [0, 1, 2, 3] as const;

function tourStatusLabel(t: (k: string) => string, status: string) {
  const map: Record<string, string> = {
    Pending: t("factoryTour.statusLabels.pending"),
    Reviewed: t("factoryTour.statusLabels.reviewed"),
    Approved: t("factoryTour.statusLabels.approved"),
    Completed: t("factoryTour.statusLabels.completed"),
    Rejected: t("factoryTour.statusLabels.rejected"),
  };
  return map[status] ?? status;
}

function FactoryTourPage() {
  const { t } = useLanguage();
  const { content } = useFactoryTourContent();
  const [activeJourneyIdx, setActiveJourneyIdx] = useState<number>(0);
  const [activeReqTab, setActiveReqTab] = useState<number>(0);
  const heroSrc = resolveMediaUrl(content.heroImage) || darkFactoryImg;
  const gallery =
    content.gallery.length >= 6
      ? content.gallery
      : [aerialImg, productionImg, scientistImg, officeImg, teamImg, darkFactoryImg];

  const tourNavItems = [
    { id: "tour-intro", label: t("factoryTour.intro.eyebrow"), href: "#tour-intro" },
    { id: "tour-why", label: t("factoryTour.whyVisit.eyebrow"), href: "#tour-why" },
    { id: "tour-journey", label: t("factoryTour.visitorJourney.eyebrow"), href: "#tour-journey" },
    { id: "tour-booking", label: t("home.facilities.cta"), href: "#tour-booking" },
    { id: "tour-faq", label: t("factoryTour.visitorGuide.faqLabel"), href: "#tour-faq" },
  ];

  return (
    <>
      {/* HERO */}
      <PageHero
        variant="factory-tour"
        eyebrow={t("factoryTour.hero.eyebrow")}
        title={t("factoryTour.hero.titlePrefix")}
        italic={t("factoryTour.hero.titleHighlight")}
        description={t("factoryTour.hero.description")}
        image={heroSrc}
      />

      {/* INTRO */}
      <section id="tour-intro" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("factoryTour.intro.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
              {t("factoryTour.intro.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("factoryTour.intro.titleHighlight")}
              </span>
            </h2>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base mb-4">
              {t("factoryTour.intro.p1")}
            </p>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
              {t("factoryTour.intro.p2")}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="lg:col-span-7 grid grid-cols-3 gap-3.5 sm:gap-4">
            <div className="col-span-2 row-span-2 rounded-[24px] overflow-hidden shadow-md group">
              <MediaImage
                src={gallery[0]}
                alt=""
                className="w-full h-full object-cover aspect-square transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="rounded-[20px] overflow-hidden shadow-md group aspect-square">
              <MediaImage
                src={gallery[1]}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="rounded-[20px] overflow-hidden shadow-md group aspect-square">
              <MediaImage
                src={gallery[2]}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHY VISIT — 2-Col Mobile / 4-Col Desktop Rounded Cards */}
      <section id="tour-why" className="py-16 sm:py-24 bg-surface scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("factoryTour.whyVisit.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("factoryTour.whyVisit.title")}
              </h2>
            </div>
            <SubNavbar scrollSpy items={tourNavItems.slice(0, 3)} />
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch">
            {WHY_VISIT_ITEMS.map((i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80} className="h-full">
                <div
                  className="group relative rounded-[20px] sm:rounded-[22px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-sm hover:border-primary/40 hover:shadow-[0_18px_36px_-12px_rgba(9,42,125,0.18)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <span
                    className={`absolute -left-[2px] top-5 h-7 w-[4px] rounded-r-full transition-all group-hover:h-11 ${
                      i % 2 === 0 ? "bg-primary" : "bg-accent"
                    }`}
                  />
                  <div className="flex flex-col flex-1">
                    <div className="text-xs font-mono font-bold text-primary mb-3 shrink-0">0{i + 1}</div>
                    <h4 className="text-sm sm:text-lg font-semibold mb-2 group-hover:text-primary transition-colors min-h-[2.75rem] line-clamp-2">
                      {t(`factoryTour.whyVisit.items.${i}.title`)}
                    </h4>
                    <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed line-clamp-3">
                      {t(`factoryTour.whyVisit.items.${i}.desc`)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* VISITOR JOURNEY — Header + SubNavbar matching Screenshot */}
      <section id="tour-journey" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("factoryTour.visitorJourney.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("factoryTour.visitorJourney.title")}
              </h2>
            </div>

            <SubNavbar
              activeId={activeJourneyIdx}
              onSelect={(idx) => setActiveJourneyIdx(idx)}
              items={JOURNEY_ITEMS.map((i) => ({
                id: i,
                label: t(`factoryTour.visitorJourney.items.${i}.time`),
              }))}
            />
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 items-stretch">
            {JOURNEY_ITEMS.map((i) => {
              const isSelected = activeJourneyIdx === i;
              return (
                <ScrollReveal key={i} animation="fade-up" delay={i * 70} className="h-full">
                  <div
                    onClick={() => setActiveJourneyIdx(i)}
                    className={`cursor-pointer rounded-[20px] p-5 transition-all duration-300 border-2 h-full flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-br from-primary to-brand-deep text-white border-primary shadow-xl -translate-y-1"
                        : "bg-surface border-black/[0.05] dark:border-white/[0.07] hover:border-primary/40"
                    }`}
                  >
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold mb-3 ${
                          isSelected ? "bg-white/20 text-white" : "bg-brand-tint text-primary"
                        }`}
                      >
                        {t(`factoryTour.visitorJourney.items.${i}.time`)}
                      </span>
                      <h4
                        className={`text-sm sm:text-base font-semibold mb-1.5 min-h-[2.5rem] line-clamp-2 ${
                          isSelected ? "text-white" : ""
                        }`}
                      >
                        {t(`factoryTour.visitorJourney.items.${i}.title`)}
                      </h4>
                      <p
                        className={`text-xs leading-relaxed line-clamp-3 ${
                          isSelected ? "text-white/85" : "text-corporate-gray"
                        }`}
                      >
                        {t(`factoryTour.visitorJourney.items.${i}.desc`)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCHEDULE & GALLERY */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("factoryTour.schedule.eyebrow")}
            </span>
            <h3 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-6">
              {t("factoryTour.schedule.title")}
            </h3>
            <div className="space-y-3">
              {SCHEDULE_ITEMS.map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <span className="font-bold uppercase tracking-wider text-primary text-[11px]">
                    {t(`factoryTour.schedule.items.${i}.k`)}
                  </span>
                  <span className="font-medium text-right">
                    {t(`factoryTour.schedule.items.${i}.v`)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("factoryTour.schedule.galleryLabel")}
            </span>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((src, i) => (
                <div
                  key={i}
                  className="rounded-[18px] overflow-hidden aspect-square group shadow-sm"
                >
                  <MediaImage
                    src={src}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* VIRTUAL PREVIEW */}
      <section className="py-16 sm:py-24 bg-corporate-black text-white">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("factoryTour.virtualPreview.eyebrow")}
            </span>
            <h3 className="text-[28px] sm:text-[36px] lg:text-[42px] font-semibold leading-[1.12] mb-5">
              {t("factoryTour.virtualPreview.title")}
            </h3>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8">
              {t("factoryTour.virtualPreview.description")}
            </p>
            <button className="px-8 py-4 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all cursor-pointer">
              {t("factoryTour.virtualPreview.playButton")}
            </button>
          </ScrollReveal>
          <ScrollReveal animation="zoom-in" duration={700} className="lg:col-span-7 aspect-video rounded-[28px] bg-white/5 border-2 border-white/15 flex items-center justify-center relative overflow-hidden group shadow-2xl">
            <MediaImage
              src={heroSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative z-10 w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-current ml-1" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SAFETY / DRESS / RULES — Header + SubNavbar matching Screenshot */}
      <section className="py-16 sm:py-24 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("factoryTour.requirements.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("factoryTour.requirements.title")}
              </h2>
            </div>

            <SubNavbar
              activeId={activeReqTab}
              onSelect={(idx) => setActiveReqTab(idx)}
              items={[
                { id: 0, label: t("factoryTour.requirements.safety.title") },
                { id: 1, label: t("factoryTour.requirements.dressCode.title") },
                { id: 2, label: t("factoryTour.requirements.regulations.title") },
              ]}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            <ScrollReveal animation="fade-up" delay={0} className="h-full">
              <ListCard
                active={activeReqTab === 0}
                onClick={() => setActiveReqTab(0)}
                title={t("factoryTour.requirements.safety.title")}
                items={[0, 1, 2, 3, 4].map((i) => t(`factoryTour.requirements.safety.items.${i}`))}
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100} className="h-full">
              <ListCard
                active={activeReqTab === 1}
                onClick={() => setActiveReqTab(1)}
                title={t("factoryTour.requirements.dressCode.title")}
                items={[0, 1, 2, 3].map((i) => t(`factoryTour.requirements.dressCode.items.${i}`))}
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200} className="h-full">
              <ListCard
                active={activeReqTab === 2}
                onClick={() => setActiveReqTab(2)}
                title={t("factoryTour.requirements.regulations.title")}
                items={[0, 1, 2, 3].map((i) => t(`factoryTour.requirements.regulations.items.${i}`))}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MEETING POINT */}
      <section className="py-16 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <ScrollReveal animation="fade-right" className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
              {t("factoryTour.meetingPoint.eyebrow")}
            </span>
            <h3 className="text-2xl lg:text-3xl font-semibold">
              {t("factoryTour.meetingPoint.title")}
            </h3>
            <p className="text-corporate-gray mt-3 text-sm sm:text-base">
              {t("factoryTour.meetingPoint.description")}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="lg:col-span-5 rounded-[24px] overflow-hidden shadow-md border border-black/10">
            <iframe
              title="Plant location"
              className="w-full aspect-video"
              loading="lazy"
              src="https://maps.google.com/maps?q=Jl.+Stadion+No.+1+Pandaan+Pasuruan&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* BOOKING FLOW */}
      <ScrollReveal animation="fade-up" id="tour-booking" className="scroll-mt-32">
        <BookingFlow />
      </ScrollReveal>

      {/* CHECK BOOKING STATUS */}
      <ScrollReveal animation="fade-up">
        <CheckBookingStatus />
      </ScrollReveal>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("factoryTour.testimonials.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("factoryTour.testimonials.title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {TESTIMONIAL_ITEMS.map((i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 90} className="h-full">
                <article
                  className="group relative rounded-[24px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  <span className="absolute -left-[2px] top-6 h-8 w-[4px] rounded-r-full bg-primary group-hover:h-12 transition-all" />
                  <p className="text-base sm:text-lg font-serif-italic text-primary leading-relaxed mb-6 min-h-[4.5rem] line-clamp-4">
                    "{t(`factoryTour.testimonials.items.${i}.quote`)}"
                  </p>
                  <div className="pt-4 border-t border-black/[0.05] dark:border-white/[0.06]">
                    <div className="text-sm font-semibold">
                      {t(`factoryTour.testimonials.items.${i}.name`)}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray mt-1">
                      {t(`factoryTour.testimonials.items.${i}.role`)}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD + FAQ */}
      <section id="tour-faq" className="py-16 sm:py-24 bg-surface scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("factoryTour.visitorGuide.eyebrow")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
              {t("factoryTour.visitorGuide.title")}
            </h3>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base mb-6">
              {t("factoryTour.visitorGuide.description")}
            </p>
            <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:bg-brand-deep transition-all cursor-pointer">
              {t("factoryTour.visitorGuide.button")}
            </button>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("factoryTour.visitorGuide.faqLabel")}
            </span>
            <div className="space-y-3">
              {FAQ_ITEMS.map((i) => (
                <details
                  key={i}
                  className="group rounded-[20px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] px-5 py-4 open:border-primary/40 transition-all"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <span className="text-sm sm:text-base font-semibold">
                      {t(`factoryTour.visitorGuide.faq.${i}.q`)}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center font-mono font-bold flex-shrink-0 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-corporate-gray leading-relaxed">
                    {t(`factoryTour.visitorGuide.faq.${i}.a`)}
                  </p>
                </details>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function ListCard({
  title,
  items,
  active,
  onClick,
}: {
  title: string;
  items: string[];
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-[24px] p-6 sm:p-7 transition-all duration-300 border-2 ${
        active
          ? "bg-white dark:bg-card border-primary shadow-[0_20px_44px_-14px_rgba(14,49,146,0.22)] -translate-y-1.5"
          : "bg-surface border-black/[0.06] dark:border-white/[0.08] hover:border-primary/40 hover:-translate-y-1"
      }`}
    >
      <span className="inline-block px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-primary mb-5">
        {title}
      </span>
      <ul className="space-y-3">
        {items.map((i) => (
          <li
            key={i}
            className="text-xs sm:text-sm text-corporate-black dark:text-foreground flex gap-3 leading-relaxed"
          >
            <span className="text-accent font-bold flex-shrink-0">•</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────── Booking Flow ───────────────────── */

const TIME_SLOTS = [
  { time: "09:00 – 10:30", quota: 25 },
  { time: "13:30 – 15:00", quota: 18 },
];

function BookingFlow() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, ready } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<typeof TIME_SLOTS[number] | null>(null);
  const [visitor, setVisitor] = useState({
    name: user?.name ?? "",
    organization: "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    pax: "1",
    purpose: "",
  });
  const [submittedBooking, setSubmittedBooking] = useState<StoredTourBooking | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const days = useMemo(() => buildCalendar(new Date()), []);
  const dateLocale = language === "id" ? "id-ID" : "en";

  const STEP_LABELS = [
    t("factoryTour.booking.steps.0"),
    t("factoryTour.booking.steps.1"),
    t("factoryTour.booking.steps.2"),
    t("factoryTour.booking.steps.3"),
    t("factoryTour.booking.steps.4"),
    t("factoryTour.booking.steps.5"),
  ];

  function resetFlow() {
    setStep(1);
    setDate(null);
    setSlot(null);
    setVisitor({ name: "", organization: "", email: "", phone: "", pax: "1", purpose: "" });
    setSubmittedBooking(null);
  }

  async function handleSubmitBooking() {
    if (!date || !slot) return;
    const record = await addBooking({
      tourDate: date.toISOString().slice(0, 10),
      timeSlot: slot.time,
      visitorName: visitor.name,
      organization: visitor.organization,
      email: visitor.email,
      phone: visitor.phone,
      pax: Math.max(1, parseInt(visitor.pax, 10) || 1),
      purpose: visitor.purpose,
    });
    setSubmittedBooking(record);
    setStep(6);
    setShowConfirmModal(true);
  }

  if (ready && !isAuthenticated) {
    const redirectPath = "/factory-tour#book";
    return (
      <section id="book" className="py-24 bg-gradient-to-br from-primary via-brand-deep to-[#05174A] text-primary-foreground">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow opacity-70 mb-4 block">{t("factoryTour.booking.eyebrow")}</span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("factoryTour.booking.titlePrefix")} <span className="font-serif-italic opacity-80">{t("factoryTour.booking.titleHighlight")}</span>
            </h2>
          </div>
          <div className="bg-white dark:bg-card text-corporate-black dark:text-foreground rounded-2xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
            <div className="p-10 lg:p-16 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-brand-tint text-primary grid place-items-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-light mb-3">{t("factoryTour.booking.signInRequired.title")}</h3>
              <p className="text-corporate-gray mb-8">
                {t("factoryTour.booking.signInRequired.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`/auth/login?redirect=${encodeURIComponent(redirectPath)}`}
                  className="h-11 px-8 inline-flex items-center justify-center bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors rounded"
                >
                  {t("factoryTour.booking.signInRequired.signIn")}
                </a>
                <a
                  href={`/auth/register?redirect=${encodeURIComponent(redirectPath)}`}
                  className="h-11 px-8 inline-flex items-center justify-center border border-black/15 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors rounded"
                >
                  {t("factoryTour.booking.signInRequired.createAccount")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (ready && isAuthenticated && user?.accountType === "internal") {
    const redirectPath = "/factory-tour#book";
    return (
      <section id="book" className="py-24 bg-gradient-to-br from-primary via-brand-deep to-[#05174A] text-primary-foreground">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow opacity-70 mb-4 block">{t("factoryTour.booking.eyebrow")}</span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("factoryTour.booking.titlePrefix")} <span className="font-serif-italic opacity-80">{t("factoryTour.booking.titleHighlight")}</span>
            </h2>
          </div>
          <div className="bg-white dark:bg-card text-corporate-black dark:text-foreground rounded-2xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
            <div className="p-10 lg:p-16 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-brand-tint text-primary grid place-items-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-light mb-3">{t("factoryTour.booking.roleBlocked.title")}</h3>
              <p className="text-corporate-gray mb-8">{t("factoryTour.booking.roleBlocked.description")}</p>
              <a
                href="/applicant"
                className="h-11 px-8 inline-flex items-center justify-center bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors rounded"
              >
                {t("factoryTour.booking.roleBlocked.backToDashboard")}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="py-24 bg-gradient-to-br from-primary via-brand-deep to-[#05174A] text-primary-foreground">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <span className="eyebrow opacity-70 mb-4 block">{t("factoryTour.booking.eyebrow")}</span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
            {t("factoryTour.booking.titlePrefix")} <span className="font-serif-italic opacity-80">{t("factoryTour.booking.titleHighlight")}</span>
          </h2>
        </div>

        {/* Stepper — elegant pill rail */}
        <ol className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const current = step === n;
            return (
              <li key={label} className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex items-center gap-2 px-3 h-9 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${done ? "bg-white/15 text-white" : current ? "bg-white dark:bg-card text-primary shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)]" : "bg-white/[0.06] text-white/50"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${current ? "bg-primary text-white" : done ? "bg-white/25 text-white" : "bg-white/10 text-white/60"}`}>
                    {done ? "✓" : n}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 5 && <span className={`w-4 h-px ${done ? "bg-white/40" : "bg-white/15"}`} />}
              </li>
            );
          })}
        </ol>

        <div className="bg-white dark:bg-card text-corporate-black dark:text-foreground rounded-2xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
          <div className="p-8 lg:p-10 min-h-[420px]">
            {step === 1 && (
              <Step title={t("factoryTour.booking.step1.title")} hint={t("factoryTour.booking.step1.hint")}>
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-start">
                  <Calendar days={days} value={date} onChange={setDate} tueThuLabel={t("factoryTour.booking.step1.tueThu")} locale={dateLocale} />
                  <div className="rounded-lg bg-[#F7F8FB] border border-black/[0.06] dark:border-white/[0.06] p-5 flex flex-col justify-between min-h-[200px]">
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-corporate-gray mb-1.5">{t("factoryTour.booking.step1.selectedDateLabel")}</div>
                      <div className="text-base font-semibold text-corporate-black dark:text-foreground leading-snug">
                        {date ? date.toLocaleDateString(dateLocale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : <span className="text-corporate-gray/50 font-normal text-sm">{t("factoryTour.booking.step1.noDateSelected")}</span>}
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                      <p className="text-[11px] text-corporate-gray leading-relaxed">
                        {t("factoryTour.booking.step1.notice", { days: t("factoryTour.booking.step1.noticeDaysHighlight") })}
                      </p>
                    </div>
                  </div>
                </div>
                <Nav onNext={() => date && setStep(2)} nextDisabled={!date} backLabel={t("factoryTour.booking.nav.back")} nextLabel={t("factoryTour.booking.nav.continue")} />
              </Step>
            )}
            {step === 2 && (
              <Step title={t("factoryTour.booking.step2.title")} hint={date ? `${t("factoryTour.booking.step2.hintPrefix")} ${date.toLocaleDateString(dateLocale, { weekday: "long", month: "long", day: "numeric" })}.` : ""}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TIME_SLOTS.map((s) => (
                    <button key={s.time} onClick={() => setSlot(s)} className={`p-6 rounded-lg border text-left transition-all ${slot?.time === s.time ? "border-primary bg-primary/[0.05] shadow-[0_10px_28px_-14px_rgba(14,49,146,0.5)]" : "border-black/10 hover:border-primary/40 hover:-translate-y-0.5"}`}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-corporate-gray mb-2">{t("factoryTour.booking.step2.timeSlotLabel")}</div>
                      <div className="text-2xl font-semibold text-corporate-black dark:text-foreground">{s.time}</div>
                      <div className="text-xs text-corporate-gray mt-3">{t("factoryTour.booking.step2.spotsOpen", { quota: s.quota })}</div>
                    </button>
                  ))}
                </div>
                <Nav onPrev={() => setStep(1)} onNext={() => slot && setStep(3)} nextDisabled={!slot} backLabel={t("factoryTour.booking.nav.back")} nextLabel={t("factoryTour.booking.nav.continue")} />
              </Step>
            )}
            {step === 3 && slot && (
              <Step title={t("factoryTour.booking.step3.title")} hint={t("factoryTour.booking.step3.hint")}>
                <div className="p-8 rounded-lg bg-[#F7F8FB] border border-black/[0.06] dark:border-white/[0.06]">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-corporate-gray">{t("factoryTour.booking.step3.remainingQuota")}</div>
                      <div className="text-5xl font-semibold text-primary mt-2">{slot.quota} <span className="text-xl text-corporate-gray font-light">/ 25</span></div>
                    </div>
                    <span className="font-mono text-sm">{slot.time}</span>
                  </div>
                  <div className="h-2 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-brand-deep rounded-full transition-all" style={{ width: `${(slot.quota / 25) * 100}%` }} />
                  </div>
                  <p className="text-sm text-corporate-gray mt-6">{t("factoryTour.booking.step3.note")}</p>
                </div>
                <Nav onPrev={() => setStep(2)} onNext={() => setStep(4)} backLabel={t("factoryTour.booking.nav.back")} nextLabel={t("factoryTour.booking.nav.continue")} />
              </Step>
            )}
            {step === 4 && (
              <Step title={t("factoryTour.booking.step4.title")} hint={t("factoryTour.booking.step4.hint")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                  <BookField label={t("factoryTour.booking.step4.fields.fullName")} value={visitor.name} onChange={(v) => setVisitor({ ...visitor, name: v })} />
                  <BookField label={t("factoryTour.booking.step4.fields.organization")} value={visitor.organization} onChange={(v) => setVisitor({ ...visitor, organization: v })} />
                  <BookField label={t("factoryTour.booking.step4.fields.email")} type="email" value={visitor.email} onChange={(v) => setVisitor({ ...visitor, email: v })} />
                  <BookField label={t("factoryTour.booking.step4.fields.phone")} type="tel" value={visitor.phone} onChange={(v) => setVisitor({ ...visitor, phone: v })} />
                  <BookField label={t("factoryTour.booking.step4.fields.numberOfVisitors")} type="number" value={visitor.pax} onChange={(v) => setVisitor({ ...visitor, pax: v })} />
                  <BookField label={t("factoryTour.booking.step4.fields.purposeOfVisit")} value={visitor.purpose} onChange={(v) => setVisitor({ ...visitor, purpose: v })} />
                </div>
                <Nav onPrev={() => setStep(3)} onNext={() => setStep(5)} nextDisabled={!visitor.name || !visitor.email} backLabel={t("factoryTour.booking.nav.back")} nextLabel={t("factoryTour.booking.nav.continue")} />
              </Step>
            )}
            {step === 5 && (
              <Step title={t("factoryTour.booking.step5.title")} hint={t("factoryTour.booking.step5.hint")}>
                <dl className="divide-y divide-black/[0.06] dark:divide-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] rounded-lg overflow-hidden">
                  {[
                    [t("factoryTour.booking.step5.fields.date"), date?.toLocaleDateString(dateLocale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) ?? "—"],
                    [t("factoryTour.booking.step5.fields.timeSlot"), slot?.time ?? "—"],
                    [t("factoryTour.booking.step5.fields.visitor"), visitor.name],
                    [t("factoryTour.booking.step5.fields.organization"), visitor.organization || "—"],
                    [t("factoryTour.booking.step5.fields.email"), visitor.email],
                    [t("factoryTour.booking.step5.fields.phone"), visitor.phone || "—"],
                    [t("factoryTour.booking.step5.fields.numberOfVisitors"), visitor.pax],
                    [t("factoryTour.booking.step5.fields.purpose"), visitor.purpose || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-3 gap-3 px-5 py-3.5 bg-white dark:bg-card">
                      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray">{k}</dt>
                      <dd className="col-span-2 text-sm font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Nav onPrev={() => setStep(4)} onNext={handleSubmitBooking} nextLabel={t("factoryTour.booking.nav.submit")} backLabel={t("factoryTour.booking.nav.back")} />
              </Step>
            )}
            {step === 6 && submittedBooking && (
              <div className="text-center py-10">
                <div className="w-20 h-20 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl mb-6 shadow-[0_14px_32px_-8px_rgba(14,49,146,0.55)]">✓</div>
                <h3 className="text-3xl font-light mb-3">{t("factoryTour.booking.step6.title")}</h3>
                <p className="text-corporate-gray max-w-md mx-auto">
                  {t("factoryTour.booking.step6.referenceIs")} <span className="font-mono text-primary">{submittedBooking.id}</span>.{" "}
                  {t("factoryTour.booking.step6.confirmationSentTo")} <span className="font-medium">{submittedBooking.email}</span>.
                </p>
                <div className="mt-5 flex items-center justify-center gap-2">
                  <StatusPill status={submittedBooking.status} label={tourStatusLabel(t, submittedBooking.status)} />
                  <span className="text-[11px] text-corporate-gray">{t("factoryTour.booking.step6.hostReviewNote")}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-8 py-3 rounded border border-black/15 text-[11px] font-bold uppercase tracking-[0.25em] hover:border-primary hover:text-primary transition-colors"
                  >
                    {t("factoryTour.booking.step6.viewDetails")}
                  </button>
                  <button
                    onClick={resetFlow}
                    className="px-8 py-3 rounded bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors"
                  >
                    {t("factoryTour.booking.step6.bookAnother")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfirmModal && submittedBooking && (
        <BookingConfirmationModal
          booking={submittedBooking}
          onClose={() => setShowConfirmModal(false)}
          onViewStatus={() => {
            setShowConfirmModal(false);
            setShowStatusModal(true);
          }}
        />
      )}
      {showStatusModal && submittedBooking && (
        <BookingStatusModal booking={submittedBooking} onClose={() => setShowStatusModal(false)} />
      )}
    </section>
  );
}

/* ───────────────────── Check Booking Status ───────────────────── */

function CheckBookingStatus() {
  const { t } = useLanguage();
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StoredTourBooking | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const found = await lookupBooking(bookingId, email);
    if (!found) {
      setResult(null);
      setError(t("factoryTour.checkStatus.errorNotFound"));
      return;
    }
    setResult(found);
    setShowModal(true);
  }

  return (
    <section className="py-20 bg-white dark:bg-card">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-12 items-start">
        <div className="col-span-12 lg:col-span-5">
          <span className="eyebrow text-primary mb-4 block">{t("factoryTour.checkStatus.eyebrow")}</span>
          <h3 className="text-3xl lg:text-4xl font-light tracking-tight mb-4">{t("factoryTour.checkStatus.title")}</h3>
          <p className="text-corporate-gray leading-relaxed">
            {t("factoryTour.checkStatus.descriptionPrefix")}{" "}
            <span className="font-medium text-corporate-black dark:text-foreground">{t("factoryTour.checkStatus.descriptionStatuses")}</span>{t("factoryTour.checkStatus.descriptionSuffix")}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray mb-1.5 block">{t("factoryTour.checkStatus.referenceLabel")}</span>
              <input
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder={t("factoryTour.checkStatus.referencePlaceholder")}
                className="w-full h-11 rounded border border-black/10 px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray mb-1.5 block">{t("factoryTour.checkStatus.emailLabel")}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("factoryTour.checkStatus.emailPlaceholder")}
                className="w-full h-11 rounded border border-black/10 px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
            <button
              type="submit"
              disabled={!bookingId.trim() || !email.trim()}
              className="h-11 px-6 rounded bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-brand-deep disabled:opacity-40 inline-flex items-center gap-2 justify-center"
            >
              <Search className="w-3.5 h-3.5" /> {t("factoryTour.checkStatus.checkButton")}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-[13px] text-destructive">{error}</p>
          )}
        </div>
      </div>
      {showModal && result && (
        <BookingStatusModal booking={result} onClose={() => setShowModal(false)} />
      )}
    </section>
  );
}


function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-2xl font-light mb-1">{title}</h3>
      {hint && <p className="text-sm text-corporate-gray mb-6">{hint}</p>}
      {children}
    </div>
  );
}

function Nav({ onPrev, onNext, nextDisabled, nextLabel, backLabel }: { onPrev?: () => void; onNext: () => void; nextDisabled?: boolean; nextLabel: string; backLabel: string }) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
      <button onClick={onPrev} disabled={!onPrev} className="px-5 h-10 text-[11px] font-bold uppercase tracking-[0.22em] text-corporate-gray disabled:opacity-30 hover:text-primary">{backLabel}</button>
      <button onClick={onNext} disabled={nextDisabled} className="px-6 h-10 rounded bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.22em] disabled:opacity-40 hover:bg-brand-deep shadow-[0_10px_24px_-10px_rgba(14,49,146,0.55)]">{nextLabel} →</button>
    </div>
  );
}

function BookField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray mb-1.5 block">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-11 rounded border border-black/10 px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
    </label>
  );
}

/* Calendar — only Tuesday(2) & Thursday(4) future dates enabled */
function buildCalendar(refDate: Date) {
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ date: Date | null; enabled: boolean }> = [];
  for (let i = 0; i < startDay; i++) cells.push({ date: null, enabled: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    const isFuture = date.getTime() >= new Date(refDate.toDateString()).getTime();
    cells.push({ date, enabled: isFuture && (dow === 2 || dow === 4) });
  }
  return cells;
}

function Calendar({ days, value, onChange, tueThuLabel, locale }: { days: ReturnType<typeof buildCalendar>; value: Date | null; onChange: (d: Date) => void; tueThuLabel: string; locale: string }) {
  const monthLabel = days.find((d) => d.date)?.date?.toLocaleString(locale, { month: "long", year: "numeric" });
  return (
    <div className="w-full max-w-[248px] rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-card p-3 shadow-[0_2px_12px_-4px_rgba(9,42,125,0.12)]">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[12px] font-semibold text-corporate-black dark:text-foreground">{monthLabel}</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-primary bg-primary/[0.07] px-1.5 h-4 flex items-center rounded-full">{tueThuLabel}</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} className="h-5 flex items-center justify-center text-[9px] font-bold uppercase text-corporate-gray/60">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((c, i) => {
          const selected = value && c.date && value.toDateString() === c.date.toDateString();
          return (
            <button
              key={i}
              disabled={!c.enabled}
              onClick={() => c.date && onChange(c.date)}
              className={`h-7 w-full text-[11px] rounded flex items-center justify-center transition-all ${
                !c.date ? "" :
                selected ? "bg-primary text-white font-semibold shadow-[0_2px_8px_-2px_rgba(14,49,146,0.5)]" :
                !c.enabled ? "text-corporate-gray/25 cursor-not-allowed" :
                "text-corporate-black dark:text-foreground hover:bg-primary/[0.07] hover:text-primary font-medium cursor-pointer"
              }`}
            >
              {c.date?.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
