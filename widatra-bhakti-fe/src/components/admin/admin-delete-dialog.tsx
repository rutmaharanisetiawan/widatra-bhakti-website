import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export interface AdminDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  itemName?: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
}

/**
 * Standardized Admin Delete Confirmation Dialog.
 * Enforces unified visual design, explicit verification before deletion,
 * clear item context badge, danger accenting, and double-submit protection.
 */
export function AdminDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  itemType,
  onConfirm,
  isDeleting = false,
  cancelLabel,
  confirmLabel,
}: AdminDeleteDialogProps) {
  const { t, language } = useLanguage();
  const isId = language === "id";

  const resolvedTitle =
    title || (isId ? "Konfirmasi Hapus Data" : "Confirm Data Deletion");
  const resolvedCancelLabel =
    cancelLabel || t("admin.common.cancel") || (isId ? "Batal" : "Cancel");
  const resolvedConfirmLabel =
    confirmLabel || t("admin.common.delete") || (isId ? "Hapus" : "Delete");
  const resolvedDescription =
    description ||
    (isId
      ? "Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen dari sistem dan katalog publik."
      : "This action cannot be undone. The data will be permanently removed from the system and public catalog.");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[440px] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-card">
        <AlertDialogHeader className="text-left space-y-0">
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-inner flex-shrink-0 mt-0.5">
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              {itemType && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-400 mb-0.5">
                  <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                  {itemType}
                </span>
              )}
              <AlertDialogTitle className="text-base sm:text-lg font-bold text-foreground font-display leading-snug">
                {resolvedTitle}
              </AlertDialogTitle>
            </div>
          </div>

          {itemName && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-xs text-foreground font-medium my-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
              <span className="truncate font-semibold">{itemName}</span>
            </div>
          )}

          <AlertDialogDescription className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed pt-1">
            {resolvedDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-5 flex-row justify-end gap-2.5 sm:gap-3">
          <AlertDialogCancel
            disabled={isDeleting}
            className="mt-0 rounded-xl px-4 py-2 text-xs font-semibold border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all"
          >
            {resolvedCancelLabel}
          </AlertDialogCancel>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              void onConfirm();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] shadow-md shadow-rose-600/25 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{resolvedConfirmLabel}...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{resolvedConfirmLabel}</span>
              </>
            )}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
