import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface Interactive3DProductCardProps {
  /** Main product title */
  title: string;
  /** Subtitle / pharmaceutical code */
  subtitle?: string;
  /** Pill category badge on the stage (e.g. "LVP · PARENTERAL") */
  categoryBadge?: string;
  /** Status badge text (e.g. "BPOM & Halal") */
  statusBadge?: string;
  /** Specification detail (e.g. "500 mL & 1000 mL Unicap") */
  specDetail?: string;
  /** Product image source URL */
  imageSrc: string;
  /** Product image alt */
  imageAlt?: string;
  /** Maximum 3D card tilt angle in degrees (default: 9) */
  maxTilt?: number;
  /** Optional top header slot (e.g. pill tab switcher) */
  header?: React.ReactNode;
  /** Optional custom container class */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Interactive3DProductCard:
 * - Outer Frame stays flat and stable ("frame ya gausa").
 * - The inner white stage box ("daerah putihnya aja") smoothly tilts & floats in 3D space with 60 FPS lerp physics.
 * - Product image inside floats forward (translateZ) with dynamic floor shadow & specular sheen.
 */
export function Interactive3DProductCard({
  title,
  subtitle,
  categoryBadge,
  statusBadge,
  specDetail,
  imageSrc,
  imageAlt,
  maxTilt = 9,
  header,
  className,
  onClick,
}: Interactive3DProductCardProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  // Smooth lerp coordinates (-1 to +1)
  const [coords, setCoords] = useState({ x: 0, y: 0, px: 50, py: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Physics animation ref for buttery smooth 60fps lerp
  const targetCoords = useRef({ x: 0, y: 0, px: 50, py: 50 });
  const currentCoords = useRef({ x: 0, y: 0, px: 50, py: 50 });
  const animFrameId = useRef<number | null>(null);

  // Continuous animation loop that glides smoothly toward the target coords
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const factor = isHovered ? 0.14 : 0.08;
      const dx = targetCoords.current.x - currentCoords.current.x;
      const dy = targetCoords.current.y - currentCoords.current.y;
      const dpx = targetCoords.current.px - currentCoords.current.px;
      const dpy = targetCoords.current.py - currentCoords.current.py;

      // Only update if difference is noticeable
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        currentCoords.current.x += dx * factor;
        currentCoords.current.y += dy * factor;
        currentCoords.current.px += dpx * factor;
        currentCoords.current.py += dpy * factor;

        setCoords({
          x: currentCoords.current.x,
          y: currentCoords.current.y,
          px: currentCoords.current.px,
          py: currentCoords.current.py,
        });
      }

      animFrameId.current = requestAnimationFrame(tick);
    };

    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const xOffset = e.clientX - rect.left;
    const yOffset = e.clientY - rect.top;

    const xNorm = ((xOffset / rect.width) - 0.5) * 2;
    const yNorm = ((yOffset / rect.height) - 0.5) * 2;

    targetCoords.current = {
      x: Math.max(-1, Math.min(1, xNorm)),
      y: Math.max(-1, Math.min(1, yNorm)),
      px: Math.max(0, Math.min(100, (xOffset / rect.width) * 100)),
      py: Math.max(0, Math.min(100, (yOffset / rect.height) * 100)),
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    targetCoords.current = { x: 0, y: 0, px: 50, py: 50 };
  }, []);

  // 3D Rotations for ONLY the white stage
  const rotateX = -coords.y * maxTilt;
  const rotateY = coords.x * maxTilt;

  // Dynamic shadow for the white stage
  const stageShadowX = -coords.x * 16;
  const stageShadowY = 16 - coords.y * 12;
  const stageShadowBlur = isHovered ? 36 : 20;

  // Dynamic floor shadow under the product inside the white box
  const productShadowX = -coords.x * 14;
  const productShadowY = 8 - coords.y * 6;

  return (
    <div className="relative mx-auto max-w-[360px] sm:max-w-[440px] lg:max-w-[460px] xl:max-w-[490px] 2xl:max-w-none w-full select-none">
      {/* 
        OUTER CARD CONTAINER (Frame)
        STAYS STRICTLY FLAT & STILL ("frame ya gausa")
      */}
      <div
        onClick={onClick}
        className={cn(
          "relative rounded-[32px] bg-white/14 dark:bg-card/75 backdrop-blur-xl border-2 border-white/30 dark:border-white/15 p-5 sm:p-6 shadow-[0_20px_50px_rgba(9,42,125,0.28)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65)]",
          className
        )}
      >
        {/* =========================================================
            TOP HEADER / TAB SWITCHER (Flat & Still)
        ========================================================= */}
        {header && <div className="mb-4 relative z-10">{header}</div>}

        {/* =========================================================
            INNER WHITE STAGE ("Daerah Putihnya Aja Yang Gerak 3D")
        ========================================================= */}
        <div
          style={{ perspective: "1000px" }}
          className="w-full relative z-20 py-1"
        >
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              boxShadow: isHovered
                ? `${stageShadowX}px ${stageShadowY}px ${stageShadowBlur}px -4px rgba(9, 42, 125, 0.32), 0 0 0 1px rgba(255, 255, 255, 0.45) inset`
                : "0 10px 25px -5px rgba(9, 42, 125, 0.16)",
              willChange: "transform, box-shadow",
            }}
            className="rounded-[26px] bg-white dark:bg-slate-900 p-5 sm:p-6 flex items-center justify-center aspect-[16/11.5] relative overflow-hidden cursor-pointer border border-white/60 dark:border-white/10"
          >
            {/* Category Pill Badge (Floats at translateZ: 24px) */}
            {categoryBadge && (
              <div
                style={{
                  transform: isHovered ? "translateZ(24px)" : "translateZ(0px)",
                  transition: "transform 0.2s ease-out",
                }}
                className="absolute top-3.5 left-3.5 z-30 pointer-events-none"
              >
                <span className="px-3 py-1 rounded-full bg-brand-tint dark:bg-white/10 text-primary text-[10px] font-bold uppercase tracking-wider shadow-xs border border-primary/10">
                  {categoryBadge}
                </span>
              </div>
            )}

            {/* Subtle Studio Ambient Depth Glow */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute w-52 h-52 rounded-full blur-2xl transition-opacity duration-500",
                isHovered ? "bg-gradient-to-tr from-primary/20 via-sky-300/25 to-blue-200/20 opacity-100" : "bg-primary/5 opacity-50"
              )}
            />

            {/* Dynamic Product Floor Shadow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 w-3/5 h-6 rounded-[50%]"
              style={{
                background: "rgba(14, 49, 146, 0.28)",
                filter: `blur(${isHovered ? 18 : 10}px)`,
                opacity: isHovered ? 0.45 : 0.22,
                transform: `translate3d(${productShadowX}px, ${productShadowY}px, 0px) scale(${isHovered ? 1.08 : 0.94})`,
                transition: "filter 0.2s ease-out, opacity 0.2s ease-out",
              }}
            />

            {/* 3D Floating Product Image (Floats forward at translateZ: 42px) */}
            <div
              style={{
                transform: isHovered
                  ? `translate3d(${coords.x * 10}px, ${coords.y * 8}px, 42px) scale(1.06)`
                  : "translate3d(0px, 0px, 0px) scale(1)",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <img
                src={imageSrc}
                alt={imageAlt || title}
                className="h-full w-auto max-h-[195px] sm:max-h-[225px] object-contain drop-shadow-[0_14px_24px_rgba(14,49,146,0.22)] select-none"
                draggable={false}
              />
            </div>

            {/* Dynamic Specular Sheen across the White Stage */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[25px] overflow-hidden"
              style={{
                opacity: isHovered ? 0.35 : 0,
                background: `radial-gradient(circle at ${coords.px}% ${coords.py}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)`,
                mixBlendMode: "overlay",
                transition: "opacity 0.25s ease-out",
              }}
            />
          </div>
        </div>

        {/* =========================================================
            BOTTOM METADATA & SPECS (Flat & Still)
        ========================================================= */}
        <div className="mt-4 flex items-center justify-between text-left px-1 relative z-10">
          <div>
            {subtitle && (
              <div className="text-xs font-mono text-blue-200 dark:text-blue-300">
                {subtitle}
              </div>
            )}
            <h3 className="text-base font-semibold text-white tracking-tight">
              {title}
            </h3>
          </div>
          {(statusBadge || specDetail) && (
            <div className="text-right">
              {statusBadge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {statusBadge}
                </span>
              )}
              {specDetail && (
                <div className="text-[10px] text-white/80 dark:text-white/70 mt-1 font-mono">
                  {specDetail}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
