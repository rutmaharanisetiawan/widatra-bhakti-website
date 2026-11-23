import { useState } from "react";
import { ModalShell, CloseButton } from "@/components/career/career-flow";
import { useLanguage } from "@/hooks/use-language";
import {
  scheduleInterview,
  updateInterview,
  type InterviewScheduleInput,
  type InterviewType,
  type StoredApplication,
} from "@/lib/ats-store";
import { CalendarClock, Link2, MapPin, MessageSquare, User } from "lucide-react";

function emptyInput(): InterviewScheduleInput {
  return { date: "", time: "", type: "Online", locationOrLink: "", interviewer: "", notes: "" };
}

export function InterviewSchedulingModal({
  application,
  mode = "schedule",
  onClose,
  onSaved,
}: {
  application: StoredApplication;
  mode?: "schedule" | "edit";
  onClose: () => void;
  onSaved: (updated: StoredApplication) => void;
}) {
  const { t } = useLanguage();
  const existing = application.interview;
  const [form, setForm] = useState<InterviewScheduleInput>(
    mode === "edit" && existing
      ? {
          date: existing.date,
          time: existing.time,
          type: existing.type,
          locationOrLink: existing.locationOrLink,
          interviewer: existing.interviewer,
          notes: existing.notes,
        }
      : emptyInput()
  );
  const [error, setError] = useState("");

  const set = <K extends keyof InterviewScheduleInput>(key: K, value: InterviewScheduleInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isValid = form.date.trim() && form.time.trim() && form.locationOrLink.trim() && form.interviewer.trim();

  const handleSubmit = async () => {
    if (!isValid) {
      setError(t("admin.ats.scheduling.errorRequired"));
      return;
    }
    const updated =
      mode === "edit" ? await updateInterview(application.id, form) : await scheduleInterview(application.id, form);
    if (updated) {
      onSaved(updated);
    }
  };

  const title = mode === "edit" ? t("admin.ats.scheduling.titleReschedule") : t("admin.ats.scheduling.titleSchedule");
  const typeLabel = (ty: InterviewType) => (ty === "Online" ? t("admin.ats.scheduling.online") : t("admin.ats.scheduling.offline"));

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-lg" labelledBy="interview-scheduling-title">
      <CloseButton onClose={onClose} />
      <div className="max-h-[88vh] overflow-y-auto">
        <div className="px-8 pt-10 pb-6 border-b border-hairline bg-gradient-to-br from-brand-tint/60 to-white">
          <div className="w-11 h-11 rounded-full bg-brand-tint text-primary grid place-items-center mb-4">
            <CalendarClock className="w-5 h-5" />
          </div>
          <h2 id="interview-scheduling-title" className="text-xl font-semibold font-display tracking-tight mb-1">
            {title}
          </h2>
          <p className="text-sm text-corporate-gray">
            {application.fullName} · <span className="font-medium text-corporate-black dark:text-foreground">{application.jobTitle}</span>
          </p>
        </div>

        <div className="px-8 py-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1.5 block">
                {t("admin.ats.scheduling.interviewDate")}
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full h-10 rounded border border-hairline px-3 text-sm bg-white dark:bg-card focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1.5 block">
                {t("admin.ats.scheduling.interviewTime")}
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                className="w-full h-10 rounded border border-hairline px-3 text-sm bg-white dark:bg-card focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1.5 block">
              {t("admin.ats.scheduling.interviewType")}
            </label>
            <div className="flex gap-2">
              {(["Online", "Offline"] as InterviewType[]).map((ty) => (
                <button
                  key={ty}
                  type="button"
                  onClick={() => set("type", ty)}
                  className={`flex-1 h-10 rounded border text-[13px] font-semibold transition-colors ${
                    form.type === ty
                      ? "border-primary bg-brand-tint text-primary"
                      : "border-hairline text-corporate-gray hover:border-primary/40"
                  }`}
                >
                  {typeLabel(ty)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1.5 flex items-center gap-1.5">
              {form.type === "Online" ? <Link2 className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
              {form.type === "Online" ? t("admin.ats.scheduling.meetingLink") : t("admin.ats.scheduling.location")}
            </label>
            <input
              type="text"
              value={form.locationOrLink}
              onChange={(e) => set("locationOrLink", e.target.value)}
              placeholder={form.type === "Online" ? t("admin.ats.scheduling.meetingLinkPlaceholder") : t("admin.ats.scheduling.locationPlaceholder")}
              className="w-full h-10 rounded border border-hairline px-3 text-sm bg-white dark:bg-card focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1.5 flex items-center gap-1.5">
              <User className="w-3 h-3" /> {t("admin.ats.scheduling.interviewer")}
            </label>
            <input
              type="text"
              value={form.interviewer}
              onChange={(e) => set("interviewer", e.target.value)}
              placeholder={t("admin.ats.scheduling.interviewerPlaceholder")}
              className="w-full h-10 rounded border border-hairline px-3 text-sm bg-white dark:bg-card focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-corporate-gray mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" /> {t("admin.ats.scheduling.notes")}
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder={t("admin.ats.scheduling.notesPlaceholder")}
              className="w-full rounded border border-hairline px-3 py-2 text-[13px] focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {error && <p className="text-[12px] text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded border border-hairline text-[11px] font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
            >
              {t("admin.ats.scheduling.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 h-11 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-deep"
            >
              {mode === "edit" ? t("admin.ats.scheduling.saveChanges") : t("admin.ats.scheduling.scheduleInterview")}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
