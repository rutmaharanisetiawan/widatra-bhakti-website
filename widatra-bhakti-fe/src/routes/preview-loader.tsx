import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { IVDripLoader } from "@/components/ui/iv-drip-loader";
import { ArrowLeft, Play, Sparkles, Sliders, Droplets, Clock, Type } from "lucide-react";

export const Route = createFileRoute("/preview-loader")({
  head: () => ({
    meta: [
      { title: "Tumbling IV Drip Preloader Preview — PT Widatra Bhakti" },
      { name: "description", content: "Interactive preview for the kinetic tumbling IV drip loader" },
    ],
  }),
  component: LoaderPreviewPage,
});

const COLOR_PRESETS = [
  { name: "Medical Cyan", theme: "#0284c7", secondary: "#38bdf8" },
  { name: "Otsuka Navy", theme: "#0E3192", secondary: "#60a5fa" },
  { name: "Emerald Saline", theme: "#059669", secondary: "#34d399" },
  { name: "Amber Parenteral", theme: "#d97706", secondary: "#fbbf24" },
  { name: "Rose Pediatric", theme: "#e11d48", secondary: "#fb7185" },
  { name: "Violet Specialty", theme: "#7c3aed", secondary: "#a78bfa" },
];

function LoaderPreviewPage() {
  const [loadingText, setLoadingText] = useState("Memuat data formularium...");
  const [activeColorPreset, setActiveColorPreset] = useState(0);
  const [customTheme, setCustomTheme] = useState("#0284c7");
  const [customSecondary, setCustomSecondary] = useState("#38bdf8");
  const [duration, setDuration] = useState(3.0);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [fullscreenDemo, setFullscreenDemo] = useState(false);

  const currentTheme = customTheme;
  const currentSecondary = customSecondary;

  const triggerFullscreen = () => {
    setFullscreenDemo(true);
    setTimeout(() => {
      setFullscreenDemo(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-[#07090e] py-12 px-4 sm:px-6 lg:px-8">
      {/* Fullscreen Overlay Demo when triggered */}
      {fullscreenDemo && (
        <IVDripLoader
          loadingText={loadingText}
          themeColor={currentTheme}
          secondaryColor={currentSecondary}
          duration={duration}
          size={size}
          fullScreen
          blurBackdrop
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-brand-deep transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Produk</span>
          </Link>
          <span className="px-3.5 py-1 rounded-full bg-brand-tint dark:bg-white/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            Motion Engineering Demo
          </span>
        </div>

        {/* Title & Description */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-corporate-black dark:text-white mb-3">
            Tumbling IV Drip{" "}
            <span className="font-serif-italic font-normal text-primary">Preloader.</span>
          </h1>
          <p className="text-sm sm:text-base text-corporate-gray leading-relaxed">
            Animasi kantong infus jatuh dan bangkit bergantian dengan fisika permukaan cairan nyata
            (sloshing effect), tetesan dinamis, dan bayangan lantai sinkron.
          </p>
        </div>

        {/* Main Grid: Live Showcase & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================
              LEFT COLUMN (7 COLS): LIVE ANIMATED STAGE
          ======================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-[32px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-12 shadow-xl relative overflow-hidden min-h-[460px]">
            {/* Ambient Background Radial Halo */}
            <div
              className="absolute w-72 h-72 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-500"
              style={{ backgroundColor: currentTheme }}
            />

            {/* Stage Floor Line Reference */}
            <div className="absolute bottom-16 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent pointer-events-none" />

            {/* The Live Tumbling IV Drip Component */}
            <div className="relative z-10 my-auto">
              <IVDripLoader
                loadingText={loadingText}
                themeColor={currentTheme}
                secondaryColor={currentSecondary}
                duration={duration}
                size={size}
              />
            </div>

            {/* Action Bar */}
            <div className="w-full pt-6 mt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="font-mono text-corporate-gray text-[11px]">
                Titik Tumpu: <code className="text-primary font-bold">50% 95%</code>
              </span>
              <button
                type="button"
                onClick={triggerFullscreen}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-brand-deep active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Uji Fullscreen Overlay (3.5s)</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN (5 COLS): INTERACTIVE CONTROLS
          ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-6 rounded-[32px] bg-white dark:bg-card border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-black/5 dark:border-white/10">
              <Sliders className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-corporate-black dark:text-white">
                Pengaturan Props
              </h2>
            </div>

            {/* Control 1: Loading Text */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-corporate-black dark:text-white flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-primary" />
                <span>Loading Text</span>
              </label>
              <input
                type="text"
                value={loadingText}
                onChange={(e) => setLoadingText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-white/[0.04] text-xs font-medium focus:outline-hidden focus:border-primary"
                placeholder="Masukkan teks keterangan..."
              />
            </div>

            {/* Control 2: Color Presets */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-corporate-black dark:text-white flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-primary" />
                <span>Warna Cairan (Theme Color)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setActiveColorPreset(idx);
                      setCustomTheme(preset.theme);
                      setCustomSecondary(preset.secondary);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      activeColorPreset === idx
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-black/5 dark:border-white/10 hover:border-black/20 text-corporate-gray"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-xs shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${preset.secondary}, ${preset.theme})`,
                      }}
                    />
                    <span className="truncate text-[11px]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Duration Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-corporate-black dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Durasi Siklus</span>
                </label>
                <span className="font-mono text-primary font-bold">{duration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-corporate-gray font-mono">
                <span>Cepat (1.5s)</span>
                <span>Standar (3.0s)</span>
                <span>Lambat (5.0s)</span>
              </div>
            </div>

            {/* Control 4: Size Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-corporate-black dark:text-white">
                Ukuran (Size Variant)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      size === s
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface dark:bg-white/[0.04] border border-black/5 dark:border-white/10 text-corporate-gray hover:text-corporate-black"
                    }`}
                  >
                    {s} ({s === "sm" ? "75%" : s === "md" ? "100%" : "125%"})
                  </button>
                ))}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="mt-2 p-3.5 rounded-2xl bg-surface dark:bg-white/[0.03] border border-black/5 dark:border-white/10 text-[11px] font-mono text-corporate-gray overflow-x-auto">
              <code>
                {`<IVDripLoader\n  loadingText="${loadingText}"\n  themeColor="${currentTheme}"\n  duration={${duration}}\n  size="${size}"\n/>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
