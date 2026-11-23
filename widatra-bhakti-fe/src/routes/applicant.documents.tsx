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
import { Download, Upload, FileText, Trash2, Loader2 } from "lucide-react";
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
  const { t } = useLanguage();
  const documents = useDocuments();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await uploadDocument(file);
      }
      toast.success("Document uploaded.");
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
      toast.success("Document removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove the document.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ApplicantShell title={t("dashboard.documents.title")} subtitle={t("dashboard.documents.subtitle")}>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 h-10 px-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}{" "}
          {t("dashboard.documents.uploadDocument")}
        </button>
      </div>
      <div className="grid gap-3">
        {documents.length === 0 && (
          <div className="card-elevated p-8 text-center text-[13px] text-corporate-gray">
            No documents uploaded yet.
          </div>
        )}
        {documents.map((d) => (
          <div key={d.id} className="card-elevated p-4 flex items-center gap-4">
            <div className="w-11 h-11 bg-brand-tint text-primary rounded grid place-items-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{d.name}</div>
              <div className="text-[12px] text-corporate-gray">
                {formatDocumentSize(d.size)} · {t("dashboard.documents.uploadedPrefix")}{" "}
                {d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : ""}
              </div>
            </div>
            <a
              href={d.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-9 px-3 border border-hairline text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-primary hover:text-primary"
            >
              <Download className="w-4 h-4" /> {t("dashboard.documents.download")}
            </a>
            <button
              disabled={deletingId === d.id}
              onClick={() => handleDelete(d.id)}
              className="inline-flex items-center gap-2 h-9 px-3 border border-hairline text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-destructive hover:text-destructive disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ApplicantShell>
  );
}
