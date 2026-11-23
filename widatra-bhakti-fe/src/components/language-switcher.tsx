import { useLanguage } from "@/hooks/use-language";

export function LanguageSwitcher({
  transparent = false,
  className = "",
}: {
  /** Match the navbar's transparent-over-hero styling vs solid styling. */
  transparent?: boolean;
  className?: string;
}) {
  const { language, setLanguage } = useLanguage();

  const wrapperColor = transparent
    ? "border border-white/30 text-white/80"
    : "border border-black/[0.10] dark:border-white/[0.14] text-corporate-black/60 dark:text-white/70";

  const activeColor = transparent
    ? "bg-white/20 text-white"
    : "bg-primary text-primary-foreground";

  const inactiveHover = transparent
    ? "hover:text-white"
    : "hover:text-primary";

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`inline-flex items-center rounded-full p-0.5 transition-all duration-300 ${wrapperColor} ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
        title="English"
        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
          language === "en" ? activeColor : inactiveHover
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("id")}
        aria-pressed={language === "id"}
        aria-label="Ganti ke Bahasa Indonesia"
        title="Bahasa Indonesia"
        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
          language === "id" ? activeColor : inactiveHover
        }`}
      >
        ID
      </button>
    </div>
  );
}
