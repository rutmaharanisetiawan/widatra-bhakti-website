export const DEFAULT_MARQUEE_ITEMS = [
  "OTSUKA GROUP INDONESIA",
  "EST. 1986 · 40 YEARS OF EXCELLENCE",
  "PIC/S GMP CERTIFIED · BPOM RI",
  "ISO 9001 : 2015",
  "ISO 14001 : 2015",
  "ISO 45001 : 2018",
  "HALAL CERTIFIED · LPPOM MUI",
  "A-GRADE STERILE CLEANROOM",
  "RELIABLE PARTNER FOR BETTER HEALTH",
  "PANDAAN CAMPUS · 5+ HECTARES",
  "LARGEST INFUSION PLANT IN SE ASIA",
];

export function WavyMarqueeRibbon({
  items = DEFAULT_MARQUEE_ITEMS,
  variant = "wave",
  className = "",
}: {
  items?: string[];
  variant?: "wave" | "crossed";
  className?: string;
  fillColor?: string;
}) {
  // If variant is "wave" (top hero ribbon), remove completely in favor of smooth gradient
  if (variant === "wave") {
    return null;
  }

  const loopItems = [...items, ...items];

  // Unified Dual-Layer Tilted Crossed Ribbon Layout across all positions
  return (
    <div
      className={`relative py-6 sm:py-8 overflow-hidden select-none bg-surface dark:bg-background ${className}`}
      aria-hidden="true"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      {/* Back Ribbon (Tilted +1.6deg, Accent/Deep Navy) */}
      <div className="relative -mx-8 transform rotate-[1.6deg] bg-gradient-to-r from-brand-ink via-primary to-accent py-2.5 opacity-90 shadow-md will-change-transform [backface-visibility:hidden]">
        <div className="animate-marquee-right flex items-center gap-8">
          {loopItems.map((badge, idx) => (
            <div key={`back-${idx}`} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-white/90">
                {badge}
              </span>
              <span className="text-white/40 text-xs font-serif-italic">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Front Ribbon (Tilted -1.6deg, Primary Widatra Navy) */}
      <div className="relative -mx-8 -mt-9 sm:-mt-10 transform -rotate-[1.6deg] bg-gradient-to-r from-primary via-brand-deep to-primary py-3 shadow-[0_14px_32px_-8px_rgba(9,42,125,0.45)] border-y border-white/15 will-change-transform [backface-visibility:hidden]">
        <div className="animate-marquee-left flex items-center gap-8">
          {loopItems.map((badge, idx) => (
            <div key={`front-${idx}`} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-white">
                {badge}
              </span>
              <span className="text-white/60 text-xs font-serif-italic">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
