import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, StatusPill, StatCard } from "@/components/admin-shell";
import { useContactInbox } from "@/hooks/use-contact-inbox";
import {
  deleteContactInquiry,
  replyToContactInquiry,
  setContactArchived,
  toggleContactRead,
} from "@/lib/contact-store";
import {
  formatReceivedAgo,
  getContactStatus,
  type ContactInquiry,
  type ContactStatus,
} from "@/lib/contact-data";
import { useLanguage } from "@/hooks/use-language";
import {
  Search,
  Eye,
  MailOpen,
  Mail as MailIcon,
  Archive,
  ArchiveRestore,
  HeartPulse,
  ShieldAlert,
  Download,
  ExternalLink,
  Printer,
  Calendar,
  User,
  Building,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Send,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pharmacovigilance")({
  head: () => ({ meta: [{ title: "Pharmacovigilance (ADR) — Admin" }] }),
  component: AdminPharmacovigilancePage,
});

type PvFilter = "All" | ContactStatus;

const STATUS_FILTERS: { label: string; value: PvFilter }[] = [
  { label: "Semua", value: "All" },
  { label: "Belum Ditinjau", value: "Unread" },
  { label: "Sudah Ditinjau", value: "Read" },
  { label: "Sudah Dibalas", value: "Replied" },
  { label: "Diarsipkan", value: "Archived" },
];

