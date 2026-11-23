import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { onMediaStoreChange, resolveMediaUrl } from "@/lib/media-store";
import { ImageOff } from "lucide-react";

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  /** A `media:<id>` reference or a legacy raw URL/import path. */
  src: string | undefined | null;
  fallbackClassName?: string;
};

/**
 * Drop-in replacement for `<img src={...} />` used everywhere a Product,
 * News, CSR, Factory Tour or Company Profile image is rendered. It always
 * resolves the *current* Media Library asset for `media:` references, so
 * replacing a file in the Media Library propagates everywhere instantly.
 */
export function MediaImage({ src, alt, fallbackClassName, className, ...rest }: MediaImageProps) {
  const [resolved, setResolved] = useState(() => resolveMediaUrl(src));

  useEffect(() => {
    setResolved(resolveMediaUrl(src));
    const unsubscribe = onMediaStoreChange(() => setResolved(resolveMediaUrl(src)));
    return unsubscribe;
  }, [src]);

  if (!resolved) {
    return (
      <div className={fallbackClassName ?? className ?? "grid place-items-center bg-brand-soft text-corporate-gray/60"}>
        <ImageOff className="w-1/3 h-1/3 min-w-4 min-h-4" />
      </div>
    );
  }

  return <img src={resolved} alt={alt ?? ""} className={className} {...rest} />;
}
