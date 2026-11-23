import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/media-store";
import defaultIvBag from "@/assets/iv-bag-cutout.png";

/**
 * Props for the 3D Floating Image Stage
 */
export interface Floating3DImageStageProps {
  /** Source URL of the image */
  src: string;
  /** Image alternative text */
  alt?: string;
  /** Optional badge rendered inside the stage */
  badge?: React.ReactNode;
  /** Maximum 3D rotation in degrees (default: 8) */
  maxTilt?: number;
  /** Elevation distance in pixels along Z axis (default: 40) */
  elevation?: number;
  /** Subtle scaling factor when lifted (default: 1.05) */
  scale?: number;
  /** Color of the dynamic floor shadow (default: primary navy tone) */
  shadowColor?: string;
  /** Custom class for the stage box */
  className?: string;
  /** Custom class for the <img> element */
  imageClassName?: string;
  /** Optional extra content inside the stage */
  children?: React.ReactNode;
  /** Optional external coordinates (-1 to 1) passed from a parent card */
  coords?: { x: number; y: number };
  /** Optional external hover state passed from a parent card */
  isHovered?: boolean;
}

/**
 * Floating3DImageStage:
 * A modular stage where ONLY the inner image and its shadow react to cursor motion in 3D.
 * The stage container itself remains flat; only the image tilts, floats forward (translateZ),
 * and casts an organic shifting shadow.
 */
