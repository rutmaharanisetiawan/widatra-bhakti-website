import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useCountUp } from "@/hooks/use-countup";
import { useLanguage } from "@/hooks/use-language";
import { WavyMarqueeRibbon } from "@/components/wavy-marquee-ribbon";
import { SubNavbar } from "@/components/sub-navbar";
import { usePublishedArticles } from "@/hooks/use-news";
import { MediaImage } from "@/components/media/media-image";
import { NewsDetailModal } from "@/components/news/news-detail-modal";
import type { Article } from "@/lib/news-data";
import { ScrollReveal, ScrollStagger } from "@/components/ui/scroll-reveal";
import {
  ShieldCheck,
  Award,
  Droplets,
  Factory,
  FlaskConical,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Compass,
  Building2,
  HeartHandshake,
  Users,
  MapPin,
  Layers,
  Microscope,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import heroImg from "@/assets/factory.png";
import productionImg from "@/assets/production-line.jpg";
import scientistImg from "@/assets/scientist.jpg";
import darkFactoryImg from "@/assets/dark-factory.jpg";
import officeImg from "@/assets/office-building.jpg";
import aerialImg from "@/assets/factory-aerial.jpg";
import teamImg from "@/assets/team.jpg";
import csrCommunity from "@/assets/csr-community.jpg";
import csrEnvironment from "@/assets/csr-environment.jpg";
import ivBag from "@/assets/iv-bag.jpg";
import vial from "@/assets/vial.jpg";
import supplies from "@/assets/supplies.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PT Widatra Bhakti — Reliable Partner for Better Health" },
      {
        name: "description",
        content:
          "Indonesia's largest manufacturer of basic intravenous solution products and a market leader. Part of Otsuka Group Indonesia, trusted by hospitals nationwide since 1986.",
      },
      { property: "og:title", content: "PT Widatra Bhakti — Reliable Partner for Better Health" },
      {
        property: "og:description",
        content:
          "Indonesia's largest manufacturer of basic intravenous solution products, a member of Otsuka Group Indonesia.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

function StatCard({
  value,
  suffix,
  label,
  accentText,
  index,
}: {
  value?: number;
  suffix?: string;
  label: string;
  accentText?: string;
  index: number;
}) {
  const { ref, value: animated } = useCountUp(value ?? 0);
  return (
    <ScrollReveal animation="fade-up" delay={index * 110} duration={650}>
      <div
        ref={ref}
        className="group relative rounded-[20px] sm:rounded-[24px] bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-7 lg:p-8 shadow-[0_8px_30px_-12px_rgba(9,42,125,0.08)] hover:shadow-[0_18px_40px_-12px_rgba(9,42,125,0.18)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        {/* Left accent bar */}
        <span
          className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full transition-all duration-300 group-hover:top-3 group-hover:bottom-3 ${
            index === 3 ? "bg-accent" : "bg-primary"
          }`}
        />
        <div className="text-[32px] sm:text-[42px] lg:text-[52px] font-bold leading-none tracking-[-0.04em] mb-2.5">
          {accentText ? (
            <span className="text-accent">{accentText}</span>
          ) : (
            <span className="bg-gradient-to-r from-primary via-brand-deep to-primary dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              {animated}
              {suffix}
            </span>
          )}
        </div>
        <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-corporate-gray leading-snug">
          {label}
        </div>
      </div>
    </ScrollReveal>
  );
}

const WHY_ICONS = [ShieldCheck, Building2, Award, Layers, Factory, HeartHandshake] as const;

function HomePage() {
  const { t, language } = useLanguage();
  const isId = language === "id";

  const { articles: allPublishedArticles } = usePublishedArticles();
  const [newsCategory, setNewsCategory] = useState<string>("Semua");
  const [newsSearch, setNewsSearch] = useState<string>("");
  const [newsSort, setNewsSort] = useState<"newest" | "oldest" | "popular">("newest");
  const [newsPage, setNewsPage] = useState<number>(1);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<Article | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  const [activeProductTab, setActiveProductTab] = useState<number>(0);
  const [activeProcessStep, setActiveProcessStep] = useState<number>(0);
  const [activeFacilityTab, setActiveFacilityTab] = useState<number>(0);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(5);

  const manufacturingItems = [0, 1, 2] as const;
  const facilitiesItems = [0, 1, 2, 3] as const;
  const whyChooseItems = [0, 1, 2, 3, 4, 5] as const;
  const processItems = [0, 1, 2, 3, 4, 5] as const;
  const certificationItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
  const qaStats = [0, 1, 2, 3] as const;
  const productItems = [
    { img: ivBag, index: 0, badge: "LVP · Parenteral", code: "WIDA NS / RL" },
    { img: vial, index: 1, badge: "Therapeutic", code: "WIDA D5 / KN / 2A" },
    { img: supplies, index: 2, badge: "Sterile System", code: "WIDA WI / WidaSet" },
  ];
  const rndItems = [0, 1, 2, 3] as const;
  const partnerItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
  const timelineItems = [0, 1, 2, 3, 4, 5] as const;
  const factoryTourStats = [0, 1, 2, 3] as const;
  const careersStats = [0, 1, 2] as const;

  const cleanArticles = useMemo(
    () =>
      allPublishedArticles.filter(
        (a) => a.title.toLowerCase() !== "test" && a.excerpt.toLowerCase() !== "test"
      ),
    [allPublishedArticles]
  );

  const newsCategoriesList = useMemo(() => {
    const counts: Record<string, number> = {
      Semua: cleanArticles.length,
      Corporate: 0,
      Science: 0,
      Sustainability: 0,
      Events: 0,
    };
    cleanArticles.forEach((a) => {
      const c = a.cat || "Corporate";
      if (c === "Corporate") counts.Corporate = (counts.Corporate || 0) + 1;
      else if (c === "Science") counts.Science = (counts.Science || 0) + 1;
      else if (c === "Sustainability") counts.Sustainability = (counts.Sustainability || 0) + 1;
      else counts.Events = (counts.Events || 0) + 1;
    });
    return [
      { key: "Semua", label: "Semua", count: counts.Semua || 0 },
      { key: "Corporate", label: "Corporate", count: counts.Corporate || 0 },
      { key: "Science", label: "Science & Inovasi", count: counts.Science || 0 },
      { key: "Sustainability", label: "Keberlanjutan & CSR", count: counts.Sustainability || 0 },
      { key: "Events", label: "Acara & People", count: counts.Events || 0 },
    ];
  }, [cleanArticles]);

  const filteredNewsArticles = useMemo(() => {
    let list = [...cleanArticles];
    if (newsCategory !== "Semua") {
      if (newsCategory === "Events") {
        list = list.filter((a) => a.cat === "Events" || a.cat === "People");
      } else {
        list = list.filter((a) => a.cat?.toLowerCase() === newsCategory.toLowerCase());
      }
    }
    if (newsSearch.trim()) {
      const q = newsSearch.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.cat.toLowerCase().includes(q) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    if (newsSort === "newest") {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (newsSort === "oldest") {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (newsSort === "popular") {
      list.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }
    return list;
  }, [cleanArticles, newsCategory, newsSearch, newsSort]);

  const newsPageSize = 4;
  const totalNewsPages = Math.max(1, Math.ceil(filteredNewsArticles.length / newsPageSize));
  const currentNewsPage = Math.min(newsPage, totalNewsPages);
  const paginatedNewsArticles = useMemo(() => {
    const start = (currentNewsPage - 1) * newsPageSize;
    return filteredNewsArticles.slice(start, start + newsPageSize);
  }, [filteredNewsArticles, currentNewsPage, newsPageSize]);

  const facilityImages = [productionImg, aerialImg, scientistImg, darkFactoryImg];

  const marqueeBadges = [
    "OTSUKA GROUP INDONESIA",
    "PIC/S GMP CERTIFIED",
    "ISO 9001 : 2015",
    "ISO 14001 : 2015",
    "ISO 45001 : 2018",
    "BPOM LICENSED",
    "HALAL CERTIFIED",
    "A-GRADE STERILE CLEANROOM",
  ];

  return (
    <>
      {/* =================================================================
          TAHAP 1: INTERACTIVE HERO + CAPSULE COLLAGE + MARQUEE RIBBON
      ================================================================= */}
      <section className="relative min-h-[90vh] 2xl:min-h-[95vh] -mt-20 pt-24 sm:pt-28 lg:pt-28 xl:pt-32 2xl:pt-36 pb-20 sm:pb-24 lg:pb-24 xl:pb-28 2xl:pb-36 flex items-center overflow-hidden bg-[#061844] text-white">
        {/* Rich Layered Background — Cleanroom image smoothly dissolves into cleanroom navy */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Sterile pharmaceutical cleanroom"
            className="w-full h-full object-cover object-center scale-105 opacity-75"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.7) 68%, rgba(0,0,0,0.2) 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.7) 68%, rgba(0,0,0,0.2) 88%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05153d]/80 via-[#082266]/55 to-[#0b2b80]/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(27,72,196,0.22),transparent_60%)]" />
          {/* Deep Navy Grounding: ensures seamless navy tone before easing into surface */}
          <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 bg-gradient-to-t from-[#061844] via-[#061844]/80 to-transparent pointer-events-none" />
        </div>

        {/* Ultra-Smooth Non-Linear Scrim Gradient Fade into Ribbon & Next Section (Zero Hard Cuts / Banding) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 sm:h-64 lg:h-72 z-[5] hero-bottom-scrim"
        />

        <div className="container mx-auto max-w-[1240px] 2xl:max-w-[1360px] px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 2xl:gap-10 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 text-center lg:text-left animate-reveal order-2 lg:order-1">
              {/* Pill Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-white/90">
                  {t("home.hero.eyebrow")}
                </span>
              </div>

              {/* Responsive Display Heading */}
              <h1 className="text-[32px] sm:text-[44px] lg:text-[50px] xl:text-[56px] 2xl:text-[64px] font-semibold leading-[1.08] tracking-[-0.03em] mb-6 text-balance text-white">
                {t("home.hero.titleLine1")}{" "}
                <span className="font-serif-italic font-normal bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent block sm:inline">
                  {t("home.hero.titleLine2")}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-white/75 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8 sm:mb-10 text-pretty">
                {t("home.hero.description")}
              </p>

              {/* Pill CTA Cluster */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 sm:gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-4 rounded-full bg-white text-primary font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_14px_34px_-8px_rgba(0,0,0,0.45)] hover:scale-[1.02]"
                >
                  <span>{t("home.hero.ctaExplore")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/factory-tour"
                  className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white transition-all duration-300 group"
                >
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors">
                    <span className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-current ml-0.5" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                    {t("home.hero.ctaTour")}
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Interactive Capsule Collage */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative mx-auto max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[500px] 2xl:max-w-none">
                {/* Main Capsule Visual Grid */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
                  <div className="col-span-7">
                    <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-white/20 shadow-2xl aspect-[3/4] relative group">
                      <img
                        src={productionImg}
                        alt="Sterile filling line"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-primary/90 text-[9px] font-bold uppercase tracking-widest text-white mb-1">
                          PIC/S GMP
                        </span>
                        <p className="text-xs font-medium text-white/90 leading-snug">
                          Grade A Closed-System Filling
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-5 flex flex-col gap-3 sm:gap-4">
                    <div className="rounded-[24px] sm:rounded-[30px] overflow-hidden border-2 border-white/20 shadow-xl aspect-square bg-white p-3 flex items-center justify-center group">
                      <img
                        src={ivBag}
                        alt="WIDA IV Solution"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="rounded-[24px] sm:rounded-[30px] overflow-hidden border-2 border-white/20 shadow-xl aspect-[4/5] relative group">
                      <img
                        src={scientistImg}
                        alt="Quality control"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <div className="text-lg sm:text-xl font-bold text-white leading-none">100%</div>
                        <div className="text-[9px] uppercase tracking-wider text-white/80 mt-0.5">
                          Batch QC Tested
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Glass Badge */}
                <div className="hidden sm:flex items-center gap-3 absolute -bottom-4 lg:-bottom-4 xl:-bottom-5 left-0 sm:-left-3 lg:left-0 xl:-left-5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-card text-corporate-black dark:text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-black/5 animate-float-slow">
                  <div className="w-10 h-10 rounded-xl bg-brand-tint text-primary flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Otsuka Group Standard</div>
                    <div className="text-[10px] text-corporate-gray">Trusted by Hospitals Since 1986</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS WAVY MARQUEE RIBBON DIVIDER */}
      <WavyMarqueeRibbon variant="wave" items={marqueeBadges} />

      {/* =================================================================
          CORPORATE STATS BAND — 2-Col Mobile / 4-Col Desktop Rounded Cards
      ================================================================= */}
      <section className="py-10 sm:py-14 bg-surface border-b border-black/5 dark:border-white/5">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <StatCard value={38} suffix="+" label={t("home.stats.years")} index={0} />
            <StatCard value={150} suffix="M+" label={t("home.stats.units")} index={1} />
            <StatCard value={11} suffix="" label={t("home.stats.productLines")} index={2} />
            <StatCard accentText="A-Grade" label={t("home.stats.cleanroom")} index={3} />
          </div>
        </div>
      </section>

      {/* =================================================================
          (01) COMPANY INTRODUCTION — Editorial Collage & Floating Quote Pill
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-5">
            <ScrollReveal animation="fade-right">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-5">
                {t("home.intro.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-6 text-balance">
                {t("home.intro.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("home.intro.titleHighlight")}
                </span>{" "}
                {t("home.intro.titleSuffix")}
              </h2>
              <p className="text-corporate-gray leading-relaxed text-sm sm:text-base mb-4">
                {t("home.intro.p1")}
              </p>
              <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
                {t("home.intro.p2")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_10px_24px_-8px_rgba(14,49,146,0.5)] hover:bg-brand-deep hover:scale-[1.02] transition-all"
                >
                  {t("home.intro.ctaStory")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/management"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-black/10 dark:border-white/20 text-[11px] font-bold uppercase tracking-[0.18em] hover:border-primary hover:text-primary transition-all"
                >
                  {t("home.intro.ctaLeadership")}
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Rounded Collage */}
          <div className="lg:col-span-7">
            <ScrollReveal animation="fade-left">
              <div className="grid grid-cols-12 gap-3.5 sm:gap-5 items-stretch">
                <div className="col-span-12 sm:col-span-6 relative rounded-[24px] overflow-hidden shadow-md group min-h-[260px]">
                  <img
                    src={scientistImg}
                    alt="Scientist"
                    className="w-full h-full object-cover aspect-[4/5] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-corporate-black text-[10px] font-bold uppercase tracking-wider shadow">
                      Pandaan Campus · Est. 1986
                    </span>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 flex flex-col gap-3.5 sm:gap-5">
                  <div className="rounded-[24px] overflow-hidden shadow-md group">
                    <img
                      src={productionImg}
                      alt="Production"
                      className="w-full object-cover aspect-[16/10] sm:aspect-square transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="rounded-[24px] bg-gradient-to-br from-primary via-brand-deep to-brand-ink text-primary-foreground p-6 sm:p-7 flex-1 flex flex-col justify-between shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
                        {t("home.intro.otsukaLabel")}
                      </span>
                      <Sparkles className="w-4 h-4 text-white/60" />
                    </div>
                    <p className="text-lg sm:text-xl font-light leading-snug font-serif-italic my-4">
                      "{t("home.intro.quote")}"
                    </p>
                    <span className="text-[11px] text-white/75 font-medium">
                      {t("home.intro.quoteAuthor")}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =================================================================
          TAHAP 2: (04) WHY CHOOSE WIDATRA — Signature 2-Col Mobile / 3-Col Desktop Cards
          with Left-Edge Vertical Brand Accent Tab
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("home.whyChoose.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("home.whyChoose.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("home.whyChoose.titleHighlight")}
                </span>
              </h2>
            </div>
          </ScrollReveal>

          {/* 2 Columns on Mobile (390px) & Tablet, 3 Columns on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7">
            {whyChooseItems.map((i) => {
              const Icon = WHY_ICONS[i];
              return (
                <ScrollReveal key={i} animation="fade-up" delay={i * 70}>
                  <div
                    className="group relative rounded-[18px] sm:rounded-[22px] border-2 border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-card p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0_6px_24px_-12px_rgba(9,42,125,0.08)] hover:shadow-[0_20px_40px_-14px_rgba(9,42,125,0.18)] hover:border-primary/35 hover:-translate-y-1 transition-all duration-300 h-full"
                  >
                    {/* Protruding Left-Edge Vertical Brand Tab */}
                    <span
                      className={`absolute -left-[2px] top-5 sm:top-6 h-8 sm:h-10 w-[4px] rounded-r-full transition-all duration-300 group-hover:h-14 ${
                        i % 2 === 0 ? "bg-primary" : "bg-accent"
                      }`}
                    />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-mono font-bold text-corporate-gray/50 group-hover:text-primary transition-colors">
                          0{i + 1}
                        </span>
                      </div>

                      <h3 className="text-[14px] sm:text-lg font-semibold leading-snug mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                        {t(`home.whyChoose.items.${i}.title`)}
                      </h3>
                      <p className="text-[11.5px] sm:text-sm text-corporate-gray leading-relaxed line-clamp-3 sm:line-clamp-none">
                        {t(`home.whyChoose.items.${i}.desc`)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-primary/80 group-hover:text-primary">
                      <span>Widatra Standard</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          (02) & (05) MANUFACTURING EXCELLENCE + INTERACTIVE 6-STEP PROCESS TABS
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-10 sm:mb-14">
              <div className="lg:col-span-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                  {t("home.manufacturing.eyebrow")}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                  {t("home.manufacturing.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-primary">
                    {t("home.manufacturing.titleHighlight")}
                  </span>{" "}
                  {t("home.manufacturing.titleSuffix")}
                </h2>
              </div>
              <div className="lg:col-span-6">
                <p className="text-sm sm:text-base text-corporate-gray leading-relaxed">
                  {t("home.manufacturing.description")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-16">
            <div className="lg:col-span-7">
              <ScrollReveal animation="fade-right" className="h-full">
                <div className="relative h-full min-h-[300px] sm:min-h-[380px] rounded-[24px] sm:rounded-[28px] group overflow-hidden shadow-lg">
                  <img
                    src={productionImg}
                    alt="Production line"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/90 via-corporate-black/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white max-w-lg">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-mono font-bold mb-3">
                      {t("home.manufacturing.highlight.number")} · Core System
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                      {t("home.manufacturing.highlight.title")}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 mt-2.5 leading-relaxed">
                      {t("home.manufacturing.highlight.desc")}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {manufacturingItems.map((i) => (
                <ScrollReveal key={i} animation="fade-left" delay={i * 90}>
                  <div
                    className="group relative rounded-[20px] p-5 sm:p-6 bg-surface border-2 border-black/[0.05] dark:border-white/[0.07] hover:border-primary/40 hover:bg-white dark:hover:bg-card shadow-sm hover:shadow-md transition-all duration-300 h-full"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-1 rounded-full bg-accent group-hover:w-12 transition-all duration-300" />
                      <span className="text-xs font-mono text-corporate-gray">0{i + 2}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">
                      {t(`home.manufacturing.items.${i}.title`)}
                    </h4>
                    <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed">
                      {t(`home.manufacturing.items.${i}.desc`)}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Interactive 6-Step Manufacturing Process Switcher */}
          <div className="rounded-[26px] sm:rounded-[32px] bg-surface border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                  {t("home.process.eyebrow")}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                  {t("home.process.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-primary">
                    {t("home.process.titleHighlight")}
                  </span>{" "}
                  {t("home.process.titleSuffix")}
                </h2>
              </div>

              {/* Unified SubNavbar — Segmented Step Pills */}
              <SubNavbar
                activeId={activeProcessStep}
                onSelect={(i) => setActiveProcessStep(i)}
                items={processItems.map((i) => ({
                  id: i,
                  label: `${t("home.process.stepLabel")} 0${i + 1}`,
                }))}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {processItems.map((i) => {
                const isSelected = activeProcessStep === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveProcessStep(i)}
                    className={`text-left rounded-[18px] p-4 sm:p-5 transition-all duration-300 border-2 ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-[0_14px_30px_-10px_rgba(14,49,146,0.55)] -translate-y-1"
                        : "bg-white dark:bg-card border-black/[0.05] dark:border-white/[0.07] hover:border-primary/35"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-brand-tint dark:bg-white/[0.06] text-primary"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 ${isSelected ? "text-white" : "text-primary/30"}`}
                      />
                    </div>
                    <h4
                      className={`text-sm sm:text-base font-semibold mb-1.5 leading-snug ${
                        isSelected ? "text-white" : ""
                      }`}
                    >
                      {t(`home.process.items.${i}.title`)}
                    </h4>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? "text-white/85" : "text-corporate-gray"
                      }`}
                    >
                      {t(`home.process.items.${i}.desc`)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          (08) OUR PRODUCTS — Segmented Pill Tab Switcher + Interactive Cards
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                  {t("home.products.eyebrow")}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                  {t("home.products.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-primary">
                    {t("home.products.titleHighlight")}
                  </span>
                </h2>
              </div>

              {/* Unified SubNavbar — Product Category Switcher */}
              <SubNavbar
                activeId={activeProductTab}
                onSelect={(idx) => setActiveProductTab(idx)}
                items={productItems.map((p) => ({
                  id: p.index,
                  label: t(`home.products.items.${p.index}.title`),
                }))}
              />
            </div>
          </ScrollReveal>

          {/* Interactive Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {productItems.map((p) => {
              const isHighlighted = activeProductTab === p.index;
              return (
                <ScrollReveal key={p.index} animation="fade-up" delay={p.index * 110}>
                  <div
                    onClick={() => setActiveProductTab(p.index)}
                    className={`group cursor-pointer rounded-[24px] sm:rounded-[28px] bg-white dark:bg-card p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 border-2 h-full ${
                      isHighlighted
                        ? "border-primary shadow-[0_24px_50px_-16px_rgba(14,49,146,0.25)] -translate-y-1.5"
                        : "border-black/[0.06] dark:border-white/[0.08] hover:border-primary/40 hover:-translate-y-1"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary text-[10px] font-bold uppercase tracking-wider">
                          {p.badge}
                        </span>
                        <span className="text-xs font-mono text-corporate-gray">{p.code}</span>
                      </div>

                      <div className="h-52 sm:h-60 my-4 rounded-2xl bg-brand-soft/70 dark:bg-white/[0.03] p-6 flex items-center justify-center overflow-hidden">
                        <img
                          src={p.img}
                          alt={t(`home.products.items.${p.index}.title`)}
                          className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {t(`home.products.items.${p.index}.title`)}
                      </h3>
                      <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed">
                        {t(`home.products.items.${p.index}.desc`)}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                      >
                        {t("home.products.cta")}
                      </Link>
                      <span className="w-8 h-8 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          (03) PRODUCTION FACILITIES — Interactive Tabbed Showcase
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-corporate-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={aerialImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-[0.22em] mb-5">
                {t("home.facilities.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
                {t("home.facilities.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-blue-300">
                  {t("home.facilities.titleHighlight")}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8">
                {t("home.facilities.description")}
              </p>

              {/* 2x2 Interactive Facility Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {facilitiesItems.map((i) => {
                  const active = activeFacilityTab === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveFacilityTab(i)}
                      className={`text-left rounded-[18px] p-4 sm:p-5 border transition-all duration-300 ${
                        active
                          ? "bg-primary border-primary text-white shadow-lg -translate-y-0.5"
                          : "bg-white/[0.06] border-white/15 hover:bg-white/10 text-white"
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1.5">
                        Zone 0{i + 1}
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold mb-1">
                        {t(`home.facilities.items.${i}.title`)}
                      </h4>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {t(`home.facilities.items.${i}.desc`)}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8">
                <Link
                  to="/factory-tour"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white text-corporate-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all"
                >
                  <span>{t("home.facilities.cta")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-[28px] overflow-hidden border-2 border-white/15 shadow-2xl aspect-[4/3]">
                <img
                  src={facilityImages[activeFacilityTab]}
                  alt={t(`home.facilities.items.${activeFacilityTab}.title`)}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                      Pandaan Facility · Zone 0{activeFacilityTab + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">
                      {t(`home.facilities.items.${activeFacilityTab}.title`)}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          (07) QUALITY ASSURANCE & (09) R&D — Responsive 2-Col Bento
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-20">
          {/* Quality Assurance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal animation="fade-right">
                <div className="relative rounded-[28px] overflow-hidden shadow-lg aspect-[4/4.2]">
                  <img
                    src={scientistImg}
                    alt="Quality assurance scientist"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="text-xs font-mono uppercase tracking-widest opacity-80">
                      PIC/S Annex 1 Aligned
                    </div>
                    <div className="text-lg font-semibold">Microbiological & Endotoxin QC Lab</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-7">
              <ScrollReveal animation="fade-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                  {t("home.qa.eyebrow")}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
                  {t("home.qa.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-primary">
                    {t("home.qa.titleHighlight")}
                  </span>
                </h2>
                <p className="text-corporate-gray leading-relaxed mb-8 text-sm sm:text-base">
                  {t("home.qa.description")}
                </p>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
                  {qaStats.map((i) => (
                    <ScrollReveal key={i} animation="zoom-in" delay={i * 70}>
                      <div
                        className="rounded-2xl bg-surface p-4 sm:p-5 border border-black/[0.06] dark:border-white/[0.08] h-full"
                      >
                        <dt className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                          {t(`home.qa.stats.${i}.k`)}
                        </dt>
                        <dd className="text-[11px] font-medium text-corporate-gray leading-snug">
                          {t(`home.qa.stats.${i}.v`)}
                        </dd>
                      </div>
                    </ScrollReveal>
                  ))}
                </dl>
              </ScrollReveal>
            </div>
          </div>

          {/* R&D / Innovation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <ScrollReveal animation="fade-right" className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("home.rnd.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-4">
                {t("home.rnd.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("home.rnd.titleHighlight")}
                </span>
              </h2>
              <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
                {t("home.rnd.description")}
              </p>
            </ScrollReveal>
            <div className="lg:col-span-7 grid grid-cols-2 gap-3.5 sm:gap-5">
              {rndItems.map((i) => (
                <ScrollReveal
                  key={i}
                  animation="fade-up"
                  delay={i * 80}
                  className="group rounded-[20px] p-5 sm:p-6 bg-surface border-2 border-black/[0.05] dark:border-white/[0.07] hover:border-primary/35 hover:bg-white dark:hover:bg-card transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center mb-3.5 group-hover:bg-primary group-hover:text-white transition-colors">
                    {i % 2 === 0 ? (
                      <FlaskConical className="w-4 h-4" />
                    ) : (
                      <Microscope className="w-4 h-4" />
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold mb-1.5">
                    {t(`home.rnd.items.${i}.title`)}
                  </h4>
                  <p className="text-xs text-corporate-gray leading-relaxed">
                    {t(`home.rnd.items.${i}.desc`)}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          TAHAP 3: (06) CERTIFICATIONS & (10) BUSINESS PARTNERS
          Dual-Row Infinite Marquee Tracks (Moving in Opposite Directions)
      ================================================================= */}
      <section className="py-16 sm:py-24 bg-surface overflow-hidden">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("home.certifications.eyebrow")} &middot; {t("home.partners.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("home.certifications.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("home.certifications.titleHighlight")}
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm text-corporate-gray leading-relaxed">
                {t("home.certifications.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Row 1: Certifications Marquee (Left) */}
        <div className="relative mb-4">
          <div className="animate-marquee-left flex gap-4 px-2">
            {[...certificationItems, ...certificationItems].map((i, idx) => (
              <div
                key={`cert-${idx}`}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] shadow-sm whitespace-nowrap hover:border-primary transition-colors"
              >
                <span className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-xs sm:text-sm font-semibold">
                  {t(`home.certifications.items.${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Business Partners Marquee (Right) */}
        <div className="relative">
          <div className="animate-marquee-right flex gap-4 px-2">
            {[...partnerItems, ...partnerItems].map((i, idx) => (
              <div
                key={`partner-${idx}`}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] shadow-sm whitespace-nowrap hover:border-primary transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs sm:text-sm font-medium text-corporate-gray dark:text-white/80">
                  {t(`home.partners.items.${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          (11) INTERACTIVE COMPANY TIMELINE (1986 - 2025)
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                  {t("home.timeline.eyebrow")}
                </span>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                  {t("home.timeline.titlePrefix")}{" "}
                  <span className="font-serif-italic font-normal text-primary">
                    {t("home.timeline.titleHighlight")}
                  </span>
                </h2>
              </div>

              {/* Unified SubNavbar — Year Selector Pills */}
              <SubNavbar
                activeId={activeTimelineIndex}
                onSelect={(i) => setActiveTimelineIndex(i)}
                items={timelineItems.map((i) => ({
                  id: i,
                  label: t(`home.timeline.items.${i}.year`),
                }))}
              />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {timelineItems.map((i) => {
              const isSelected = activeTimelineIndex === i;
              return (
                <ScrollReveal
                  key={i}
                  animation="fade-up"
                  delay={i * 60}
                  onClick={() => setActiveTimelineIndex(i)}
                  className={`cursor-pointer rounded-[20px] p-5 transition-all duration-300 border-2 ${
                    isSelected
                      ? "bg-gradient-to-br from-primary to-brand-deep text-white border-primary shadow-xl -translate-y-1"
                      : "bg-surface border-black/[0.05] dark:border-white/[0.07] hover:border-primary/40"
                  }`}
                >
                  <div
                    className={`text-2xl sm:text-3xl font-bold font-mono mb-2 ${
                      isSelected ? "text-white" : "text-primary"
                    }`}
                  >
                    {t(`home.timeline.items.${i}.year`)}
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-semibold mb-1.5 ${
                      isSelected ? "text-white" : ""
                    }`}
                  >
                    {t(`home.timeline.items.${i}.title`)}
                  </h4>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? "text-white/85" : "text-corporate-gray"
                    }`}
                  >
                    {t(`home.timeline.items.${i}.desc`)}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          (14) INTERACTIVE FACTORY TOUR HUB (with Floating Feature Pills)
      ================================================================= */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-br from-[#061539] via-[#092A7D] to-[#051235] text-white">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              <Compass className="w-3.5 h-3.5 text-accent" />
              {t("home.factoryTour.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-4">
              {t("home.factoryTour.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-blue-200">
                {t("home.factoryTour.titleHighlight")}
              </span>
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed">
              {t("home.factoryTour.description")}
            </p>
          </ScrollReveal>

          {/* Centered Preview Frame Flanked by Floating Feature Pills */}
          <div className="relative max-w-4xl mx-auto">
            <ScrollReveal animation="zoom-in" duration={700}>
              <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden border-4 border-white/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] aspect-[16/9] relative group">
                <img
                  src={darkFactoryImg}
                  alt="Widatra Pandaan Factory Tour"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/85 via-[#051235]/25 to-transparent" />

                {/* Center Play / Tour Trigger Pill */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Link
                    to="/factory-tour"
                    className="inline-flex items-center gap-3 px-7 sm:px-9 py-4 rounded-full bg-white text-primary font-bold uppercase text-xs tracking-[0.22em] shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:bg-accent hover:text-white hover:scale-105 transition-all duration-300"
                  >
                    <span>{t("home.factoryTour.cta")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* 4 Floating Stat Pills around the hub (2x2 on mobile, floating on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5 lg:mt-6">
              {factoryTourStats.map((i) => (
                <ScrollReveal
                  key={i}
                  animation="fade-up"
                  delay={i * 80}
                  className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 flex items-center gap-3.5 hover:bg-white/15 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    0{i + 1}
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white leading-none">
                      {t(`home.factoryTour.stats.${i}.n`)}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-1">
                      {t(`home.factoryTour.stats.${i}.l`)}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          (12) LATEST NEWS & ARTICLES (CHEVRON INTERACTIVE STYLE)
      ================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-surface dark:bg-[#070e1e]/60 transition-colors">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Centered Section Header */}
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              (12) PUBLIKASI & ARTIKEL
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-corporate-black dark:text-white leading-tight">
              Berita & <span className="text-rose-600 dark:text-rose-500 font-serif italic">Artikel</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm md:text-base text-corporate-gray dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Dapatkan informasi terbaru mengenai kegiatan korporasi, prestasi, inovasi teknologi cairan infus, hingga program keberlanjutan dan edukasi kesehatan PT Widatra Bhakti.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Categories Card */}
            <ScrollReveal animation="fade-right" className="lg:col-span-3">
              <div className="rounded-[26px] bg-white dark:bg-card border border-black/10 dark:border-white/10 p-5 sm:p-6 shadow-sm lg:sticky lg:top-28">
                <h3 className="font-extrabold text-base sm:text-lg text-corporate-black dark:text-white mb-4 tracking-tight">
                  Categories
                </h3>
                <div className="flex flex-col gap-2.5">
                  {newsCategoriesList.map((catItem) => {
                    const isActive = newsCategory === catItem.key;
                    return (
                      <button
                        key={catItem.key}
                        type="button"
                        onClick={() => {
                          setNewsCategory(catItem.key);
                          setNewsPage(1);
                        }}
                        className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                            : "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-corporate-gray hover:text-corporate-black dark:hover:text-white border border-black/10 dark:border-white/10"
                        }`}
                      >
                        <span>{catItem.label}</span>
                        <span className={isActive ? "text-white/80 text-[11px]" : "text-corporate-gray/70 text-[11px]"}>
                          ({catItem.count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Search + Sort + 2x2 Grid + Slider */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-card border border-black/10 dark:border-white/10 shadow-sm">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-corporate-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newsSearch}
                    onChange={(e) => {
                      setNewsSearch(e.target.value);
                      setNewsPage(1);
                    }}
                    placeholder="Search Artikel/Berita.."
                    className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-corporate-black dark:text-white placeholder:text-corporate-gray/60"
                  />
                  {newsSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewsSearch("");
                        setNewsPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-corporate-gray hover:text-corporate-black cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 pr-2 border-t sm:border-t-0 sm:border-l border-black/5 dark:border-white/10 pt-2 sm:pt-0 sm:pl-4">
                  <span className="text-xs font-semibold text-corporate-gray shrink-0">Sort By</span>
                  <select
                    value={newsSort}
                    onChange={(e) => {
                      setNewsSort(e.target.value as any);
                      setNewsPage(1);
                    }}
                    className="text-xs font-bold text-corporate-black dark:text-white bg-transparent border border-black/10 dark:border-white/15 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="newest" className="dark:bg-slate-900">Newest</option>
                    <option value="oldest" className="dark:bg-slate-900">Oldest</option>
                    <option value="popular" className="dark:bg-slate-900">Most Viewed</option>
                  </select>
                </div>
              </div>

              {/* 2x2 Grid of News Cards */}
              {paginatedNewsArticles.length === 0 ? (
                <div className="rounded-[24px] bg-white dark:bg-card border border-dashed border-black/15 dark:border-white/15 p-12 text-center">
                  <p className="text-sm font-semibold text-corporate-gray mb-3">
                    Tidak ada berita atau artikel yang cocok dengan pencarian Anda.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewsSearch("");
                      setNewsCategory("Semua");
                      setNewsPage(1);
                    }}
                    className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {paginatedNewsArticles.map((article, idx) => (
                    <ScrollReveal key={article.slug} animation="fade-up" delay={idx * 70}>
                      <div
                        onClick={() => {
                          setSelectedNewsArticle(article);
                          setIsNewsModalOpen(true);
                        }}
                        className="group rounded-[22px] bg-white dark:bg-card border border-black/10 dark:border-white/10 hover:border-rose-500/50 dark:hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 cursor-pointer h-full"
                      >
                        {/* Left: Thumbnail Image */}
                        <div className="w-full sm:w-36 md:w-40 h-40 sm:h-36 shrink-0 rounded-2xl overflow-hidden relative bg-brand-soft">
                          <MediaImage
                            src={article.img}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Right: Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                              {article.cat}
                            </span>
                            <h4 className="font-bold text-sm sm:text-[15px] leading-snug line-clamp-2 mt-2 text-corporate-black dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                              {article.title}
                            </h4>
                            <p className="text-xs text-corporate-gray dark:text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                              {article.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-2 border-t border-black/5 dark:border-white/5 text-[11px] text-corporate-gray font-medium">
                            <span>{article.date}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {article.views ?? 12}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {/* Slider Pagination Controls */}
              {totalNewsPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
                  {/* Left Circle Button */}
                  <button
                    type="button"
                    disabled={currentNewsPage <= 1}
                    onClick={() => setNewsPage((p) => Math.max(1, p - 1))}
                    className="w-11 h-11 rounded-full bg-white dark:bg-card border border-black/10 dark:border-white/15 text-corporate-black dark:text-white hover:bg-rose-600 hover:text-white hover:border-rose-600 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shadow-sm cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Track with Slider Thumb */}
                  <div className="w-36 sm:w-52 h-2.5 bg-black/10 dark:bg-white/10 rounded-full relative overflow-hidden flex items-center p-0.5">
                    <div
                      className="h-full rounded-full bg-rose-600 transition-all duration-300"
                      style={{
                        width: `${Math.max(25, (1 / totalNewsPages) * 100)}%`,
                        transform: `translateX(${((currentNewsPage - 1) / Math.max(1, totalNewsPages - 1)) * (100 * (totalNewsPages - 1) / totalNewsPages)}%)`,
                      }}
                    />
                  </div>

                  {/* Right Circle Button */}
                  <button
                    type="button"
                    disabled={currentNewsPage >= totalNewsPages}
                    onClick={() => setNewsPage((p) => Math.min(totalNewsPages, p + 1))}
                    className="w-11 h-11 rounded-full bg-white dark:bg-card border border-black/10 dark:border-white/15 text-corporate-black dark:text-white hover:bg-rose-600 hover:text-white hover:border-rose-600 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shadow-sm cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal for Article Detail */}
        <NewsDetailModal
          article={selectedNewsArticle}
          open={isNewsModalOpen}
          onOpenChange={setIsNewsModalOpen}
          related={allPublishedArticles.slice(0, 3)}
          onSelectRelated={(slug) => {
            const found = allPublishedArticles.find((a) => a.slug === slug);
            if (found) setSelectedNewsArticle(found);
          }}
        />
      </section>

      {/* CSR HIGHLIGHTS */}
      <section className="py-16 sm:py-24 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("home.csr.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("home.csr.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("home.csr.titleHighlight")}
                </span>
              </h2>
            </div>
            <Link
              to="/csr"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-black/10 dark:border-white/15 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all self-start sm:self-auto"
            >
              {t("home.csr.cta")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <ScrollReveal animation="fade-up" delay={0}>
              <Link
                to="/csr"
                className="relative rounded-[24px] sm:rounded-[28px] group overflow-hidden aspect-[16/10] shadow-md block"
              >
                <img
                  src={csrCommunity}
                  alt="Community"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/85 via-corporate-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest mb-2.5">
                    {t("home.csr.community.label")}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    {t("home.csr.community.title")}
                  </h3>
                </div>
              </Link>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={120}>
              <Link
                to="/csr"
                className="relative rounded-[24px] sm:rounded-[28px] group overflow-hidden aspect-[16/10] shadow-md block"
              >
                <img
                  src={csrEnvironment}
                  alt="Environment"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/85 via-corporate-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest mb-2.5">
                    {t("home.csr.environment.label")}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    {t("home.csr.environment.title")}
                  </h3>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CAREERS PREVIEW */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <ScrollReveal animation="fade-right">
              <div className="rounded-[28px] overflow-hidden shadow-lg">
                <img
                  src={teamImg}
                  alt="Widatra team"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6">
            <ScrollReveal animation="fade-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("home.careers.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
                {t("home.careers.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("home.careers.titleHighlight")}
                </span>{" "}
                {t("home.careers.titleSuffix")}
              </h2>
              <p className="text-corporate-gray leading-relaxed mb-8 text-sm sm:text-base">
                {t("home.careers.description")}
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                {careersStats.map((i) => (
                  <ScrollReveal key={i} animation="zoom-in" delay={i * 80}>
                    <div
                      className="rounded-2xl bg-white dark:bg-card p-4 border border-black/[0.06] dark:border-white/[0.08]"
                    >
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        {t(`home.careers.stats.${i}.n`)}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray mt-1">
                        {t(`home.careers.stats.${i}.l`)}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_10px_24px_-6px_rgba(14,49,146,0.5)] hover:bg-brand-deep transition-all"
              >
                <span>{t("home.careers.cta")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-16 sm:py-20 bg-white dark:bg-card">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-primary via-brand-deep to-brand-ink text-primary-foreground p-7 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            <div className="lg:col-span-7">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("home.contact.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] text-balance">
                {t("home.contact.titlePrefix")}
                <span className="font-serif-italic font-normal text-blue-200">
                  {" "}
                  {t("home.contact.titleHighlight")}
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3.5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/75">
                  <MapPin className="w-3.5 h-3.5" />
                  {t("home.contact.jakartaLabel")}
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-white/90">
                  {t("home.contact.jakartaAddress")}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/75">
                  <MapPin className="w-3.5 h-3.5" />
                  {t("home.contact.pandaanLabel")}
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-white/90">
                  {t("home.contact.pandaanAddress")}
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-[0.22em] text-center hover:bg-accent hover:text-white transition-all shadow-lg mt-1"
              >
                <span>{t("home.contact.cta")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
