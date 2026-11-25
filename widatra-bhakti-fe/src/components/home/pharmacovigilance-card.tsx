import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeartPulse, ExternalLink, Copy, Check, QrCode } from "lucide-react";
import { toast } from "sonner";
import pharmacovigilanceQr from "@/assets/pharmacovigilance-qr.png";

export const PHARMACOVIGILANCE_FORM_URL =
  "https://forms.cloud.microsoft/pages/responsepage.aspx?id=x6kc8ucLxESeq4Fj-5cUb3nCfMnnxrVDor5CQMcqWLVUN1Q3TVVUVzRMNTVOU0Y0MTcyVTNRWTE5TS4u&route=shorturl";

export function PharmacovigilanceCard({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(PHARMACOVIGILANCE_FORM_URL);
      setCopied(true);
      toast.success(t("home.pharmacovigilance.linkCopied"));
      setTimeout(() => setCopied(false), 2400);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <ScrollReveal animation="fade-up" className={className}>
      <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-white via-slate-50/70 to-blue-50/30 dark:from-card dark:via-surface-2 dark:to-background border border-primary/15 dark:border-white/10 p-7 sm:p-10 lg:p-12 shadow-[0_20px_50px_-20px_rgba(14,49,146,0.12)] dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Information & Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10.5px] font-bold uppercase tracking-[0.20em] mb-3">
                <HeartPulse className="w-3.5 h-3.5" />
                {t("home.pharmacovigilance.eyebrow")}
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-corporate-black dark:text-white leading-[1.18] tracking-[-0.02em] text-balance">
                {t("home.pharmacovigilance.title")}
              </h3>
            </div>

            <div className="space-y-2 text-sm sm:text-base text-corporate-gray dark:text-slate-300 leading-relaxed">
              <p>{t("home.pharmacovigilance.intro1")}</p>
              <p className="font-medium text-corporate-black/90 dark:text-white/90">
                {t("home.pharmacovigilance.intro2")}
              </p>
            </div>

            {/* Clinical Value / Safety Participation Quote */}
            <div className="rounded-2xl bg-white/90 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 shadow-sm text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-l-rose-500">
              <p className="italic">
                &ldquo;{t("home.pharmacovigilance.participationNote")}&rdquo;
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={PHARMACOVIGILANCE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold uppercase tracking-[0.18em] shadow-lg shadow-rose-600/20 hover:shadow-rose-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{t("home.pharmacovigilance.openFormCta")}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-black/[0.12] dark:border-white/[0.15] bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-white/[0.06] text-corporate-black dark:text-white text-xs font-semibold tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-corporate-gray" />
                    <span>{t("home.pharmacovigilance.copyLink")}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive QR Code Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-card p-6 sm:p-7 shadow-[0_14px_40px_-10px_rgba(9,42,125,0.14)] dark:shadow-[0_14px_40px_-10px_rgba(0,0,0,0.6)] border border-primary/10 dark:border-white/10 flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] text-[10px] font-bold uppercase tracking-wider text-corporate-gray dark:text-slate-400 mb-3">
                <QrCode className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                {t("home.pharmacovigilance.scanInstruction")}
              </span>

              {/* QR Image with subtle scan frame */}
              <a
                href={PHARMACOVIGILANCE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                title={t("home.pharmacovigilance.scanInstruction")}
                className="group relative p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-inner hover:scale-105 hover:shadow-md transition-all duration-300 block"
              >
                <img
                  src={pharmacovigilanceQr}
                  alt="Pharmacovigilance QR Code"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                  loading="lazy"
                />
                <span className="absolute inset-0 rounded-2xl ring-2 ring-rose-500/0 group-hover:ring-rose-500/40 transition-all pointer-events-none" />
              </a>

              {/* Clickable link */}
              <a
                href={PHARMACOVIGILANCE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline inline-flex items-center gap-1.5"
              >
                <span>{t("home.pharmacovigilance.scanInstruction")}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="mt-2 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                {t("home.pharmacovigilance.officialBadge")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
