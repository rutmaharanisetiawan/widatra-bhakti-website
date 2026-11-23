import { useEffect, useState } from "react";

export type SubNavItem<T extends string | number = string> = {
  id: T;
  label: string;
  /** Optional count shown cleanly in parentheses, e.g. (4) */
  count?: number;
  /** Optional anchor target (e.g. "#profile"). When set, clicking smooth-scrolls to the section. */
  href?: string;
};

/** Strips leading "(01) " or "01 " numbering from eyebrow strings when used as tab labels */
function cleanLabel(raw: string): string {
  return raw.replace(/^\(\d+\)\s*/, "").trim();
}

export function SubNavbar<T extends string | number = string>({
  items,
  activeId,
  onSelect,
  sticky = false,
  scrollSpy = false,
  align = "center",
  className = "",
}: {
  items: readonly SubNavItem<T>[];
  activeId?: T;
  onSelect?: (id: T) => void;
  /** Renders as a sticky floating pill bar below the main SiteNav */
  sticky?: boolean;
  /** Automatically tracks which section anchor is in view when items have `href="#..."` */
  scrollSpy?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const [spyActiveId, setSpyActiveId] = useState<T | undefined>(items[0]?.id);
  const currentActive = activeId !== undefined ? activeId : spyActiveId;

  useEffect(() => {
    if (!scrollSpy) return;
    const sectionIds = items
      .map((it) => (it.href?.startsWith("#") ? it.href.slice(1) : String(it.id)))
      .filter(Boolean);

    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      const offset = 200;
      let current = items[0]?.id;
      for (const item of items) {
        const targetId = item.href?.startsWith("#") ? item.href.slice(1) : String(item.id);
        const el = document.getElementById(targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            current = item.id;
          }
        }
      }
      if (current !== undefined) {
        setSpyActiveId(current);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items, scrollSpy]);

  const handleClick = (item: SubNavItem<T>) => {
    if (onSelect) {
      onSelect(item.id);
    }
    if (item.href?.startsWith("#")) {
      setSpyActiveId(item.id);
      const targetId = item.href.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const pillTrack = (
    <div
      role="tablist"
      aria-label="Section navigation"
      className="inline-flex items-center gap-1 p-1.5 rounded-[22px] sm:rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.10] shadow-[0_6px_24px_-6px_rgba(9,42,125,0.12)] dark:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.6)] max-w-full overflow-x-auto no-scrollbar"
    >
      {items.map((item) => {
        const isActive = currentActive === item.id;
        return (
          <button
            key={String(item.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleClick(item)}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              isActive
                ? "bg-gradient-to-r from-primary to-brand-deep text-white shadow-[0_6px_16px_-4px_rgba(14,49,146,0.5)] scale-[1.01]"
                : "text-corporate-gray hover:text-primary hover:bg-brand-soft/70 dark:hover:bg-white/[0.05]"
            }`}
          >
            <span>{cleanLabel(item.label)}</span>
            {typeof item.count === "number" && (
              <span
                className={`ml-1.5 text-[10px] font-semibold ${
                  isActive ? "text-white/80" : "text-corporate-gray/70"
                }`}
              >
                ({item.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  if (sticky) {
    return (
      <div
        className={`sticky top-[70px] sm:top-[82px] z-30 py-3 px-4 sm:px-6 pointer-events-none ${className}`}
      >
        <div
          className={`max-w-[1360px] mx-auto flex pointer-events-auto ${
            align === "center"
              ? "justify-center"
              : align === "right"
                ? "justify-end"
                : "justify-start"
          }`}
        >
          {pillTrack}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex max-w-full ${
        align === "center"
          ? "justify-center"
          : align === "right"
            ? "justify-end"
            : "justify-start"
      } ${className}`}
    >
      {pillTrack}
    </div>
  );
}
