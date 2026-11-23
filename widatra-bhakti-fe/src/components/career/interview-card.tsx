import { useEffect, useState, type ReactNode } from "react";
import { Calendar, CalendarClock, Link2, MapPin, MessageSquare, User } from "lucide-react";
import type { InterviewSchedule } from "@/lib/ats-store";
import { useLanguage } from "@/hooks/use-language";

export function getInterviewDateTime(schedule: InterviewSchedule): Date {
  return new Date(`${schedule.date}T${schedule.time || "00:00"}:00`);
}

export function formatInterviewDate(schedule: InterviewSchedule, locale: string = "en-GB"): string {
  try {
    return getInterviewDateTime(schedule).toLocaleString(locale, {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return `${schedule.date} ${schedule.time}`;
  }
}

/**
 * Build a translated "In X days/hours/minutes" countdown label. `t` is the
 * translation function from useLanguage(), passed in by the caller so this
 * plain helper doesn't need to be a hook itself.
 */
export function getCountdownLabel(schedule: InterviewSchedule, t: (key: string) => string): string {
  const diff = getInterviewDateTime(schedule).getTime() - Date.now();
  if (diff <= 0) return t("dashboard.interviewCard.happeningNowOrPassed");
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const inLabel = t("dashboard.interviewCard.inLabel");
  const hourShort = t("dashboard.interviewCard.hourShort");
  const minuteShort = t("dashboard.interviewCard.minuteShort");
  if (days > 0) {
    const dayWord = days === 1 ? t("dashboard.interviewCard.daySingular") : t("dashboard.interviewCard.dayPlural");
    return `${inLabel} ${days} ${dayWord}${hours > 0 ? ` ${hours}${hourShort}` : ""}`;
  }
  if (hours > 0) return `${inLabel} ${hours}${hourShort} ${minutes}${minuteShort}`;
  const minuteWord = minutes === 1 ? t("dashboard.interviewCard.minuteSingular") : t("dashboard.interviewCard.minutePlural");
  return `${inLabel} ${minutes} ${minuteWord}`;
}

/**
 * Full interview details, used in the Admin Applicant Detail sidebar and
 * the Applicant Timeline modal. `actions` slot lets the admin view inject
 * Edit/Reschedule/Cancel buttons without this component knowing about them.
 */
export function InterviewDetailsPanel({
  schedule,
  actions,
}: {
  schedule: InterviewSchedule;
  actions?: ReactNode;
}) {
  const { t, language } = useLanguage();
  const cancelled = schedule.status === "Cancelled";
  return (
    <div
      className={`rounded-lg border p-4 space-y-3 ${
        cancelled ? "border-hairline bg-slate-50 dark:bg-surface-2" : "border-primary/30 bg-brand-tint/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          <CalendarClock className="w-3.5 h-3.5" /> {t("dashboard.interviewCard.interview")}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.16em] px-2 py-0.5 rounded-full ${
            cancelled ? "bg-slate-200 dark:bg-white/10 text-corporate-gray" : "bg-primary text-white"
          }`}
        >
          {schedule.status}
        </span>
      </div>
      <div className={`text-sm font-semibold ${cancelled ? "text-corporate-gray line-through" : "text-corporate-black dark:text-foreground"}`}>
        {formatInterviewDate(schedule, language === "id" ? "id-ID" : "en-GB")}
      </div>
      <div className="space-y-1.5 text-[13px]">
        <div className="flex items-center gap-2 text-corporate-gray">
          {schedule.type === "Online" ? (
            <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
          ) : (
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          )}
          <span className="text-corporate-black dark:text-foreground break-all">{schedule.locationOrLink}</span>
        </div>
        <div className="flex items-center gap-2 text-corporate-gray">
          <User className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-corporate-black dark:text-foreground">{schedule.interviewer}</span>
        </div>
        {schedule.notes && (
          <div className="flex gap-2 text-corporate-gray">
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="text-corporate-black dark:text-foreground">{schedule.notes}</span>
          </div>
        )}
      </div>
      {actions && <div className="pt-1 flex gap-2">{actions}</div>}
    </div>
  );
}

/**
 * "Upcoming Interview" card for the Applicant Dashboard — shows a live
 * countdown plus interviewer, location/link, and notes.
 */
export function UpcomingInterviewCard({ schedule, jobTitle }: { schedule: InterviewSchedule; jobTitle: string }) {
  const { t, language } = useLanguage();
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-3 mt-3">
      <div className="w-10 h-10 bg-brand-tint text-primary rounded grid place-items-center flex-shrink-0">
        <Calendar className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-primary">{getCountdownLabel(schedule, t)}</div>
        <div className="text-[12px] text-corporate-gray">{jobTitle}</div>
        <div className="text-[12px] text-corporate-black dark:text-foreground mt-1">{formatInterviewDate(schedule, language === "id" ? "id-ID" : "en-GB")}</div>
        <div className="text-[12px] text-corporate-gray mt-1 flex items-center gap-1.5">
          <User className="w-3 h-3 flex-shrink-0" /> {schedule.interviewer}
        </div>
        <div className="text-[12px] text-corporate-gray flex items-center gap-1.5">
          {schedule.type === "Online" ? (
            <Link2 className="w-3 h-3 flex-shrink-0" />
          ) : (
            <MapPin className="w-3 h-3 flex-shrink-0" />
          )}
          <span className="break-all">{schedule.locationOrLink}</span>
        </div>
        {schedule.notes && <div className="text-[12px] text-corporate-gray mt-1 italic">"{schedule.notes}"</div>}
      </div>
    </div>
  );
}
