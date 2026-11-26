import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, StatusPill } from "@/components/admin-shell";
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
import { ContactDetailModal } from "@/components/contact/contact-detail-modal";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { useLanguage } from "@/hooks/use-language";
import { Search, Eye, MailOpen, Mail as MailIcon, Archive, ArchiveRestore, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contact")({
  head: () => ({ meta: [{ title: "Contact Inbox — Admin" }] }),
  component: AdminContactPage,
});

type ContactFilter = "All" | "PV" | ContactStatus;

const FILTERS: { label: string; value: ContactFilter }[] = [
  { label: "All", value: "All" },
  { label: "ADR / Farmakovigilans", value: "PV" },
  { label: "Unread", value: "Unread" },
  { label: "Read", value: "Read" },
  { label: "Replied", value: "Replied" },
  { label: "Archived", value: "Archived" },
];

function AdminContactPage() {
  const { t } = useLanguage();
  const { inquiries, unreadCount, refresh } = useContactInbox();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ContactFilter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((i) => {
      const status = getContactStatus(i);
      const isPv =
        i.source?.toLowerCase().includes("pharmacovigilance") ||
        i.source?.toLowerCase().includes("adr") ||
        i.id.startsWith("PV-") ||
        i.subject.toLowerCase().includes("[adr]");

      if (filter === "PV" && !isPv) return false;
      if (filter === "All" && status === "Archived") return false;
      if (filter !== "All" && filter !== "PV" && status !== filter) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q) ||
        (i.organization ?? "").toLowerCase().includes(q) ||
        (i.source ?? "").toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
      );
    });
  }, [inquiries, query, filter]);

  const selected = useMemo(
    () => inquiries.find((i) => i.id === selectedId) ?? null,
    [inquiries, selectedId]
  );

  async function openInquiry(inquiry: ContactInquiry) {
    setSelectedId(inquiry.id);
    setModalOpen(true);
    if (!inquiry.read) {
      await toggleContactRead(inquiry.id);
      await refresh();
    }
  }

  async function handleToggleRead(id: string) {
    await toggleContactRead(id);
    await refresh();
  }

  async function handleToggleArchive(id: string) {
    const inquiry = inquiries.find((i) => i.id === id);
    await setContactArchived(id, !inquiry?.archived);
    toast.success(inquiry?.archived ? "Moved back to inbox." : "Inquiry archived.");
    await refresh();
  }

  async function handleDelete(id: string) {
    try {
      await deleteContactInquiry(id);
      if (selectedId === id) {
        setSelectedId(null);
        setModalOpen(false);
      }
      toast.success(t("admin.contact.toast.deleted"));
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete the inquiry.");
    }
  }

  async function handleReply(id: string, message: string) {
    await replyToContactInquiry(id, message);
    toast.success("Reply saved to the inquiry thread.");
    await refresh();
  }

  return (
    <AdminShell
      title="Contact Form Management"
      subtitle="Inquiries from partners, healthcare institutions and the public — synced live from every Contact form on the site."
      actions={
        <span className="inline-flex items-center gap-2 h-10 px-4 rounded bg-brand-tint text-primary text-[11px] font-bold uppercase tracking-[0.18em]">
          <Inbox className="w-3.5 h-3.5" />
          {unreadCount} unread
        </span>
      }
    >
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-hairline bg-white dark:bg-card p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-corporate-gray" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, subject or message…"
            className="h-10 w-full rounded-md border border-hairline bg-brand-soft/40 dark:bg-surface-2 pl-10 pr-3.5 text-sm text-corporate-black dark:text-foreground placeholder:text-corporate-gray transition-colors focus:border-primary focus:bg-white focus:outline-none dark:focus:bg-card"
          />
        </div>
        <div className="hidden h-6 w-px shrink-0 bg-hairline md:block" />
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`h-10 shrink-0 whitespace-nowrap rounded-md border px-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                filter === f.value
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-hairline text-corporate-gray hover:border-primary hover:bg-brand-soft hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-soft text-[11px] uppercase tracking-[0.18em] text-corporate-gray">
              <th className="text-left px-5 py-3 font-semibold">From</th>
              <th className="text-left px-5 py-3 font-semibold">Subject</th>
              <th className="text-left px-5 py-3 font-semibold">Received</th>
              <th className="text-left px-5 py-3 font-semibold">Status</th>
              <th className="text-right px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-corporate-gray text-sm">
                  No inquiries match your search or filter.
                </td>
              </tr>
            )}
            {filtered.map((i) => {
              const status = getContactStatus(i);
              const isPv =
                i.source?.toLowerCase().includes("pharmacovigilance") ||
                i.source?.toLowerCase().includes("adr") ||
                i.id.startsWith("PV-") ||
                i.subject.toLowerCase().includes("[adr]");

              return (
                <tr
                  key={i.id}
                  onClick={() => openInquiry(i)}
                  className={`border-t border-hairline hover:bg-brand-soft/50 cursor-pointer ${
                    !i.read && !i.archived ? "bg-brand-tint/40" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className={i.read ? "font-medium" : "font-bold"}>{i.name}</span>
                    <div className="text-[11px] text-corporate-gray">{i.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-corporate-gray max-w-xs">
                    <div className="flex items-center gap-1.5">
                      {isPv && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300/60 dark:border-rose-800">
                          ADR / PV
                        </span>
                      )}
                      <span className="truncate">{i.subject}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-corporate-gray whitespace-nowrap">
                    {formatReceivedAgo(i.receivedAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <IconAction label="View" onClick={() => openInquiry(i)}>
                        <Eye className="w-4 h-4" />
                      </IconAction>
                      <IconAction
                        label={i.read ? "Mark unread" : "Mark read"}
                        onClick={() => handleToggleRead(i.id)}
                      >
                        {i.read ? <MailIcon className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                      </IconAction>
                      <IconAction
                        label={i.archived ? "Unarchive" : "Archive"}
                        onClick={() => handleToggleArchive(i.id)}
                      >
                        {i.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                      </IconAction>
                      <IconAction label={t("admin.common.delete")} danger onClick={() => setDeleteTarget(i)}>
                        <Trash2 className="w-4 h-4" />
                      </IconAction>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ContactDetailModal
        inquiry={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onToggleRead={handleToggleRead}
        onToggleArchive={handleToggleArchive}
        onDelete={handleDelete}
        onReply={handleReply}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("admin.contact.deleteDialog.title")}
        itemName={deleteTarget ? `${deleteTarget.name} — ${deleteTarget.subject}` : undefined}
        itemType="INQUIRY"
        description={
          deleteTarget
            ? `${t("admin.contact.deleteDialog.bodyPrefix")} "${deleteTarget.name}" ${t("admin.contact.deleteDialog.bodySuffix")}`
            : undefined
        }
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setIsDeleting(true);
          try {
            await deleteContactInquiry(deleteTarget.id);
            if (selectedId === deleteTarget.id) {
              setSelectedId(null);
              setModalOpen(false);
            }
            toast.success(t("admin.contact.toast.deleted"));
            await refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Couldn't delete the inquiry.");
          } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
          }
        }}
      />
    </AdminShell>
  );
}

function IconAction({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`w-8 h-8 grid place-items-center rounded hover:bg-brand-soft transition-colors ${
        danger ? "text-destructive hover:bg-destructive/10" : "text-corporate-gray hover:text-primary"
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