export function Floating3DImageStage({
  src,
  alt = "Product visual",
  badge,
  maxTilt = 8,
  elevation = 40,
  scale = 1.05,
  shadowColor = "rgba(14, 49, 146, 0.28)",
  className,
  imageClassName,
  children,
  coords: externalCoords,
  isHovered: externalIsHovered,
}: Floating3DImageStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [internalCoords, setInternalCoords] = useState({ x: 0, y: 0 });
  const [internalIsHovered, setInternalIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const initialUrl = resolveMediaUrl(src) || src || defaultIvBag;
  const [currentSrc, setCurrentSrc] = useState(initialUrl);

  useEffect(() => {
    const resolved = resolveMediaUrl(src) || src;
    setCurrentSrc(resolved && !resolved.startsWith("media:") ? resolved : defaultIvBag);
  }, [src]);

  const isControlled = externalCoords !== undefined && externalIsHovered !== undefined;
  const coords = isControlled ? externalCoords : internalCoords;
  const isHovered = isControlled ? externalIsHovered : internalIsHovered;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlled) return;
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const xNorm = ((clientX - rect.left) / rect.width - 0.5) * 2;
        const yNorm = ((clientY - rect.top) / rect.height - 0.5) * 2;
        const clampedX = Math.max(-1, Math.min(1, xNorm));
        const clampedY = Math.max(-1, Math.min(1, yNorm));

        setInternalCoords({ x: clampedX, y: clampedY });
      });
    },
    [isControlled]
  );

  const handleMouseEnter = useCallback(() => {
    if (isControlled) return;
    setInternalIsHovered(true);
  }, [isControlled]);

  const handleMouseLeave = useCallback(() => {
    if (isControlled) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setInternalIsHovered(false);
    setInternalCoords({ x: 0, y: 0 });
  }, [isControlled]);

  // Compute 3D rotation angles & lateral parallax
  const rotateX = isHovered ? -coords.y * maxTilt : 0;
  const rotateY = isHovered ? coords.x * maxTilt : 0;
  const translateX = isHovered ? coords.x * 10 : 0;
  const translateY = isHovered ? coords.y * 8 : 0;
  const translateZ = isHovered ? elevation : 0;
  const currentScale = isHovered ? scale : 1;

  // Shadow projection (moves in opposite direction of imaginary light source)
  const shadowTranslateX = isHovered ? -coords.x * 16 : 0;
  const shadowTranslateY = isHovered ? 12 - coords.y * 10 : 0;
  const shadowBlur = isHovered ? 24 : 10;
  const shadowOpacity = isHovered ? 0.45 : 0.2;

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-[24px] bg-white dark:bg-card p-6 flex items-center justify-center aspect-[16/11] overflow-hidden shadow-inner select-none cursor-pointer group",
        className
      )}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Optional Badge (Pinned flat in 2D space) */}
      {badge && (
        <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
          {badge}
        </div>
      )}

      {/* Subtle Studio Ambient Depth Glow behind the 3D product */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute w-48 h-48 rounded-full blur-2xl transition-all duration-500",
          isHovered
            ? "bg-gradient-to-tr from-primary/20 via-sky-400/20 to-blue-300/25 scale-110 opacity-100"
            : "bg-primary/10 scale-95 opacity-60"
        )}
      />

      {/* Dynamic 3D Projected Floor Shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 w-3/5 h-6 rounded-[50%]"
        style={{
          background: shadowColor,
          filter: `blur(${shadowBlur}px)`,
          opacity: shadowOpacity,
          transform: `translate3d(${shadowTranslateX}px, ${shadowTranslateY}px, 0px) scale(${
            isHovered ? 1.08 : 0.92
          })`,
          transition: isHovered
            ? "transform 0.1s ease-out, filter 0.1s ease-out, opacity 0.15s ease-out"
            : "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.65s ease, opacity 0.5s ease",
        }}
      />

      {/* 3D Floating Image Transform Node */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${currentScale})`,
          willChange: "transform",
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <img
          src={currentSrc}
          alt={alt}
          onError={() => setCurrentSrc(defaultIvBag)}
          className={cn(
            "h-full w-auto max-h-[190px] sm:max-h-[220px] object-contain drop-shadow-[0_12px_20px_rgba(14,49,146,0.18)] pointer-events-none",
            imageClassName
          )}
          draggable={false}
        />

        {/* Dynamic Specular Studio Lighting Reflection Glare */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle at ${50 + coords.x * 35}% ${
              50 + coords.y * 35
            }%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 65%)`,
            mixBlendMode: "overlay",
            transition: isHovered
              ? "opacity 0.2s ease-out"
              : "opacity 0.5s ease-out",
          }}
        />
      </div>

      {/* Ambient Inner Glow Ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-black/5 dark:ring-white/10"
      />

      {children}
    </div>
  );
}

/**
 * Props for the full FlatCard3DImage component
 */
export interface FlatCard3DImageProps {
  /** Product or card title */
  title: string;
  /** Subtitle, SKU, or pharmaceutical code */
  subtitle?: string;
  /** Pill category badge at top of image stage */
  categoryBadge?: string;
  /** Status badge text (e.g. "BPOM & Halal") */
  statusBadge?: string;
  /** Right specification or packaging detail */
  specDetail?: string;
  /** Product image source */
  imageSrc: string;
  /** Image alternative text */
  imageAlt?: string;
  /** Maximum tilt angle in degrees (default: 8) */
  maxTilt?: number;
  /** Z-elevation depth in pixels (default: 40) */
  elevation?: number;
  /** Scale factor when elevated (default: 1.05) */
  scale?: number;
  /** Optional CTA button text */
  ctaText?: string;
  /** Optional click handler for the card or CTA */
  onClick?: () => void;
  /** Additional container styling */
  className?: string;
  /** Header slot (e.g. tab switchers or category pills) */
  header?: React.ReactNode;
}

/**
 * FlatCard3DImage:
 * A production-ready Card Component where the outer container remains completely flat
 * and stable in 2D space, while the internal image floats and tilts in interactive 3D
 * with dynamic shadow projection and spring recovery.
 */
export function FlatCard3DImage({
  title,
  subtitle,
  categoryBadge,
  statusBadge,
  specDetail,
  imageSrc,
  imageAlt,
  maxTilt = 8,
  elevation = 40,
  scale = 1.05,
  ctaText,
  onClick,
  className,
  header,
}: FlatCard3DImageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const xNorm = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const yNorm = ((clientY - rect.top) / rect.height - 0.5) * 2;
      const clampedX = Math.max(-1, Math.min(1, xNorm));
      const clampedY = Math.max(-1, Math.min(1, yNorm));

      setCoords({ x: clampedX, y: clampedY });
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "rounded-[32px] bg-white/12 backdrop-blur-xl border-2 border-white/25 p-5 sm:p-6 shadow-2xl transition-[border-color,box-shadow] duration-300 select-none",
        onClick && "cursor-pointer hover:border-white/40",
        className
      )}
    >
      {/* Header Slot (e.g. Tab switchers) */}
      {header && <div className="mb-4">{header}</div>}

      {/* 3D Floating Image Stage (Controlled by whole card cursor position!) */}
      <Floating3DImageStage
        src={imageSrc}
        alt={imageAlt || title}
        maxTilt={maxTilt}
        elevation={elevation}
        scale={scale}
        coords={coords}
        isHovered={isHovered}
        badge={
          categoryBadge ? (
            <span className="px-3 py-1 rounded-full bg-brand-tint text-primary text-[10px] font-bold uppercase tracking-wider shadow-xs">
              {categoryBadge}
            </span>
          ) : undefined
        }
      />

      {/* Bottom Flat Metadata Bar (Stays strictly flat & stable in 2D space) */}
      <div className="mt-4 flex items-center justify-between text-left px-1">
        <div>
          {subtitle && (
            <div className="text-xs font-mono text-blue-200">{subtitle}</div>
          )}
          <h3 className="text-base font-semibold text-white tracking-tight">
            {title}
          </h3>
        </div>
        {(statusBadge || specDetail) && (
          <div className="text-right">
            {statusBadge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {statusBadge}
              </span>
            )}
            {specDetail && (
              <div className="text-[10px] text-white/75 mt-1 font-mono">
                {specDetail}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional CTA Button */}
      {ctaText && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-white text-primary text-xs font-bold uppercase tracking-wider hover:bg-brand-tint transition-colors cursor-pointer shadow-sm"
          >
            {ctaText}
          </button>
        </div>
      )}
    </div>
  );
}
