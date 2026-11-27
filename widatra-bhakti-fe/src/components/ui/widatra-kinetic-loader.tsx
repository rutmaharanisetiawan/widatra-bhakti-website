import { cn } from "@/lib/utils";

export interface WidatraKineticLoaderProps {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom loading text or tagline */
  loadingText?: string;
  /** Whether to show the brand typography and subtitle */
  showText?: boolean;
  /** Whether to show the pulsing dots */
  showDots?: boolean;
  /** Optional extra classes */
  className?: string;
}

/**
 * Official Kinetic Dual-Ring Orbit Preloader for PT Widatra Bhakti (Option B)
 * Features the two official rings (Deep Navy & Widatra Red) orbiting in harmonic
 * motion before snapping into the iconic interlocking brand emblem.
 */
export function WidatraKineticLoader({
  size = "md",
  loadingText = "OTSUKA GROUP INDONESIA · EST. 1986",
  showText = true,
  showDots = true,
  className,
}: WidatraKineticLoaderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none",
        className
      )}
      role="status"
      aria-label="Memuat aplikasi PT Widatra Bhakti"
    >
      {/* Ambient Pulsing Glow Aura */}
      <div className="absolute -top-6 w-52 h-52 rounded-full bg-primary/15 dark:bg-blue-500/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -top-6 w-40 h-40 rounded-full bg-accent/10 dark:bg-red-500/15 blur-2xl pointer-events-none" />

      {/* Kinetic Emblem Container */}
      <div
        className={cn(
          "relative mb-3 flex items-center justify-center animate-widatra-emblem-float",
          size === "sm" && "w-28 h-20",
          size === "md" && "w-36 h-28",
          size === "lg" && "w-48 h-36"
        )}
      >
        <svg
          viewBox="0 0 375 280"
          className="w-full h-full select-none overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="widatra-kinetic-overlap-clip">
              <rect x="135" y="138.75" width="102" height="101.25" />
            </clipPath>

            {/* Specular Gleam Radial Gradient */}
            <radialGradient
              id="widatra-gleam-grad"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Orbiting Blue Ring (Left) */}
          <g className="animate-widatra-orbit-blue" style={{ willChange: "transform" }}>
            {/* Top Arc */}
            <path
              d="M 33.75 138.75 C 33.75 102.578 53.047 69.152 84.375 51.066 C 115.703 32.977 154.297 32.977 185.625 51.066 C 216.953 69.152 236.25 102.578 236.25 138.75 L 206.25 138.75 C 206.25 107.938 189.812 79.461 163.125 64.055 C 136.438 48.648 103.562 48.648 76.875 64.055 C 50.188 79.461 33.75 107.938 33.75 138.75 Z"
              fill="#0E3192"
            />
            {/* Bottom Arc */}
            <path
              d="M 33.75 138.75 C 33.75 174.922 53.047 208.348 84.375 226.434 C 115.703 244.523 154.297 244.523 185.625 226.434 C 216.953 208.348 236.25 174.922 236.25 138.75 L 195 138.75 C 195 160.188 183.562 179.992 165 190.711 C 146.438 201.43 123.562 201.43 105 190.711 C 86.438 179.992 75 160.188 75 138.75 Z"
              fill="#0E3192"
            />
          </g>

          {/* 2. Orbiting Red Ring (Right) */}
          <g className="animate-widatra-orbit-red" style={{ willChange: "transform" }}>
            {/* Top Arc */}
            <path
              d="M 131.25 138.75 C 131.25 102.578 150.547 69.152 181.875 51.066 C 213.203 32.977 251.797 32.977 283.125 51.066 C 314.453 69.152 333.75 102.578 333.75 138.75 L 303.75 138.75 C 303.75 107.938 287.312 79.461 260.625 64.055 C 233.938 48.648 201.062 48.648 174.375 64.055 C 147.688 79.461 131.25 107.938 131.25 138.75 Z"
              fill="#D81920"
            />
            {/* Bottom Arc */}
            <path
              d="M 131.25 138.75 C 131.25 174.922 150.547 208.348 181.875 226.434 C 213.203 244.523 251.797 244.523 283.125 226.434 C 314.453 208.348 333.75 174.922 333.75 138.75 L 292.5 138.75 C 292.5 160.188 281.062 179.992 262.5 190.711 C 243.938 201.43 221.062 201.43 202.5 190.711 C 183.938 179.992 172.5 160.188 172.5 138.75 Z"
              fill="#D81920"
            />
          </g>

          {/* 3. Interlocking Cross Bridge (Smoothly dissolves in exclusively during the lock snap) */}
          <path
            d="M 135 138.75 L 236.25 138.75 C 236.25 165.602 225.582 191.355 206.594 210.344 C 187.605 229.332 161.852 240 135 240 L 135 198.75 C 150.914 198.75 166.176 192.43 177.426 181.176 C 188.68 169.926 195 154.664 195 138.75 Z"
            clipPath="url(#widatra-kinetic-overlap-clip)"
            fill="#0E3192"
            className="animate-widatra-lock-bridge"
            style={{ willChange: "opacity, transform" }}
          />

          {/* 4. Central Gleam Star (Flashes at lock moment) */}
          <g className="animate-widatra-lock-gleam" pointerEvents="none">
            <circle cx="183.75" cy="138.75" r="28" fill="url(#widatra-gleam-grad)" />
            <path
              d="M 183.75 110 L 186.5 136 L 212.5 138.75 L 186.5 141.5 L 183.75 167.5 L 181 141.5 L 155 138.75 L 181 136 Z"
              fill="#ffffff"
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography & Tagline */}
      {showText && (
        <div className="flex flex-col items-center text-center">
          {/* Main Wordmark */}
          <div className="flex items-baseline gap-2 mb-1.5">
            <span
              className={cn(
                "font-extrabold italic tracking-tight text-[#0E3192] dark:text-white uppercase transition-colors",
                size === "sm" && "text-lg sm:text-xl",
                size === "md" && "text-xl sm:text-2xl",
                size === "lg" && "text-2xl sm:text-3xl"
              )}
            >
              WIDATRA
            </span>
            <span
              className={cn(
                "font-bold italic text-[#D81920] uppercase tracking-normal",
                size === "sm" && "text-xs sm:text-sm",
                size === "md" && "text-sm sm:text-base",
                size === "lg" && "text-base sm:text-lg"
              )}
            >
              BHAKTI
            </span>
          </div>

          {/* Animated Signature Accent Streak */}
          <div className="relative w-44 sm:w-52 h-[2.5px] rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-700/60 mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E3192] via-[#2563eb] to-[#D81920]" />
            <div className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white to-transparent opacity-90 animate-widatra-sweep" />
          </div>

          {/* Subtitle / Tagline */}
          {loadingText && (
            <p
              className={cn(
                "font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-blue-300/85",
                size === "sm" && "text-[8.5px] sm:text-[9px]",
                size === "md" && "text-[9.5px] sm:text-[10px]",
                size === "lg" && "text-[11px] sm:text-[12px]"
              )}
            >
              {loadingText}
            </p>
          )}

          {/* 3 Kinetic Pulse Dots */}
          {showDots && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E3192] dark:bg-blue-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] dark:bg-blue-300 animate-pulse [animation-delay:180ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D81920] animate-pulse [animation-delay:360ms]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
