import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle({
  transparent = false,
  className = "",
}: {
  /** Match the navbar's transparent-over-hero styling vs solid styling. */
  transparent?: boolean;
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
        transparent
          ? "border border-white/30 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/50"
          : "border border-black/[0.10] dark:border-white/[0.14] text-corporate-black/60 dark:text-white/70 hover:text-primary hover:border-primary hover:bg-brand-tint"
      } ${className}`}
    >
      <span className="theme-toggle-icon">
        <svg
          className="icon-sun"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.55 1.55M18.05 18.05l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.4 19.6l1.55-1.55M18.05 5.95l1.55-1.55" />
        </svg>
        <svg
          className="icon-moon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
        </svg>
      </span>
    </button>
  );
}
