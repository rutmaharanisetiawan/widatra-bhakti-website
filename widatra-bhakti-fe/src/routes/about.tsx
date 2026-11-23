import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SubNavbar } from "@/components/sub-navbar";
import { useLanguage } from "@/hooks/use-language";
import {
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  FlaskConical,
  Activity,
  HeartHandshake,
  Quote,
  Layers,
  Check,
  User,
} from "lucide-react";
import heroImg from "@/assets/factory.png";
import scientistImg from "@/assets/scientist.jpg";
import productionImg from "@/assets/production-line.jpg";
import aerialImg from "@/assets/factory-aerial.jpg";
import teamImg from "@/assets/team.jpg";
import officeImg from "@/assets/office-building.jpg";
import cleanroomImg from "@/assets/hero-cleanroom.jpg";
import darkFactoryImg from "@/assets/dark-factory.jpg";
import suhariCutout from "@/assets/management/suhari_mukti_cutout.png";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { resolveMediaUrl } from "@/lib/media-store";
import { MediaImage } from "@/components/media/media-image";
import {
  ALL_MANAGEMENT_LEADERS,
  BOARD_OF_COMMISSIONERS,
  BOARD_OF_DIRECTORS,
  PRESIDENT_DIRECTOR_MESSAGE,
} from "@/lib/management-data";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — PT Widatra Bhakti" },
      {
        name: "description",
        content:
          "PT Widatra Bhakti — Indonesia's trusted pharmaceutical manufacturer since 1986. Company profile, leadership, vision, values, corporate video and certifications.",
      },
      { property: "og:title", content: "About PT Widatra Bhakti" },
      {
        property: "og:description",
        content:
          "Pharmaceutical manufacturing since 1986 — profile, leadership, vision, values and certifications.",
      },
    ],
  }),
  component: AboutPage,
});

const SECTION_IDS = [
  "profile",
  "management",
  "vision-mission",
  "values",
  "video",
  "certifications",
] as const;
const SECTION_KEYS = [
  "profile",
  "management",
  "visionMission",
  "values",
  "video",
  "certifications",
] as const;

const PROFILE_STATS = [0, 1, 2] as const;
const MISSION_ITEMS = [0, 1, 2, 3] as const;
const VALUE_ITEMS = [0, 1, 2, 3] as const;
const AWARD_ITEMS = [0, 1, 2] as const;
const CERT_ITEMS = [0, 1, 2, 3, 4, 5] as const;

