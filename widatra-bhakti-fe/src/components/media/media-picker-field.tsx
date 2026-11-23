import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { MediaImage } from "@/components/media/media-image";
import { MediaPickerModal } from "@/components/media/media-picker-modal";
import type { MediaFolder } from "@/lib/media-store";

export function MediaPickerField({
  value,
  onChange,
  folder = "Others",
}: {
  value: string;
  onChange: (ref: string) => void;
  folder?: MediaFolder;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 shrink-0 rounded border border-hairline overflow-hidden bg-brand-soft">
        <MediaImage src={value} alt="Selected" className="w-full h-full object-cover" />
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-hairline rounded text-[11px] font-semibold uppercase tracking-[0.14em] hover:border-primary hover:text-primary transition-colors"
      >
        <ImagePlus className="w-3.5 h-3.5" /> Select from Media Library
      </button>
      <MediaPickerModal
        open={open}
        onOpenChange={setOpen}
        defaultFolder={folder}
        mode="single"
        value={[value]}
        onSelect={(refs) => refs[0] && onChange(refs[0])}
      />
    </div>
  );
}

export function MediaPickerGalleryField({
  value,
  onChange,
  folder = "Others",
}: {
  value: string[];
  onChange: (refs: string[]) => void;
  folder?: MediaFolder;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((ref, i) => (
          <div key={`${ref}-${i}`} className="w-14 h-14 rounded border border-hairline overflow-hidden bg-brand-soft">
            <MediaImage src={ref} alt="Gallery item" className="w-full h-full object-cover" />
          </div>
        ))}
        {value.length === 0 && <span className="text-[12px] text-corporate-gray py-4">No images selected yet.</span>}
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-hairline rounded text-[11px] font-semibold uppercase tracking-[0.14em] hover:border-primary hover:text-primary transition-colors"
      >
        <ImagePlus className="w-3.5 h-3.5" /> Select images from Media Library
      </button>
      <MediaPickerModal
        open={open}
        onOpenChange={setOpen}
        defaultFolder={folder}
        mode="multi"
        value={value}
        onSelect={onChange}
      />
    </div>
  );
}
