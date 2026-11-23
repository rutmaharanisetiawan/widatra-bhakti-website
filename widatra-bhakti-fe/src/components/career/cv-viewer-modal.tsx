import { useEffect, useState } from "react";
import { Download, X, ZoomIn, ZoomOut, RotateCcw, FileX } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

/* ------------------------------------------------------------------ */
/* Fullscreen CV / Resume viewer — Admin ATS                           */
/* Supports embedded PDF preview and zoomable image preview.           */
/* Falls back to an elegant empty state when no file is stored.        */
/* ------------------------------------------------------------------ */

function isImageFile(fileType: string, fileName: string) {
  if (fileType?.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(fileName || "");
}

function isPdfFile(fileType: string, fileName: string) {
  if (fileType === "application/pdf") return true;
  return /\.pdf$/i.test(fileName || "");
}

export function CvViewerModal({
  applicantName,
  jobTitle,
  fileName,
  fileType,
  dataUrl,
  onClose,
}: {
  applicantName: string;
  jobTitle: string;
  fileName: string;
  fileType: string;
  dataUrl: string;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { t } = useLanguage();

  const handleClose = () => {
    setClosing(true);
    window.setTimeout(onClose, 170);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasFile = !!dataUrl;
  const isImage = hasFile && isImageFile(fileType, fileName);
  const isPdf = hasFile && isPdfFile(fileType, fileName);

  return (
    <div
      className={`fixed inset-0 z-[80] bg-corporate-black/85 backdrop-blur-sm flex flex-col ${
        closing ? "animate-out fade-out duration-150" : "animate-in fade-in duration-200"
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`CV viewer — ${applicantName}`}
    >
      <div
        className={`bg-white dark:bg-card w-full h-full flex flex-col shadow-2xl ${
          closing ? "animate-out zoom-out-95 fade-out duration-150" : "animate-in zoom-in-95 fade-in duration-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-hairline bg-white dark:bg-card flex-shrink-0">
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-semibold font-display truncate text-corporate-black dark:text-foreground">
              {applicantName}
            </div>
            <div className="text-[11px] sm:text-[12px] text-corporate-gray truncate">
              {jobTitle}
              {fileName ? ` · ${fileName}` : ""}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isImage && (
              <div className="hidden sm:flex items-center gap-0.5 mr-1 border border-hairline rounded-md px-1 py-1">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                  className="w-7 h-7 grid place-items-center rounded hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-corporate-gray hover:text-corporate-black dark:hover:text-foreground"
                  aria-label={t("admin.ats.cvViewer.zoomOut")}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] w-11 text-center text-corporate-gray tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                  className="w-7 h-7 grid place-items-center rounded hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-corporate-gray hover:text-corporate-black dark:hover:text-foreground"
                  aria-label={t("admin.ats.cvViewer.zoomIn")}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="w-7 h-7 grid place-items-center rounded hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-corporate-gray hover:text-corporate-black dark:hover:text-foreground"
                  aria-label={t("admin.ats.cvViewer.resetZoom")}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}

            {hasFile && (
              <a
                href={dataUrl}
                download={fileName}
                className="inline-flex items-center gap-2 h-9 px-3 sm:px-4 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-brand-deep flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t("admin.ats.cvViewer.download")}</span>
              </a>
            )}

            <button
              onClick={handleClose}
              aria-label={t("admin.ats.cvViewer.close")}
              className="w-9 h-9 grid place-items-center rounded-full text-corporate-gray hover:text-corporate-black dark:hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-auto bg-black/[0.03] dark:bg-black/20 flex items-center justify-center">
          {!hasFile && (
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand-soft grid place-items-center mb-4">
                <FileX className="w-7 h-7 text-corporate-gray" />
              </div>
              <div className="text-sm font-semibold text-corporate-black dark:text-foreground mb-1">
                {t("admin.ats.cvViewer.noFileTitle")}
              </div>
              <p className="text-[12px] text-corporate-gray leading-relaxed">
                {t("admin.ats.cvViewer.noFileBody")}
              </p>
            </div>
          )}

          {hasFile && isPdf && (
            <iframe src={dataUrl} title={`CV — ${applicantName}`} className="w-full h-full border-0 bg-white" />
          )}

          {hasFile && isImage && (
            <div className="w-full h-full overflow-auto flex items-center justify-center p-6">
              <img
                src={dataUrl}
                alt={`CV — ${applicantName}`}
                style={{ transform: `scale(${zoom})`, transition: "transform 150ms ease" }}
                className="max-w-none select-none rounded shadow-lg"
                draggable={false}
              />
            </div>
          )}

          {hasFile && !isPdf && !isImage && (
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand-soft grid place-items-center mb-4">
                <FileX className="w-7 h-7 text-corporate-gray" />
              </div>
              <div className="text-sm font-semibold text-corporate-black dark:text-foreground mb-1">
                {t("admin.ats.cvViewer.previewNotAvailableTitle")}
              </div>
              <p className="text-[12px] text-corporate-gray leading-relaxed">
                {fileName ? fileName : t("admin.ats.cvViewer.previewNotAvailableBodyPrefix")} {t("admin.ats.cvViewer.previewNotAvailableBodySuffix")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
