import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, AdminButton, DataTable, StatusPill } from "@/components/admin-shell";
import { AdminApplicantModal } from "@/components/career/admin-applicant-modal";
import { AdminJobFormModal, type JobFormValues } from "@/components/career/admin-job-form-modal";
import { useAtsApplications } from "@/hooks/use-ats-applications";
import { useAllJobs } from "@/hooks/use-jobs";
import { useLanguage } from "@/hooks/use-language";
import { APPLICATION_STATUSES, type StoredApplication } from "@/lib/ats-store";
import { addJob, deleteJob, updateJob, setJobStatus, setJobFeatured } from "@/lib/jobs-store";
import { formatJobDate, type Job } from "@/lib/jobs-data";
import { MediaImage } from "@/components/media/media-image";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/careers")({
  head: () => ({ meta: [{ title: "Careers & ATS — Admin" }] }),
  component: CareersAdmin,
});

const TABS = ["Job posts", "Applicants", "Pipeline"] as const;
type Tab = (typeof TABS)[number];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

function CareersAdmin() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("Applicants");
  const { applications, refresh } = useAtsApplications();
  const { jobs, refresh: refreshJobs } = useAllJobs();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteJobTarget, setDeleteJobTarget] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const TAB_LABELS: Record<Tab, string> = {
    "Job posts": t("admin.ats.tabs.jobPosts"),
    "Applicants": t("admin.ats.tabs.applicants"),
    "Pipeline": t("admin.ats.tabs.pipeline"),
  };

  const selected = useMemo(
    () => applications.find((a) => a.id === selectedId) ?? null,
    [applications, selectedId]
  );

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchesQuery =
        !query.trim() ||
        [a.fullName, a.jobTitle, a.email, a.id].some((v) => v.toLowerCase().includes(query.trim().toLowerCase()));
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [applications, query, statusFilter]);

  const applicantsFor = (slug: string) => applications.filter((a) => a.jobSlug === slug).length;

  function openCreateJob() {
    setEditingJob(null);
    setJobFormOpen(true);
  }

  function openEditJob(j: Job) {
    setEditingJob(j);
    setJobFormOpen(true);
  }

  async function handleJobSubmit(values: JobFormValues, publish: boolean) {
    try {
      if (editingJob) {
        await updateJob(editingJob.slug, values as Job);
        toast.success(
          publish
            ? `"${values.title}" ${t("admin.ats.jobPosts.toast.publishedSuffix")}`
            : `"${values.title}" ${t("admin.ats.jobPosts.toast.updatedSuffix")}`
        );
      } else {
        const created = await addJob(values);
        toast.success(
          publish
            ? `"${created.title}" ${t("admin.ats.jobPosts.toast.publishedSuffix")}`
            : `"${created.title}" ${t("admin.ats.jobPosts.toast.draftSuffix")}`
        );
      }
      await refreshJobs();
      setJobFormOpen(false);
      setEditingJob(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the job posting.");
    }
  }

  async function confirmDeleteJob() {
    if (!deleteJobTarget) return;
    setIsDeleting(true);
    try {
      await deleteJob(deleteJobTarget.slug);
      toast.success(`"${deleteJobTarget.title}" ${t("admin.ats.jobPosts.toast.removedSuffix")}`);
      await refreshJobs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete the job posting.");
    } finally {
      setIsDeleting(false);
      setDeleteJobTarget(null);
    }
  }

  async function toggleJobStatus(j: Job) {
    const next = j.status === "Published" ? "Draft" : "Published";
    await setJobStatus(j.slug, next);
    toast.success(`"${j.title}" ${t("admin.ats.jobPosts.toast.isNowPrefix")} ${t(`admin.statusLabels.${next}`)}`);
    await refreshJobs();
  }

  async function toggleJobFeatured(j: Job) {
    await setJobFeatured(j.slug, !j.featured);
    toast.success(
      !j.featured
        ? `"${j.title}" ${t("admin.ats.jobPosts.toast.featuredOnSuffix")}`
        : `"${j.title}" ${t("admin.ats.jobPosts.toast.featuredOffSuffix")}`
    );
    await refreshJobs();
  }

  return (
    <AdminShell
      title={t("admin.ats.title")}
      subtitle={t("admin.ats.subtitle")}
      actions={
        <AdminButton onClick={openCreateJob}>
          <Plus className="w-4 h-4" /> {t("admin.ats.postJob")}
        </AdminButton>
      }
    >
      <div className="flex gap-1 mb-6 p-1 bg-white dark:bg-card border border-hairline rounded w-fit">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-4 h-9 text-[11px] font-semibold uppercase tracking-[0.18em] rounded transition-colors ${
              tab === tb ? "bg-primary text-white" : "text-corporate-gray hover:text-primary"
            }`}
          >
            {TAB_LABELS[tb]}
          </button>
        ))}
      </div>

      {tab === "Job posts" && (
        <div>
          <h2 className="font-display text-lg font-semibold mb-3">{t("admin.ats.jobPosts.heading")}</h2>
          <DataTable
            columns={[
              t("admin.ats.jobPosts.table.title"),
              t("admin.ats.jobPosts.table.department"),
              t("admin.ats.jobPosts.table.location"),
              t("admin.ats.jobPosts.table.applicants"),
              t("admin.ats.jobPosts.table.status"),
              t("admin.ats.jobPosts.table.posted"),
              t("admin.ats.jobPosts.table.actions"),
            ]}
            rows={jobs.map((j) => [
              <div className="flex items-center gap-3">
                <MediaImage src={j.coverImage} alt={j.title} className="w-9 h-9 object-cover rounded bg-brand-soft" />
                <div>
                  <span className="font-medium">{j.title}</span>
                  {j.featured && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
                      <Star className="w-3 h-3 fill-current" /> {t("admin.ats.jobPosts.featuredBadge")}
                    </span>
                  )}
                </div>
              </div>,
              j.department,
              <span className="text-corporate-gray">{j.location}</span>,
              String(applicantsFor(j.slug)),
              <StatusPill status={j.status} />,
              <span className="text-corporate-gray font-mono text-[12px]">{formatJobDate(j.posted)}</span>,
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => toggleJobFeatured(j)}
                  className={`w-8 h-8 grid place-items-center rounded hover:bg-brand-soft transition-colors ${j.featured ? "text-amber-500" : "text-corporate-gray hover:text-primary"}`}
                  aria-label={`${t("admin.ats.jobPosts.toggleFeaturedAria")} ${j.title}`}
                  title={j.featured ? t("admin.ats.jobPosts.unfeature") : t("admin.ats.jobPosts.feature")}
                >
                  <Star className={`w-4 h-4 ${j.featured ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => toggleJobStatus(j)}
                  className="w-8 h-8 grid place-items-center rounded hover:bg-brand-soft text-corporate-gray hover:text-primary transition-colors"
                  aria-label={`${t("admin.ats.jobPosts.toggleStatusAria")} ${j.title}`}
                  title={j.status === "Published" ? t("admin.ats.jobPosts.setToDraft") : t("admin.ats.jobPosts.publish")}
                >
                  {j.status === "Published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEditJob(j)}
                  className="w-8 h-8 grid place-items-center rounded hover:bg-brand-soft text-corporate-gray hover:text-primary transition-colors"
                  aria-label={`${t("admin.ats.jobPosts.editAria")} ${j.title}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteJobTarget(j)}
                  className="w-8 h-8 grid place-items-center rounded hover:bg-red-50 dark:bg-red-500/15 text-corporate-gray hover:text-destructive transition-colors"
                  aria-label={`${t("admin.ats.jobPosts.deleteAria")} ${j.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>,
            ])}
          />
          {jobs.length === 0 && (
            <p className="text-center text-sm text-corporate-gray py-10">{t("admin.ats.jobPosts.empty")}</p>
          )}
          <p className="mt-3 text-[12px] text-corporate-gray">
            {applications.length} {applications.length === 1 ? t("admin.ats.jobPosts.syncNoteSingular") : t("admin.ats.jobPosts.syncNotePlural")}
          </p>
        </div>
      )}

      {tab === "Applicants" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 h-10 px-3 border border-hairline rounded bg-white dark:bg-card flex-1 min-w-[220px] max-w-sm">
              <Search className="w-4 h-4 text-corporate-gray" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("admin.ats.applicants.searchPlaceholder")}
                className="flex-1 h-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 border border-hairline rounded bg-white dark:bg-card text-sm focus:outline-none focus:border-primary"
            >
              <option value="All">{t("admin.ats.applicants.allStatuses")}</option>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>{t(`admin.statusLabels.${s}`)}</option>
              ))}
            </select>
            <span className="text-[12px] text-corporate-gray ml-auto">
              {filtered.length} {filtered.length === 1 ? t("admin.ats.applicants.countSuffixSingular") : t("admin.ats.applicants.countSuffixPlural")}
            </span>
          </div>

          <DataTable
            columns={[
              t("admin.ats.applicants.table.applicant"),
              t("admin.ats.applicants.table.position"),
              t("admin.ats.applicants.table.department"),
              t("admin.ats.applicants.table.status"),
              t("admin.ats.applicants.table.applied"),
              t("admin.ats.applicants.table.action"),
            ]}
            rows={filtered.map((a) => [
              <div>
                <div className="font-medium">{a.fullName}</div>
                <div className="text-[11px] text-corporate-gray font-mono">{a.id}</div>
              </div>,
              a.jobTitle,
              <span className="text-corporate-gray">{a.department}</span>,
              <StatusPill status={a.status} />,
              <span className="text-corporate-gray">{formatDate(a.submittedAt)}</span>,
              <button
                onClick={() => setSelectedId(a.id)}
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline"
              >
                {t("admin.common.view")}
              </button>,
            ])}
          />
          {filtered.length === 0 && (
            <p className="text-center text-sm text-corporate-gray py-10">{t("admin.ats.applicants.noMatch")}</p>
          )}
        </div>
      )}

      {tab === "Pipeline" && (
        <div>
          <h2 className="font-display text-lg font-semibold mb-3">{t("admin.ats.pipeline.heading")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {APPLICATION_STATUSES.map((s) => {
              const inStage = applications.filter((a) => a.status === s);
              return (
                <div key={s} className="card-elevated p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="eyebrow text-primary">{t(`admin.statusLabels.${s}`)}</div>
                    <div className="text-sm font-semibold">{inStage.length}</div>
                  </div>
                  <div className="space-y-2">
                    {inStage.slice(0, 4).map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className="w-full text-left p-2.5 border border-hairline rounded text-[12px] hover:border-primary/40 transition-colors"
                      >
                        <div className="font-semibold truncate">{a.fullName}</div>
                        <div className="text-corporate-gray truncate">{a.jobTitle}</div>
                      </button>
                    ))}
                    {inStage.length === 0 && <div className="text-[11px] text-corporate-gray">{t("admin.ats.pipeline.noApplicants")}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected && (
        <AdminApplicantModal
          key={selected.id}
          application={selected}
          onClose={() => setSelectedId(null)}
          onChanged={refresh}
        />
      )}

      <AdminJobFormModal
        open={jobFormOpen}
        onOpenChange={(o) => {
          setJobFormOpen(o);
          if (!o) setEditingJob(null);
        }}
        initialJob={editingJob}
        onSubmit={handleJobSubmit}
      />

      <AdminDeleteDialog
        open={!!deleteJobTarget}
        onOpenChange={(o) => !o && setDeleteJobTarget(null)}
        title={t("admin.ats.jobPosts.deleteDialog.title")}
        itemName={deleteJobTarget?.title}
        itemType="JOB POST"
        description={
          deleteJobTarget
            ? `${t("admin.ats.jobPosts.deleteDialog.bodyPrefix")} "${deleteJobTarget.title}" ${t("admin.ats.jobPosts.deleteDialog.bodySuffix")}`
            : undefined
        }
        isDeleting={isDeleting}
        onConfirm={confirmDeleteJob}
      />
    </AdminShell>
  );
}
