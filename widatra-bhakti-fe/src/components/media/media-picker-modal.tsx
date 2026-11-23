import { useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, Upload, X, Check, ImageOff } from "lucide-react";
import {
  MEDIA_FOLDERS,
  addMediaAsset,
  searchMedia,
  toMediaRef,
  isMediaRef,
  mediaRefId,
  type MediaFolder,
} from "@/lib/media-store";
import { fileToOptimizedImage, ACCEPTED_IMAGE_ACCEPT_ATTR } from "@/lib/image-upload";
import { useMedia } from "@/hooks/use-media";
import { MediaImage } from "@/components/media/media-image";
import { toast } from "sonner";

type MediaPickerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Folder new uploads land in by default, and the initial filter tab. */
  defaultFolder?: MediaFolder;
  mode?: "single" | "multi";
  /** Currently-selected media references (e.g. current form value(s)). */
  value?: string[];
  onSelect: (refs: string[]) => void;
  title?: string;
};

export function MediaPickerModal({
  open,
  onOpenChange,
  defaultFolder = "Others",
  mode = "single",
  value = [],
  onSelect,
  title,
}: MediaPickerModalProps) {
  const { assets, refresh } = useMedia();
  const [folder, setFolder] = useState<MediaFolder | "All">(defaultFolder);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFolder(defaultFolder);
      setQuery("");
      setPicked(new Set(value.filter(isMediaRef).map(mediaRefId)));
    }
  }, [open, defaultFolder, value]);

  const results = useMemo(() => searchMedia(query, folder), [assets, query, folder]);

  function togglePick(id: string) {
    if (mode === "single") {
      onSelect([toMediaRef(id)]);
      onOpenChange(false);
      return;
    }
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirmMulti() {
    onSelect(Array.from(picked).map(toMediaRef));
    onOpenChange(false);
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const uploadFolder = folder === "All" ? defaultFolder : folder;
    const list = Array.from(files);
    let lastCreatedId: string | null = null;
    let succeeded = 0;
    for (const file of list) {
      try {
        const optimized = await fileToOptimizedImage(file);
        const created = await addMediaAsset({
          name: file.name,
          url: optimized.url,
          folder: uploadFolder,
          type: optimized.type,
          size: optimized.size,
        });
        succeeded += 1;
        lastCreatedId = created.id;
        if (mode === "multi") {
          setPicked((prev) => new Set(prev).add(created.id));
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Couldn't upload "${file.name}".`);
      }
    }
    if (succeeded === 0) return;
    refresh();
    toast.success(succeeded > 1 ? `${succeeded} images uploaded` : "Image uploaded");
    if (mode === "single" && lastCreatedId) {
      onSelect([toMediaRef(lastCreatedId)]);
      onOpenChange(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[110] bg-corporate-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />
        <DialogPrimitive.Content
          className="fixed z-[111] bg-white dark:bg-card shadow-2xl overflow-hidden flex flex-col
            inset-x-0 bottom-0 top-6 rounded-t-2xl
            sm:inset-x-4 sm:bottom-4 sm:top-10 sm:rounded-2xl
            lg:left-1/2 lg:top-1/2 lg:bottom-auto lg:right-auto lg:-translate-x-1/2 lg:-translate-y-1/2
            lg:w-full lg:max-w-4xl lg:h-[85vh] lg:max-h-[760px]
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            duration-300 ease-out focus:outline-none"
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-hairline shrink-0">
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold font-display">
                {title ?? "Select from Media Library"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-corporate-gray">
                {mode === "multi" ? "Select one or more images, then confirm." : "Click an image to select it."}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="w-9 h-9 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-hairline shrink-0">
            <div className="flex items-center gap-2 h-9 px-3 border border-hairline rounded bg-white dark:bg-card flex-1 min-w-[180px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-corporate-gray" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search media…"
                className="flex-1 h-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFolder("All")}
                className={`h-8 px-3 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
                  folder === "All" ? "bg-primary text-white border-primary" : "border-hairline hover:border-primary hover:text-primary"
                }`}
              >
                All
              </button>
              {MEDIA_FOLDERS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFolder(f)}
                  className={`h-8 px-3 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] border transition-colors whitespace-nowrap ${
                    folder === f ? "bg-primary text-white border-primary" : "border-hairline hover:border-primary hover:text-primary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleUploadClick}
              className="ml-auto inline-flex items-center gap-1.5 h-9 px-3.5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-brand-deep rounded shrink-0"
            >
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 py-5"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            {results.length === 0 ? (
              <div className="h-full grid place-items-center text-center text-corporate-gray">
                <div>
                  <ImageOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No images match. Try another search, or drag & drop / upload a new one.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {results.map((asset) => {
                  const isPicked = picked.has(asset.id);
                  return (
                    <button
                      type="button"
                      key={asset.id}
                      onClick={() => togglePick(asset.id)}
                      className={`group relative card-elevated aspect-square overflow-hidden text-left focus:outline-none ${
                        isPicked ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <MediaImage src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                      {isPicked && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary text-white grid place-items-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                      <span className="absolute inset-x-0 bottom-0 bg-corporate-black/70 text-white text-[10px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {asset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {mode === "multi" && (
            <div className="flex items-center justify-between gap-3 px-6 h-16 border-t border-hairline shrink-0 bg-brand-soft/40">
              <span className="text-[12px] text-corporate-gray">{picked.size} selected</span>
              <div className="flex gap-3">
                <DialogPrimitive.Close className="h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
                  Cancel
                </DialogPrimitive.Close>
                <button
                  type="button"
                  onClick={confirmMulti}
                  className="h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors"
                >
                  Use {picked.size || ""} image{picked.size === 1 ? "" : "s"}
                </button>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
