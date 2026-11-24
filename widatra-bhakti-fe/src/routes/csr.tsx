import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SubNavbar } from "@/components/sub-navbar";
import {
  HeartHandshake,
  Leaf,
  GraduationCap,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Award,
} from "lucide-react";
import csrCommunity from "@/assets/csr1.png";
import csrEnvironment from "@/assets/csr-environment.jpg";
import teamImg from "@/assets/csr2.png";
import officeImg from "@/assets/csr3.png";
import scientistImg from "@/assets/csr1.png";
import { usePublishedCsrPrograms } from "@/hooks/use-csr";
import { CsrDetailModal } from "@/components/csr/csr-detail-modal";
import { MediaImage } from "@/components/media/media-image";
import { useLanguage } from "@/hooks/use-language";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/csr")({
  head: () => ({
    meta: [
      { title: "Corporate Social Responsibility — PT Widatra Bhakti" },
      {
        name: "description",
        content:
          "Widatra Bhakti's commitment to environment, community development, education, healthcare, employee volunteering, disaster relief and sustainability.",
      },
      { property: "og:title", content: "CSR — PT Widatra Bhakti" },
    ],
  }),
  component: CsrPage,
});

const IMPACT_STATS = [0, 1, 2, 3] as const;
const PILLAR_ITEMS = [0, 1, 2, 3, 4, 5] as const;
const ENV_STATS = [0, 1, 2, 3] as const;
const SUSTAINABILITY_ITEMS = [0, 1, 2, 3] as const;
const AWARD_ITEMS = [0, 1, 2, 3, 4] as const;
const GALLERY_IMAGES_KEY = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const PILLAR_ICONS = [Leaf, HeartHandshake, GraduationCap, ShieldCheck, Users, Sparkles] as const;

