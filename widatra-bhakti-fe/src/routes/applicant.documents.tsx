import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ApplicantShell } from "@/components/applicant-shell";
import {
  deleteDocument,
  formatDocumentSize,
  getAllDocuments,
  initDocumentsStore,
  onDocumentsStoreChange,
  uploadDocument,
  type StoredDocument,
} from "@/lib/documents-store";
import { useLanguage } from "@/hooks/use-language";
import { Download, Upload, FileText, Trash2, Loader2, CloudUpload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/applicant/documents")({
  head: () => ({ meta: [{ title: "Documents — Widatra Applicant" }] }),
  component: DocumentsPage,
});

function useDocuments() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  useEffect(() => {
    initDocumentsStore();
    setDocuments(getAllDocuments());
    return onDocumentsStoreChange(() => setDocuments(getAllDocuments()));
  }, []);
  return documents;
}

function DocumentsPage() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const documents = useDocuments();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await uploadDocument(file);
      }
      toast.success(isId ? "Dokumen berhasil diunggah." : "Document uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't upload the document.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      toast.success(isId ? "Dokumen dihapus." : "Document removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove the document.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ApplicantShell
      title={t("dashboard.documents.title")}
      subtitle={t("dashboard.documents.subtitle")}
      headerActions={
        <button
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-60 transition-all cursor-pointer"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{t("dashboard.documents.uploadDocument")}</span>
        </button>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Interactive Drag & Drop Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-6 rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-500/20 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#13213a] hover:border-primary/60 dark:hover:border-sky-400/60"
        }`}
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 flex items-center justify-center mb-3">
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CloudUpload className="w-6 h-6" />}
        </div>
        <div className="text-sm font-bold text-slate-900 dark:text-white">
          {isId
            ? "Tarik & lepas berkas CV, Sertifikat, atau Portofolio di sini"
            : "Drag & drop your CV, Certificates, or Portfolio files here"}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">
          {isId
            ? "Atau klik untuk memilih file dari perangkat Anda (PDF, DOCX, JPG, PNG · Maks 15MB)"
            : "Or click to browse from your device (PDF, DOCX, JPG, PNG · Max 15MB)"}
        </div>
      </div>

      {/* Documents List */}
      <div className="grid gap-3">
        {documents.length === 0 && (
          <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-10 text-center text-[13px] text-slate-500 dark:text-slate-300">
            {isId ? "Belum ada dokumen yang diunggah." : "No documents uploaded yet."}
          </div>
        )}
        {documents.map((d) => (
          <div
            key={d.id}
            className="group rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 hover:border-primary/40 dark:hover:border-sky-400/40 p-4 flex flex-wrap sm:flex-nowrap items-center gap-4 shadow-xs transition-all"
          >
            <div className="w-11 h-11 bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 rounded-xl grid place-items-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white truncate">{d.name}</div>
              <div className="text-[12px] text-slate-500 dark:text-slate-300 mt-0.5">
                {formatDocumentSize(d.size)} · {t("dashboard.documents.uploadedPrefix")}{" "}
                {d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : ""}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-primary dark:hover:border-sky-400 hover:text-primary dark:hover:text-sky-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("dashboard.documents.download")}</span>
              </a>
              <button
                type="button"
                disabled={deletingId === d.id}
                onClick={() => handleDelete(d.id)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:border-rose-500 hover:text-rose-500 dark:hover:text-rose-400 disabled:opacity-60 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ApplicantShell>
  );
}