function AboutPage() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const { profile } = useCompanyProfile();
  const [activeValueIdx, setActiveValueIdx] = useState<number>(0);

  // Distinct imagery per section to eliminate repetitive visuals
  const heroSrc = resolveMediaUrl(profile.heroImage) || heroImg;
  const facilityAerial = profile.facilityGallery[0] ? resolveMediaUrl(profile.facilityGallery[0]) : aerialImg;
  const facilityProduction = profile.facilityGallery[1] ? resolveMediaUrl(profile.facilityGallery[1]) : productionImg;
  const facilityScientist = profile.facilityGallery[2] ? resolveMediaUrl(profile.facilityGallery[2]) : scientistImg;

  return (
    <>
      <PageHero
        variant="about"
        eyebrow={t("about.hero.eyebrow")}
        title={t("about.hero.title")}
        italic={t("about.hero.italic")}
        description={t("about.hero.description")}
        image={heroSrc}
      />

      {/* =================================================================
          CHAPTER 01: COMPANY PROFILE & HERITAGE
          Foundational story from 1986 to Otsuka Group integration
      ================================================================= */}
      <section id="profile" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("about.profile.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("about.profile.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("about.profile.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Story & Heritage Copy */}
            <ScrollReveal animation="fade-right" className="lg:col-span-5">
              <p className="text-corporate-gray leading-relaxed text-sm sm:text-base mb-4">
                {t("about.profile.p1")}
              </p>
              <p className="text-corporate-gray leading-relaxed text-sm sm:text-base mb-6">
                {t("about.profile.p2")}
              </p>

              {/* Otsuka Group Synergy Note */}
              <div className="p-4 rounded-[18px] bg-brand-tint/60 dark:bg-white/[0.04] border border-primary/20 mb-8">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isId ? "Bagian dari Otsuka Group" : "Member of Otsuka Group"}</span>
                </div>
                <p className="text-xs text-corporate-gray leading-relaxed">
                  {isId
                    ? "Didukung oleh komitmen global Otsuka dalam riset, inovasi, dan peningkatan derajat kesehatan manusia di seluruh dunia."
                    : "Backed by Otsuka's global commitment to research, innovation, and better health for people worldwide."}
                </p>
              </div>

              {/* Interactive Stat Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {PROFILE_STATS.map((i) => (
                  <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                    <div className="group relative rounded-[20px] bg-surface border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 shadow-sm hover:shadow-[0_16px_32px_-12px_rgba(9,42,125,0.18)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      <span
                        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${
                          i === 2 ? "bg-accent" : "bg-primary"
                        }`}
                      />
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                        {t(`about.profile.stats.${i}.n`)}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray leading-snug">
                        {t(`about.profile.stats.${i}.l`)}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            {/* Curated Manufacturing Facility Collage (Distinct Images) */}
            <ScrollReveal animation="fade-left" className="lg:col-span-7 grid grid-cols-3 gap-3.5 sm:gap-4">
              <div className="col-span-2 row-span-2 rounded-[24px] overflow-hidden shadow-md group relative">
                <MediaImage
                  src={facilityAerial}
                  alt="Widatra facility aerial"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 min-h-[280px]"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-corporate-black/60 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
                  {isId ? "Pabrik Pandaan, Pasuruan (5+ Ha)" : "Pandaan Plant, Pasuruan (5+ Ha)"}
                </div>
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md group aspect-square relative">
                <MediaImage
                  src={facilityProduction}
                  alt="Production line"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-corporate-black/60 backdrop-blur-md text-white text-[9px] font-medium tracking-wide">
                  {isId ? "Lini BFS Steril" : "Sterile BFS Line"}
                </div>
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md group aspect-square relative">
                <MediaImage
                  src={facilityScientist}
                  alt="QC scientist"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-corporate-black/60 backdrop-blur-md text-white text-[9px] font-medium tracking-wide">
                  {isId ? "Laboratorium Mutu" : "QC Laboratory"}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =================================================================
          CHAPTER 02: LEADERSHIP & EXECUTIVE COMMITMENT
          Featuring Message from President Director & All 5 Board Members
      ================================================================= */}
      <section id="management" className="py-16 sm:py-24 bg-surface scroll-mt-32 border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("about.management.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("about.management.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("about.management.titleHighlight")}
                </span>
              </h2>
            </div>
            <Link
              to="/management"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-card border border-black/[0.08] dark:border-white/[0.1] text-xs font-bold text-primary shadow-sm hover:bg-primary hover:text-white transition-all self-start md:self-auto"
            >
              <span>{t("about.management.cta")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>

          {/* President Director Highlight Banner — Reference Editorial Layout with Cutout & Geometric Arch */}
          <ScrollReveal animation="fade-up" className="mb-12">
            <div className="bg-white dark:bg-card rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 border-2 border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_44px_-16px_rgba(9,42,125,0.08)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Artistic Geometric Frame + Transparent Cutout */}
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="relative flex items-end justify-center w-full max-w-[380px] min-h-[380px] sm:min-h-[430px] pt-8">
                    {/* Dashed circular contour behind head */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-primary/25 dark:border-white/20 pointer-events-none" />

                    {/* Brand theme geometric pill backdrop extending to the right behind torso */}
                    <div className="absolute bottom-2 left-4 sm:left-6 -right-2 sm:-right-4 h-44 sm:h-52 bg-gradient-to-r from-primary via-brand-deep to-[#0284c7] rounded-r-[110px] rounded-l-2xl shadow-xl shadow-primary/20" />

                    {/* High-res transparent cutout of Pak Suhari Mukti */}
                    <img
                      src={suhariCutout}
                      alt={PRESIDENT_DIRECTOR_MESSAGE.name}
                      className="relative z-10 w-full max-w-[280px] sm:max-w-[310px] h-auto object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Right Column: Editorial Speech & Signoff */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-4 self-start">
                    <User className="w-3.5 h-3.5" />
                    <span>{isId ? "Sambutan" : "Welcome Address"}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold tracking-tight text-corporate-black dark:text-foreground leading-tight">
                    {isId ? "Presiden Direktur" : "President Director"}
                  </h3>
                  <div className="text-xl sm:text-2xl lg:text-[26px] font-bold text-primary dark:text-blue-400 mb-6">
                    PT Widatra Bhakti
                  </div>

                  <div className="space-y-4 text-sm sm:text-base text-corporate-black/85 dark:text-foreground/85 leading-relaxed font-normal">
                    <p>
                      {isId ? PRESIDENT_DIRECTOR_MESSAGE.paragraphs[0] : PRESIDENT_DIRECTOR_MESSAGE.paragraphsEn[0]}
                    </p>
                    <p>
                      {isId ? PRESIDENT_DIRECTOR_MESSAGE.paragraphs[1] : PRESIDENT_DIRECTOR_MESSAGE.paragraphsEn[1]}
                    </p>
                    <p>
                      {isId ? PRESIDENT_DIRECTOR_MESSAGE.paragraphs[2] : PRESIDENT_DIRECTOR_MESSAGE.paragraphsEn[2]}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-corporate-black dark:text-foreground">
                        — {PRESIDENT_DIRECTOR_MESSAGE.name}
                      </div>
                      <div className="text-xs text-corporate-gray mt-0.5">
                        {isId ? "Presiden Direktur PT Widatra Bhakti (Otsuka Group)" : "President Director of PT Widatra Bhakti (Otsuka Group)"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* All 5 Leaders in Clean Balanced Grid */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-corporate-gray mb-4">
              {isId ? "Dewan Komisaris & Dewan Direksi" : "Board of Commissioners & Directors"}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {ALL_MANAGEMENT_LEADERS.map((leader, idx) => (
                <ScrollReveal key={leader.id} animation="fade-up" delay={idx * 70}>
                  <article
                    className="group bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] rounded-[20px] overflow-hidden shadow-sm hover:shadow-[0_16px_36px_-12px_rgba(9,42,125,0.18)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="overflow-hidden aspect-[4/4.5] relative bg-slate-100 dark:bg-slate-800">
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-corporate-black/70 backdrop-blur-md text-white text-[9px] font-semibold uppercase tracking-wider">
                          {leader.category === "komisaris" ? (isId ? "Komisaris" : "Commissioner") : (isId ? "Direksi" : "Director")}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                          {isId ? leader.role : leader.roleEn}
                        </span>
                        <h4 className="text-sm font-semibold text-corporate-black dark:text-foreground group-hover:text-primary transition-colors leading-snug">
                          {leader.name}
                        </h4>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          CHAPTER 03: UNIFIED PHILOSOPHY — VISION, MISSION & VALUES
          Seamlessly integrated into one coherent narrative ecosystem
      ================================================================= */}
      <section id="vision-mission" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header Row */}
          <ScrollReveal animation="fade-up" className="mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("about.visionMission.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("about.visionMission.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("about.visionMission.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>

          {/* Vision Banner with Otsuka Philosophy Highlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-10 items-stretch">
            <ScrollReveal animation="fade-right" className="lg:col-span-7 flex flex-col justify-between p-7 sm:p-9 rounded-[26px] bg-gradient-to-br from-primary via-brand-deep to-brand-ink text-white shadow-[0_18px_44px_-14px_rgba(9,42,125,0.45)] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.22em]">
                    {t("about.visionMission.visionLabel")}
                  </span>
                  <Sparkles className="w-5 h-5 text-white/60" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light leading-snug font-serif-italic mb-6">
                  "{t("about.visionMission.visionText")}"
                </h3>
              </div>
              <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-white/80">
                <div className="font-semibold uppercase tracking-wider text-blue-200 mb-1">
                  {isId ? "Falsafah Luhur Otsuka Group" : "Otsuka Group Philosophy"}
                </div>
                <p className="font-serif-italic text-sm">
                  "Otsuka-people creating new products for better health worldwide."
                </p>
              </div>
            </ScrollReveal>

            {/* Strategic Mission 4-Pack */}
            <ScrollReveal animation="fade-left" className="lg:col-span-5 p-7 sm:p-8 rounded-[26px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-5">
                  {t("about.visionMission.missionLabel")}
                </span>
                <div className="space-y-3.5">
                  {MISSION_ITEMS.map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <p className="text-xs sm:text-sm text-corporate-black/85 dark:text-foreground/85 leading-relaxed">
                        {t(`about.visionMission.missionItems.${i}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-corporate-gray">
                <span>{isId ? "Pilar Budaya Kerja:" : "Working Culture Pillars:"}</span>
                <span className="font-bold text-primary">5+1S (Speed, Synergy, Share, Simplify, Smart, Sincere)</span>
              </div>
            </ScrollReveal>
          </div>

          {/* Integrated Core Values */}
          <div id="values" className="pt-8 border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
                  {t("about.values.eyebrow")}
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold leading-tight">
                  {t("about.values.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-primary">
                    {t("about.values.titleHighlight")}
                  </span>
                </h3>
              </div>

              <SubNavbar
                activeId={activeValueIdx}
                onSelect={(idx) => setActiveValueIdx(idx)}
                items={VALUE_ITEMS.map((i) => ({
                  id: i,
                  label: t(`about.values.items.${i}.title`),
                }))}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {VALUE_ITEMS.map((i) => {
                const isSelected = activeValueIdx === i;
                return (
                  <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                    <div
                      onClick={() => setActiveValueIdx(i)}
                      className={`cursor-pointer group relative rounded-[22px] p-5 sm:p-7 transition-all duration-300 border-2 ${
                        isSelected
                          ? "bg-gradient-to-br from-primary to-brand-deep text-white border-primary shadow-[0_20px_44px_-14px_rgba(14,49,146,0.5)] -translate-y-1.5"
                          : "bg-surface dark:bg-card border-black/[0.06] dark:border-white/[0.08] hover:border-primary/40 hover:-translate-y-1"
                      }`}
                    >
                      <span
                        className={`absolute -left-[2px] top-6 h-8 w-[4px] rounded-r-full transition-all ${
                          isSelected ? "bg-accent h-12" : "bg-primary group-hover:h-12"
                        }`}
                      />
                      <div
                        className={`font-mono text-xs font-bold mb-4 ${
                          isSelected ? "text-white/80" : "text-primary"
                        }`}
                      >
                        {t(`about.values.items.${i}.index`)}
                      </div>
                      <h4
                        className={`text-base sm:text-xl font-semibold mb-2 ${
                          isSelected ? "text-white" : ""
                        }`}
                      >
                        {t(`about.values.items.${i}.title`)}
                      </h4>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isSelected ? "text-white/85" : "text-corporate-gray"
                        }`}
                      >
                        {t(`about.values.items.${i}.desc`)}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          CHAPTER 04: MANUFACTURING EXCELLENCE & CORPORATE FILM
          Using Cleanroom Visual (NO REPEATING AERIAL PHOTO)
      ================================================================= */}
      <section id="video" className="py-16 sm:py-24 bg-surface scroll-mt-32 border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("about.video.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("about.video.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("about.video.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>

          {/* Side-by-Side Video Showcase & Technology Pillars (NO HD 1080P badge) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left 7 Columns: Cinematic Video Player */}
            <ScrollReveal animation="zoom-in" duration={700} className="lg:col-span-7 flex flex-col">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto flex-1 min-h-[300px] sm:min-h-[400px] rounded-[28px] overflow-hidden border-2 border-black/[0.06] dark:border-white/[0.08] shadow-[0_20px_50px_-16px_rgba(9,42,125,0.25)] group cursor-pointer">
                <img
                  src={cleanroomImg}
                  alt="Corporate cleanroom and sterile manufacturing preview"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/90 via-[#051235]/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
                    {t("about.video.filmLabel")}
                  </div>
                  <div className="text-lg sm:text-xl font-semibold mt-1">
                    {t("about.video.filmTitle")}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right 5 Columns: 3 Manufacturing Technology Highlights */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4">
              <ScrollReveal animation="fade-left" delay={60}>
                <div className="p-5 sm:p-6 rounded-[22px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <span>{isId ? "Closed-System BFS" : "Closed-System BFS"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed">
                    {isId
                      ? "Pembentukan botol, pengisian steril, dan penyegelan hermetis berlangsung dalam satu proses otomatis kontinu tanpa kontak udara luar."
                      : "Bottle forming, sterile filling, and hermetic sealing occur in a continuous automated closed system free of ambient air contact."}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={120}>
                <div className="p-5 sm:p-6 rounded-[22px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span>{isId ? "Water For Injection (WFI)" : "Water For Injection (WFI)"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed">
                    {isId
                      ? "Distilasi bertingkat multiefek menghasilkan air steril dengan kemurnian farmasi absolut, bebas pirogen dan endotoksin."
                      : "Multi-effect distillation ensures absolute pharmaceutical water purity, rigorously pyrogen and endotoxin-free."}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={180}>
                <div className="p-5 sm:p-6 rounded-[22px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span>{isId ? "Cleanroom Grade A / B" : "Cleanroom Grade A / B"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed">
                    {isId
                      ? "Tekanan udara positif dengan filtrasi HEPA ganda dan pemantauan partikulat mikrobiologi secara real-time di setiap shift."
                      : "Positive air pressure with dual HEPA filtration and real-time microbiological particulate monitoring across every shift."}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          CHAPTER 05: GLOBAL CERTIFICATIONS & INDEPENDENT RECOGNITION
      ================================================================= */}
      <section id="certifications" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("about.awards.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
              {t("about.awards.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("about.awards.titleHighlight")}
              </span>{" "}
              {t("about.awards.titleSuffix")}
            </h2>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
              {t("about.awards.description")}
            </p>

            <div className="mt-8 space-y-3.5">
              {AWARD_ITEMS.map((i) => (
                <div
                  key={i}
                  className="group relative p-5 rounded-[20px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] flex gap-4 items-start shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] font-mono text-primary text-xs font-bold flex-shrink-0">
                    {t(`about.awards.items.${i}.year`)}
                  </span>
                  <div>
                    <div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                      {t(`about.awards.items.${i}.title`)}
                    </div>
                    <div className="text-xs text-corporate-gray mt-1 leading-relaxed">
                      {t(`about.awards.items.${i}.body`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
            {CERT_ITEMS.map((i) => (
              <div
                key={i}
                className="group relative p-5 sm:p-6 aspect-square rounded-[22px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between shadow-sm hover:border-primary/40 hover:shadow-[0_18px_36px_-12px_rgba(9,42,125,0.2)] hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className={`absolute -left-[2px] top-5 h-7 w-[4px] rounded-r-full transition-all group-hover:h-11 ${
                    i % 2 === 0 ? "bg-primary" : "bg-accent"
                  }`}
                />
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-card text-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {i % 2 === 0 ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <Award className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold tracking-tight text-corporate-black dark:text-foreground group-hover:text-primary transition-colors">
                    {t(`about.awards.certifications.${i}.name`)}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-corporate-gray mt-1">
                    {t(`about.awards.certifications.${i}.label`)}
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* =================================================================
          CHAPTER 06: FACTORY TOUR INVITATION
          Using Corporate Headquarters / Architectural Visual (NO AERIAL REPETITION)
      ================================================================= */}
      <section className="py-16 sm:py-20 bg-surface border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="zoom-in">
            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[340px] flex items-center justify-center text-center p-8 sm:p-14 shadow-xl">
              <img
                src={officeImg}
                alt="Widatra Bhakti Pandaan Facility Administration"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#051235]/95 via-[#092A7D]/85 to-[#051235]/95" />
              <div className="relative z-10 max-w-2xl text-white">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                  {isId ? "Kunjungan Fasilitas Pandaan" : "Pandaan Facility Tour"}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-4 text-balance">
                  {t("about.aerialCta.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-blue-200">
                    {t("about.aerialCta.titleHighlight")}
                  </span>
                </h2>
                <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto mb-7 leading-relaxed">
                  {isId
                    ? "Kami membuka pintu fasilitas kami bagi tenaga medis, praktisi rumah sakit, dan akademisi untuk menyaksikan langsung transparansi standar sterilitas kelas dunia kami."
                    : "We welcome healthcare professionals, hospital partners, and academic institutions to witness our world-class sterile standards firsthand."}
                </p>
                <Link
                  to="/factory-tour"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-accent hover:text-white transition-all shadow-lg"
                >
                  <span>{t("about.aerialCta.cta")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
