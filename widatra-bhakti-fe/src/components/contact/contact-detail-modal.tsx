import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Mail, Phone, Building2, Clock, Archive, ArchiveRestore, MailOpen, Mail as MailIcon, Trash2, Send } from "lucide-react";
import { StatusPill } from "@/components/admin-shell";
import {
  getContactStatus,
  formatReceivedAgo,
  type ContactInquiry,
} from "@/lib/contact-data";
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

export function ContactDetailModal({
  inquiry,
  open,
  onOpenChange,
  onToggleRead,
  onToggleArchive,
  onDelete,
  onReply,
}: {
  inquiry: ContactInquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleRead: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (id: string, message: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setReplyText("");
      setSending(false);
    }
  }, [open, inquiry?.id]);

  if (!inquiry) return null;
  const status = getContactStatus(inquiry);

  async function handleSendReply() {
    if (!inquiry || !replyText.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 400));
    onReply(inquiry.id, replyText.trim());
    setReplyText("");
    setSending(false);
  }

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-corporate-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />
          <DialogPrimitive.Content
            className="fixed z-[101] bg-white dark:bg-card shadow-2xl overflow-hidden flex flex-col
              inset-x-0 bottom-0 top-6 rounded-t-2xl
              sm:inset-x-4 sm:bottom-4 sm:top-10 sm:rounded-2xl
              lg:left-1/2 lg:top-1/2 lg:bottom-auto lg:right-auto lg:-translate-x-1/2 lg:-translate-y-1/2
              lg:w-full lg:max-w-2xl lg:h-auto lg:max-h-[88vh]
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
              data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4
              duration-300 ease-out focus:outline-none"
          >
            <div className="flex items-center justify-between px-6 sm:px-8 h-16 border-b border-hairline shrink-0">
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-lg font-semibold font-display truncate">
                  {inquiry.subject}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-xs text-corporate-gray">
                  From {inquiry.name} · {inquiry.source}
                </DialogPrimitive.Description>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-9 h-9 shrink-0 rounded-full grid place-items-center hover:bg-brand-soft text-corporate-black dark:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={status} />
                <span className="inline-flex items-center gap-1.5 text-[12px] text-corporate-gray">
                  <Clock className="w-3.5 h-3.5" /> {formatReceivedAgo(inquiry.receivedAt)}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-brand-soft rounded">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-corporate-gray">Email</div>
                    <a href={`mailto:${inquiry.email}`} className="text-sm text-primary break-all">{inquiry.email}</a>
                  </div>
                </div>
                {inquiry.phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-corporate-gray">Phone</div>
                      <div className="text-sm font-mono">{inquiry.phone}</div>
                    </div>
                  </div>
                )}
                {inquiry.organization && (
                  <div className="flex items-start gap-2.5 sm:col-span-2">
                    <Building2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-corporate-gray">Organization</div>
                      <div className="text-sm">{inquiry.organization}</div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-corporate-gray mb-2">Message</div>
                <p className="text-sm leading-relaxed whitespace-pre-line text-corporate-black dark:text-foreground">
                  {inquiry.message}
                </p>
              </div>

              {inquiry.replies.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-corporate-gray mb-2">
                    Replies ({inquiry.replies.length})
                  </div>
                  <div className="space-y-3">
                    {inquiry.replies.map((r) => (
                      <div key={r.id} className="p-4 bg-brand-tint rounded border border-primary/10">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{r.message}</p>
                        <div className="mt-2 text-[11px] text-corporate-gray">{formatReceivedAgo(r.sentAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-corporate-gray mb-2">Send a reply</div>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply — this is a mockup and won't send a real email…"
                  className="admin-input resize-none"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    disabled={!replyText.trim() || sending}
                    onClick={handleSendReply}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sending ? "Sending…" : "Send reply"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-6 sm:px-8 h-16 border-t border-hairline shrink-0 bg-brand-soft/40">
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleRead(inquiry.id)}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors"
                >
                  {inquiry.read ? <MailIcon className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                  {inquiry.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleArchive(inquiry.id)}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded text-[11px] font-semibold uppercase tracking-[0.18em] border border-hairline hover:border-primary hover:text-primary transition-colors"
                >
                  {inquiry.archived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                  {inquiry.archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the message from "{inquiry.name}" from the Contact Inbox. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDelete(false);
                onOpenChange(false);
                onDelete(inquiry.id);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
