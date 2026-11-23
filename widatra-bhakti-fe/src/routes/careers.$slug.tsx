import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatJobDate } from "@/lib/jobs-data";
import { fetchPublishedJob, onJobsStoreChange } from "@/lib/jobs-store";
import { CareerFlow, type CareerFlowMode } from "@/components/career/career-flow";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { z } from "zod";

export const Route = createFileRoute("/careers/$slug")({
  validateSearch: z.object({ apply: z.coerce.number().optional() }),
  loader: async ({ params }) => {
    const job = await fetchPublishedJob(params.slug);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    const j = loaderData?.job;
    return {
      meta: [
        { title: `${j?.title ?? "Job"} — Careers · PT Widatra Bhakti` },
        { name: "description", content: j?.summary ?? "Career opportunity at Widatra Bhakti." },
      ],
    };
  },
  notFoundComponent: () => {
    const { t } = useLanguage();
    return (
      <div className="py-32 text-center">
        <p className="text-corporate-gray">{t("careers.detail.notFound")}</p>
        <Link to="/careers" className="text-primary underline mt-4 inline-block">{t("careers.detail.backToCareers")}</Link>
      </div>
    );
  },
  component: JobDetailPage,
});

function JobDetailPage() {
  const { job: loaderJob } = Route.useLoaderData();
  const { apply: applySearch } = Route.useSearch();
  const { t } = useLanguage();
  const [job, setJob] = useState(loaderJob);
  const [flowOpen, setFlowOpen] = useState(false);
  const [flowMode, setFlowMode] = useState<CareerFlowMode>("apply");

  useEffect(() => {
    setJob(loaderJob);
  }, [loaderJob]);

  useEffect(() => {
    const unsubscribe = onJobsStoreChange(() => {
      fetchPublishedJob(loaderJob.slug).then((fresh) => {
        if (fresh) setJob(fresh);
      });
    });
    return unsubscribe;
  }, [loaderJob.slug]);

  useEffect(() => {
    if (applySearch === 1) {
      setFlowMode("apply");
      setFlowOpen(true);
    }
  }, [applySearch]);

  const openApply = () => {
    setFlowMode("apply");
    setFlowOpen(true);
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-surface border-b border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 text-xs font-mono text-corporate-gray flex gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">{t("careers.detail.breadcrumbHome")}</Link><span>/</span>
          <Link to="/careers" className="hover:text-primary">{t("careers.detail.breadcrumbCareers")}</Link><span>/</span>
          <span className="text-corporate-black dark:text-foreground">{job.title}</span>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white dark:bg-card py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-12">
          <ScrollReveal animation="fade-right" className="col-span-12 lg:col-span-8">
            <span className="eyebrow text-primary mb-4 block">{job.department} · {job.level}</span>
            <h1 className="text-4xl lg:text-6xl font-light tracking-tighter mb-6 text-balance">{job.title}</h1>
            <p className="text-xl text-corporate-gray leading-relaxed max-w-2xl mb-8">{job.summary}</p>
            <div className="rounded-xl overflow-hidden aspect-[16/7] max-w-2xl">
              <MediaImage src={job.coverImage} alt={job.title} className="w-full h-full object-cover" />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="col-span-12 lg:col-span-4 bg-white dark:bg-card border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-8 self-start shadow-[0_10px_30px_-15px_rgba(9,42,125,0.18)]">
            <dl className="space-y-5 mb-8">
              <Row k={t("careers.detail.workingLocation")} v={job.location} />
              <Row k={t("careers.detail.workMode")} v={job.workMode} />
              <Row k={t("careers.detail.employmentType")} v={job.employmentType} />
              <Row k={t("careers.detail.level")} v={job.level} />
              {job.salary && <Row k={t("careers.detail.salary")} v={job.salary} />}
              <Row k={t("careers.detail.posted")} v={formatJobDate(job.posted)} />
              <Row k={t("careers.detail.deadline")} v={formatJobDate(job.deadline)} />
            </dl>
            <button onClick={openApply} className="w-full inline-flex items-center justify-center h-12 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-brand-deep transition-colors rounded shadow-[0_10px_24px_-8px_rgba(14,49,146,0.55)] cursor-pointer">
              {t("careers.detail.applyForRole")}
            </button>
            <Link to="/careers" className="mt-3 w-full inline-flex items-center justify-center h-11 border border-black/10 text-[11px] font-bold uppercase tracking-[0.22em] text-corporate-black dark:text-foreground rounded hover:border-primary hover:text-primary transition-colors">
              {t("careers.detail.backToAllRoles")}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Description */}
      <section className="bg-surface py-20">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 space-y-16">
          <ScrollReveal animation="fade-up">
            <Section title={t("careers.detail.jobDescription")}>
              <p className="text-lg text-corporate-black dark:text-foreground leading-relaxed">{job.description}</p>
            </Section>
          </ScrollReveal>
          <ScrollReveal animation="fade-up">
            <Section title={t("careers.detail.responsibilities")}><List items={job.responsibilities} /></Section>
          </ScrollReveal>
          <ScrollReveal animation="fade-up">
            <Section title={t("careers.detail.qualifications")}><List items={job.qualifications} /></Section>
          </ScrollReveal>
          <ScrollReveal animation="fade-up">
            <Section title={t("careers.detail.requirements")}><List items={job.requirements} /></Section>
          </ScrollReveal>
          <ScrollReveal animation="fade-up">
            <Section title={t("careers.detail.whatWeOffer")}><List items={job.benefits} /></Section>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" className="pt-8 border-t border-black/10 flex flex-wrap gap-4 items-center justify-between">
            <Link to="/careers" className="text-[11px] font-bold uppercase tracking-[0.25em] border-b border-corporate-black dark:border-white/30 pb-1">{t("careers.detail.allPositions")}</Link>
            <button onClick={openApply} className="px-10 py-4 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.25em] rounded shadow-[0_10px_24px_-8px_rgba(14,49,146,0.55)] cursor-pointer">
              {t("careers.detail.applyNow")}
            </button>
          </ScrollReveal>
        </div>
      </section>

      {flowOpen && (
        <CareerFlow
          key={job.slug}
          job={job}
          mode={flowMode}
          onClose={() => setFlowOpen(false)}
        />
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-corporate-gray mb-1">{k}</dt>
      <dd className="text-sm font-medium">{v}</dd>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-light tracking-tight mb-6 pb-3 border-b border-black/10">{title}</h2>
      {children}
    </div>
  );
}
function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="text-corporate-black dark:text-foreground leading-relaxed flex gap-3">
          <span className="text-primary mt-2 flex-shrink-0">•</span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
