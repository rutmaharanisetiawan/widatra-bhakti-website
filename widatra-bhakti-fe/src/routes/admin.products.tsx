import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, AdminButton, StatusPill } from "@/components/admin-shell";
import { useProducts } from "@/hooks/use-products";
import { addProduct, deleteProduct, updateProduct } from "@/lib/products-store";
import type { Product } from "@/lib/products-data";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";
import {
  AdminProductFormModal,
  type ProductFormValues,
} from "@/components/products/admin-product-form-modal";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Admin" }] }),
  component: AdminProductsPage,
});

const FILTERS = ["All", "Branded", "Generic"] as const;

function AdminProductsPage() {
  const { t } = useLanguage();
  const { products, refresh } = useProducts();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filterLabel = (f: (typeof FILTERS)[number]) =>
    f === "All" ? t("admin.products.filters.all") : f === "Branded" ? t("admin.products.filters.branded") : t("admin.products.filters.generic");

  const filtered = useMemo(() => {
    if (filter === "All") return products;
    return products.filter((p) => p.brand === filter);
  }, [products, filter]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setFormOpen(true);
  }

  async function handleSubmit(values: ProductFormValues) {
    try {
      if (editing) {
        await updateProduct(editing.code, values as Product);
        toast.success(`"${values.name}" ${t("admin.products.toast.updatedSuffix")}`);
      } else {
        const created = await addProduct(values);
        toast.success(`"${created.name}" ${t("admin.products.toast.addedSuffix")}`);
      }
      await refresh();
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the product.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.code);
      toast.success(`"${deleteTarget.name}" ${t("admin.products.toast.removedSuffix")}`);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete the product.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <AdminShell
      title={t("admin.products.title")}
      subtitle={t("admin.products.subtitle")}
      actions={
        <AdminButton onClick={openCreate}>
          <Plus className="w-4 h-4" /> {t("admin.products.newProduct")}
        </AdminButton>
      }
    >
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
            {filterLabel(f)}
            {f !== "All" && (
              <span className="ml-1.5 opacity-70">({products.filter((p) => p.brand === f).length})</span>
            )}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-corporate-gray">
          {filtered.length} {t("admin.common.of")} {products.length} {t("admin.products.countSuffix")}
        </span>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-soft text-[11px] uppercase tracking-[0.18em] text-corporate-gray">
              <th className="text-left px-5 py-3 font-semibold">{t("admin.products.table.code")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.products.table.name")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.products.table.category")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.products.table.package")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.products.table.type")}</th>
              <th className="text-right px-5 py-3 font-semibold">{t("admin.products.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-corporate-gray">
                  {t("admin.products.table.empty")}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.code} className="border-t border-hairline hover:bg-brand-soft/50">
                  <td className="px-5 py-3.5"><span className="font-mono text-[12px]">{p.code}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <MediaImage src={p.img} alt={p.name} className="w-9 h-9 object-contain bg-brand-soft rounded" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray">{p.category}</span></td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray">{p.packaging?.[0] ?? "—"}</span></td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={p.brand === "Generic" ? "Inactive" : "Active"} />
                    <span className="ml-2 text-[11px] text-corporate-gray">{filterLabel(p.brand)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-brand-soft text-corporate-gray hover:text-primary transition-colors"
                        aria-label={`${t("admin.products.editAriaPrefix")} ${p.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-red-50 dark:bg-red-500/15 text-corporate-gray hover:text-destructive transition-colors"
                        aria-label={`${t("admin.products.deleteAriaPrefix")} ${p.name}`}
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

      <AdminProductFormModal
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initialProduct={editing}
        onSubmit={handleSubmit}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={t("admin.products.deleteDialog.title")}
        itemName={deleteTarget?.name}
        itemType="PRODUCT"
        description={
          deleteTarget
            ? `${t("admin.products.deleteDialog.bodyPrefix")} "${deleteTarget.name}" ${t("admin.products.deleteDialog.bodySuffix")}`
            : undefined
        }
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </AdminShell>
  );
}
