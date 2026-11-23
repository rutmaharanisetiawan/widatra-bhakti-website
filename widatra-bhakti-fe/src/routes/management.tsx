import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/hooks/use-language";
import {
  ShieldCheck,
  Quote,
  Building2,
  MapPin,
  CheckCircle2,
  Sparkles,
  Award,
  X,
  UserCheck,
} from "lucide-react";
import officeImg from "@/assets/office-building.jpg";
import {
  PRESIDENT_DIRECTOR_MESSAGE,
  BOARD_OF_COMMISSIONERS,
  BOARD_OF_DIRECTORS,
  type ManagementLeader,
} from "@/lib/management-data";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Struktur Manajemen — PT Widatra Bhakti" },
      {
        name: "description",
        content:
          "Dewan Komisaris dan Dewan Direksi PT Widatra Bhakti (Otsuka Group). Kepemimpinan terpercaya yang mengawal keunggulan manufaktur cairan infus medis berkualitas tinggi di Indonesia.",
      },
      { property: "og:title", content: "Struktur Manajemen — PT Widatra Bhakti" },
      {
        property: "og:description",
        content:
          "Struktur resmi Dewan Komisaris dan Dewan Direksi PT Widatra Bhakti (Otsuka Group Indonesia).",
      },
    ],
  }),
  component: ManagementPage,
});

function ManagementPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [selectedLeader, setSelectedLeader] = useState<ManagementLeader | null>(null);

  return (
    <>
      <PageHero
        variant="management"
        eyebrow={isEn ? "(Management) Leadership" : "(Manajemen) Kepemimpinan"}
        title={isEn ? "Management Structure" : "Struktur Manajemen"}
        italic="PT Widatra Bhakti"
        description={
          isEn
            ? "Board of Commissioners and Board of Directors dedicated to advancing trusted, international-standard IV solutions across Indonesia and Asia (Otsuka Group)."
            : "Dewan Komisaris dan Dewan Direksi yang berdedikasi mengawal integritas tata kelola dan mutu manufaktur cairan infus steril standar internasional di Indonesia dan Asia (Otsuka Group)."
        }
        image={officeImg}
      />

      {/* =================================================================
          BAGIAN 1: PESAN DARI PRESIDEN DIREKTUR
          Layout Ramping, Bersih, & Elegan:
          - Sisi Kiri: Foto HD Presiden Direktur dalam bingkai minimalis modern
          - Sisi Kanan: Judul, 3 Paragraf Pesan Resmi, Metadata Poin, & Quote Box
      ================================================================= */}
      <section id="mgmt-letter" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-28">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* SISI KIRI: BINGKAI FOTO RAMPING ELEGAN (HD STUDIO PORTRAIT) */}
            <ScrollReveal animation="fade-right" className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-[340px] sm:max-w-[380px] w-full group">
                {/* Subtle Ambient Glow */}
                <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-tr from-primary/10 via-sky-400/10 to-transparent blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* Main Minimalist Frame */}
                <div className="relative rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 p-2.5 sm:p-3 border border-black/[0.08] dark:border-white/[0.1] shadow-[0_16px_45px_-12px_rgba(14,49,146,0.12)] transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_20px_50px_-10px_rgba(14,49,146,0.2)]">
                  
                  {/* Photo Container */}
                  <div className="rounded-[20px] overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[3/3.9] relative">
                    <img
                      src={PRESIDENT_DIRECTOR_MESSAGE.photo}
                      alt={PRESIDENT_DIRECTOR_MESSAGE.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-104"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                    {/* Minimalist Floating Badge on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-center">
                      <div className="inline-block px-3.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm">
                        <span className="text-[11px] font-bold text-primary dark:text-sky-300 uppercase tracking-wider">
                          {isEn ? PRESIDENT_DIRECTOR_MESSAGE.roleEn : PRESIDENT_DIRECTOR_MESSAGE.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Footer Nameplate */}
                  <div className="py-3 px-2 text-center">
                    <h3 className="text-xl font-bold text-corporate-black dark:text-white tracking-tight">
                      {PRESIDENT_DIRECTOR_MESSAGE.name}
                    </h3>
                    <p className="text-xs text-corporate-gray dark:text-gray-400 font-medium mt-0.5">
                      PT Widatra Bhakti &middot; Otsuka Group
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* SISI KANAN: PESAN RESMI DARI PRESIDEN DIREKTUR */}
            <ScrollReveal animation="fade-left" className="lg:col-span-7 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4 self-start">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? "Message from President Director" : "Pesan dari Presiden Direktur"}
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-corporate-black dark:text-white leading-[1.15] mb-5">
                {PRESIDENT_DIRECTOR_MESSAGE.name}
              </h2>

              {/* 3 Paragraf Pesan Resmi Asli */}
              <div className="space-y-4 text-corporate-gray dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                {(isEn ? PRESIDENT_DIRECTOR_MESSAGE.paragraphsEn : PRESIDENT_DIRECTOR_MESSAGE.paragraphs).map(
                  (p, idx) => (
                    <p key={idx}>{p}</p>
                  )
                )}
              </div>

              {/* Grid Metadata Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.06] text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray/70">
                      {isEn ? "Company & Affiliation" : "Perusahaan & Afiliasi"}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-corporate-black dark:text-white mt-0.5">
                      PT Widatra Bhakti (Otsuka Group)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.06] text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray/70">
                      {isEn ? "Manufacturing Plant" : "Pabrik Manufaktur"}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-corporate-black dark:text-white mt-0.5">
                      Pandaan, Pasuruan - Jawa Timur
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.06] text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray/70">
                      {isEn ? "Quality Assurance" : "Standar Kualitas"}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-corporate-black dark:text-white mt-0.5">
                      CPOB & WHO GMP (Bebas Pirogen)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.06] text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray/70">
                      {isEn ? "Focus" : "Fokus Produksi"}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-corporate-black dark:text-white mt-0.5">
                      Cairan Infus Steril & Solusi Kesehatan
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote Box Minimalis & Elegan */}
              <div className="mt-6 p-4 rounded-2xl bg-brand-tint/30 dark:bg-slate-800/40 border-l-3 border-primary dark:border-sky-400">
                <div className="flex items-start gap-3">
                  <Quote className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm italic font-medium text-corporate-black dark:text-white leading-relaxed">
                    "{isEn ? PRESIDENT_DIRECTOR_MESSAGE.highlightQuoteEn : PRESIDENT_DIRECTOR_MESSAGE.highlightQuote}"
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =================================================================
          BAGIAN 2: DEWAN KOMISARIS & DEWAN DIREKSI (LAYOUT FIX / HIERARCHICAL GRID)
          Sesuai permintaan: layout tetap (fixed), tidak memakai slider karena
          jumlah orang sedikit (2 Komisaris + 3 Direksi), dengan kartu berbingkai
          ramping, elegan, dan fotonya tajam (HD).
      ================================================================= */}
      <section id="mgmt-executive" className="py-16 sm:py-24 bg-surface dark:bg-[#070e1e]/60 scroll-mt-28 border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* -------------------------------------------------------------
              SUB-SEKSI A: DEWAN KOMISARIS (BOARD OF COMMISSIONERS)
              2 Orang: Kazushi Nagaya & Kimitaka Naito (Centered 2-Column Grid)
          ------------------------------------------------------------- */}
          <div className="mb-20">
            <ScrollReveal animation="fade-up" className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary dark:text-sky-400 block mb-2">
                {isEn ? "Board of Commissioners" : "Dewan Komisaris"}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-corporate-black dark:text-white tracking-tight">
                {isEn ? "Dewan Komisaris" : "Dewan Komisaris"}
              </h2>
              <div className="w-12 h-1 bg-primary/40 rounded-full mx-auto mt-3" />
            </ScrollReveal>

            {/* 2-Column Centered Fixed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
              {BOARD_OF_COMMISSIONERS.map((leader, idx) => (
                <ScrollReveal key={leader.id} animation="fade-up" delay={idx * 100}>
                  <div
                    onClick={() => setSelectedLeader(leader)}
                    className="group bg-white dark:bg-card rounded-[24px] p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-10px_rgba(14,49,146,0.14)] hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
                  >
                    {/* Portrait Frame Ramping */}
                    <div className="w-full aspect-[3/3.8] rounded-[18px] overflow-hidden bg-slate-50 dark:bg-slate-900 relative mb-4">
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Top Badge Pill */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-white border border-white/20">
                          {leader.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div className="w-full px-2 pb-1">
                      <h3 className="font-bold text-base sm:text-lg text-corporate-black dark:text-white group-hover:text-primary transition-colors tracking-tight">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-primary dark:text-sky-400 mt-0.5">
                        {isEn ? leader.roleEn : leader.role}
                      </p>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-corporate-gray dark:text-gray-400 mt-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                        <UserCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Otsuka Group</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------------
              SUB-SEKSI B: DEWAN DIREKSI (BOARD OF DIRECTORS)
              3 Orang: Suhari Mukti, Betty Zubaida, Evalin K. Jayakusli (Centered 3-Column Grid)
          ------------------------------------------------------------- */}
          <div>
            <ScrollReveal animation="fade-up" className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary dark:text-sky-400 block mb-2">
                {isEn ? "Board of Directors" : "Dewan Direksi"}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-corporate-black dark:text-white tracking-tight">
                {isEn ? "Dewan Direksi" : "Dewan Direksi"}
              </h2>
              <div className="w-12 h-1 bg-primary/40 rounded-full mx-auto mt-3" />
            </ScrollReveal>

            {/* 3-Column Centered Fixed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-4xl mx-auto">
              {BOARD_OF_DIRECTORS.map((leader, idx) => (
                <ScrollReveal key={leader.id} animation="fade-up" delay={idx * 100}>
                  <div
                    onClick={() => setSelectedLeader(leader)}
                    className="group bg-white dark:bg-card rounded-[24px] p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-10px_rgba(14,49,146,0.14)] hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
                  >
                    {/* Portrait Frame Ramping */}
                    <div className="w-full aspect-[3/3.8] rounded-[18px] overflow-hidden bg-slate-50 dark:bg-slate-900 relative mb-4">
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Top Badge Pill */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-white border border-white/20">
                          {leader.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div className="w-full px-2 pb-1">
                      <h3 className="font-bold text-base sm:text-lg text-corporate-black dark:text-white group-hover:text-primary transition-colors tracking-tight">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-primary dark:text-sky-400 mt-0.5">
                        {isEn ? leader.roleEn : leader.role}
                      </p>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-corporate-gray dark:text-gray-400 mt-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                        <UserCheck className="w-3.5 h-3.5 text-primary" />
                        <span>PT Widatra Bhakti</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          MODAL DETAIL PROFIL EKSEKUTIF SAAT KARTU DIKLIK
      ================================================================= */}
      {selectedLeader && (
        <div
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedLeader(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-sky-100 dark:border-sky-900 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedLeader(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-corporate-gray hover:text-corporate-black dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 border border-primary/20 shadow-md">
                <img
                  src={selectedLeader.photo}
                  alt={selectedLeader.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary text-[10px] font-bold uppercase tracking-wider">
                  {selectedLeader.categoryLabel}
                </span>
                <h3 className="text-xl font-bold text-corporate-black dark:text-white mt-1.5">
                  {selectedLeader.name}
                </h3>
                <p className="text-xs text-primary dark:text-sky-400 font-semibold mt-0.5">
                  {isEn ? selectedLeader.roleEn : selectedLeader.role}
                </p>
                <div className="text-[11px] text-corporate-gray dark:text-gray-400 mt-1">
                  {selectedLeader.division}
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-corporate-gray dark:text-gray-300 leading-relaxed">
              <p>{isEn ? selectedLeader.bioEn : selectedLeader.bio}</p>
              
              <div className="p-3.5 rounded-xl bg-brand-tint/40 dark:bg-slate-800/60 border-l-3 border-primary italic">
                "{isEn ? selectedLeader.quoteEn : selectedLeader.quote}"
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-corporate-gray">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>Otsuka Group Indonesia</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors"
              >
                {isEn ? "Close" : "Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          BAGIAN 3: TATA KELOLA PERUSAHAAN (GOVERNANCE)
      ================================================================= */}
      <section id="mgmt-governance" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-28">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              {isEn ? "(03) Corporate Governance" : "(03) Tata Kelola Korporasi"}
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-semibold leading-[1.15] tracking-[-0.025em] mb-5">
              {isEn ? "Built on" : "Dibangun atas"}{" "}
              <span className="font-serif-italic font-normal text-primary">
                {isEn ? "integrity & compliance." : "integritas & kepatuhan."}
              </span>
            </h2>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
              {isEn
                ? "Our corporate governance framework combines independent oversight by the Board of Commissioners and operational excellence by the Board of Directors aligned with Otsuka Global standards."
                : "Kerangka tata kelola PT Widatra Bhakti mengintegrasikan pengawasan independen Dewan Komisaris dan keunggulan operasional Dewan Direksi sesuai standar Otsuka Pharmaceutical Global."}
            </p>
          </ScrollReveal>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[0, 1, 2, 3].map((i) => (
              <ScrollReveal
                key={i}
                animation="fade-up"
                delay={i * 80}
                className="rounded-2xl p-5 bg-surface dark:bg-slate-900/60 border border-black/[0.06] dark:border-white/[0.08] hover:border-primary/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-tint dark:bg-white/[0.08] text-primary flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base mb-1 text-corporate-black dark:text-white">
                  {i === 0
                    ? isEn ? "Board of Commissioners" : "Dewan Komisaris"
                    : i === 1
                    ? isEn ? "Board of Directors" : "Dewan Direksi"
                    : i === 2
                    ? isEn ? "Pharmaceutical Quality (GMP)" : "Jaminan Mutu Farmasi (CPOB & GMP)"
                    : isEn ? "Safety & Environment (ISO 14001)" : "Keselamatan & Lingkungan (K3 & ISO 14001)"}
                </h4>
                <p className="text-xs text-corporate-gray leading-relaxed">
                  {i === 0
                    ? isEn ? "Independent oversight on corporate strategy, legal compliance, and risk management." : "Pengawasan independen terhadap strategi korporasi, kepatuhan hukum, dan manajemen risiko."
                    : i === 1
                    ? isEn ? "Operational execution of sterile manufacturing, closed-system technology, and financial administration." : "Eksekusi operasional manufaktur steril, inovasi teknologi closed-system, dan administrasi keuangan."
                    : i === 2
                    ? isEn ? "Ensuring 100% pyrogen-free sterile compliance across every production batch in Pandaan." : "Pengawasan kepatuhan sterilitas 100% bebas pirogen pada setiap batch produksi Pandaan."
                    : isEn ? "Sustainable green campus stewardship across 5+ hectares of modern facilities in Pandaan." : "Pengelolaan lingkungan kampus industri hijau berkelanjutan seluas 5+ hektar di Pandaan."}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
