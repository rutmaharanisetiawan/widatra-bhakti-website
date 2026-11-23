import React from "react";
import { cn } from "@/lib/utils";
import otsukaSvg from "@/assets/otsuka-logo.svg";

export interface OtsukaLogoProps {
  /**
   * "badge": Modern interactive pill capsule: [Otsuka Motif + "Member of Otsuka Group"]
   * "horizontal": The Otsuka corporate logo (Motif + Wordmark)
   * "emblem": The Otsuka blue motif + red dot only
   */
  variant?: "badge" | "horizontal" | "emblem";
  /** Size scale: "sm" | "md" | "lg" */
  size?: "sm" | "md" | "lg";
  /** Optional custom class */
  className?: string;
  /** Optional link destination (defaults to /about#heritage or Otsuka official) */
  href?: string;
  /** Show subtle interactive hover effect */
  interactive?: boolean;
}

/**
 * Official Otsuka Group Brand Logo Component
 * Extracted with 100% vector fidelity from official Otsuka Holdings assets.
 */
export const OTSUKA_GROUP_URL = "https://www.otsuka.com/en/company/group/#asia";

export function OtsukaLogo({
  variant = "badge",
  size = "md",
  className,
  href = OTSUKA_GROUP_URL,
  interactive = true,
}: OtsukaLogoProps) {
  const isExternal = Boolean(href && /^https?:\/\//.test(href));
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  // 1. EMBLEM ONLY (Blue motif with red accent dot)
  if (variant === "emblem") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center select-none flex-shrink-0",
          interactive && "transition-transform duration-300 hover:scale-105",
          className
        )}
      >
        <img
          src={otsukaSvg}
          alt="Otsuka Group Emblem"
          className={cn(
            "w-auto object-contain",
            size === "sm" && "h-6 sm:h-6.5",
            size === "md" && "h-7.5 sm:h-8.5",
            size === "lg" && "h-10 sm:h-11"
          )}
          draggable={false}
        />
      </div>
    );
  }

  // 2. HORIZONTAL LOGO (Motif + Otsuka Wordmark)
  if (variant === "horizontal") {
    const el = (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 select-none flex-shrink-0 group px-2.5 py-1 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors",
          interactive && "cursor-pointer",
          className
        )}
        title="Member of Otsuka Group Indonesia"
      >
        <img
          src={otsukaSvg}
          alt="Otsuka Logo"
          className={cn(
            "w-auto object-contain transition-transform duration-300 group-hover:scale-105",
            size === "sm" && "h-5 sm:h-5.5",
            size === "md" && "h-6 sm:h-7",
            size === "lg" && "h-8 sm:h-9.5"
          )}
          draggable={false}
        />
      </div>
    );
    if (href) {
      return (
        <a href={href} {...linkProps} className="inline-flex items-center flex-shrink-0 text-inherit no-underline">
          {el}
        </a>
      );
    }
    return el;
  }

  // 3. BADGE / CAPSULE ("Member of Otsuka Group" / "Group of Otsuka")
  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2 sm:gap-2.5 rounded-full border transition-all duration-300 select-none",
        "bg-slate-50/90 dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.12]",
        interactive &&
          "hover:bg-white dark:hover:bg-white/[0.12] hover:border-primary/30 hover:shadow-sm hover:scale-[1.02] cursor-pointer group",
        size === "sm" && "px-3 py-1.5 text-[10px]",
        size === "md" && "px-3.5 sm:px-4 py-1.5 text-[11px]",
        size === "lg" && "px-4.5 py-2 text-[12px]",
        className
      )}
      title="Member of Otsuka Group Indonesia · Est. 1921 (Japan) / 1986 (Indonesia)"
    >
      <img
        src={otsukaSvg}
        alt="Otsuka"
        className={cn(
          "w-auto object-contain transition-transform duration-300 group-hover:scale-105",
          size === "sm" && "h-4.5 sm:h-5",
          size === "md" && "h-5.5 sm:h-6",
          size === "lg" && "h-7 sm:h-7.5"
        )}
        draggable={false}
      />
      <div className="h-3 w-[1px] bg-black/15 dark:bg-white/20" />
      <span className="font-bold uppercase tracking-[0.14em] text-corporate-gray dark:text-slate-300 group-hover:text-primary transition-colors whitespace-nowrap">
        Group of Otsuka
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
    </div>
  );

  if (href) {
    return (
      <a href={href} {...linkProps} className="inline-block flex-shrink-0 text-inherit no-underline">
        {content}
      </a>
    );
  }

  return content;
}
