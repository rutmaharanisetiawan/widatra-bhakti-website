import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "fade";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds (default: 650)
  threshold?: number; // 0 to 1 (default: 0.12)
  once?: boolean; // If false, re-triggers when scrolling back into view (default: false for continuous scroll motion)
  className?: string;
  style?: React.CSSProperties;
}

/**
 * High-performance Scroll-Driven Transition Component
 * Triggers silky 60fps hardware-accelerated entrance animations on scroll.
 */
export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 650,
  threshold = 0.12,
  once = false,
  className,
  style,
  ...props
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check if element is already in viewport on mount (e.g. above the fold)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            // Re-arm when out of view so scrolling back down triggers the motion transition
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Initial and target transforms
  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";
    switch (animation) {
      case "fade-up":
        return "translate3d(0, 32px, 0)";
      case "fade-down":
        return "translate3d(0, -32px, 0)";
      case "fade-left":
        return "translate3d(-36px, 0, 0)";
      case "fade-right":
        return "translate3d(36px, 0, 0)";
      case "zoom-in":
        return "translate3d(0, 20px, 0) scale(0.92)";
      case "fade":
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn("transition-all ease-[cubic-bezier(0.16,1,0.3,1)]", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * ScrollStagger container to automatically cascade delays across child cards
 */
export function ScrollStagger({
  children,
  staggerMs = 90,
  animation = "fade-up",
  className,
  once = false,
}: {
  children: React.ReactNode;
  staggerMs?: number;
  animation?: AnimationType;
  className?: string;
  once?: boolean;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ScrollReveal
            animation={animation}
            delay={idx * staggerMs}
            once={once}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </div>
  );
}
