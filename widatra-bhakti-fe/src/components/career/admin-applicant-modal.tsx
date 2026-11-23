import { useState } from "react";
import { ModalShell, CloseButton } from "@/components/career/career-flow";
import { InterviewSchedulingModal } from "@/components/career/interview-scheduling-modal";
import { InterviewDetailsPanel } from "@/components/career/interview-card";
import { CvViewerModal } from "@/components/career/cv-viewer-modal";
import { StatusPill } from "@/components/admin-shell";
import { useLanguage } from "@/hooks/use-language";
import {
  APPLICATION_STATUSES,
  addHrNote,
  cancelInterview,
  updateApplicationStatus,
  type ApplicationStatus,
  type StoredApplication,
} from "@/lib/ats-store";
import { Download, Eye, FileText } from "lucide-react";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1">{label}</div>
      <div className="text-sm font-medium text-corporate-black dark:text-foreground">{value || "—"}</div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function AdminApplicantModal({
  application,
  onClose,
  onChanged,
}: {
  application: StoredApplication;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t } = useLanguage();
  const [app, setApp] = useState(application);
  const [note, setNote] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus>(application.status);
  const [interviewModal, setInterviewModal] = useState<"schedule" | "edit" | null>(null);
  const [cvViewerOpen, setCvViewerOpen] = useState(false);

  const applyStatus = async () => {
    if (pendingStatus === app.status) return;

    // Moving to "Interview" never writes the timeline directly — HR must
    // schedule the interview first, and that scheduling step is what
    // records the status change (with the actual interview date/time).
    if (pendingStatus === "Interview") {
      setInterviewModal("schedule");
      return;
    }

    const updated = await updateApplicationStatus(app.id, pendingStatus, statusNote);
    if (updated) {
      setApp(updated);
      setStatusNote("");
      onChanged();
    }
  };

  const handleInterviewSaved = (updated: StoredApplication) => {
    setApp(updated);
    setPendingStatus(updated.status);
    setInterviewModal(null);
    onChanged();
  };

  const handleCancelInterview = async () => {
    if (!confirm(t("admin.ats.modal.confirmCancelInterview"))) return;
    const updated = await cancelInterview(app.id);
    if (updated) {
      setApp(updated);
      onChanged();
    }
  };

  const submitNote = async () => {
    if (!note.trim()) return;
    const updated = await addHrNote(app.id, note.trim());
    if (updated) {
      setApp(updated);
      setNote("");
      onChanged();
    }
  };

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-4xl" labelledBy="admin-applicant-title">
      <CloseButton onClose={onClose} />
      <div className="max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-hairline bg-gradient-to-br from-brand-tint/60 to-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono text-corporate-gray">{app.id}</span>
            <StatusPill status={app.status} />
          </div>
          <h2 id="admin-applicant-title" className="text-2xl lg:text-3xl font-semibold font-display tracking-tight mb-1">{app.fullName}</h2>
          <p className="text-sm text-corporate-gray">{t("admin.ats.modal.appliedForPrefix")} <span className="font-medium text-corporate-black dark:text-foreground">{app.jobTitle}</span> · {app.department} · {app.location}</p>
        </div>

        <div className="px-8 py-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.personalInfo")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("admin.ats.modal.fields.fullName")} value={app.fullName} />
                <Field label={t("admin.ats.modal.fields.dob")} value={app.dob} />
                <Field label={t("admin.ats.modal.fields.gender")} value={app.gender} />
                <Field label={t("admin.ats.modal.fields.submitted")} value={formatDate(app.submittedAt)} />
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.contactInfo")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("admin.ats.modal.fields.email")} value={app.email} />
                <Field label={t("admin.ats.modal.fields.phone")} value={app.phone} />
                <Field label={t("admin.ats.modal.fields.city")} value={app.city} />
                <Field label={t("admin.ats.modal.fields.address")} value={app.address} />
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.education")}</h3>
              <div className="space-y-3">
                {app.education.map((e, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{[e.degree, e.major].filter(Boolean).join(" · ")}</span>
                    <span className="text-corporate-gray"> — {e.institution} {e.year && `(${e.year})`}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.experience")}</h3>
              {app.hasNoExperience || app.experience.length === 0 ? (
                <p className="text-sm text-corporate-gray">{t("admin.ats.modal.noExperience")}</p>
              ) : (
                <div className="space-y-4">
                  {app.experience.map((e, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium">{e.role} — {e.company}</div>
                      <div className="text-corporate-gray text-[12px]">{e.period}</div>
                      {e.description && <p className="text-corporate-gray mt-1">{e.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.skills")}</h3>
              <p className="text-sm text-corporate-black dark:text-foreground">{app.skills || "—"}</p>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.portfolioLinkedin")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("admin.ats.modal.fields.linkedin")} value={app.linkedin} />
                <Field label={t("admin.ats.modal.fields.portfolio")} value={app.portfolio} />
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.cvResume")}</h3>
              <div className="flex items-center justify-between p-4 border border-hairline rounded-lg bg-brand-soft">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{app.cvFileName}</div>
                    <div className="text-[11px] text-corporate-gray">{(app.cvFileSize / 1024).toFixed(0)} KB · {app.cvFileType}</div>
                  </div>
                </div>
                {app.cvDataUrl ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setCvViewerOpen(true)}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded border border-primary text-primary text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-primary hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> {t("admin.ats.modal.viewCv")}
                    </button>
                    <a
                      href={app.cvDataUrl}
                      download={app.cvFileName}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 h-9 px-4 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-brand-deep"
                    >
                      <Download className="w-3.5 h-3.5" /> {t("admin.ats.modal.download")}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-corporate-gray">{t("admin.ats.modal.sampleRecord")}</span>
                    <button
                      onClick={() => setCvViewerOpen(true)}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded border border-hairline text-corporate-gray text-[11px] font-bold uppercase tracking-[0.18em] hover:border-primary hover:text-primary transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> {t("admin.ats.modal.viewCv")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("admin.ats.modal.sections.coverLetter")}</h3>
              <p className="text-sm text-corporate-black dark:text-foreground leading-relaxed whitespace-pre-wrap">{app.coverLetter || "—"}</p>
            </div>
          </div>

          {/* Sidebar — status + notes */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-display text-sm font-semibold mb-4">{t("admin.ats.modal.sections.recruitmentStatus")}</h3>
              <div className="space-y-3">
                <select
                  value={pendingStatus}
                  onChange={(e) => setPendingStatus(e.target.value as ApplicationStatus)}
                  className="w-full h-10 rounded border border-hairline px-3 text-sm bg-white dark:bg-card focus:outline-none focus:border-primary"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{t(`admin.statusLabels.${s}`)}</option>
                  ))}
                </select>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={t("admin.ats.modal.statusNotePlaceholder")}
                  className="w-full rounded border border-hairline px-3 py-2 text-[13px] focus:outline-none focus:border-primary resize-none"
                />
                <button
                  onClick={applyStatus}
                  disabled={pendingStatus === app.status}
                  className="w-full h-10 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep disabled:opacity-40"
                >
                  {t("admin.ats.modal.updateStatus")}
                </button>
              </div>

              {app.interview && (
                <div className="mt-5 pt-5 border-t border-hairline">
                  <InterviewDetailsPanel
                    schedule={app.interview}
                    actions={
                      app.interview.status === "Scheduled" ? (
                        <>
                          <button
                            onClick={() => setInterviewModal("edit")}
                            className="flex-1 h-8 rounded border border-hairline text-[10px] font-bold uppercase tracking-[0.16em] hover:border-primary hover:text-primary"
                          >
                            {t("admin.ats.modal.editReschedule")}
                          </button>
                          <button
                            onClick={handleCancelInterview}
                            className="flex-1 h-8 rounded border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-[0.16em] hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            {t("admin.ats.modal.cancel")}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setInterviewModal("edit")}
                          className="flex-1 h-8 rounded border border-hairline text-[10px] font-bold uppercase tracking-[0.16em] hover:border-primary hover:text-primary"
                        >
                          {t("admin.ats.modal.reschedule")}
                        </button>
                      )
                    }
                  />
                </div>
              )}

              <div className="mt-5 pt-5 border-t border-hairline">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-3">{t("admin.ats.modal.sections.timeline")}</div>
                <ol className="space-y-3">
                  {app.statusHistory.map((h, i) => (
                    <li key={i} className="flex gap-3 text-[12px]">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-corporate-black dark:text-foreground">{t(`admin.statusLabels.${h.status}`)}</div>
                        <div className="text-corporate-gray">{formatDate(h.date)}</div>
                        {h.note && <div className="text-corporate-gray mt-0.5">{h.note}</div>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className="font-display text-sm font-semibold mb-4">{t("admin.ats.modal.sections.hrNotes")}</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {app.hrNotes.length === 0 && <p className="text-[12px] text-corporate-gray">{t("admin.ats.modal.noNotesYet")}</p>}
                {app.hrNotes.map((n) => (
                  <div key={n.id} className="p-3 rounded bg-brand-soft text-[12px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{n.author}</span>
                      <span className="text-corporate-gray">{formatDate(n.date)}</span>
                    </div>
                    <p className="text-corporate-black dark:text-foreground">{n.note}</p>
                  </div>
                ))}
              </div>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("admin.ats.modal.addNotePlaceholder")}
                className="w-full rounded border border-hairline px-3 py-2 text-[13px] focus:outline-none focus:border-primary resize-none mb-2"
              />
              <button
                onClick={submitNote}
                disabled={!note.trim()}
                className="w-full h-10 rounded border border-hairline text-[11px] font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary disabled:opacity-40"
              >
                {t("admin.ats.modal.addNote")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {interviewModal && (
        <InterviewSchedulingModal
          application={app}
          mode={interviewModal}
          onClose={() => setInterviewModal(null)}
          onSaved={handleInterviewSaved}
        />
      )}

      {cvViewerOpen && (
        <CvViewerModal
          applicantName={app.fullName}
          jobTitle={app.jobTitle}
          fileName={app.cvFileName}
          fileType={app.cvFileType}
          dataUrl={app.cvDataUrl}
          onClose={() => setCvViewerOpen(false)}
        />
      )}
    </ModalShell>
  );
}
