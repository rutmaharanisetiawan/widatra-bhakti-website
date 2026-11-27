import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { WidatraKineticLoader } from "./widatra-kinetic-loader";

export interface SitePreloaderProps {
  /** Minimum time in ms to display on initial load (defaults to 1800ms) */
  initialDurationMs?: number;
  /** Whether to show during route transitions */
  showOnRouteChange?: boolean;
}

export function SitePreloader({
  initialDurationMs = 1800,
  showOnRouteChange = false,
}: SitePreloaderProps) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Check router loading state
  const isRouterLoading = useRouterState({
    select: (s) => (showOnRouteChange ? s.isLoading : false),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const dismissTimer = setTimeout(() => {
        setInitialLoading(false);
      }, 650);
      return () => clearTimeout(dismissTimer);
    }, initialDurationMs);

    return () => clearTimeout(timer);
  }, [initialDurationMs]);

  const isVisible = initialLoading || isRouterLoading;
  if (!isVisible && !isFadingOut) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#061844] transition-opacity duration-600 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={!isVisible}
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 dark:bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      {/* Kinetic Dual-Ring Orbit Widatra Logo Loader (Option B) */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-500 ease-out ${
          isFadingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <WidatraKineticLoader
          size="md"
          loadingText="OTSUKA GROUP INDONESIA · EST. 1986"
          showText={true}
          showDots={true}
        />
      </div>
    </div>
  );
}
