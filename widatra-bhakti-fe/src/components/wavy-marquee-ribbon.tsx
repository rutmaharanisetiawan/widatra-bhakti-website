import { useId } from "react";

export const DEFAULT_MARQUEE_ITEMS = [
  "OTSUKA GROUP INDONESIA",
  "PIC/S GMP CERTIFIED",
  "ISO 9001 : 2015",
  "ISO 14001 : 2015",
  "ISO 45001 : 2018",
  "BPOM LICENSED",
  "HALAL CERTIFIED",
  "A-GRADE STERILE CLEANROOM",
  "RELIABLE PARTNER FOR BETTER HEALTH",
  "EST. 1986 · PANDAAN CAMPUS",
];

export function WavyMarqueeRibbon({
  items = DEFAULT_MARQUEE_ITEMS,
  variant = "wave",
  className = "",
  fillColor = "var(--surface)",
}: {
  items?: string[];
  /** "wave" renders the curved undulating SVG wave ribbon; "crossed" renders an angled dual-ribbon band. */
  variant?: "wave" | "crossed";
  className?: string;
  fillColor?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const wavePathId = `widatra-wave-path-${uid}`;
  const gradId = `widatra-wave-grad-${uid}`;
  const glowGradId = `widatra-wave-glow-${uid}`;

  const unitText = items.map((item) => `${item}   ✦   `).join("");
  const repeatedText = `${unitText}${unitText}${unitText}${unitText}`;

  if (variant === "crossed") {
    return (
      <div
        className={`relative py-6 sm:py-8 overflow-hidden select-none bg-surface dark:bg-background ${className}`}
        aria-hidden="true"
      >
        {/* Back Ribbon (Tilted +1.6deg, Accent/Deep Navy) */}
        <div className="relative -mx-8 transform rotate-[1.6deg] bg-gradient-to-r from-brand-ink via-primary to-accent py-2.5 opacity-90 shadow-md">
          <div className="animate-marquee-right flex items-center gap-8">
            {[...items, ...items, ...items].map((badge, idx) => (
              <div key={`back-${idx}`} className="flex items-center gap-8 whitespace-nowrap">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-white/90">
                  {badge}
                </span>
                <span className="text-white/70 text-xs leading-none">✸</span>
              </div>
            ))}
          </div>
        </div>

        {/* Front Ribbon (Tilted -1.6deg, Primary Widatra Navy) */}
        <div className="relative -mx-8 -mt-9 sm:-mt-10 transform -rotate-[1.6deg] bg-gradient-to-r from-primary via-brand-deep to-primary py-3 shadow-[0_14px_32px_-8px_rgba(9,42,125,0.45)] border-y border-white/15">
          <div className="animate-marquee-left flex items-center gap-8">
            {[...items, ...items, ...items].map((badge, idx) => (
              <div key={`front-${idx}`} className="flex items-center gap-8 whitespace-nowrap">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-white">
                  {badge}
                </span>
                <span className="text-accent text-sm leading-none">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden select-none bg-transparent -mt-20 sm:-mt-24 lg:-mt-28 z-20 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[82px] sm:h-[104px] lg:h-[126px] block overflow-visible drop-shadow-[0_14px_28px_rgba(9,42,125,0.22)]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#092A7D" />
            <stop offset="50%" stopColor="#0E3192" />
            <stop offset="100%" stopColor="#092A7D" />
          </linearGradient>
          <linearGradient id={glowGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF0000" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#1B48C4" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FF0000" stopOpacity="0.45" />
          </linearGradient>

          <path
            id={wavePathId}
            d="M -360 72 C -180 16, 0 128, 180 72 C 360 16, 540 128, 720 72 C 900 16, 1080 128, 1260 72 C 1440 16, 1620 128, 1800 72"
          />
          <path
            id={`${wavePathId}-fill`}
            d="M -360 72 C -180 16, 0 128, 180 72 C 360 16, 540 128, 720 72 C 900 16, 1080 128, 1260 72 C 1440 16, 1620 128, 1800 72 L 1800 240 L -360 240 Z"
          />
        </defs>

        {/* Seamless Under-Wave Surface Fill — bridges the hero navy directly into the page surface following the natural wave curve */}
        <use
          href={`#${wavePathId}-fill`}
          fill={fillColor}
          style={{ fill: fillColor }}
        />

        {/* Outer Accent Rim / Shadow Wave */}
        <use
          href={`#${wavePathId}`}
          stroke={`url(#${glowGradId})`}
          strokeWidth="62"
          strokeLinecap="round"
        />

        {/* Main Widatra Navy Wave Ribbon */}
        <use
          href={`#${wavePathId}`}
          stroke={`url(#${gradId})`}
          strokeWidth="54"
          strokeLinecap="round"
        />

        {/* Subtle Inner Hairline Highlight */}
        <use
          href={`#${wavePathId}`}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="44"
          strokeLinecap="round"
          fill="none"
        />
        <use
          href={`#${wavePathId}`}
          stroke={`url(#${gradId})`}
          strokeWidth="42"
          strokeLinecap="round"
          fill="none"
        />

        {/* Animated Flowing Text Along the Wave Curve */}
        <text
          fill="#FFFFFF"
          fontSize="13.5"
          fontWeight="700"
          letterSpacing="0.24em"
          dominantBaseline="middle"
          dy="1"
          className="font-display uppercase"
        >
          <textPath href={`#${wavePathId}`} startOffset="0%">
            {repeatedText}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-50%"
              dur="28s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}