function CsrPage() {
  const { programs } = usePublishedCsrPrograms();
  const { t } = useLanguage();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePillarFilter, setActivePillarFilter] = useState<string>("All");
  const [activeBlockIdx, setActiveBlockIdx] = useState<number>(0);

  const pillarsList = useMemo(() => {
    const unique = Array.from(new Set(programs.map((p) => p.pillar))).filter(Boolean);
    return ["All", ...unique];
  }, [programs]);

  const filteredPrograms = useMemo(
    () =>
      activePillarFilter === "All"
        ? programs
        : programs.filter((p) => p.pillar === activePillarFilter),
    [programs, activePillarFilter]
  );

  const selectedProgram = useMemo(
    () => programs.find((p) => p.slug === selectedSlug) ?? null,
    [programs, selectedSlug]
  );

  function openProgram(slug: string) {
    setSelectedSlug(slug);
    setModalOpen(true);
  }

  const galleryImages = [
    csrCommunity,
    csrEnvironment,
    teamImg,
    officeImg,
    scientistImg,
    csrCommunity,
    csrEnvironment,
    teamImg,
  ];
  const blockImages = [csrCommunity, officeImg, scientistImg, teamImg];
  const PARTNER_ITEMS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

  const sectionNavItems = [
    { id: "csr-pillars", label: t("csr.pillars.eyebrow"), href: "#csr-pillars" },
    { id: "csr-environment", label: t("csr.environment.eyebrow"), href: "#csr-environment" },
    { id: "csr-programs", label: t("csr.successStories.eyebrow"), href: "#csr-programs" },
  ];

  return (
    <>
      <PageHero
        variant="csr"
        eyebrow={t("csr.hero.eyebrow")}
        title={t("csr.hero.title")}
        italic={t("csr.hero.italic")}
        description={t("csr.hero.description")}
        image={csrCommunity}
      />

      {/* IMPACT STATS — Unified Rounded Stat Cards */}
      <section className="py-10 sm:py-14 bg-surface border-b border-black/5 dark:border-white/5">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch">
            {IMPACT_STATS.map((i) => {
              const n = t(`csr.impactStats.${i}.n`);
              return (
                <ScrollReveal key={i} animation="fade-up" delay={i * 80} className="h-full">
                  <div className="group relative rounded-[20px] sm:rounded-[24px] bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-7 shadow-[0_8px_30px_-12px_rgba(9,42,125,0.08)] hover:shadow-[0_18px_40px_-12px_rgba(9,42,125,0.18)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col justify-between">
                    <span
                      className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full transition-all duration-300 group-hover:top-3 group-hover:bottom-3 ${
                        n === "ISO 14001" ? "bg-accent" : "bg-primary"
                      }`}
                    />
                    <div className="text-[28px] sm:text-[38px] lg:text-[46px] font-bold leading-none tracking-[-0.03em] mb-2">
                      {n === "ISO 14001" ? (
                        <span className="text-accent">{n}</span>
                      ) : (
                        <span className="text-primary dark:text-white">{n}</span>
                      )}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-corporate-gray">
                      {t(`csr.impactStats.${i}.l`)}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PILLARS — 2-Col Mobile / 3-Col Desktop Interactive Cards */}
      <section id="csr-pillars" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("csr.pillars.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("csr.pillars.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("csr.pillars.titleHighlight")}
                </span>
              </h2>
            </div>
            <SubNavbar scrollSpy items={sectionNavItems} />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-7 items-stretch">
            {PILLAR_ITEMS.map((i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <ScrollReveal key={i} animation="fade-up" delay={i * 80} className="h-full">
                  <div className="group relative rounded-[18px] sm:rounded-[22px] border-2 border-black/[0.06] dark:border-white/[0.08] bg-surface hover:bg-white dark:hover:bg-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between h-full shadow-sm hover:shadow-[0_20px_40px_-14px_rgba(9,42,125,0.18)] hover:border-primary/35 hover:-translate-y-1 transition-all duration-300">
                    <span
                      className={`absolute -left-[2px] top-5 sm:top-6 h-8 sm:h-10 w-[4px] rounded-r-full transition-all duration-300 group-hover:h-14 ${
                        i % 2 === 0 ? "bg-primary" : "bg-accent"
                      }`}
                    />
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-xs font-mono font-bold text-corporate-gray/50">
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-primary transition-colors min-h-[3rem] line-clamp-2">
                        {t(`csr.pillars.items.${i}.title`)}
                      </h3>
                      <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed line-clamp-3">
                        {t(`csr.pillars.items.${i}.desc`)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ENVIRONMENT DETAIL */}
      <section
        id="csr-environment"
        className="py-16 sm:py-24 bg-corporate-black text-white relative overflow-hidden scroll-mt-32"
      >
        <div className="absolute inset-0 opacity-25">
          <img src={csrEnvironment} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/85 text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("csr.environment.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
              {t("csr.environment.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-blue-200">
                {t("csr.environment.titleHighlight")}
              </span>
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed">
              {t("csr.environment.description")}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="lg:col-span-7 grid grid-cols-2 gap-3.5 sm:gap-5">
            {ENV_STATS.map((i) => (
              <div
                key={i}
                className="rounded-[22px] bg-white/10 backdrop-blur-md border border-white/15 p-6 sm:p-7 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {t(`csr.environment.stats.${i}.n`)}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">
                  {t(`csr.environment.stats.${i}.l`)}
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* COMMUNITY + EDUCATION + HEALTH + VOLUNTEERING (Interactive SubNavbar Showcase) */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t(`csr.blocks.${activeBlockIdx}.eyebrow`)}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t(`csr.blocks.${activeBlockIdx}.title`)}
              </h2>
            </div>
            <SubNavbar
              activeId={activeBlockIdx}
              onSelect={(idx) => setActiveBlockIdx(idx)}
              items={([0, 1, 2, 3] as const).map((i) => ({
                id: i,
                label: t(`csr.blocks.${i}.eyebrow`),
              }))}
            />
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" duration={650}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-[28px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-8 shadow-md">
              <div className="lg:col-span-7 overflow-hidden rounded-[22px]">
                <img
                  src={blockImages[activeBlockIdx]}
                  alt={t(`csr.blocks.${activeBlockIdx}.title`)}
                  className="w-full aspect-[16/10] object-cover transition-all duration-500"
                />
              </div>
              <div className="lg:col-span-5">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                  {t(`csr.blocks.${activeBlockIdx}.eyebrow`)}
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
                  {t(`csr.blocks.${activeBlockIdx}.title`)}
                </h3>
                <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
                  {t(`csr.blocks.${activeBlockIdx}.copy`)}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SUCCESS STORIES / CSR PROGRAMS — Header + SubNavbar matching Screenshot */}
      <section id="csr-programs" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("csr.successStories.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("csr.successStories.title")}
              </h2>
            </div>

            <SubNavbar
              activeId={activePillarFilter}
              onSelect={(val) => setActivePillarFilter(val)}
              items={pillarsList.map((p) => ({
                id: p,
                label: p === "All" ? t("news.categories.all") : p,
                count:
                  p === "All"
                    ? programs.length
                    : programs.filter((prog) => prog.pillar === p).length,
              }))}
            />
          </ScrollReveal>

          {filteredPrograms.length === 0 ? (
            <div className="py-16 text-center text-corporate-gray rounded-[24px] border border-dashed border-black/10">
              <p>{t("csr.successStories.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {filteredPrograms.map((p, idx) => (
                <ScrollReveal key={p.slug} animation="fade-up" delay={idx * 80} className="h-full">
                  <article
                    onClick={() => openProgram(p.slug)}
                    className="group cursor-pointer relative bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] rounded-[24px] p-5 sm:p-6 shadow-[0_6px_24px_-12px_rgba(9,42,125,0.08)] hover:shadow-[0_22px_44px_-14px_rgba(9,42,125,0.22)] hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <span
                      className={`absolute -left-[2px] top-6 h-8 w-[4px] rounded-r-full transition-all duration-300 group-hover:h-14 ${
                        idx % 2 === 0 ? "bg-primary" : "bg-accent"
                      }`}
                    />

                    <div className="flex flex-col flex-1">
                      <div className="relative aspect-[16/10] rounded-[18px] overflow-hidden mb-5 bg-brand-soft shrink-0">
                        <MediaImage
                          src={p.img}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 inline-flex items-center px-3 py-1 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                          {p.pillar}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2.5 text-xs text-corporate-gray h-5">
                        <span className="truncate mr-2">{p.location}</span>
                        <span className="font-mono shrink-0">{p.date}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2.5 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3.25rem] sm:min-h-[3.5rem]">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed line-clamp-3 min-h-[3.6rem] sm:min-h-[3.9rem]">
                        {p.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {t("csr.successStories.readMore")}
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

      {/* CSR GALLERY + PARTNERS & AWARDS */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-16">
          <ScrollReveal animation="fade-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-5">
              {t("csr.gallery.eyebrow")}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
              {GALLERY_IMAGES_KEY.map((i) => (
                <div
                  key={i}
                  className="rounded-[20px] overflow-hidden aspect-square group shadow-sm"
                >
                  <img
                    src={galleryImages[i]}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ScrollReveal animation="fade-right" className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("csr.partners.eyebrow")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold mb-6">
                {t("csr.partners.title")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PARTNER_ITEMS.map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] p-4 text-xs sm:text-sm font-medium flex items-center justify-center text-center min-h-[72px] hover:border-primary/40 transition-colors"
                  >
                    {t(`csr.partners.items.${i}`)}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("csr.awards.eyebrow")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold mb-6">
                {t("csr.awards.title")}
              </h3>
              <div className="space-y-3">
                {AWARD_ITEMS.map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] px-5 py-4 flex items-center gap-4 hover:border-primary/40 transition-colors"
                  >
                    <span className="px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] font-mono text-xs font-bold text-primary">
                      {t(`csr.awards.items.${i}.year`)}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold flex-1">
                      {t(`csr.awards.items.${i}.name`)}
                    </span>
                    <Award className="w-4 h-4 text-primary/50" />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ANNUAL REPORT CTA */}
      <section className="py-16 sm:py-20 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="zoom-in">
            <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-primary via-brand-deep to-brand-ink text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
                  {t("csr.annualReport.eyebrow")}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                  {t("csr.annualReport.title")}
                </h2>
              </div>
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-lg cursor-pointer">
                <span>{t("csr.annualReport.button")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CsrDetailModal program={selectedProgram} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