export default function AdminPharmacovigilancePage() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const { inquiries, refresh } = useContactInbox();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PvFilter>("All");
  const [productFilter, setProductFilter] = useState<string>("All");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter only Pharmacovigilance / ADR reports
  const pvInquiries = useMemo(() => {
    return inquiries.filter((i) => {
      const isPv =
        i.source?.toLowerCase().includes("pharmacovigilance") ||
        i.source?.toLowerCase().includes("adr") ||
        i.id.startsWith("PV-") ||
        i.subject.toLowerCase().includes("[adr]");
      return isPv;
    });
  }, [inquiries]);

  // Unique products present in the reports
  const availableProducts = useMemo(() => {
    const set = new Set<string>();
    pvInquiries.forEach((i) => {
      const match = i.subject.match(/\[ADR\]\s*([^-]+)/i);
      if (match && match[1]) {
        set.add(match[1].trim());
      }
    });
    return Array.from(set);
  }, [pvInquiries]);

  // Filtered inquiries based on search and filters
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pvInquiries.filter((i) => {
      const status = getContactStatus(i);
      if (statusFilter === "All" && status === "Archived") return false;
      if (statusFilter !== "All" && status !== statusFilter) return false;

      if (productFilter !== "All") {
        if (!i.subject.toLowerCase().includes(productFilter.toLowerCase())) {
          return false;
        }
      }

      if (!q) return true;
      return (
        i.id.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q) ||
        (i.organization ?? "").toLowerCase().includes(q)
      );
    });
  }, [pvInquiries, query, statusFilter, productFilter]);

  // Metrics
  const stats = useMemo(() => {
    const total = pvInquiries.length;
    const unread = pvInquiries.filter((i) => !i.read && !i.archived).length;
    const replied = pvInquiries.filter((i) => i.replies && i.replies.length > 0).length;
    const archived = pvInquiries.filter((i) => i.archived).length;
    return { total, unread, replied, archived };
  }, [pvInquiries]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    toast.success(isId ? "Data Farmakovigilans diperbarui." : "Pharmacovigilance data refreshed.");
    setIsRefreshing(false);
  };

  const handleOpenDetail = async (i: ContactInquiry) => {
    setSelectedInquiry(i);
    if (!i.read) {
      await toggleContactRead(i.id);
      await refresh();
    }
  };

  const handleToggleRead = async (id: string) => {
    await toggleContactRead(id);
    await refresh();
  };

  const handleToggleArchive = async (id: string) => {
    const target = pvInquiries.find((i) => i.id === id);
    await setContactArchived(id, !target?.archived);
    toast.success(
      target?.archived
        ? (isId ? "Laporan dikembalikan ke inbox." : "Report restored to inbox.")
        : (isId ? "Laporan diarsipkan." : "Report archived.")
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
    await refresh();
  };

  const handleExportCsv = () => {
    if (pvInquiries.length === 0) {
      toast.error(isId ? "Belum ada data laporan untuk diekspor." : "No report data to export.");
      return;
    }

    const headers = [
      "ID Laporan",
      "Perihal",
      "Nama Pelapor",
      "Email",
      "No Telepon",
      "Instansi / Faskes",
      "Waktu Terima",
      "Status",
    ];

    const rows = pvInquiries.map((i) => [
      `"${i.id}"`,
      `"${i.subject.replace(/"/g, '""')}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.phone || "-"}"`,
      `"${(i.organization || "-").replace(/"/g, '""')}"`,
      `"${i.receivedAt}"`,
      `"${getContactStatus(i)}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_farmakovigilans_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isId ? "Data CSV berhasil diunduh." : "CSV exported successfully.");
  };

  return (
    <AdminShell
      title={isId ? "Farmakovigilans & Pemantauan KTD (ADR)" : "Pharmacovigilance & ADR Monitoring"}
      subtitle={
        isId
          ? "Wadah sentral pengawasan keamanan produk infus & pelaporan Kejadian Tidak Diinginkan (KTD) PT Widatra Bhakti sesuai regulasi BPOM No. 4/2026."
          : "Central monitoring portal for IV fluid safety surveillance & Adverse Drug Reaction (ADR) cases conforming to BPOM No. 4/2026 standards."
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 border border-hairline rounded bg-white dark:bg-card text-xs font-semibold hover:border-primary transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 border border-hairline rounded bg-white dark:bg-card text-xs font-semibold hover:border-primary transition"
          >
            <Download className="w-3.5 h-3.5 text-corporate-gray" />
            <span>{isId ? "Ekspor CSV" : "Export CSV"}</span>
          </button>

          <Link
            to="/contact"
            search={{ tab: "reporting" }}
            target="_blank"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            <HeartPulse className="w-4 h-4" />
            <span>{isId ? "Buka Form Publik" : "Public Form"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metrik Farmakovigilans Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={isId ? "Total Laporan KTD" : "Total ADR Reports"}
            value={String(stats.total)}
            delta={isId ? "Semua kasus tercatat" : "All registered cases"}
          />
          <div className="card-elevated p-5 h-full flex flex-col justify-between min-h-[110px] border-l-4 border-l-rose-500">
            <div className="text-[11px] uppercase tracking-[0.2em] text-corporate-gray font-semibold flex items-center justify-between">
              <span>{isId ? "Perlu Evaluasi Klinis" : "Needs Review"}</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="mt-2 text-3xl font-semibold font-display text-rose-600 dark:text-rose-400">
                {stats.unread}
              </div>
              <div className="mt-1 text-[12px] text-rose-600 dark:text-rose-400 font-medium">
                {isId ? "Laporan baru / belum ditinjau" : "Unread / New reports"}
              </div>
            </div>
          </div>
          <StatCard
            label={isId ? "Sudah Dibalas / Ditindaklanjuti" : "Followed Up / Replied"}
            value={String(stats.replied)}
            delta={isId ? "Respons resmi terkirim" : "Official response sent"}
          />
          <div className="card-elevated p-5 h-full flex flex-col justify-between min-h-[110px] border-l-4 border-l-emerald-500">
            <div className="text-[11px] uppercase tracking-[0.2em] text-corporate-gray font-semibold">
              {isId ? "Regulasi & Sistem PV" : "PV Regulation Status"}
            </div>
            <div>
              <div className="mt-2 text-lg font-bold font-display text-emerald-600 dark:text-emerald-400">
                BPOM No. 4/2026
              </div>
              <div className="mt-1 text-[12px] text-muted-foreground">
                {isId ? "Hotline & Email Siaga 24/7" : "Hotline & Email Active 24/7"}
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-xl border border-hairline bg-white dark:bg-card p-3.5 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-corporate-gray" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isId
                  ? "Cari kode referensi (PV-...), pasien, pelapor, produk, atau faskes…"
                  : "Search reference code, patient, reporter, product, or hospital…"
              }
              className="h-10 w-full rounded-md border border-hairline bg-brand-soft/40 dark:bg-surface-2 pl-10 pr-3.5 text-xs sm:text-sm text-corporate-black dark:text-foreground placeholder:text-corporate-gray focus:border-primary focus:bg-white dark:focus:bg-card focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Product Filter */}
            {availableProducts.length > 0 && (
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="h-10 px-3 text-xs rounded-md border border-hairline bg-white dark:bg-card text-corporate-black dark:text-foreground focus:outline-none focus:border-primary"
              >
                <option value="All">{isId ? "Semua Produk" : "All Products"}</option>
                {availableProducts.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}

            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`h-10 shrink-0 whitespace-nowrap rounded-md border px-3 text-[11px] font-semibold uppercase tracking-wider transition ${
                    statusFilter === f.value
                      ? "border-rose-600 bg-rose-600 text-white shadow-sm"
                      : "border-hairline text-corporate-gray hover:border-primary hover:text-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabel Kasus ADR Farmakovigilans */}
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-soft text-[11px] uppercase tracking-[0.16em] text-corporate-gray border-b border-hairline">
                  <th className="text-left px-5 py-3 font-semibold">{isId ? "Kode & Waktu Lapor" : "Case ID & Time"}</th>
                  <th className="text-left px-5 py-3 font-semibold">{isId ? "Produk Terlapor" : "Reported Product"}</th>
                  <th className="text-left px-5 py-3 font-semibold">{isId ? "Data Pasien" : "Patient Info"}</th>
                  <th className="text-left px-5 py-3 font-semibold">{isId ? "Pelapor & Faskes" : "Reporter & Facility"}</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">{isId ? "Aksi" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-corporate-gray text-sm">
                      <HeartPulse className="w-8 h-8 text-rose-300 dark:text-rose-900/60 mx-auto mb-2" />
                      <p className="font-semibold text-corporate-black dark:text-white">
                        {isId ? "Tidak ada berkas laporan yang sesuai." : "No ADR reports match your query."}
                      </p>
                      <p className="text-xs text-corporate-gray mt-1">
                        {isId
                          ? "Laporan efek samping obat baru yang dikirim via website akan otomatis muncul di sini."
                          : "New drug adverse reaction reports submitted via website will automatically appear here."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((i) => {
                    const status = getContactStatus(i);
                    const isUnread = !i.read && !i.archived;

                    return (
                      <tr
                        key={i.id}
                        onClick={() => handleOpenDetail(i)}
                        className={`border-t border-hairline hover:bg-brand-soft/50 cursor-pointer transition ${
                          isUnread ? "bg-rose-50/40 dark:bg-rose-950/20" : ""
                        }`}
                      >
                        {/* ID & Timestamp */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                              {i.id}
                            </span>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" title="Belum dibaca" />
                            )}
                          </div>
                          <div className="text-[11px] text-corporate-gray mt-1">
                            {formatReceivedAgo(i.receivedAt)}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-xs sm:text-sm text-corporate-black dark:text-foreground">
                            {i.subject.replace(/\[ADR\]\s*/i, "").split("-")[0]?.trim() || i.subject}
                          </div>
                          <span className="inline-block text-[10px] text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">
                            PT Widatra Bhakti
                          </span>
                        </td>

                        {/* Patient */}
                        <td className="px-5 py-4">
                          <div className="text-xs sm:text-sm font-medium text-corporate-black dark:text-foreground">
                            {i.subject.includes("Pasien:")
                              ? i.subject.split("Pasien:")[1]?.split("(")[0]?.trim()
                              : "-"}
                          </div>
                          <div className="text-[11px] text-corporate-gray">
                            {isId ? "Status Klinis Tercatat" : "Clinical Record"}
                          </div>
                        </td>

                        {/* Reporter & Institution */}
                        <td className="px-5 py-4">
                          <div className="font-medium text-xs sm:text-sm text-corporate-black dark:text-foreground">
                            {i.name}
                          </div>
                          <div className="text-[11px] text-corporate-gray truncate max-w-xs">
                            {i.organization || i.phone || "-"}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusPill status={status} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(i)}
                              title={isId ? "Buka Berkas Laporan" : "View Details"}
                              className="w-8 h-8 rounded hover:bg-brand-soft dark:hover:bg-surface-2 flex items-center justify-center text-corporate-gray hover:text-primary transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleRead(i.id)}
                              title={i.read ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                              className="w-8 h-8 rounded hover:bg-brand-soft dark:hover:bg-surface-2 flex items-center justify-center text-corporate-gray hover:text-primary transition"
                            >
                              {i.read ? <MailIcon className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleArchive(i.id)}
                              title={i.archived ? "Batal Arsipkan" : "Arsipkan Laporan"}
                              className="w-8 h-8 rounded hover:bg-brand-soft dark:hover:bg-surface-2 flex items-center justify-center text-corporate-gray hover:text-primary transition"
                            >
                              {i.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detail Berkas Klinis Farmakovigilans */}
        {selectedInquiry && (
          <PvDetailModal
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            onToggleRead={handleToggleRead}
            onToggleArchive={handleToggleArchive}
            onReplySuccess={refresh}
          />
        )}
      </div>
    </AdminShell>
  );
}

function PvDetailModal({
  inquiry,
  onClose,
  onToggleRead,
  onToggleArchive,
  onReplySuccess,
}: {
  inquiry: ContactInquiry;
  onClose: () => void;
  onToggleRead: (id: string) => Promise<void>;
  onToggleArchive: (id: string) => Promise<void>;
  onReplySuccess: () => Promise<void>;
}) {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const status = getContactStatus(inquiry);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setIsSubmittingReply(true);
    try {
      await replyToContactInquiry(inquiry.id, replyMessage.trim());
      toast.success(
        isId
          ? "Tanggapan resmi unit Farmakovigilans tersimpan."
          : "Official PV response saved to report thread."
      );
      setReplyMessage("");
      await onReplySuccess();
      onClose();
    } catch {
      toast.error(isId ? "Gagal menyimpan tanggapan." : "Failed to save response.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pv-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-card border border-hairline rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                Pharmacovigilance Dossier
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/20">
                {inquiry.id}
              </span>
            </div>
            <h2 id="pv-modal-title" className="text-xl sm:text-2xl font-bold">{inquiry.subject}</h2>
            <p className="text-xs text-white/80 mt-1">
              {isId ? "Waktu Lapor:" : "Received:"} {inquiry.receivedAt || "-"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* BPOM Compliance Banner */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 p-4 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Regulasi BPOM No. 4/2026:</strong> Persetujuan pemrosesan data medis rahasia & pelaporan KTD terverifikasi sah.
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600/30 bg-white dark:bg-card text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 transition shrink-0 ml-3"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isId ? "Cetak Dokumen" : "Print"}</span>
            </button>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-hairline p-4 space-y-2 bg-slate-50/50 dark:bg-surface-2/30">
              <span className="font-bold uppercase tracking-wider text-corporate-gray text-[10px]">
                {isId ? "Identitas Pelapor" : "Reporter Details"}
              </span>
              <div className="font-semibold text-sm text-corporate-black dark:text-white">
                {inquiry.name}
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{inquiry.phone || "-"}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <MailIcon className="w-3.5 h-3.5" />
                <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                  {inquiry.email}
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-hairline p-4 space-y-2 bg-slate-50/50 dark:bg-surface-2/30">
              <span className="font-bold uppercase tracking-wider text-corporate-gray text-[10px]">
                {isId ? "Fasilitas Kesehatan / Instansi" : "Healthcare Institution"}
              </span>
              <div className="font-semibold text-sm text-corporate-black dark:text-white">
                {inquiry.organization || "-"}
              </div>
              <div className="text-muted-foreground text-[11px] leading-relaxed">
                Status Evaluasi: <StatusPill status={status} />
              </div>
            </div>
          </div>

          {/* Full Report Documentation */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <FileText className="w-4 h-4" />
              <span>{isId ? "Isi Berkas Klinis Pelaporan" : "Clinical ADR Case Transcript"}</span>
            </div>
            <div className="rounded-xl border border-hairline bg-slate-50 dark:bg-surface-2 p-4 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed text-corporate-black dark:text-foreground">
              {inquiry.message}
            </div>
          </div>

          {/* Thread / History Balasan Tim PV */}
          {inquiry.replies && inquiry.replies.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-hairline">
              <div className="text-xs font-bold uppercase tracking-wider text-corporate-gray">
                {isId ? "Riwayat Tindak Lanjut Unit Farmakovigilans" : "PV Team Follow-Up Thread"}
              </div>
              <div className="space-y-2">
                {inquiry.replies.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="p-3.5 rounded-xl border border-hairline bg-brand-soft/40 dark:bg-surface-2/60 text-xs text-corporate-black dark:text-white space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-corporate-gray">
                      <span className="font-bold text-primary">Unit Farmakovigilans Widatra</span>
                      <span>{r.sentAt || "-"}</span>
                    </div>
                    <p className="leading-relaxed">{r.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Balas / Tindak Lanjut Baru */}
          <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-hairline">
            <label className="block text-xs font-bold uppercase tracking-wider text-corporate-black dark:text-white">
              {isId ? "Tambah Catatan Evaluasi / Balas Pelapor" : "Add Follow-Up Note / Reply"}
            </label>
            <textarea
              rows={3}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={
                isId
                  ? "Tuliskan hasil evaluasi klinis tim Farmakovigilans atau tanggapan resmi..."
                  : "Write clinical evaluation result or official PV response..."
              }
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-hairline bg-white dark:bg-card focus:outline-none focus:border-primary"
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={isSubmittingReply || !replyMessage.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-deep transition disabled:opacity-50"
              >
                {isSubmittingReply ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isId ? "Menyimpan..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{isId ? "Simpan Tindak Lanjut" : "Save Follow-Up"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-surface-2 border-t border-hairline flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleArchive(inquiry.id)}
            className="inline-flex items-center gap-1.5 text-xs text-corporate-gray hover:text-rose-600 transition"
          >
            {inquiry.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            <span>{inquiry.archived ? (isId ? "Batal Arsipkan" : "Restore") : (isId ? "Arsipkan Laporan" : "Archive")}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-hairline text-xs font-semibold hover:bg-white dark:hover:bg-card transition"
          >
            {isId ? "Tutup Berkas" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
