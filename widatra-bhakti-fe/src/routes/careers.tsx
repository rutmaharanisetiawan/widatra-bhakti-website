import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SubNavbar } from "@/components/sub-navbar";
import { CheckCircle2, Briefcase, Sparkles, Building2, HeartHandshake } from "lucide-react";
import teamImg from "@/assets/team.jpg";
import scientistImg from "@/assets/scientist.jpg";
import productionImg from "@/assets/production-line.jpg";
import officeImg from "@/assets/office-building.jpg";
import { DEPARTMENTS, formatJobDate, type Job } from "@/lib/jobs-data";
import { CareerFlow, type CareerFlowMode } from "@/components/career/career-flow";
import { useLanguage } from "@/hooks/use-language";
import { usePublishedJobs } from "@/hooks/use-jobs";
import { MediaImage } from "@/components/media/media-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — PT Widatra Bhakti" },
      {
        name: "description",
        content:
          "Build your career inside Indonesia's leading parenteral pharmaceutical manufacturer. Explore open positions, life at Widatra, benefits and recruitment process.",
      },
      { property: "og:title", content: "Careers — PT Widatra Bhakti" },
    ],
  }),
  component: CareersPage,
});

const BRANDING_ITEMS = [0, 1, 2, 3] as const;
const TESTIMONIAL_ITEMS = [0, 1, 2] as const;
const BENEFIT_ITEMS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const PROCESS_ITEMS = [0, 1, 2, 3, 4] as const;
const DEPT_ITEMS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const BRANDING_ICONS = [Briefcase, Sparkles, Building2, HeartHandshake] as const;

