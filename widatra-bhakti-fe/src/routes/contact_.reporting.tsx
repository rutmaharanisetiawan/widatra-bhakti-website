import { createFileRoute, Link } from "@tanstack/react-router";
import { SideEffectReportingForm } from "@/components/contact/side-effect-reporting-form";
import { useLanguage } from "@/hooks/use-language";
import { Phone, MessageSquare, ShieldCheck, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/contact_/reporting")({
  head: () => ({
    meta: [
      {
        title: "Pelaporan Efek Samping Obat (Farmakovigilans) — PT Widatra Bhakti",
      },
      {
        name: "description",
        content:
          "Formulir resmi pelaporan Kejadian Tidak Diinginkan (KTD) dan efek samping obat PT Widatra Bhakti sesuai regulasi Badan POM No. 4 Tahun 2026.",
      },
    ],
  }),
  component: SideEffectReportingPage,
});

function SideEffectReportingPage() {
  const { t, language } = useLanguage();
  const isId = language === "id";

  return (
    <div className="pt-6 sm:pt-10 pb-16 sm:pb-24 bg-surface min-h-screen">
      <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Compact Breadcrumb & Title */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-corporate-gray mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-corporate-gray/60" />
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-corporate-gray/60" />
            <span className="text-corporate-black dark:text-white font-semibold">
              {isId ? "Pelaporan Efek Samping Obat" : "Side Effect Reporting"}
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Farmakovigilans &middot; BPOM No. 4/2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-corporate-black dark:text-white">
                {t("sideEffectReporting.heroTitle")}{" "}
                <span className="font-serif-italic font-normal text-rose-600 dark:text-rose-400">
                  {t("sideEffectReporting.heroItalic")}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-corporate-gray max-w-2xl mt-1.5 leading-relaxed">
                {t("sideEffectReporting.heroDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Reporting Form Directly on Screen */}
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
    </div>
  );
}
