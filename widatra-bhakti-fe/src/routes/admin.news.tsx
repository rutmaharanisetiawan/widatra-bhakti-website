import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, AdminButton, StatusPill } from "@/components/admin-shell";
import { useAllArticles } from "@/hooks/use-news";
import { addArticle, deleteArticle, updateArticle, setArticleStatus } from "@/lib/news-store";
import type { Article } from "@/lib/news-data";
import { NEWS_CATEGORIES } from "@/lib/news-data";
import { useLanguage } from "@/hooks/use-language";
import { MediaImage } from "@/components/media/media-image";
import {
  AdminNewsFormModal,
  type ArticleFormValues,
} from "@/components/news/admin-news-form-modal";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/news")({
  head: () => ({ meta: [{ title: "News & Events — Admin" }] }),
  component: AdminNewsPage,
});

const FILTERS = ["All", ...NEWS_CATEGORIES] as const;
const CATEGORY_KEY_MAP: Record<string, string> = {
  All: "all",
  Corporate: "corporate",
  Science: "science",
  Sustainability: "sustainability",
  Events: "events",
};

function AdminNewsPage() {
  const { t } = useLanguage();
  const { articles, refresh } = useAllArticles();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filterLabel = (f: (typeof FILTERS)[number]) => t(`news.categories.${CATEGORY_KEY_MAP[f] ?? "all"}`);

  const filtered = useMemo(() => {
    if (filter === "All") return articles;
    return articles.filter((a) => a.cat === filter);
  }, [articles, filter]);

  const publishedCount = articles.filter((a) => (a.status ?? "Published") === "Published").length;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(a: Article) {
    setEditing(a);
    setFormOpen(true);
  }

  async function handleSubmit(values: ArticleFormValues) {
    try {
      if (editing) {
        await updateArticle(editing.slug, values as Article);
        toast.success(`"${values.title}" ${t("admin.news.toast.updatedSuffix")}`);
      } else {
        const created = await addArticle(values);
        toast.success(`"${created.title}" ${t("admin.news.toast.createdSuffix")}`);
      }
      await refresh();
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the article.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteArticle(deleteTarget.slug);
      toast.success(`"${deleteTarget.title}" ${t("admin.news.toast.removedSuffix")}`);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete the article.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function toggleStatus(a: Article) {
    const next = (a.status ?? "Published") === "Published" ? "Draft" : "Published";
    await setArticleStatus(a.slug, next);
    toast.success(`"${a.title}" ${t("admin.news.toast.isNowPrefix")} ${t(`admin.statusLabels.${next}`)}`);
    await refresh();
  }

  return (
    <AdminShell
      title={t("admin.news.title")}
      subtitle={t("admin.news.subtitle")}
      actions={
        <AdminButton onClick={openCreate}>
          <Plus className="w-4 h-4" /> {t("admin.news.newArticle")}
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
              <span className="ml-1.5 opacity-70">({articles.filter((a) => a.cat === f).length})</span>
            )}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-corporate-gray">
          {filtered.length} {t("admin.common.of")} {articles.length} {t("admin.news.articlesSuffix")} · {publishedCount} {t("admin.news.publishedSuffix")}
        </span>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-soft text-[11px] uppercase tracking-[0.18em] text-corporate-gray">
              <th className="text-left px-5 py-3 font-semibold">{t("admin.news.table.title")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.news.table.category")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.news.table.author")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.news.table.published")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("admin.news.table.status")}</th>
              <th className="text-right px-5 py-3 font-semibold">{t("admin.news.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-corporate-gray">
                  {t("admin.news.table.empty")}
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.slug} className="border-t border-hairline hover:bg-brand-soft/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <MediaImage src={a.img} alt={a.title} className="w-9 h-9 object-cover rounded bg-brand-soft" />
                      <span className="font-medium">{a.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray">{a.cat}</span></td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray">{a.author ?? "—"}</span></td>
                  <td className="px-5 py-3.5"><span className="text-corporate-gray font-mono text-[12px]">{a.date}</span></td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={(a.status ?? "Published")} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(a)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-brand-soft text-corporate-gray hover:text-primary transition-colors"
                        aria-label={`${t("admin.news.toggleAriaPrefix")} ${a.title}`}
                        title={(a.status ?? "Published") === "Published" ? t("admin.news.setToDraft") : t("admin.news.publish")}
                      >
                        {(a.status ?? "Published") === "Published" ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(a)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-brand-soft text-corporate-gray hover:text-primary transition-colors"
                        aria-label={`${t("admin.news.editAriaPrefix")} ${a.title}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(a)}
                        className="w-8 h-8 grid place-items-center rounded hover:bg-red-50 dark:bg-red-500/15 text-corporate-gray hover:text-destructive transition-colors"
                        aria-label={`${t("admin.news.deleteAriaPrefix")} ${a.title}`}
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

      <AdminNewsFormModal
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initialArticle={editing}
        onSubmit={handleSubmit}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={t("admin.news.deleteDialog.title")}
        itemName={deleteTarget?.title}
        itemType="ARTICLE"
        description={
          deleteTarget
            ? `${t("admin.news.deleteDialog.bodyPrefix")} "${deleteTarget.title}" ${t("admin.news.deleteDialog.bodySuffix")}`
            : undefined
        }
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </AdminShell>
  );
}
