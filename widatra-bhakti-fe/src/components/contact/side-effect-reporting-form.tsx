import React, { useState, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { addContactInquiry } from "@/lib/contact-store";
import {
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Calendar,
  User,
  Building,
  Phone,
  FileText,
  CheckCircle2,
  Printer,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Loader2,
  QrCode,
  Lock,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import pharmacovigilanceQr from "@/assets/pharmacovigilance-qr.png";

export const PHARMACOVIGILANCE_FORM_URL =
  "https://forms.cloud.microsoft/pages/responsepage.aspx?id=x6kc8ucLxESeq4Fj-5cUb3nCfMnnxrVDor5CQMcqWLVUN1Q3TVVUVzRMNTVOU0Y0MTcyVTNRWTE5TS4u&route=shorturl";

const PRODUCT_OPTIONS = [
  "WIDA D5-1/4 NS",
  "WIDA NS",
  "WIDA RL 500 ml",
  "WIDA D5-NS",
  "WIDA D5-1/2 NS",
  "SODIUM CHLORIDE 0,9% 500 ml",
  "SODIUM CHLORIDE 0,9% 1000 ml",
  "RINGER LACTATE 500 ml",
  "WIDA KN-2",
  "WIDA 2A",
  "WIDA WI",
  "RINGER LACTATE 500 ml - OTSUKA INDONESIA",
  "OTSU NS - OTSUKA INDONESIA",
  "SODIUM CHLORIDE 500 ml - OTSUKA INDONESIA",
  "OTSU RL - OTSUKA INDONESIA",
] as const;

const PROFESSIONS = ["Dokter", "Perawat", "Apoteker", "Other"] as const;

export interface SideEffectFormData {
  agreedToPolicy: boolean;
  productName: string;
  usageDate: string;
  reactionDescription: string;
  reactionDate?: string;
  patientName: string;
  patientDob: string;
  patientAge: string;
  reporterName: string;
  reporterEmail?: string;
  profession: string;
  professionOther?: string;
  institutionAddress: string;
  phone: string;
}

export function SideEffectReportingForm() {
  const { t, language } = useLanguage();
  const isId = language === "id";

  const formTopRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string>("");

  const scrollToForm = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const el = document.getElementById("report-form");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [formData, setFormData] = useState<SideEffectFormData>({
    agreedToPolicy: false,
    productName: "",
    usageDate: "",
    reactionDescription: "",
    reactionDate: "",
    patientName: "",
    patientDob: "",
    patientAge: "",
    reporterName: "",
    reporterEmail: "",
    profession: "Dokter",
    professionOther: "",
    institutionAddress: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (
    field: keyof SideEffectFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToPolicy) {
      setErrors({ agreedToPolicy: t("sideEffectReporting.consentError") });
      toast.error(t("sideEffectReporting.consentError"));
      return;
    }
    setErrors({});
    setStep(2);
    setTimeout(scrollToForm, 50);
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.productName.trim()) {
      errs.productName = t("sideEffectReporting.requiredError");
    }
    if (!formData.usageDate.trim()) {
      errs.usageDate = t("sideEffectReporting.requiredError");
    }
    if (!formData.reactionDescription.trim()) {
      errs.reactionDescription = t("sideEffectReporting.requiredError");
    } else if (formData.reactionDescription.trim().length < 30) {
      errs.reactionDescription = t("sideEffectReporting.minCharError");
    }
    if (!formData.patientName.trim()) {
      errs.patientName = t("sideEffectReporting.requiredError");
    }
    if (!formData.patientDob.trim()) {
      errs.patientDob = t("sideEffectReporting.requiredError");
    }
    if (!formData.patientAge.trim()) {
      errs.patientAge = t("sideEffectReporting.requiredError");
    }
    if (!formData.reporterName.trim()) {
      errs.reporterName = t("sideEffectReporting.requiredError");
    }
    if (formData.profession === "Other" && !formData.professionOther?.trim()) {
      errs.professionOther = t("sideEffectReporting.requiredError");
    }
    if (!formData.institutionAddress.trim()) {
      errs.institutionAddress = t("sideEffectReporting.requiredError");
    }
    if (!formData.phone.trim()) {
      errs.phone = t("sideEffectReporting.requiredError");
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      toast.error(
        isId
          ? "Mohon lengkapi seluruh bidang bertanda bintang (*) dengan benar."
          : "Please complete all required fields (*) properly."
      );
      return;
    }

    setIsSubmitting(true);

    const code = `PV-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const formattedMessage = [
      `=== LAPORAN FARMAKOVIGILANS / EFEK SAMPING OBAT (ADR) ===`,
      `Kode Referensi : ${code}`,
      `Waktu Lapor    : ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB`,
      ``,
      `[1. INFORMASI PRODUK & EFEK SAMPING]`,
      `• Nama Produk              : ${formData.productName}`,
      `• Tanggal Penggunaan Obat  : ${formData.usageDate}`,
      `• Tanggal Kejadian Reaksi  : ${formData.reactionDate || "-"}`,
      `• Gejala / Reaksi Pasien   :`,
      `${formData.reactionDescription}`,
      ``,
      `[2. INFORMASI PASIEN]`,
      `• Nama / Inisial Pasien    : ${formData.patientName}`,
      `• Tanggal Lahir            : ${formData.patientDob}`,
      `• Umur Pasien              : ${formData.patientAge} Tahun`,
      ``,
      `[3. DATA PELAPOR & FASILITAS KESEHATAN]`,
      `• Nama Pelapor             : ${formData.reporterName}`,
      `• Profesi / Kategori       : ${formData.profession === "Other" ? `Lainnya (${formData.professionOther})` : formData.profession}`,
      `• Telepon / WhatsApp       : ${formData.phone}`,
      `• Email Pelapor            : ${formData.reporterEmail?.trim() || "-"}`,
      `• Fasilitas Kesehatan / Alamat :`,
      `${formData.institutionAddress}`,
      ``,
      `[4. REGULASI & PERSETUJUAN DATA PRIBADI]`,
      `• Status Persetujuan       : Disetujui (Sesuai Peraturan BPOM No. 4 Tahun 2026)`,
    ].join("\n");

    try {
      await addContactInquiry({
        id: code,
        name: formData.reporterName,
        organization: formData.institutionAddress.split("\n")[0] || formData.profession,
        email: formData.reporterEmail?.trim() || "pv-report@widatra.com",
        phone: formData.phone,
        subject: `[ADR] ${formData.productName} - Pasien: ${formData.patientName} (${code})`,
        message: formattedMessage,
        source: "Pharmacovigilance (ADR)",
      });
    } catch (err) {
      console.warn("Backend ADR record warning:", err);
    }

    setReferenceCode(code);
    setIsSubmitting(false);
    setStep(3);
    toast.success(t("sideEffectReporting.successTitle"));
    setTimeout(scrollToForm, 60);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setFormData({
      agreedToPolicy: false,
      productName: "",
      usageDate: "",
      reactionDescription: "",
      reactionDate: "",
      patientName: "",
      patientDob: "",
      patientAge: "",
      reporterName: "",
      reporterEmail: "",
      profession: "Dokter",
      professionOther: "",
      institutionAddress: "",
      phone: "",
    });
    setErrors({});
    setReferenceCode("");
    setStep(1);
    setTimeout(scrollToForm, 60);
  };

  return (
    <div ref={formTopRef} id="reporting-form-card" className="space-y-8 scroll-mt-28">
      {/* Top Helper Banner with QR link to Microsoft Forms */}
      <div className="rounded-2xl sm:rounded-3xl border border-primary/15 dark:border-white/10 bg-gradient-to-r from-blue-50/70 via-white to-rose-50/40 dark:from-surface-2 dark:via-card dark:to-background p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-card border border-primary/20 shadow-sm flex items-center justify-center flex-shrink-0">
            <QrCode className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-xs sm:text-sm text-corporate-black/90 dark:text-foreground/90">
            <p className="font-semibold text-primary dark:text-blue-400 mb-0.5">
              {isId ? "Formulir Resmi Terverifikasi" : "Official Verified Form"}
            </p>
            <p className="text-muted-foreground text-xs">
              {t("sideEffectReporting.msFormsNote")}
            </p>
          </div>
        </div>

        <a
          href={PHARMACOVIGILANCE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 hover:border-primary/40 bg-white dark:bg-card hover:bg-slate-50 text-primary dark:text-blue-400 text-xs font-semibold whitespace-nowrap shadow-sm transition-all"
        >
          <span>{t("sideEffectReporting.openMsForms")}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-card shadow-xl overflow-hidden">
        {/* Progress Stepper Bar */}
        <div className="border-b border-black/[0.06] dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.02] px-6 sm:px-10 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  step >= 1
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                1
              </span>
              <span className="text-xs font-semibold hidden sm:inline text-corporate-black dark:text-foreground">
                {isId ? "Persetujuan Privasi" : "Privacy Consent"}
              </span>
            </div>

            <div
              className={`h-[2px] flex-1 mx-3 sm:mx-4 transition-colors ${
                step >= 2 ? "bg-primary" : "bg-slate-200 dark:bg-white/10"
              }`}
            />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  step >= 2
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                2
              </span>
              <span className="text-xs font-semibold hidden sm:inline text-corporate-black dark:text-foreground">
                {isId ? "Rincian Keluhan" : "Complaint Details"}
              </span>
            </div>

            <div
              className={`h-[2px] flex-1 mx-3 sm:mx-4 transition-colors ${
                step === 3 ? "bg-primary" : "bg-slate-200 dark:bg-white/10"
              }`}
            />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  step === 3
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                ✓
              </span>
              <span className="text-xs font-semibold hidden sm:inline text-corporate-black dark:text-foreground">
                {isId ? "Selesai" : "Completed"}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-10 lg:p-12">
          {/* STEP 1: Privacy Consent */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="max-w-3xl mx-auto space-y-6">
              <div className="text-center sm:text-left space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isId ? "Kebijakan Data Pribadi" : "Data Privacy Policy"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                  {t("sideEffectReporting.step1Title")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t("sideEffectReporting.step1Description")}
                </p>
              </div>

              {/* Legal Clauses Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/70 dark:bg-surface-2 p-5 sm:p-7 space-y-4 text-xs sm:text-sm leading-relaxed text-corporate-black/85 dark:text-slate-300">
                <p className="font-semibold text-corporate-black dark:text-white">
                  {isId
                    ? "1. Dengan mengisi form ini, Anda memberikan izin kepada Unit Farmakovigilans PT Widatra Bhakti (“Widatra”) untuk menyimpan dan memproses Data Pribadi Anda, baik Data Pribadi Umum maupun Data Pribadi Spesifik/Sensitif, untuk tujuan-tujuan berikut ini:"
                    : "1. By filling out this form, you authorize the Pharmacovigilance Unit of PT Widatra Bhakti (“Widatra”) to store and process your Personal Data, both general and sensitive/specific, strictly for the following purposes:"}
                </p>
                <ol className="list-decimal pl-5 space-y-2.5 marker:text-primary font-normal">
                  <li>
                    {isId
                      ? "Tujuan pengumpulan data laporan Efek Samping Obat ini adalah untuk mengimplementasikan salah satu kewajiban Pemilik Izin Edar dalam pelaporan Farmakovigilans berdasarkan Peraturan Badan POM No. 4 tahun 2026 tentang Pelaksanaan Farmakovigilans;"
                      : "The purpose of collecting this Adverse Drug Reaction report is to fulfill the Marketing Authorization Holder's legal obligations under BPOM Regulation No. 4 of 2026 on the Implementation of Pharmacovigilance;"}
                  </li>
                  <li>
                    {isId
                      ? "Widatra menjamin untuk mengelola dan menyimpan data yang Anda cantumkan di dalam form ini dari akses pengungkapan dan penyalahgunaan;"
                      : "Widatra guarantees to safeguard and manage the data you provide in this form against unauthorized access, disclosure, and misuse;"}
                  </li>
                  <li>
                    {isId
                      ? "Widatra menjamin tidak akan menggunakan data yang Anda cantumkan di dalam form ini di luar dari keperluan Farmakovigilans."
                      : "Widatra guarantees that your data will never be utilized outside the strict scope of Pharmacovigilance and patient safety evaluation."}
                  </li>
                </ol>
                <p className="pt-2 border-t border-slate-200 dark:border-white/10 text-xs italic text-muted-foreground">
                  {isId
                    ? "Dengan ini menyatakan, saya telah membaca dan memahami syarat dan ketentuan yang berlaku pada form pendaftaran ini."
                    : "By proceeding, I declare that I have read, understood, and agreed to the applicable terms and privacy conditions."}
                </p>
              </div>

              {/* Consent Toggle / Radio Checkbox */}
              <div
                onClick={() =>
                  handleFieldChange("agreedToPolicy", !formData.agreedToPolicy)
                }
                className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  formData.agreedToPolicy
                    ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/50 ring-2 ring-rose-500/20"
                    : "bg-white dark:bg-card border-slate-200 dark:border-white/10 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  id="agreedToPolicy"
                  checked={formData.agreedToPolicy}
                  onChange={(e) =>
                    handleFieldChange("agreedToPolicy", e.target.checked)
                  }
                  className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <label
                  htmlFor="agreedToPolicy"
                  className="text-xs sm:text-sm font-semibold text-corporate-black dark:text-foreground cursor-pointer select-none"
                >
                  {t("sideEffectReporting.consentCheckbox")}
                  <span className="text-rose-600 ml-1 font-bold">*</span>
                </label>
              </div>

              {errors.agreedToPolicy && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.agreedToPolicy}
                </p>
              )}

              {/* Action */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-brand-deep text-white text-xs font-bold uppercase tracking-[0.18em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>{t("sideEffectReporting.nextStep")}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Main Form Fields */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  <HeartPulse className="w-3.5 h-3.5" />
                  {isId ? "Bagian 2: Informasi Keluhan" : "Part 2: Complaint Information"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                  {t("sideEffectReporting.step2Title")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isId
                    ? "Tanda bintang (*) menandakan bidang wajib diisi."
                    : "Fields marked with an asterisk (*) are required."}
                </p>
              </div>

              {/* Sub-section A: Product & Reaction */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-7 space-y-5 bg-slate-50/50 dark:bg-surface-2/40">
                <div className="flex items-center gap-2 text-sm font-bold text-primary pb-2 border-b border-slate-200/80 dark:border-white/10">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>
                    {isId ? "1. Produk & Reaksi Obat" : "1. Product & Reaction"}
                  </span>
                </div>

                {/* Question 2: Product Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                    {t("sideEffectReporting.productLabel")}
                    <span className="text-rose-600 ml-1 font-bold">*</span>
                  </label>
                  <select
                    value={formData.productName}
                    onChange={(e) =>
                      handleFieldChange("productName", e.target.value)
                    }
                    className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.productName
                        ? "border-rose-500"
                        : "border-slate-300 dark:border-white/15"
                    }`}
                  >
                    <option value="">
                      {t("sideEffectReporting.selectProductPlaceholder")}
                    </option>
                    {PRODUCT_OPTIONS.map((prod) => (
                      <option key={prod} value={prod}>
                        {prod}
                      </option>
                    ))}
                  </select>
                  {errors.productName && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.productName}
                    </p>
                  )}
                </div>

                {/* Question 3: Usage Date & Question 5: Reaction Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {t("sideEffectReporting.usageDateLabel")}
                      <span className="text-rose-600 ml-1 font-bold">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.usageDate}
                      onChange={(e) =>
                        handleFieldChange("usageDate", e.target.value)
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.usageDate
                          ? "border-rose-500"
                          : "border-slate-300 dark:border-white/15"
                      }`}
                    />
                    {errors.usageDate && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.usageDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {t("sideEffectReporting.reactionDateLabel")}
                    </label>
                    <input
                      type="date"
                      value={formData.reactionDate}
                      onChange={(e) =>
                        handleFieldChange("reactionDate", e.target.value)
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Question 4: Reaction Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground">
                      {t("sideEffectReporting.reactionLabel")}
                      <span className="text-rose-600 ml-1 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {formData.reactionDescription.length}/30 min
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.reactionDescription}
                    onChange={(e) =>
                      handleFieldChange("reactionDescription", e.target.value)
                    }
                    placeholder={t("sideEffectReporting.reactionHint")}
                    className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.reactionDescription
                        ? "border-rose-500"
                        : "border-slate-300 dark:border-white/15"
                    }`}
                  />
                  {errors.reactionDescription && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.reactionDescription}
                    </p>
                  )}
                </div>
              </div>

              {/* Sub-section B: Patient Details */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-7 space-y-5 bg-slate-50/50 dark:bg-surface-2/40">
                <div className="flex items-center gap-2 text-sm font-bold text-primary pb-2 border-b border-slate-200/80 dark:border-white/10">
                  <User className="w-4 h-4 text-primary" />
                  <span>
                    {isId ? "2. Data Pasien" : "2. Patient Information"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Question 6: Patient Name / Initials */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {t("sideEffectReporting.patientNameLabel")}
                      <span className="text-rose-600 ml-1 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tn. B / Ny. S"
                      value={formData.patientName}
                      onChange={(e) =>
                        handleFieldChange("patientName", e.target.value)
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.patientName
                          ? "border-rose-500"
                          : "border-slate-300 dark:border-white/15"
                      }`}
                    />
                    {errors.patientName && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.patientName}
                      </p>
                    )}
                  </div>

                  {/* Question 7: Patient DOB */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {t("sideEffectReporting.patientDobLabel")}
                      <span className="text-rose-600 ml-1 font-bold">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.patientDob}
                      onChange={(e) =>
                        handleFieldChange("patientDob", e.target.value)
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.patientDob
                          ? "border-rose-500"
                          : "border-slate-300 dark:border-white/15"
                      }`}
                    />
                    {errors.patientDob && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.patientDob}
                      </p>
                    )}
                  </div>

                  {/* Question 8: Patient Age */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {t("sideEffectReporting.patientAgeLabel")}
                      <span className="text-rose-600 ml-1 font-bold">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="130"
                      placeholder="e.g. 45"
                      value={formData.patientAge}
                      onChange={(e) =>
                        handleFieldChange("patientAge", e.target.value)
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.patientAge
                          ? "border-rose-500"
                          : "border-slate-300 dark:border-white/15"
                      }`}
                    />
                    {errors.patientAge && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.patientAge}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-section C: Reporter & Institution */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-7 space-y-5 bg-slate-50/50 dark:bg-surface-2/40">
                <div className="flex items-center gap-2 text-sm font-bold text-primary pb-2 border-b border-slate-200/80 dark:border-white/10">
                  <Building className="w-4 h-4 text-primary" />
                  <span>
                    {isId
                      ? "3. Data Pelapor & Fasilitas Kesehatan"
                      : "3. Reporter & Healthcare Institution"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Question 9: Reporter Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {t("sideEffectReporting.reporterNameLabel")}
                      <span className="text-rose-600 ml-1 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nama lengkap pelapor"
                      value={formData.reporterName}
                      onChange={(e) =>
                        handleFieldChange("reporterName", e.target.value)
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.reporterName
                          ? "border-rose-500"
                          : "border-slate-300 dark:border-white/15"
                      }`}
                    />
                    {errors.reporterName && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.reporterName}
                      </p>
                    )}
                  </div>

                  {/* Question 12: Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {t("sideEffectReporting.phoneLabel")}
                      <span className="text-rose-600 ml-1 font-bold">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 08123456789"
                      value={formData.phone}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value)
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.phone
                          ? "border-rose-500"
                          : "border-slate-300 dark:border-white/15"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Optional Email for Confirmation Receipt */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                      {isId ? "Email Pelapor (Opsional)" : "Reporter Email (Optional)"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. pelapor@rs.co.id"
                        value={formData.reporterEmail || ""}
                        onChange={(e) =>
                          handleFieldChange("reporterEmail", e.target.value)
                        }
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Question 10: Profession / Relation */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-2">
                    {t("sideEffectReporting.professionLabel")}
                    <span className="text-rose-600 ml-1 font-bold">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PROFESSIONS.map((prof) => (
                      <label
                        key={prof}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                          formData.profession === prof
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white dark:bg-card border-slate-200 dark:border-white/10 text-muted-foreground hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="profession"
                          value={prof}
                          checked={formData.profession === prof}
                          onChange={(e) =>
                            handleFieldChange("profession", e.target.value)
                          }
                          className="w-3.5 h-3.5 text-primary"
                        />
                        <span>{prof === "Other" ? (isId ? "Lainnya" : "Other") : prof}</span>
                      </label>
                    ))}
                  </div>

                  {formData.profession === "Other" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder={
                          isId
                            ? "Sebutkan profesi / hubungan (misal: Pasien / Keluarga)"
                            : "Specify profession or relation to patient"
                        }
                        value={formData.professionOther || ""}
                        onChange={(e) =>
                          handleFieldChange("professionOther", e.target.value)
                        }
                        className={`w-full h-10 px-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.professionOther
                            ? "border-rose-500"
                            : "border-slate-300 dark:border-white/15"
                        }`}
                      />
                      {errors.professionOther && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.professionOther}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Question 11: Institution & Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black/85 dark:text-foreground mb-1.5">
                    {t("sideEffectReporting.institutionLabel")}
                    <span className="text-rose-600 ml-1 font-bold">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. RSUD dr. Soetomo, Jl. Mayjen Prof. Dr. Moestopo No. 6-8, Surabaya"
                    value={formData.institutionAddress}
                    onChange={(e) =>
                      handleFieldChange("institutionAddress", e.target.value)
                    }
                    className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.institutionAddress
                        ? "border-rose-500"
                        : "border-slate-300 dark:border-white/15"
                    }`}
                  />
                  {errors.institutionAddress && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.institutionAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setTimeout(scrollToForm, 50);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-semibold text-corporate-black dark:text-foreground transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t("sideEffectReporting.prevStep")}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold uppercase tracking-[0.18em] shadow-lg shadow-rose-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("sideEffectReporting.submitting")}</span>
                    </>
                  ) : (
                    <>
                      <HeartPulse className="w-4 h-4" />
                      <span>{t("sideEffectReporting.submitReport")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Submission Success Receipt */}
          {step === 3 && (
            <div className="max-w-xl mx-auto text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  {t("sideEffectReporting.successTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  {t("sideEffectReporting.successMessage")}
                </p>
              </div>

              {/* Reference Card */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-3 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-semibold">{t("sideEffectReporting.refCode")}</span>
                  <span className="font-mono font-bold text-sm tracking-wider">
                    {referenceCode}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-corporate-black/80 dark:text-slate-300">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {t("sideEffectReporting.productLabel")}
                    </span>
                    <span className="font-semibold">{formData.productName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {t("sideEffectReporting.patientNameLabel")}
                    </span>
                    <span className="font-semibold">{formData.patientName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {t("sideEffectReporting.reporterNameLabel")}
                    </span>
                    <span className="font-semibold">{formData.reporterName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      {isId ? "Waktu Lapor" : "Reported At"}
                    </span>
                    <span className="font-semibold">
                      {new Date().toLocaleDateString(isId ? "id-ID" : "en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-card hover:bg-slate-50 text-xs font-semibold text-corporate-black dark:text-foreground transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4 text-primary" />
                  <span>{t("sideEffectReporting.printReport")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-brand-deep text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <span>{t("sideEffectReporting.submitAnother")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
