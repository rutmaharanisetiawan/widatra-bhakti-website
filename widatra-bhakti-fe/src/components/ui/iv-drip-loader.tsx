import React from "react";

export interface IVDripLoaderProps {
  /** Text shown below the wobbling IV bag */
  loadingText?: string;
  /** Primary gradient color of the liquid (defaults to #0284c7 medical cyan/blue) */
  themeColor?: string;
  /** Secondary highlight color of the liquid (defaults to #38bdf8 light cyan) */
  secondaryColor?: string;
  /** Duration in seconds per full tumble cycle (defaults to 3s) */
  duration?: number;
  /** Scale size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to render as an overlay spanning the full screen */
  fullScreen?: boolean;
  /** Frosted glass backdrop blur when in fullScreen mode */
  blurBackdrop?: boolean;
  /** Additional custom class names */
  className?: string;
}

export function IVDripLoader({
  loadingText = "Memuat data...",
  themeColor = "#0284c7",
  secondaryColor = "#38bdf8",
  duration = 3,
  size = "md",
  fullScreen = false,
  blurBackdrop = true,
  className = "",
}: IVDripLoaderProps) {
  // Scale dimensions based on size variant
  const scale = size === "sm" ? 0.8 : size === "lg" ? 1.2 : 1;
  const animDuration = `${duration}s`;
  const dropDuration = `${Math.max(0.9, duration * 0.38)}s`;

  const containerContent = (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
      role="status"
      aria-live="polite"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Inline Scoped CSS Keyframes for GPU-Accelerated 60 FPS Fluid Physics */}
      <style>{`
        /* 1. Tumbling Bottle Motion (Pivot: 50% 92%) */
        @keyframes ivBottleTumble {
          0% {
            transform: rotate(0deg) translateY(0);
          }
          4% {
            transform: rotate(-4deg) translateY(-1px);
          }
          18% {
            transform: rotate(72deg) translateY(0);
          }
          23% {
            transform: rotate(64deg) translateY(-2.5px);
          }
          28% {
            transform: rotate(71deg) translateY(0);
          }
          34% {
            transform: rotate(70deg) translateY(0);
          }
          48% {
            transform: rotate(0deg) translateY(-4px);
          }
          52% {
            transform: rotate(0deg) translateY(0);
          }
          56% {
            transform: rotate(4deg) translateY(-1px);
          }
          70% {
            transform: rotate(-72deg) translateY(0);
          }
          75% {
            transform: rotate(-64deg) translateY(-2.5px);
          }
          80% {
            transform: rotate(-71deg) translateY(0);
          }
          86% {
            transform: rotate(-70deg) translateY(0);
          }
          97% {
            transform: rotate(0deg) translateY(-4px);
          }
          100% {
            transform: rotate(0deg) translateY(0);
          }
        }

        /* 2. Fluid Wave & Liquid Sloshing Physics with Momentum Invariance Lag */
        @keyframes ivFluidSlosh {
          0% {
            transform: rotate(0deg) translateY(0) scaleY(1);
          }
          5% {
            transform: rotate(4deg) translateY(1px) scaleY(1.02);
          }
          20% {
            transform: rotate(-70deg) translateY(4px) scaleY(1.18);
          }
          25% {
            transform: rotate(-61deg) translateY(2px) scaleY(1.1);
          }
          30% {
            transform: rotate(-68deg) translateY(3px) scaleY(1.14);
          }
          36% {
            transform: rotate(-67deg) translateY(3px) scaleY(1.13);
          }
          50% {
            transform: rotate(0deg) translateY(0) scaleY(1);
          }
          57% {
            transform: rotate(-4deg) translateY(1px) scaleY(1.02);
          }
          72% {
            transform: rotate(70deg) translateY(4px) scaleY(1.18);
          }
          77% {
            transform: rotate(61deg) translateY(2px) scaleY(1.1);
          }
          82% {
            transform: rotate(68deg) translateY(3px) scaleY(1.14);
          }
          88% {
            transform: rotate(67deg) translateY(3px) scaleY(1.13);
          }
          98% {
            transform: rotate(0deg) translateY(0) scaleY(1);
          }
          100% {
            transform: rotate(0deg) translateY(0) scaleY(1);
          }
        }

        /* 3. Surface Meniscus Wave Ripple */
        @keyframes ivWaveRipple {
          0%, 100% {
            border-radius: 42% 58% 40% 60% / 55% 45% 55% 45%;
          }
          50% {
            border-radius: 58% 42% 60% 40% / 45% 55% 45% 55%;
          }
        }

        /* 4. Anchor Contact Shadow (Right Under Pivot) */
        @keyframes ivContactShadow {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.6;
          }
          18% {
            transform: scale(1.18, 0.82) translateY(1px);
            opacity: 0.75;
          }
          23% {
            transform: scale(0.92, 0.92) translateY(0);
            opacity: 0.52;
          }
          28% {
            transform: scale(1.1, 0.88) translateY(0.5px);
            opacity: 0.7;
          }
          48% {
            transform: scale(0.95, 0.95) translateY(-1px);
            opacity: 0.55;
          }
          52% {
            transform: scale(1) translateY(0);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.18, 0.82) translateY(1px);
            opacity: 0.75;
          }
          75% {
            transform: scale(0.92, 0.92) translateY(0);
            opacity: 0.52;
          }
          80% {
            transform: scale(1.1, 0.88) translateY(0.5px);
            opacity: 0.7;
          }
          97% {
            transform: scale(0.95, 0.95) translateY(-1px);
            opacity: 0.55;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 0.6;
          }
        }

        /* 5. Directional Ambient Body Shadow (Stretches with Tilt) */
        @keyframes ivBodyShadow {
          0% {
            transform: translateX(0px) scaleX(1) scaleY(1);
            opacity: 0.45;
          }
          4% {
            transform: translateX(-4px) scaleX(0.95) scaleY(0.95);
            opacity: 0.42;
          }
          18% {
            transform: translateX(36px) scaleX(1.65) scaleY(0.68);
            opacity: 0.32;
          }
          23% {
            transform: translateX(32px) scaleX(1.5) scaleY(0.72);
            opacity: 0.36;
          }
          28% {
            transform: translateX(35px) scaleX(1.6) scaleY(0.7);
            opacity: 0.33;
          }
          34% {
            transform: translateX(35px) scaleX(1.58) scaleY(0.7);
            opacity: 0.34;
          }
          48% {
            transform: translateX(0px) scaleX(0.95) scaleY(0.95);
            opacity: 0.42;
          }
          52% {
            transform: translateX(0px) scaleX(1) scaleY(1);
            opacity: 0.45;
          }
          56% {
            transform: translateX(4px) scaleX(0.95) scaleY(0.95);
            opacity: 0.42;
          }
          70% {
            transform: translateX(-36px) scaleX(1.65) scaleY(0.68);
            opacity: 0.32;
          }
          75% {
            transform: translateX(-32px) scaleX(1.5) scaleY(0.72);
            opacity: 0.36;
          }
          80% {
            transform: translateX(-35px) scaleX(1.6) scaleY(0.7);
            opacity: 0.33;
          }
          86% {
            transform: translateX(-35px) scaleX(1.58) scaleY(0.7);
            opacity: 0.34;
          }
          97% {
            transform: translateX(0px) scaleX(0.95) scaleY(0.95);
            opacity: 0.42;
          }
          100% {
            transform: translateX(0px) scaleX(1) scaleY(1);
            opacity: 0.45;
          }
        }

        /* 6. Droplet Dripping from Tip */
        @keyframes ivDropletFall {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          15% {
            transform: translateY(2px) scale(0.9);
            opacity: 1;
          }
          60% {
            transform: translateY(32px) scale(1, 1.2);
            opacity: 0.9;
          }
          80% {
            transform: translateY(40px) scale(1.4, 0.4);
            opacity: 0.5;
          }
          100% {
            transform: translateY(42px) scale(1.8, 0.1);
            opacity: 0;
          }
        }

        /* 7. Splash Ring at Floor Contact */
        @keyframes ivSplashRing {
          0%, 65% {
            transform: scale(0);
            opacity: 0;
          }
          80% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        /* 8. Micro Bubbles Floating Up */
        @keyframes ivBubbleRiseSmooth {
          0% {
            transform: translateY(18px) translateX(0);
            opacity: 0;
          }
          30% {
            opacity: 0.75;
          }
          70% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(-45px) translateX(4px);
            opacity: 0;
          }
        }
      `}</style>

      {/* Main Kinetic Assembly */}
      <div className="relative w-44 h-56 flex items-center justify-center">
        {/* ========================================================
            1. SLEEK TUMBLING GLASS IV CAPSULE (TITIK TUMPU: 50% 92%)
        ======================================================== */}
        <div
          className="relative w-22 h-40 flex flex-col items-center will-change-transform z-10"
          style={{
            transformOrigin: "50% 92%",
            animation: `ivBottleTumble ${animDuration} cubic-bezier(0.42, 0.08, 0.58, 0.98) infinite`,
          }}
        >
          {/* Sleek Minimalist Integrated Hanger Ring */}
          <div className="w-6 h-3 rounded-t-full border-t-2 border-x-2 border-white/70 dark:border-white/40 bg-white/30 dark:bg-white/10 backdrop-blur-xs flex items-center justify-center -mb-[1px]">
            <div className="w-2.5 h-1.5 rounded-full bg-slate-300/60 dark:bg-slate-700/60 border border-white/50" />
          </div>

          {/* Aesthetic Curved Glass Body (Streamlined & Elegant) */}
          <div className="relative w-full flex-1 rounded-[22px] border-[1.5px] border-white/80 dark:border-white/30 bg-gradient-to-br from-white/30 via-white/15 to-white/5 dark:from-white/15 dark:via-white/5 dark:to-white/[0.02] backdrop-blur-md shadow-[0_10px_24px_rgba(14,49,146,0.14)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-end">
            {/* Luminous Diagonal Specular Glare */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent [transform:rotate(28deg)] scale-150 z-20" />

            {/* Minimalist Graduation Scale (Sleek Delicate Ticks) */}
            <div className="absolute left-2.5 top-4 bottom-5 flex flex-col justify-between z-20 pointer-events-none opacity-60">
              <span className="w-2.5 h-[1.5px] bg-white rounded-full shadow-xs" />
              <span className="w-1.5 h-[1px] bg-white/70 rounded-full" />
              <span className="w-2.5 h-[1.5px] bg-white rounded-full shadow-xs" />
              <span className="w-1.5 h-[1px] bg-white/70 rounded-full" />
              <span className="w-2.5 h-[1.5px] bg-white rounded-full shadow-xs" />
            </div>

            {/* ========================================================
                MULTI-LAYER DYNAMIC SLOSHING FLUID
            ======================================================== */}
            <div
              className="absolute -inset-x-6 -bottom-6 h-28 origin-bottom will-change-transform z-10"
              style={{
                animation: `ivFluidSlosh ${animDuration} cubic-bezier(0.42, 0.08, 0.58, 0.98) infinite`,
              }}
            >
              {/* Primary Fluid Volume with Meniscus Ripple */}
              <div
                className="w-full h-full rounded-t-[28px] overflow-hidden relative"
                style={{
                  background: `linear-gradient(180deg, ${secondaryColor} 0%, ${themeColor} 70%, #0369a1 100%)`,
                  boxShadow: `inset 0 3px 8px rgba(255, 255, 255, 0.5), 0 0 14px ${themeColor}35`,
                  animation: "ivWaveRipple 3s ease-in-out infinite",
                }}
              >
                {/* Luminous Crest Wave Highlight */}
                <div className="w-full h-2 bg-gradient-to-r from-white/30 via-white/75 to-white/30 rounded-full blur-[0.4px]" />

                {/* Subtle Floating Micro-Bubbles */}
                <div
                  className="absolute left-7 bottom-5 w-1.5 h-1.5 rounded-full bg-white/80 shadow-xs"
                  style={{ animation: "ivBubbleRiseSmooth 2.2s ease-in-out infinite" }}
                />
                <div
                  className="absolute right-8 bottom-3 w-1 h-1 rounded-full bg-white/70 shadow-xs"
                  style={{ animation: "ivBubbleRiseSmooth 1.9s ease-in-out 0.7s infinite" }}
                />
              </div>
            </div>
          </div>

          {/* Minimalist Precision Dropper Tip & Droplet */}
          <div className="relative flex flex-col items-center -mt-[1px] z-20">
            {/* Streamlined Collar */}
            <div className="w-4 h-1.5 rounded-b-xs bg-slate-300 dark:bg-slate-600 border-x border-b border-slate-400 dark:border-slate-500 shadow-xs" />

            {/* Dropper Nozzle */}
            <div className="w-1.5 h-2.5 rounded-b-full bg-white/80 dark:bg-white/50 border border-slate-400/40 shadow-xs relative">
              {/* Falling Droplet */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-1 w-1.5 h-2 rounded-b-full rounded-t-xs will-change-transform"
                style={{
                  background: `linear-gradient(180deg, ${secondaryColor}, ${themeColor})`,
                  boxShadow: `0 2px 4px ${themeColor}50`,
                  animation: `ivDropletFall ${dropDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            2. DUAL-LAYER SYNCHRONIZED SHADOW SYSTEM
        ======================================================== */}
        {/* Layer A: Anchor Ground Contact Shadow (Right Under Pivot) */}
        <div
          className="absolute bottom-5 w-9 h-2.5 rounded-[50%] bg-slate-900/35 dark:bg-black/60 blur-[2px] pointer-events-none will-change-transform"
          style={{
            animation: `ivContactShadow ${animDuration} cubic-bezier(0.42, 0.08, 0.58, 0.98) infinite`,
          }}
        />

        {/* Layer B: Diffused Ambient Body Projection Shadow (Stretches Proportionally) */}
        <div
          className="absolute bottom-5 w-20 h-4 rounded-[50%] bg-blue-950/20 dark:bg-black/50 blur-[8px] pointer-events-none will-change-transform"
          style={{
            animation: `ivBodyShadow ${animDuration} cubic-bezier(0.42, 0.08, 0.58, 0.98) infinite`,
          }}
        />

        {/* Layer C: Floor Droplet Splash Ring */}
        <div
          className="absolute bottom-3 w-4 h-1.5 rounded-[50%] border border-sky-400/50 pointer-events-none will-change-transform"
          style={{
            animation: `ivSplashRing ${dropDuration} cubic-bezier(0.2, 0.8, 0.4, 1) infinite`,
          }}
        />
      </div>

      {/* Clean Status Text */}
      {loadingText && (
        <p className="mt-4 text-xs font-bold tracking-[0.22em] uppercase text-corporate-black/80 dark:text-white/90 text-center">
          {loadingText}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-300 ${
          blurBackdrop
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
            : "bg-white/95 dark:bg-slate-950/95"
        }`}
      >
        {containerContent}
      </div>
    );
  }

  return containerContent;
}
