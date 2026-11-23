import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShieldCheck, Factory, Award } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface ProductionDataPoint {
  year: string;
  volume: number; // Millions of units
  quality: number; // Quality pass rate %
  growth: string;
}

const PRODUCTION_DATA: ProductionDataPoint[] = [
  { year: "1990", volume: 22, quality: 99.85, growth: "+15%" },
  { year: "1998", volume: 45, quality: 99.90, growth: "+35%" },
  { year: "2006", volume: 78, quality: 99.94, growth: "+28%" },
  { year: "2014", volume: 110, quality: 99.96, growth: "+22%" },
  { year: "2020", volume: 135, quality: 99.98, growth: "+18%" },
  { year: "2024", volume: 154, quality: 99.99, growth: "+14%" },
];

export function ProductionCapacityChart() {
  const [activeMetric, setActiveMetric] = useState<"volume" | "quality">("volume");

  return (
    <ScrollReveal animation="fade-up" duration={700}>
      <div className="rounded-[28px] sm:rounded-[32px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-[0_16px_45px_-12px_rgba(9,42,125,0.12)] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-400/10 dark:bg-sky-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl pointer-events-none" />

        {/* Header & Metric Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Pertumbuhan Kapasitas & Standar Mutu</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Kapasitas Produksi & Konsistensi Mutu Farmasi
            </h3>
            <p className="text-xs sm:text-sm text-corporate-gray mt-1.5 max-w-xl">
              Dedikasi lebih dari 38 tahun memasok cairan infus dasar berkualitas tinggi ke rumah sakit di seluruh Indonesia.
            </p>
          </div>

          {/* Metric Toggle Buttons */}
          <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveMetric("volume")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeMetric === "volume"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-primary"
              }`}
            >
              Kapasitas (Juta Unit / Tahun)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric("quality")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeMetric === "quality"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-primary"
              }`}
            >
              Tingkat Kelulusan QC (%)
            </button>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 relative z-10">
          <div className="rounded-2xl bg-surface dark:bg-slate-900/60 p-4 border border-black/[0.04] dark:border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-wider text-corporate-gray font-semibold mb-1">
              Kapasitas Saat Ini
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-sky-300 leading-none">
              150M+
            </div>
            <div className="text-[10px] text-corporate-gray mt-1">Botol infus per tahun</div>
          </div>
          <div className="rounded-2xl bg-surface dark:bg-slate-900/60 p-4 border border-black/[0.04] dark:border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-wider text-corporate-gray font-semibold mb-1">
              Batch QC Pass Rate
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">
              99.99%
            </div>
            <div className="text-[10px] text-corporate-gray mt-1">Sesuai standar CPOB</div>
          </div>
          <div className="rounded-2xl bg-surface dark:bg-slate-900/60 p-4 border border-black/[0.04] dark:border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-wider text-corporate-gray font-semibold mb-1">
              Area Fasilitas
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-sky-300 leading-none">
              5+ Ha
            </div>
            <div className="text-[10px] text-corporate-gray mt-1">Pabrik modern Pandaan</div>
          </div>
          <div className="rounded-2xl bg-surface dark:bg-slate-900/60 p-4 border border-black/[0.04] dark:border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-wider text-corporate-gray font-semibold mb-1">
              Standar Bersih
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-accent dark:text-sky-400 leading-none">
              Grade A
            </div>
            <div className="text-[10px] text-corporate-gray mt-1">Closed-System Filling</div>
          </div>
        </div>

        {/* Animated Recharts Container */}
        <div className="h-[280px] sm:h-[340px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetric === "volume" ? (
              <AreaChart data={PRODUCTION_DATA} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  unit="M"
                  domain={[0, 180]}
                  width={48}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ProductionDataPoint;
                      return (
                        <div className="rounded-xl bg-slate-900 text-white p-3 shadow-xl border border-sky-500/30 text-xs">
                          <div className="font-bold text-sky-400 text-sm mb-1">Tahun {data.year}</div>
                          <div className="text-white/90">
                            Volume: <span className="font-bold text-white">{data.volume} Juta Botol</span>
                          </div>
                          <div className="text-emerald-400 mt-1">QC Pass Rate: {data.quality}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                  animationDuration={1400}
                  animationEasing="ease-out"
                />
              </AreaChart>
            ) : (
              <BarChart data={PRODUCTION_DATA} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                  domain={[99.8, 100]}
                  width={55}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ProductionDataPoint;
                      return (
                        <div className="rounded-xl bg-slate-900 text-white p-3 shadow-xl border border-sky-500/30 text-xs">
                          <div className="font-bold text-sky-400 text-sm mb-1">Tahun {data.year}</div>
                          <div className="text-emerald-400">
                            Tingkat Kelulusan QC: <span className="font-bold">{data.quality}%</span>
                          </div>
                          <div className="text-white/80 mt-1">Standar Sterilitas: 100% Bebas Pirogen</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="quality"
                  fill="#0E3192"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1200}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footer info note */}
        <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] text-corporate-gray">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Data diaudit secara berkala sesuai ketentuan CPOB Badan POM RI & PIC/S GMP internasional.</span>
          </div>
          <div className="font-mono text-primary dark:text-sky-400 font-bold">
            PT WIDATRA BHAKTI · EST. 1986
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