function CareersPage() {
  const { t } = useLanguage();
  const { jobs } = usePublishedJobs();
  const [dept, setDept] = useState<string>("All");
  const [activeProcessIdx, setActiveProcessIdx] = useState<number>(0);
  const sortedJobs = [...jobs].sort((a, b) => Number(b.featured) - Number(a.featured));
  const filtered = dept === "All" ? sortedJobs : sortedJobs.filter((j) => j.department === dept);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [activeMode, setActiveMode] = useState<CareerFlowMode>("detail");

  const openJob = (job: Job, mode: CareerFlowMode) => {
    setActiveJob(job);
    setActiveMode(mode);
  };

  const deptNavItems = DEPARTMENTS.map((d) => ({
    id: d,
    label: t(`careers.departmentLabels.${d}`),
    count:
      d === "All" ? sortedJobs.length : sortedJobs.filter((j) => j.department === d).length,
  }));

  return (
    <>
      <PageHero
        variant="careers"
        eyebrow={t("careers.hero.eyebrow")}
        title={t("careers.hero.title")}
        italic={t("careers.hero.italic")}
        description={t("careers.hero.description")}
        image={teamImg}
      />

      {/* EMPLOYER BRANDING — Interactive Rounded Cards */}
      <section className="py-16 sm:py-24 bg-white dark:bg-card">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("careers.branding.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
              {t("careers.branding.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("careers.branding.titleHighlight")}
              </span>
            </h2>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
              {t("careers.branding.description")}
            </p>
          </ScrollReveal>
          <div className="lg:col-span-7 grid grid-cols-2 gap-3.5 sm:gap-5">
            {BRANDING_ITEMS.map((i) => {
              const Icon = BRANDING_ICONS[i];
              return (
                <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                  <div
                    className="group relative rounded-[20px] sm:rounded-[22px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 hover:bg-white dark:hover:bg-card hover:border-primary/40 hover:shadow-[0_18px_36px_-12px_rgba(9,42,125,0.18)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <span
                      className={`absolute -left-[2px] top-5 h-7 w-[4px] rounded-r-full transition-all group-hover:h-11 ${
                        i % 2 === 0 ? "bg-primary" : "bg-accent"
                      }`}
                    />
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center mb-3.5 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
                      {t(`careers.branding.items.${i}.title`)}
                    </h4>
                    <p className="text-xs text-corporate-gray leading-relaxed">
                      {t(`careers.branding.items.${i}.desc`)}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIFE AT WIDATRA */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("careers.life.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("careers.life.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("careers.life.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="zoom-in" duration={700} className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            <div className="lg:col-span-7 rounded-[24px] overflow-hidden shadow-md group">
              <img
                src={productionImg}
                alt="Production"
                className="w-full h-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
              <div className="rounded-[24px] overflow-hidden shadow-md group">
                <img
                  src={scientistImg}
                  alt="Scientist"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="rounded-[24px] overflow-hidden shadow-md group">
                <img
                  src={officeImg}
                  alt="Office"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-white dark:bg-card">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="mb-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("careers.testimonials.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("careers.testimonials.titlePrefix")}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {t("careers.testimonials.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {TESTIMONIAL_ITEMS.map((i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 90}>
                <article
                  className="group relative rounded-[24px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="absolute -left-[2px] top-6 h-8 w-[4px] rounded-r-full bg-primary group-hover:h-12 transition-all" />
                  <p className="text-base sm:text-lg font-serif-italic text-primary leading-relaxed mb-6">
                    "{t(`careers.testimonials.items.${i}.quote`)}"
                  </p>
                  <div>
                    <div className="text-sm font-semibold">
                      {t(`careers.testimonials.items.${i}.name`)}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray mt-1">
                      {t(`careers.testimonials.items.${i}.role`)}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS — 2-Col Mobile / 4-Col Desktop Rounded Cards */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("careers.benefits.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("careers.benefits.title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {BENEFIT_ITEMS.map((i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 70}>
                <div
                  className="group relative rounded-[20px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 hover:border-primary/40 hover:shadow-[0_18px_36px_-12px_rgba(9,42,125,0.16)] hover:-translate-y-1 transition-all duration-300"
                >
                  <span
                    className={`absolute -left-[2px] top-5 h-7 w-[4px] rounded-r-full transition-all group-hover:h-11 ${
                      i % 2 === 0 ? "bg-primary" : "bg-accent"
                    }`}
                  />
                  <div className="text-xs font-mono font-bold text-primary mb-2.5">0{i + 1}</div>
                  <h4 className="text-sm sm:text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
                    {t(`careers.benefits.items.${i}.title`)}
                  </h4>
                  <p className="text-xs text-corporate-gray leading-relaxed">
                    {t(`careers.benefits.items.${i}.desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECRUITMENT PROCESS — Header + SubNavbar matching Screenshot */}
      <section className="py-16 sm:py-24 bg-white dark:bg-card">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("careers.process.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {t("careers.process.titlePrefix")}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {t("careers.process.titleHighlight")}
                </span>
              </h2>
            </div>

            <SubNavbar
              activeId={activeProcessIdx}
              onSelect={(idx) => setActiveProcessIdx(idx)}
              items={PROCESS_ITEMS.map((i) => ({
                id: i,
                label: t(`careers.process.items.${i}.title`),
              }))}
            />
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
            {PROCESS_ITEMS.map((i) => {
              const isSelected = activeProcessIdx === i;
              return (
                <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                  <div
                    onClick={() => setActiveProcessIdx(i)}
                    className={`cursor-pointer rounded-[20px] p-5 transition-all duration-300 border-2 ${
                      isSelected
                        ? "bg-gradient-to-br from-primary to-brand-deep text-white border-primary shadow-xl -translate-y-1"
                        : "bg-surface border-black/[0.05] dark:border-white/[0.07] hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-lg font-mono font-bold ${
                          isSelected ? "text-white" : "text-primary"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 ${isSelected ? "text-white" : "text-primary/30"}`}
                      />
                    </div>
                    <h4
                      className={`text-sm sm:text-base font-semibold mb-1.5 ${
                        isSelected ? "text-white" : ""
                      }`}
                    >
                      {t(`careers.process.items.${i}.title`)}
                    </h4>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? "text-white/85" : "text-corporate-gray"
                      }`}
                    >
                      {t(`careers.process.items.${i}.desc`)}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              {t("careers.departmentsSection.eyebrow")}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              {t("careers.departmentsSection.title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {DEPT_ITEMS.map((i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 70}>
                <div
                  className="group relative rounded-[20px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="absolute -left-[2px] top-5 h-7 w-[4px] rounded-r-full bg-primary group-hover:h-11 transition-all" />
                  <h4 className="text-sm sm:text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
                    {t(`careers.departmentsSection.items.${i}.title`)}
                  </h4>
                  <p className="text-xs text-corporate-gray leading-relaxed">
                    {t(`careers.departmentsSection.items.${i}.desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS — Header + SubNavbar matching Screenshot */}
      <section id="openings" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                {t("careers.openings.eyebrow")}
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                {filtered.length}{" "}
                <span className="font-serif-italic font-normal text-primary">
                  {filtered.length === 1
                    ? t("careers.openings.roleOpenSingular")
                    : t("careers.openings.roleOpenPlural")}
                </span>
              </h2>
            </div>

            <SubNavbar
              activeId={dept}
              onSelect={(d) => setDept(d)}
              items={deptNavItems}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((j, idx) => (
              <ScrollReveal key={j.slug} animation="fade-up" delay={idx * 80}>
                <article
                  className="group relative flex flex-col bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] rounded-[24px] p-5 sm:p-6 shadow-[0_6px_24px_-12px_rgba(9,42,125,0.08)] hover:shadow-[0_22px_44px_-14px_rgba(9,42,125,0.22)] hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
                >
                  <span
                    className={`absolute -left-[2px] top-6 h-8 w-[4px] rounded-r-full transition-all duration-300 group-hover:h-14 ${
                      idx % 2 === 0 ? "bg-primary" : "bg-accent"
                    }`}
                  />

                  <div className="relative aspect-[16/9] rounded-[18px] overflow-hidden mb-5">
                    <MediaImage
                      src={j.coverImage}
                      alt={j.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {j.featured && (
                      <span className="absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        {t("careers.openings.featuredBadge")}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary text-[10px] font-bold uppercase tracking-wider">
                        {j.department}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray">
                        {j.level}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-corporate-black dark:text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                      {j.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-corporate-gray leading-relaxed line-clamp-3 mb-5">
                      {j.summary}
                    </p>

                    <dl className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-surface mb-5 text-xs">
                      <div>
                        <dt className="text-[9px] font-bold uppercase tracking-wider text-corporate-gray/70 mb-0.5">
                          {t("careers.openings.locationLabel")}
                        </dt>
                        <dd className="font-semibold">{j.location}</dd>
                      </div>
                      <div>
                        <dt className="text-[9px] font-bold uppercase tracking-wider text-corporate-gray/70 mb-0.5">
                          {t("careers.openings.typeLabel")}
                        </dt>
                        <dd className="font-semibold">{j.employmentType}</dd>
                      </div>
                      <div>
                        <dt className="text-[9px] font-bold uppercase tracking-wider text-corporate-gray/70 mb-0.5">
                          {t("careers.openings.workModeLabel")}
                        </dt>
                        <dd className="font-semibold">{j.workMode}</dd>
                      </div>
                      <div>
                        <dt className="text-[9px] font-bold uppercase tracking-wider text-corporate-gray/70 mb-0.5">
                          {t("careers.openings.deadlineLabel")}
                        </dt>
                        <dd className="font-mono text-[11px]">{formatJobDate(j.deadline)}</dd>
                      </div>
                    </dl>

                    <div className="mt-auto flex gap-2.5">
                      <button
                        onClick={() => openJob(j, "detail")}
                        className="flex-1 inline-flex items-center justify-center h-11 rounded-full border-2 border-primary/20 text-primary text-xs font-bold hover:bg-brand-tint hover:border-primary transition-all cursor-pointer"
                      >
                        {t("careers.openings.viewDetails")}
                      </button>
                      <button
                        onClick={() => openJob(j, "apply")}
                        className="flex-1 inline-flex items-center justify-center h-11 rounded-full bg-gradient-to-r from-primary to-brand-deep text-white text-xs font-bold hover:opacity-95 shadow-[0_6px_16px_-4px_rgba(14,49,146,0.5)] transition-all cursor-pointer"
                      >
                        {t("careers.openings.applyNow")}
                      </button>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {activeJob && (
        <CareerFlow
          job={activeJob}
          mode={activeMode}
          onClose={() => setActiveJob(null)}
        />
      )}
    </>
  );
}
