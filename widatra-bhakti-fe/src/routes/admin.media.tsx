import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, AdminButton } from "@/components/admin-shell";
import {
  Upload,
  ImageOff,
  Search,
  Pencil,
  Replace,
  Trash2,
  X,
  Info,
} from "lucide-react";
import { useMedia } from "@/hooks/use-media";
import {
  MEDIA_FOLDERS,
  addMediaAsset,
  renameMediaAsset,
  moveMediaAsset,
  replaceMediaAssetFile,
  deleteMediaAsset,
  formatBytes,
  type MediaAsset,
  type MediaFolder,
} from "@/lib/media-store";
import { fileToOptimizedImage, ACCEPTED_IMAGE_ACCEPT_ATTR } from "@/lib/image-upload";
import { getMediaUsages } from "@/lib/media-usage";
import { MediaImage } from "@/components/media/media-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Media Library — Admin" }] }),
  component: AdminMediaPage,
});

function AdminMediaPage() {
  const { assets, refresh } = useMedia();
  const [folder, setFolder] = useState<MediaFolder | "All">("All");
  const [query, setQuery] = useState("");
  const [uploadFolder, setUploadFolder] = useState<MediaFolder>("Others");
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [renaming, setRenaming] = useState<MediaAsset | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<MediaAsset | null>(null);

  const filtered = useMemo(() => {
    const scoped = folder === "All" ? assets : assets.filter((a) => a.folder === folder);
    const q = query.trim().toLowerCase();
    if (!q) return scoped;
    return scoped.filter((a) => a.name.toLowerCase().includes(q));
  }, [assets, folder, query]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assets) map.set(a.folder, (map.get(a.folder) ?? 0) + 1);
    return map;
  }, [assets]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    let succeeded = 0;
    for (const file of list) {
      try {
        const optimized = await fileToOptimizedImage(file);
        await addMediaAsset({
          name: file.name,
          url: optimized.url,
          folder: folder === "All" ? uploadFolder : folder,
          type: optimized.type,
          size: optimized.size,
        });
        succeeded += 1;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Couldn't upload "${file.name}".`);
      }
    }
    if (succeeded > 0) {
      refresh();
      toast.success(succeeded > 1 ? `${succeeded} images uploaded` : "Image uploaded");
    }
  }

  async function handleReplace(file: File | undefined) {
    if (!file || !replaceTarget) return;
    try {
      const optimized = await fileToOptimizedImage(file);
      await replaceMediaAssetFile(replaceTarget.id, optimized);
      refresh();
      toast.success(`"${replaceTarget.name}" replaced — updated everywhere it's used`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Couldn't replace "${replaceTarget.name}".`);
    } finally {
      setReplaceTarget(null);
    }
  }

  async function submitRename() {
    if (!renaming || !renameValue.trim()) return;
    await renameMediaAsset(renaming.id, renameValue.trim());
    refresh();
    toast.success("Renamed");
    setRenaming(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteMediaAsset(deleteTarget.id);
    refresh();
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  }

  const deleteUsages = deleteTarget ? getMediaUsages(deleteTarget.id) : [];
  const previewUsages = preview ? getMediaUsages(preview.id) : [];

  return (
    <AdminShell
      title="Media Library"
      subtitle="The single image source for Products, News & Event, CSR, Factory Tour, Company Profile and every other module."
      actions={
        <div className="flex items-center gap-2">
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value as MediaFolder)}
            className="admin-input h-10 w-auto"
            title="Folder new uploads will be added to"
          >
            {MEDIA_FOLDERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <AdminButton onClick={() => uploadInputRef.current?.click()}>
            <Upload className="w-4 h-4" /> Upload media
          </AdminButton>
          <input
            ref={uploadInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
            multiple
            className="hidden"
            onChange={(e) => {
              handleUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      }
    >
      {/* Toolbar: search + folder tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-2 h-10 px-3 border border-hairline rounded bg-white dark:bg-card w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-corporate-gray shrink-0" />
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
            className={`h-9 px-3.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
              folder === "All" ? "bg-primary text-white border-primary" : "border-hairline hover:border-primary hover:text-primary"
            }`}
          >
            All <span className="opacity-70">({assets.length})</span>
          </button>
          {MEDIA_FOLDERS.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFolder(f)}
              className={`h-9 px-3.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] border transition-colors whitespace-nowrap ${
                folder === f ? "bg-primary text-white border-primary" : "border-hairline hover:border-primary hover:text-primary"
              }`}
            >
              {f} <span className="opacity-70">({counts.get(f) ?? 0})</span>
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs font-mono text-corporate-gray">
          {filtered.length} of {assets.length} assets
        </span>
      </div>

      {/* Drop-to-upload zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
        className="mb-6 border-2 border-dashed border-hairline rounded-xl px-6 py-5 text-center text-corporate-gray hover:border-primary/50 transition-colors"
      >
        <Upload className="w-5 h-5 mx-auto mb-1.5 opacity-60" />
        <p className="text-[12px]">
          Drag & drop images here, or{" "}
          <button type="button" onClick={() => uploadInputRef.current?.click()} className="text-primary font-semibold underline underline-offset-2">
            Choose File
          </button>{" "}
          — added to <strong>{folder === "All" ? uploadFolder : folder}</strong>. JPG, JPEG, PNG, SVG, or WebP, up to 15MB.
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center text-corporate-gray">
          <ImageOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images match your search or filter yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filtered.map((asset) => (
            <div key={asset.id} className="group card-elevated overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={() => setPreview(asset)}
                className="aspect-square w-full overflow-hidden bg-brand-soft focus:outline-none"
              >
                <MediaImage
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
              <div className="p-2.5 flex-1 flex flex-col gap-1.5">
                <p className="text-[12px] font-medium truncate" title={asset.name}>{asset.name}</p>
                <div className="flex items-center justify-between text-[10px] text-corporate-gray">
                  <span className="uppercase tracking-wide">{asset.folder}</span>
                  <span>{formatBytes(asset.size)}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <button
                    type="button"
                    title="Rename"
                    onClick={() => {
                      setRenaming(asset);
                      setRenameValue(asset.name);
                    }}
                    className="flex-1 h-7 grid place-items-center border border-hairline rounded hover:border-primary hover:text-primary transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    title="Replace file"
                    onClick={() => {
                      setReplaceTarget(asset);
                      replaceInputRef.current?.click();
                    }}
                    className="flex-1 h-7 grid place-items-center border border-hairline rounded hover:border-primary hover:text-primary transition-colors"
                  >
                    <Replace className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => setDeleteTarget(asset)}
                    className="flex-1 h-7 grid place-items-center border border-hairline rounded hover:border-destructive hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={replaceInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => {
          handleReplace(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {/* Rename dialog */}
      <DialogPrimitive.Root open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[120] bg-corporate-black/60 backdrop-blur-sm" />
          <DialogPrimitive.Content className="fixed z-[121] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-sm bg-white dark:bg-card rounded-xl shadow-2xl p-6">
            <DialogPrimitive.Title className="text-base font-semibold font-display mb-4">Rename image</DialogPrimitive.Title>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="admin-input mb-4"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && submitRename()}
            />
            <div className="flex justify-end gap-3">
              <DialogPrimitive.Close className="h-9 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors">
                Cancel
              </DialogPrimitive.Close>
              <button
                type="button"
                onClick={submitRename}
                className="h-9 px-4 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors"
              >
                Save
              </button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Preview dialog */}
      <DialogPrimitive.Root open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[120] bg-corporate-black/60 backdrop-blur-sm" />
          <DialogPrimitive.Content className="fixed z-[121] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-card rounded-xl shadow-2xl">
            {preview && (
              <>
                <div className="flex items-center justify-between px-6 h-14 border-b border-hairline">
                  <DialogPrimitive.Title className="text-sm font-semibold truncate pr-4">{preview.name}</DialogPrimitive.Title>
                  <DialogPrimitive.Close className="w-8 h-8 rounded-full grid place-items-center hover:bg-brand-soft shrink-0">
                    <X className="w-4 h-4" />
                  </DialogPrimitive.Close>
                </div>
                <div className="aspect-video bg-brand-soft">
                  <MediaImage src={preview.url} alt={preview.name} className="w-full h-full object-contain" />
                </div>
                <div className="p-6 space-y-4">
                  <dl className="grid grid-cols-3 gap-4 text-[12px]">
                    <div><dt className="text-corporate-gray uppercase tracking-wide text-[10px] mb-1">Folder</dt><dd>{preview.folder}</dd></div>
                    <div><dt className="text-corporate-gray uppercase tracking-wide text-[10px] mb-1">Size</dt><dd>{formatBytes(preview.size)}</dd></div>
                    <div><dt className="text-corporate-gray uppercase tracking-wide text-[10px] mb-1">Type</dt><dd>{preview.type}</dd></div>
                  </dl>
                  <div>
                    <label className="text-corporate-gray uppercase tracking-wide text-[10px] mb-1.5 block">Move to folder</label>
                    <select
                      value={preview.folder}
                      onChange={async (e) => {
                        const nextFolder = e.target.value as MediaFolder;
                        await moveMediaAsset(preview.id, nextFolder);
                        refresh();
                        setPreview((p) => (p ? { ...p, folder: nextFolder } : p));
                      }}
                      className="admin-input"
                    >
                      {MEDIA_FOLDERS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-brand-soft/60 rounded-lg p-4">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-corporate-gray mb-2">
                      <Info className="w-3.5 h-3.5" /> Used in {previewUsages.length} place{previewUsages.length === 1 ? "" : "s"}
                    </p>
                    {previewUsages.length === 0 ? (
                      <p className="text-[12px] text-corporate-gray">Not currently referenced anywhere. Safe to delete.</p>
                    ) : (
                      <ul className="text-[12px] space-y-1">
                        {previewUsages.map((u, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="inline-flex h-5 items-center px-2 rounded-full bg-white dark:bg-card text-[10px] font-bold uppercase tracking-wide text-primary border border-primary/20">
                              {u.module}
                            </span>
                            <span className="text-corporate-black dark:text-foreground truncate">{u.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-[11px] text-corporate-gray mt-3">
                      Replacing this file updates it everywhere listed above automatically.
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteUsages.length > 0 ? (
                <>
                  This image is currently used in {deleteUsages.length} place{deleteUsages.length === 1 ? "" : "s"}
                  {" "}({deleteUsages.map((u) => u.module).join(", ")}). Those items will fall back to a broken-image
                  placeholder until you assign a new image. This action cannot be undone.
                </>
              ) : (
                "This image isn't referenced anywhere right now. This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
