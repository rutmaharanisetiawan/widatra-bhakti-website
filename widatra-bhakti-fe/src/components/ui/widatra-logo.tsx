import React, { useState } from "react";
import { cn } from "@/lib/utils";
import emblemImg from "@/assets/widatra-emblem.png";
import fullLogoImg from "@/assets/widatra-logo.png";

export interface WidatraLogoProps {
  /**
   * "horizontal": Emblem + WIDATRA wordmark + animated accent streak + tagline (Ideal for Navbar & Footer)
   * "emblem": Just the interlocking blue & red rings emblem with interactive hover glow
   * "full": The stacked emblem + wordmark
   */
  variant?: "horizontal" | "emblem" | "full";
  /** Optional custom class for container */
  className?: string;
  /** Size modifier: "sm" | "md" | "lg" */
  size?: "sm" | "md" | "lg";
  /** Optional custom subtitle (defaults to "Mitra Terpercaya untuk Kesehatan yang Lebih Baik") */
  subtitle?: string;
  /** Optional custom className for subtitle (e.g. "hidden 2xl:block" for responsive nav) */
  subtitleClassName?: string;
  /** Whether to show the animated accent ribbon inspired by the reference video */
  showAccentAnimation?: boolean;
  /** Show the subtitle text */
  showSubtitle?: boolean;
}

/**
 * Official PT Widatra Bhakti Brand Logo Component
 * Incorporates the authentic interlocking blue & red rings emblem,
 * bold italic typography, and an enhanced interactive sweeping gradient ribbon
 * inspired by the official company website reference.
 */
export function WidatraLogo({
  variant = "horizontal",
  className,
  size = "md",
  subtitle = "Mitra Terpercaya untuk Kesehatan yang Lebih Baik",
  subtitleClassName,
  showAccentAnimation = true,
  showSubtitle = true,
}: WidatraLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 1. EMBLEM ONLY
  if (variant === "emblem") {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0 group", className)}
      >
        <img
          src={emblemImg}
          alt="PT Widatra Bhakti Emblem"
          className={cn(
            "w-auto select-none pointer-events-none object-contain transition-all duration-300",
            isHovered ? "scale-108 -rotate-2 drop-shadow-[0_4px_12px_rgba(216,25,32,0.35)]" : "drop-shadow-xs",
            size === "sm" && "h-6 sm:h-7",
            size === "md" && "h-8 sm:h-9",
            size === "lg" && "h-11 sm:h-12"
          )}
          draggable={false}
        />
      </div>
    );
  }

  // 2. FULL STACKED LOGO
  if (variant === "full") {
    return (
      <div className={cn("inline-flex flex-col items-center select-none group", className)}>
        <img
          src={fullLogoImg}
          alt="PT Widatra Bhakti Logo"
          className={cn(
            "w-auto select-none pointer-events-none drop-shadow-sm object-contain transition-transform duration-300 group-hover:scale-105",
            size === "sm" && "h-12 sm:h-14",
            size === "md" && "h-16 sm:h-20",
            size === "lg" && "h-24 sm:h-28"
          )}
          draggable={false}
        />
      </div>
    );
  }

  // 3. HORIZONTAL BRAND LOCKUP WITH ENHANCED ANIMATED ACCENT
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "inline-flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 min-w-0 select-none cursor-pointer",
        className
      )}
    >
      {/* Official Interlocking Blue & Red Emblem */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <img
          src={emblemImg}
          alt="Widatra Emblem"
          className={cn(
            "w-auto object-contain transition-all duration-300",
            isHovered
              ? "scale-110 -rotate-3 drop-shadow-[0_4px_14px_rgba(14,49,146,0.35)]"
              : "drop-shadow-[0_2px_8px_rgba(14,49,146,0.18)]",
            size === "sm" && "h-7 sm:h-8",
            size === "md" && "h-8 sm:h-9.5",
            size === "lg" && "h-10 sm:h-12"
          )}
          draggable={false}
        />
      </div>

      {/* Typography + Animated Accent Lockup */}
      <div className="leading-none min-w-0 flex flex-col justify-center">
        {/* Main Wordmark */}
        <div className="flex items-baseline gap-1.5 overflow-hidden">
          <span
            className={cn(
              "font-extrabold italic tracking-tight text-[#1E2574] dark:text-white uppercase transition-colors relative",
              size === "sm" && "text-[14px] sm:text-[15px] tracking-[-0.02em]",
              size === "md" && "text-[16px] sm:text-[18px] tracking-[-0.025em]",
              size === "lg" && "text-[21px] sm:text-[24px] tracking-[-0.03em]"
            )}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            WIDATRA
            <span className="font-bold italic text-slate-500 dark:text-slate-400 text-[11px] sm:text-[12px] ml-1.5 uppercase font-sans tracking-normal hidden sm:inline">
              BHAKTI
            </span>
          </span>
        </div>

        {/* 
          ANIMATED ACCENT RIBBON (Inspired by reference video from widatra.com):
          A sleek slanted parallelogram with Otsuka Red & Navy gradient + periodic light-sweep!
        */}
        {showAccentAnimation && (
          <div className="relative mt-1 h-[2.5px] w-full max-w-[130px] sm:max-w-[160px] overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
            {/* Base dual-tone line (Blue -> Red) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E2574] via-[#0E3192] to-[#D81920]" />

            {/* Continuous / Hover Shimmer Light Sweep */}
            <div
              className={cn(
                "absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white to-transparent opacity-90 -skew-x-25",
                isHovered ? "animate-widatra-sweep-fast" : "animate-widatra-sweep"
              )}
            />
          </div>
        )}

        {/* Tagline Subtitle / Slogan */}
        {showSubtitle && subtitle && (
          <span
            className={cn(
              "font-medium tracking-[0.04em] text-corporate-gray dark:text-slate-400 block mt-1",
              size === "sm" && "text-[7.5px] sm:text-[8px] whitespace-nowrap truncate max-w-[150px]",
              size === "md" && "text-[8px] sm:text-[8.5px] whitespace-nowrap",
              size === "lg" && "text-[10.5px] sm:text-[11px] leading-snug whitespace-normal",
              subtitleClassName
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
