import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Building2,
  Compass,
  Newspaper,
  HeartHandshake,
  Users,
  MapPin,
  Phone,
  Sparkles,
  CheckCircle2,
  FlaskConical,
  Leaf,
} from "lucide-react";
import { WavyMarqueeRibbon } from "@/components/wavy-marquee-ribbon";
import { FlatCard3DImage } from "@/components/ui/flat-card-3d-image";
import { Interactive3DProductCard } from "@/components/ui/interactive-3d-product-card";
import { useLanguage } from "@/hooks/use-language";
import productionImg from "@/assets/production-line.jpg";
import scientistImg from "@/assets/scientist.jpg";
import aerialImg from "@/assets/factory-aerial.jpg";
import officeImg from "@/assets/office-building.jpg";
import teamImg from "@/assets/team.jpg";
import darkFactoryImg from "@/assets/dark-factory.jpg";
import csrCommunity from "@/assets/csr-community.jpg";
import csrEnvironment from "@/assets/csr-environment.jpg";
import ivBag from "@/assets/iv-bag-cutout.png";
import vial from "@/assets/vial-cutout.png";
import supplies from "@/assets/supplies-device.jpg";

export type HeroVariant =
  | "home"
  | "about"
  | "management"
  | "products"
  | "factory-tour"
  | "news"
  | "csr"
  | "careers"
  | "contact";

export function PageHero({
  eyebrow,
  title,
  italic,
  description,
  image,
  align = "left",
  children,
  minHeight = "min-h-[95vh]",
  showRibbon = true,
  variant = "home",
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  description?: string;
  image: string;
  align?: "left" | "center";
  children?: ReactNode;
  minHeight?: string;
  showRibbon?: boolean;
  variant?: HeroVariant;
}) {
  const { t } = useLanguage();

  return (
    <>
      <section
        className={`relative ${minHeight} w-full -mt-20 pt-28 sm:pt-32 lg:pt-36 pb-28 sm:pb-36 lg:pb-40 flex items-center overflow-hidden bg-[#061844] text-white`}
      >
        {/* Full-bleed background — cleanroom image smoothly dissolves into cleanroom navy */}
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover object-center scale-105 opacity-75"
            width={1920}
            height={1080}
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.7) 68%, rgba(0,0,0,0.2) 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.7) 68%, rgba(0,0,0,0.2) 88%, transparent 100%)",
            }}
          />
          {/* Balanced translucent navy gradient: readable on the left, airy & clear on the right */}
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

        {/* Standardized 2-Column Hero Content Container */}
        <div className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Copy Column */}
            <div
              className={`lg:col-span-7 animate-reveal order-2 lg:order-1 ${
                align === "center" ? "text-center" : "text-center lg:text-left"
              }`}
            >
              {/* Unified Pill Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                  {eyebrow}
                </span>
              </div>

              {/* Unified Hero H1 Size & Layout */}
              <h1 className="text-[34px] sm:text-[50px] lg:text-[64px] font-semibold leading-[1.06] tracking-[-0.03em] mb-6 text-balance text-white drop-shadow-[0_4px_24px_rgba(5,18,53,0.45)]">
                {title}{" "}
                {italic && (
                  <span className="font-serif-italic font-normal bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent block sm:inline">
                    {italic}
                  </span>
                )}
              </h1>

              {description && (
                <p className="text-sm sm:text-base lg:text-lg text-white/85 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8 sm:mb-10 text-pretty drop-shadow-[0_2px_12px_rgba(5,18,53,0.4)]">
                  {description}
                </p>
              )}

              {/* Pill CTA Cluster */}
              {children ? (
                children
              ) : (
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
                    className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white transition-all duration-300 group"
                  >
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors">
                      <span className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-current ml-0.5" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                      {t("home.hero.ctaTour")}
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Interactive Visual Collage — Unique Layout per Page! */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <HeroRightVisual variant={variant} mainImage={image} />
            </div>
          </div>
        </div>
      </section>

      {/* Wavy Moving Ribbon seamlessly bridging the gradient into page content */}
      {showRibbon && <WavyMarqueeRibbon variant="wave" />}
    </>
  );
}

