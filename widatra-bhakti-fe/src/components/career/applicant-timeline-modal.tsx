import { ModalShell, CloseButton } from "@/components/career/career-flow";
import { InterviewDetailsPanel } from "@/components/career/interview-card";
import { StatusPill } from "@/components/admin-shell";
import { APPLICATION_STATUSES, type StoredApplication } from "@/lib/ats-store";
import { useLanguage } from "@/hooks/use-language";
import { CheckCircle2, Circle, Download, FileText } from "lucide-react";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function ApplicantTimelineModal({
  application,
  onClose,
}: {
  application: StoredApplication;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  function statusLabel(status: string) {
    return t(`dashboard.statusLabels.${status}`);
  }

  const isRejected = application.status === "Rejected";
  const trackStages = isRejected
    ? ["Submitted", "Screening", "Interview", "Rejected"]
    : APPLICATION_STATUSES.filter((s) => s !== "Rejected");

  const reachedIndex = trackStages.indexOf(application.status);

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-2xl" labelledBy="timeline-modal-title">
      <CloseButton onClose={onClose} />
      <div className="max-h-[85vh] overflow-y-auto">
        <div className="px-8 pt-10 pb-6 border-b border-hairline bg-gradient-to-br from-brand-tint/60 to-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono text-corporate-gray">{application.id}</span>
            <StatusPill status={application.status} label={statusLabel(application.status)} />
          </div>
          <h2 id="timeline-modal-title" className="text-2xl font-semibold font-display tracking-tight mb-1">{application.jobTitle}</h2>
          <p className="text-sm text-corporate-gray">{application.department} · {application.location} · {t("dashboard.timelineModal.appliedPrefix")} {formatDate(application.submittedAt)}</p>
        </div>

        <div className="px-8 py-8">
          {/* Stage tracker */}
          <div className="flex items-center mb-10">
            {trackStages.map((s, i) => {
              const done = i <= reachedIndex;
              return (
                <div key={s} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    {done ? (
                      <CheckCircle2 className="w-7 h-7 text-primary" />
                    ) : (
                      <Circle className="w-7 h-7 text-black/15" />
                    )}
                    <span className={`text-[9px] font-bold uppercase tracking-[0.16em] text-center ${done ? "text-primary" : "text-corporate-gray"}`}>{statusLabel(s)}</span>
                  </div>
                  {i < trackStages.length - 1 && (
                    <div className={`flex-1 h-px mx-1 ${i < reachedIndex ? "bg-primary" : "bg-black/10 dark:bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Applicant details */}
          <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("dashboard.timelineModal.yourApplication")}</h3>
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1">{t("dashboard.timelineModal.fullName")}</div>
              <div className="font-medium">{application.fullName}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1">{t("dashboard.timelineModal.email")}</div>
              <div className="font-medium">{application.email}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1">{t("dashboard.timelineModal.phone")}</div>
              <div className="font-medium">{application.phone || "—"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1">{t("dashboard.timelineModal.employmentType")}</div>
              <div className="font-medium">{application.employmentType}</div>
            </div>
          </div>

          {/* Interview details */}
          {application.interview && (
            <>
              <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("dashboard.timelineModal.interviewDetails")}</h3>
              <div className="mb-8">
                <InterviewDetailsPanel schedule={application.interview} />
              </div>
            </>
          )}

          {/* CV / Resume */}
          <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("dashboard.timelineModal.uploadedCv")}</h3>
          <div className="flex items-center justify-between p-4 border border-hairline rounded-lg bg-brand-soft mb-8">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{application.cvFileName || t("dashboard.timelineModal.noFileRecorded")}</div>
                {application.cvFileSize > 0 && (
                  <div className="text-[11px] text-corporate-gray">
                    {(application.cvFileSize / 1024).toFixed(0)} KB · {application.cvFileType}
                  </div>
                )}
              </div>
            </div>
            {application.cvDataUrl ? (
              <a
                href={application.cvDataUrl}
                download={application.cvFileName}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-brand-deep flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> {t("dashboard.timelineModal.download")}
              </a>
            ) : (
              <span className="text-[11px] text-corporate-gray flex-shrink-0">{t("dashboard.timelineModal.sampleRecordNote")}</span>
            )}
          </div>

          {/* History log */}
          <h3 className="font-display text-base font-semibold mb-4 pb-2 border-b border-hairline">{t("dashboard.timelineModal.statusHistory")}</h3>
          <ol className="space-y-5">
            {[...application.statusHistory].reverse().map((h, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                  {i < application.statusHistory.length - 1 && <div className="flex-1 w-px bg-black/10 dark:bg-white/10 mt-1" />}
                </div>
                <div className="pb-1">
                  <div className="text-sm font-semibold text-corporate-black dark:text-foreground">{statusLabel(h.status)}</div>
                  <div className="text-[12px] text-corporate-gray mb-1">{formatDate(h.date)}</div>
                  {h.note && <p className="text-[13px] text-corporate-black dark:text-foreground bg-brand-soft rounded px-3 py-2 mt-1">{h.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ModalShell>
  );
}
