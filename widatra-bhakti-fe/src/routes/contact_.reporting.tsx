import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { useLanguage } from "@/hooks/use-language";
import { SideEffectReportingForm } from "@/components/contact/side-effect-reporting-form";
import { Phone, Mail, ShieldAlert, MessageSquare } from "lucide-react";
import scientistImg from "@/assets/scientist.jpg";

export const Route = createFileRoute("/contact_/reporting")({
  head: () => ({
    meta: [
      {
        title:
          "Side Effect Reporting (Pharmacovigilance) — PT Widatra Bhakti",
      },
      {
        name: "description",
        content:
          "Official Pharmacovigilance and Adverse Drug Reaction (ADR) reporting portal of PT Widatra Bhakti (Otsuka Group Indonesia). Report drug side effects securely.",
      },
      {
        property: "og:title",
        content: "Side Effect Reporting — PT Widatra Bhakti",
      },
    ],
  }),
  component: SideEffectReportingPage,
});

function SideEffectReportingPage() {
  const { t, language } = useLanguage();
  const isId = language === "id";

  useEffect(() => {
    // Smooth scroll down to the form when page loads so user doesn't get stuck on the top hero
    const timer = setTimeout(() => {
      const el = document.getElementById("report-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageHero
        variant="contact"
        eyebrow={t("sideEffectReporting.heroEyebrow")}
        title={t("sideEffectReporting.heroTitle")}
        italic={t("sideEffectReporting.heroItalic")}
        description={t("sideEffectReporting.heroDescription")}
        image={scientistImg}
      />

      {/* Main Section */}
      <section id="report-form" className="py-12 sm:py-16 bg-surface scroll-mt-24 sm:scroll-mt-28">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Sub Navigation Switcher */}
          <div className="flex items-center justify-center mb-8 sm:mb-12">
            <div className="inline-flex p-1.5 rounded-full bg-white dark:bg-card border border-black/[0.08] dark:border-white/[0.10] shadow-sm">
              <Link
                to="/contact"
                className="px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold text-corporate-gray dark:text-muted-foreground hover:text-primary transition-colors"
              >
                {t("sideEffectReporting.tabContact")}
              </Link>
              <span className="px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold bg-primary text-white shadow-sm">
                {t("sideEffectReporting.tabReporting")}
              </span>
            </div>
          </div>

          {/* Form Component */}
          <SideEffectReportingForm />

          {/* 24/7 Hotline Assistance Card */}
          <div className="mt-12 sm:mt-16 rounded-3xl bg-gradient-to-r from-accent via-rose-600 to-[#b50000] text-white p-7 sm:p-10 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-[0.22em]">
                {isId ? "Bantuan Darurat 24/7" : "Emergency Assistance 24/7"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                {isId
                  ? "Butuh Melaporkan Kasus KTD Kritis Segera?"
                  : "Need to Report a Critical ADR Case Urgently?"}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-xl">
                {isId
                  ? "Unit Farmakovigilans Widatra siap menerima laporan via saluran telepon darurat dan WhatsApp khusus keselamatan pasien."
                  : "Widatra's Pharmacovigilance Unit is accessible via emergency phone and dedicated WhatsApp channels for patient safety."}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <a
                href="https://wa.me/628001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-rose-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp PV Team</span>
              </a>
              <a
                href="tel:+622175923057"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/40 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>+62-21-7592-3057</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