function HeroRightVisual({
  variant,
  mainImage,
}: {
  variant: HeroVariant;
  mainImage: string;
}) {
  const [activeProd, setActiveProd] = useState(0);
  const [activeZone, setActiveZone] = useState(0);
  const [activeLoc, setActiveLoc] = useState(0);

  // 1. ABOUT US — Panoramic Aerial + Interactive Milestone Cards + Heritage Pill
  if (variant === "about") {
    return (
      <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-none">
        <div className="space-y-3.5 sm:space-y-4">
          {/* Top Panoramic Campus Card */}
          <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden border-2 border-white/25 shadow-2xl aspect-[16/10] group">
            <img
              src={aerialImg}
              alt="Pandaan Manufacturing Campus"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/85 via-transparent to-transparent" />
            <div className="absolute top-3.5 left-3.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-primary text-[10px] font-bold uppercase tracking-wider shadow">
                <Sparkles className="w-3 h-3 text-accent" /> Est. 1986 · Pandaan
              </span>
            </div>
            <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-left">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  5+ Hectares Green Campus
                </div>
                <div className="text-sm sm:text-base font-semibold text-white">
                  Otsuka Group Indonesia Member
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 2 Interactive Heritage Cards */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <div className="rounded-[24px] overflow-hidden border-2 border-white/25 bg-white/10 backdrop-blur-xl p-4 sm:p-5 text-left hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center mb-3 shadow">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white leading-none">38+ Yrs</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-1">
                Hospital Trust & Heritage
              </div>
            </div>

            <div className="rounded-[24px] overflow-hidden border-2 border-white/25 shadow-xl relative group aspect-[4/3]">
              <img
                src={teamImg}
                alt="Widatra Team"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 text-left">
                <div className="text-lg sm:text-xl font-bold text-white leading-none">1,000+</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-white/85 mt-0.5">
                  Dedicated Professionals
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. MANAGEMENT — Staggered 3-Pillar Executive & Governance Showcase
  if (variant === "management") {
    return (
      <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-none">
        <div className="grid grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Left Executive Portrait Card */}
          <div className="col-span-6 rounded-[28px] overflow-hidden border-2 border-white/25 shadow-2xl aspect-[3/4] relative group">
            <img
              src={scientistImg}
              alt="Executive Leadership"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-[9px] font-bold uppercase tracking-widest text-white mb-1">
                Leadership
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                Board of Commissioners & Directors
              </p>
            </div>
          </div>

          {/* Right Stacked Governance Pillars */}
          <div className="col-span-6 space-y-3 sm:space-y-4">
            <div className="rounded-[24px] overflow-hidden border-2 border-white/25 shadow-xl aspect-[4/3] relative group">
              <img
                src={officeImg}
                alt="Jakarta HQ"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 text-left">
                <div className="text-xs font-bold text-white">Corporate Governance</div>
                <div className="text-[10px] text-white/75">Otsuka Global Ethics</div>
              </div>
            </div>

            <div className="rounded-[24px] bg-white dark:bg-card text-corporate-black dark:text-white p-4 sm:p-5 shadow-2xl border border-black/5 text-left">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-brand-tint text-primary flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Otsuka Philosophy
                </span>
              </div>
              <p className="text-xs font-serif-italic text-corporate-gray leading-relaxed">
                "Otsuka-people creating new products for better health worldwide."
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. PRODUCTS — Interactive Live Product Pedestal Switcher inside Hero!
  if (variant === "products") {
    const heroProducts = [
      {
        title: "Basic Intravenous",
        code: "WIDA NS · RL · D5",
        badge: "LVP · Parenteral",
        img: ivBag,
        spec: "500 mL & 1000 mL Unicap",
      },
      {
        title: "Specialty Solutions",
        code: "WIDA KN · 2A · RD",
        badge: "Electrolyte & Nutrition",
        img: vial,
        spec: "Clinically Tuned Osmolarity",
      },
      {
        title: "Irrigation & Devices",
        code: "WIDA WI · WidaSet",
        badge: "Sterile Delivery",
        img: supplies,
        spec: "Apyrogenic Sterile System",
      },
    ];
    const current = heroProducts[activeProd];

    return (
      <Interactive3DProductCard
        key={current.title}
        title={current.title}
        subtitle={current.code}
        categoryBadge={current.badge}
        statusBadge="BPOM & Halal"
        specDetail={current.spec}
        imageSrc={current.img}
        imageAlt={current.title}
        maxTilt={10}
        header={
          <div className="flex items-center justify-between gap-1.5 p-1 rounded-full bg-white/15">
            {heroProducts.map((p, idx) => (
              <button
                key={p.title}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveProd(idx);
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-full text-[10px] font-bold transition-all cursor-pointer truncate ${
                  activeProd === idx
                    ? "bg-white text-primary shadow"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {p.title.split(" ")[0]}
              </button>
            ))}
          </div>
        }
      />
    );
  }

  // 4. FACTORY TOUR — Interactive 4-Zone Facility Explorer Hub
  if (variant === "factory-tour") {
    const zones = [
      { label: "Zone 01", name: "WFI Purification Loop", img: darkFactoryImg },
      { label: "Zone 02", name: "Grade A Sterile Filling", img: productionImg },
      { label: "Zone 03", name: "QC Microbiology Lab", img: scientistImg },
      { label: "Zone 04", name: "Pandaan Green Campus", img: aerialImg },
    ];
    return (
      <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-none">
        <div className="rounded-[32px] overflow-hidden border-2 border-white/25 shadow-2xl relative aspect-[4/3] group">
          <img
            src={zones[activeZone].img}
            alt={zones[activeZone].name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/90 via-[#051235]/20 to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-primary text-[10px] font-bold uppercase tracking-wider shadow">
              <Compass className="w-3.5 h-3.5 text-accent" /> Guided Plant Tour
            </span>
            <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-[10px] font-mono text-white">
              {zones[activeZone].label}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <div className="text-lg sm:text-xl font-semibold text-white">
              {zones[activeZone].name}
            </div>
            <div className="text-xs text-white/75">
              Click a facility zone below to preview
            </div>
          </div>
        </div>

        {/* 4 Interactive Zone Pills */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          {zones.map((z, idx) => (
            <button
              key={z.label}
              type="button"
              onClick={() => setActiveZone(idx)}
              className={`text-left px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                activeZone === idx
                  ? "bg-white text-primary border-white shadow-lg scale-[1.02]"
                  : "bg-white/12 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  activeZone === idx ? "bg-primary text-white" : "bg-white/15 text-white"
                }`}
              >
                0{idx + 1}
              </span>
              <span className="text-xs font-semibold truncate">{z.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 5. NEWS & EVENT — Editorial Magazine Stack + Live Dispatch Cards
  if (variant === "news") {
    return (
      <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-none space-y-3.5">
        {/* Featured Press Card */}
        <div className="rounded-[28px] overflow-hidden border-2 border-white/25 shadow-2xl relative aspect-[16/10] group">
          <img
            src={officeImg}
            alt="Corporate News"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/90 via-[#051235]/30 to-transparent" />
          <div className="absolute top-3.5 left-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider shadow">
              <Newspaper className="w-3 h-3" /> Featured Dispatch
            </span>
          </div>
          <div className="absolute bottom-3.5 left-4 right-4 text-left">
            <div className="text-[10px] font-mono uppercase tracking-wider text-blue-200">
              Corporate · Head Office
            </div>
            <div className="text-sm sm:text-base font-semibold text-white leading-snug">
              Pondok Indah Office Tower 1 & Pandaan Updates
            </div>
          </div>
        </div>

        {/* 2 Floating Newsroom Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="rounded-[22px] bg-white/12 backdrop-blur-xl border border-white/25 p-4 text-left hover:bg-white/20 transition-all">
            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200 block mb-1">
              Widatra Academy
            </span>
            <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
              Growing the Otsuka DNA in Every Team
            </div>
          </div>
          <div className="rounded-[22px] bg-white dark:bg-card text-corporate-black dark:text-white p-4 text-left shadow-xl">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary block mb-1">
              Press & Media
            </span>
            <div className="text-xs sm:text-sm font-bold leading-snug">
              Official Publications & Events
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. CSR — Dual Sustainability & Community Impact Mosaic
  if (variant === "csr") {
    return (
      <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-none">
        <div className="grid grid-cols-12 gap-3.5 items-center">
          <div className="col-span-6 space-y-3.5">
            <div className="rounded-[26px] overflow-hidden border-2 border-white/25 shadow-xl aspect-[4/4.5] relative group">
              <img
                src={csrCommunity}
                alt="Community Care"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/85 via-transparent to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-left">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-[9px] font-bold uppercase text-white">
                  Community
                </span>
                <div className="text-xs font-semibold text-white mt-1">
                  Public Health & Education
                </div>
              </div>
            </div>
            <div className="rounded-[22px] bg-white dark:bg-card text-corporate-black dark:text-white p-4 shadow-xl text-left flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-tint text-primary flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold">4 Core CSR Pillars</div>
                <div className="text-[10px] text-corporate-gray">Health · Edu · Env · Social</div>
              </div>
            </div>
          </div>

          <div className="col-span-6 space-y-3.5">
            <div className="rounded-[22px] bg-emerald-500/20 backdrop-blur-xl border border-emerald-300/35 p-4 text-left text-white shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-4 h-4 text-emerald-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  ISO 14001:2015
                </span>
              </div>
              <div className="text-sm font-bold">Green Manufacturing</div>
              <div className="text-[10px] text-white/80 mt-0.5">
                Certified Environmental Stewardship
              </div>
            </div>

            <div className="rounded-[26px] overflow-hidden border-2 border-white/25 shadow-xl aspect-[4/4.5] relative group">
              <img
                src={csrEnvironment}
                alt="Environmental Stewardship"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-transparent to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-left">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-[9px] font-bold uppercase text-white">
                  Environment
                </span>
                <div className="text-xs font-semibold text-white mt-1">
                  Pandaan Eco-Campus
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. CAREERS — Team Culture Showcase + Live Open Roles Card
  if (variant === "careers") {
    return (
      <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-none space-y-3.5">
        <div className="rounded-[28px] overflow-hidden border-2 border-white/25 shadow-2xl aspect-[16/10] relative group">
          <img
            src={teamImg}
            alt="Widatra Bhakti Team"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/85 via-transparent to-transparent" />
          <div className="absolute top-3.5 left-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-primary text-[10px] font-bold uppercase tracking-wider shadow">
              <Users className="w-3.5 h-3.5 text-accent" /> Life at Widatra
            </span>
          </div>
          <div className="absolute bottom-3.5 left-4 right-4 text-left">
            <div className="text-base sm:text-lg font-semibold text-white">
              Build a Career That Saves Lives
            </div>
            <div className="text-xs text-white/80">
              Pandaan Manufacturing Plant & Jakarta HQ
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[20px] bg-white/15 backdrop-blur-md border border-white/25 p-3.5 text-left">
            <div className="text-lg sm:text-xl font-bold text-white">7+</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/75">
              Departments
            </div>
          </div>
          <div className="rounded-[20px] bg-white/15 backdrop-blur-md border border-white/25 p-3.5 text-left">
            <div className="text-lg sm:text-xl font-bold text-white">Otsuka</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/75">
              Global DNA
            </div>
          </div>
          <div className="rounded-[20px] bg-white text-primary p-3.5 text-left shadow-lg">
            <div className="text-lg sm:text-xl font-bold">5-Step</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray">
              Fair ATS Flow
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. CONTACT — Interactive Dual Office Switcher Card (Jakarta HQ & Pandaan Plant)
  if (variant === "contact") {
    const locs = [
      {
        tag: "Corporate Head Office",
        city: "Jakarta Selatan",
        addr: "Pondok Indah Office Tower 1, Suite 902",
        phone: "+62-21-7592-3057",
        img: officeImg,
      },
      {
        tag: "Manufacturing Plant",
        city: "Pandaan, East Java",
        addr: "Jl. Stadion No. 1, Pandaan, Pasuruan 67156",
        phone: "+62-343-631575",
        img: aerialImg,
      },
    ];
    const loc = locs[activeLoc];
    return (
      <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-none">
        <div className="rounded-[30px] bg-white/12 backdrop-blur-xl border-2 border-white/25 p-5 shadow-2xl">
          <div className="flex gap-1.5 p-1 rounded-full bg-white/15 mb-4">
            {locs.map((l, idx) => (
              <button
                key={l.city}
                type="button"
                onClick={() => setActiveLoc(idx)}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeLoc === idx
                    ? "bg-white text-primary shadow"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {l.city}
              </button>
            ))}
          </div>

          <div className="rounded-[22px] overflow-hidden aspect-[16/9] relative mb-4">
            <img src={loc.img} alt={loc.city} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051235]/85 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3.5 right-3.5 text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-[9px] font-bold uppercase text-white">
                {loc.tag}
              </span>
              <div className="text-base font-semibold text-white mt-1">{loc.city}</div>
            </div>
          </div>

          <div className="space-y-2 text-left text-xs text-white/90 px-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
              <span>{loc.addr}</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <Phone className="w-4 h-4 text-blue-200 flex-shrink-0" />
              <span>{loc.phone}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT ("home"): Asymmetric 3-Image Bento Capsule Collage
  return (
    <div className="relative mx-auto max-w-[340px] sm:max-w-[420px] lg:max-w-none">
      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
        <div className="col-span-7">
          <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-white/25 shadow-2xl aspect-[3/4] relative group">
            <img
              src={mainImage || productionImg}
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
          <div className="rounded-[24px] sm:rounded-[30px] overflow-hidden border-2 border-white/25 shadow-xl aspect-square bg-white p-3 flex items-center justify-center group">
            <img
              src={ivBag}
              alt="WIDA IV Solution"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="rounded-[24px] sm:rounded-[30px] overflow-hidden border-2 border-white/25 shadow-xl aspect-[4/5] relative group">
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
      <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-5 px-4 py-3 rounded-2xl bg-white dark:bg-card text-corporate-black dark:text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-black/5 animate-float-slow">
        <div className="w-10 h-10 rounded-xl bg-brand-tint text-primary flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold leading-tight">Otsuka Group Standard</div>
          <div className="text-[10px] text-corporate-gray">Trusted by Hospitals Since 1986</div>
        </div>
      </div>
    </div>
  );
}
