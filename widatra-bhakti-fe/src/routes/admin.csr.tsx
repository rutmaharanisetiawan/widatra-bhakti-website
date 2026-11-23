import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, AdminButton, StatusPill } from "@/components/admin-shell";
import { useAllCsrPrograms } from "@/hooks/use-csr";
import { addCsrProgram, deleteCsrProgram, updateCsrProgram, setCsrProgramStatus } from "@/lib/csr-store";
import type { CsrProgram } from "@/lib/csr-data";
import { CSR_PILLARS } from "@/lib/csr-data";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";
import {
  AdminCsrFormModal,
  type CsrFormValues,
} from "@/components/csr/admin-csr-form-modal";
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
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/csr")({
  head: () => ({ meta: [{ title: "CSR — Admin" }] }),
  component: AdminCsrPage,
});

const FILTERS = ["All", ...CSR_PILLARS] as const;

function AdminCsrPage() {
  const { t } = useLanguage();
  const { programs, refresh } = useAllCsrPrograms();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CsrProgram | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CsrProgram | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return programs;
    return programs.filter((p) => p.pillar === filter);
  }, [programs, filter]);

  const publishedCount = programs.filter((p) => (p.status ?? "Published") === "Published").length;

  const pillarCounts = useMemo(
    () =>
      CSR_PILLARS.map((pillar) => ({
        pillar,
        count: programs.filter((p) => p.pillar === pillar && (p.status ?? "Published") === "Published").length,
      })),
    [programs]
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(p: CsrProgram) {
    setEditing(p);
    setFormOpen(true);
  }

  async function handleSubmit(values: CsrFormValues) {
    try {
      if (editing) {
        await updateCsrProgram(editing.slug, values as CsrProgram);
        toast.success(`"${values.title}" ${t("admin.csr.toast.updatedSuffix")}`);
      } else {
        const created = await addCsrProgram(values);
        toast.success(`"${created.title}" ${t("admin.csr.toast.createdSuffix")}`);
      }
      await refresh();
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the program.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCsrProgram(deleteTarget.slug);
      toast.success(`"${deleteTarget.title}" ${t("admin.csr.toast.removedSuffix")}`);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete the program.");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function toggleStatus(p: CsrProgram) {
    const next = (p.status ?? "Published") === "Published" ? "Draft" : "Published";
    await setCsrProgramStatus(p.slug, next);
    toast.success(`"${p.title}" ${t("admin.csr.toast.isNowPrefix")} ${t(`admin.statusLabels.${next}`)}`);
    await refresh();
  }

  return (
    <AdminShell
      title={t("admin.csr.title")}
      subtitle={t("admin.csr.subtitle")}
      actions={
        <AdminButton onClick={openCreate}>
          <Plus className="w-4 h-4" /> {t("admin.csr.newProgram")}
        </AdminButton>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {pillarCounts.map((x) => (
          <div key={x.pillar} className="card-elevated p-5">
            <div className="eyebrow text-primary">{x.pillar}</div>
            <div className="mt-2 text-3xl font-semibold font-display">{x.count}</div>
            <div className="text-[12px] text-corporate-gray">{t("admin.csr.publishedProgramsSuffix")}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-9 px-4 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] border transition-colors ${
              filter === f
                ? "bg-primary text-white border-primary"
                : "border-hairline hover:border-primary hover:text-primary"
            }`}
          >
            {f}
            {f !== "All" && (
              <span className="ml-1.5 opacity-70">({programs.filter((p) => p.pillar === f).length})</span>
            )}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-corporate-gray">
          {filtered.length} {t("admin.common.of")} {programs.length} {t("admin.csr.programsSuffix")} · {publishedCount} {t("admin.csr.publishedSuffix")}
        </span>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-soft text-[11px] uppercase tracking-[0.18em] text-corporate-gray">
              <th className="text-left px-5 py-3 font-semibold">{t("admin.csr.table.program")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.csr.table.pillar")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.csr.table.location")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.csr.table.date")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.csr.table.status")}</th>
              <th className="text-right px-5 py-3 font-semibold">{t("admin.csr.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-corporate-gray">
                  {t("admin.csr.table.empty")}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.slug} className="border-t border-hairline hover:bg-brand-soft/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <MediaImage src={p.img} alt={p.title} className="w-9 h-9 object-cover rounded bg-brand-soft" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray">{p.pillar}</span></td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray">{p.location}</span></td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray font-mono text-[12px]">{p.date}</span></td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={(p.status ?? "Published")} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(p)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-brand-soft text-corporate-gray hover:text-primary transition-colors"
                        aria-label={`${t("admin.csr.toggleAriaPrefix")} ${p.title}`}
                        title={(p.status ?? "Published") === "Published" ? t("admin.csr.setToDraft") : t("admin.csr.publish")}
                      >
                        {(p.status ?? "Published") === "Published" ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-brand-soft text-corporate-gray hover:text-primary transition-colors"
                        aria-label={`${t("admin.csr.editAriaPrefix")} ${p.title}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-red-50 dark:bg-red-500/15 text-corporate-gray hover:text-destructive transition-colors"
                        aria-label={`${t("admin.csr.deleteAriaPrefix")} ${p.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminCsrFormModal
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initialProgram={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.csr.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.csr.deleteDialog.bodyPrefix")} "{deleteTarget?.title}" {t("admin.csr.deleteDialog.bodySuffix")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.csr.deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              {t("admin.csr.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
