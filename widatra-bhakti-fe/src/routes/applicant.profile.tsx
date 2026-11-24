import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ApplicantShell } from "@/components/applicant-shell";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "@/lib/auth-store";
import { mockApplicant } from "@/lib/applicant-mock";
import { useLanguage } from "@/hooks/use-language";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Edit3,
  Check,
  X,
  Plus,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/applicant/profile")({
  head: () => ({ meta: [{ title: "Profile — Widatra Applicant" }] }),
  component: ProfilePage,
});

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProfilePage() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const { user, refresh } = useAuth();

  const name = user?.name ?? mockApplicant.name;
  const email = user?.email ?? mockApplicant.email;
  const phone = user?.phone ?? mockApplicant.phone;
  const isInternal = user?.accountType === "internal";

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState(name);
  const [formEmail, setFormEmail] = useState(email);
  const [formPhone, setFormPhone] = useState(phone);
  const [location, setLocation] = useState(mockApplicant.location);

  const [educationList, setEducationList] = useState(mockApplicant.education);
  const [addingEdu, setAddingEdu] = useState(false);
  const [newSchool, setNewSchool] = useState("");
  const [newDegree, setNewDegree] = useState("");
  const [newYear, setNewYear] = useState("");

  const [experienceList, setExperienceList] = useState(mockApplicant.experience);
  const [addingExp, setAddingExp] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newPeriod, setNewPeriod] = useState("");

  async function handleSaveBasic(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setEditing(false);
      toast.success(isId ? "Profil berhasil diperbarui." : "Profile updated.");
      return;
    }
    setSaving(true);
    const res = await updateProfile(user.id, {
      name: formName.trim() || name,
      email: formEmail.trim() || email,
      phone: formPhone.trim(),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    refresh();
    setEditing(false);
    toast.success(isId ? "Informasi kontak berhasil disimpan." : "Contact info updated.");
  }

  function handleAddEducation(e: React.FormEvent) {
    e.preventDefault();
    if (!newSchool.trim() || !newDegree.trim()) return;
    setEducationList((prev) => [
      ...prev,
      { school: newSchool.trim(), degree: newDegree.trim(), year: newYear.trim() || "2025" },
    ]);
    setNewSchool("");
    setNewDegree("");
    setNewYear("");
    setAddingEdu(false);
    toast.success(isId ? "Riwayat pendidikan ditambahkan." : "Education added.");
  }

  function handleAddExperience(e: React.FormEvent) {
    e.preventDefault();
    if (!newRole.trim() || !newCompany.trim()) return;
    setExperienceList((prev) => [
      ...prev,
      { role: newRole.trim(), company: newCompany.trim(), period: newPeriod.trim() || "2024 – Present" },
    ]);
    setNewRole("");
    setNewCompany("");
    setNewPeriod("");
    setAddingExp(false);
    toast.success(isId ? "Pengalaman kerja ditambahkan." : "Experience added.");
  }

  return (
    <ApplicantShell
      title={t("dashboard.profile.title")}
      subtitle={t("dashboard.profile.subtitle")}
      headerActions={
        !editing ? (
          <button
            type="button"
            onClick={() => {
              setFormName(name);
              setFormEmail(email);
              setFormPhone(phone);
              setEditing(true);
            }}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isId ? "Edit Profil" : "Edit Profile"}</span>
          </button>
        ) : undefined
      }
    >
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Personal Info, Education & Experience */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info Card */}
          <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-sky-300">
                  {t("dashboard.profile.personalInformation")}
                </h2>
              </div>
              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setFormName(name);
                    setFormEmail(email);
                    setFormPhone(phone);
                    setEditing(true);
                  }}
                  className="text-xs font-semibold text-primary dark:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isId ? "Ubah" : "Edit"}</span>
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSaveBasic} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5">
                      {t("dashboard.profile.fullName")}
                    </label>
                    <input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5">
                      {isInternal ? "Company Email" : t("dashboard.profile.email")}
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-400"
                    />
                  </div>
                  {!isInternal && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5">
                          {t("dashboard.profile.phone")}
                        </label>
                        <input
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5">
                          {t("dashboard.profile.location")}
                        </label>
                        <input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-sky-400"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-primary hover:bg-brand-deep dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? (isId ? "Menyimpan..." : "Saving...") : isId ? "Simpan" : "Save"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>{isId ? "Batal" : "Cancel"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
                <Field icon={User} label={t("dashboard.profile.fullName")} value={name} />
                <Field icon={Mail} label={isInternal ? "Company email" : t("dashboard.profile.email")} value={email} />
                {isInternal ? (
                  <Field icon={ShieldCheck} label="Account type" value="Internal Employee" />
                ) : (
                  <>
                    <Field icon={Phone} label={t("dashboard.profile.phone")} value={phone} />
                    <Field icon={MapPin} label={t("dashboard.profile.location")} value={location} />
                  </>
                )}
              </div>
            )}
          </div>

          {isInternal ? (
            <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-sky-300 mb-4">
                Employment Information
              </h2>
              <div className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
                <Field label="Employee ID (NIK)" value={user?.employeeId || "—"} />
                <Field label="Department" value={user?.department || "—"} />
                <Field label="Position" value={user?.position || "—"} />
              </div>
            </div>
          ) : (
            <>
              {/* Interactive Education Card */}
              <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-sky-300">
                      {t("dashboard.profile.education")}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddingEdu((v) => !v)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 text-xs font-bold hover:bg-primary hover:text-white dark:hover:bg-sky-400 dark:hover:text-slate-950 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isId ? "Tambah" : "Add"}</span>
                  </button>
                </div>

                {addingEdu && (
                  <form onSubmit={handleAddEducation} className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        placeholder={isId ? "Universitas / Institusi" : "University / School"}
                        value={newSchool}
                        onChange={(e) => setNewSchool(e.target.value)}
                        required
                        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        placeholder={isId ? "Gelar / Jurusan" : "Degree / Major"}
                        value={newDegree}
                        onChange={(e) => setNewDegree(e.target.value)}
                        required
                        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        placeholder={isId ? "Tahun Lulus" : "Graduation Year"}
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="h-8 px-4 rounded-lg bg-primary dark:bg-sky-500 text-white dark:text-slate-950 text-xs font-bold cursor-pointer">
                        {isId ? "Simpan" : "Save"}
                      </button>
                      <button type="button" onClick={() => setAddingEdu(false)} className="h-8 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                        {isId ? "Batal" : "Cancel"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {educationList.map((e, idx) => (
                    <div
                      key={`${e.school}-${idx}`}
                      className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:border-primary/40 dark:hover:border-sky-400/40 flex items-center justify-between gap-3 transition-all"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{e.school}</div>
                        <div className="text-[13px] text-slate-600 dark:text-slate-300">
                          {e.degree} · <span className="font-mono text-xs">{e.year}</span>
                        </div>
                      </div>
                      {educationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setEducationList((prev) => prev.filter((_, i) => i !== idx))}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-all cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Experience Card */}
              <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-sky-300">
                      {t("dashboard.profile.experience")}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddingExp((v) => !v)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 text-xs font-bold hover:bg-primary hover:text-white dark:hover:bg-sky-400 dark:hover:text-slate-950 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isId ? "Tambah" : "Add"}</span>
                  </button>
                </div>

                {addingExp && (
                  <form onSubmit={handleAddExperience} className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        placeholder={isId ? "Posisi / Jabatan" : "Job Title / Role"}
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        required
                        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        placeholder={isId ? "Nama Perusahaan" : "Company Name"}
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        required
                        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        placeholder={isId ? "Periode (mis. 2023 – 2025)" : "Period (e.g. 2023 – 2025)"}
                        value={newPeriod}
                        onChange={(e) => setNewPeriod(e.target.value)}
                        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="h-8 px-4 rounded-lg bg-primary dark:bg-sky-500 text-white dark:text-slate-950 text-xs font-bold cursor-pointer">
                        {isId ? "Simpan" : "Save"}
                      </button>
                      <button type="button" onClick={() => setAddingExp(false)} className="h-8 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                        {isId ? "Batal" : "Cancel"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {experienceList.map((e, idx) => (
                    <div
                      key={`${e.company}-${idx}`}
                      className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:border-primary/40 dark:hover:border-sky-400/40 flex items-center justify-between gap-3 transition-all"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {e.role} · <span className="text-primary dark:text-sky-300">{e.company}</span>
                        </div>
                        <div className="text-[13px] text-slate-600 dark:text-slate-300">{e.period}</div>
                      </div>
                      {experienceList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setExperienceList((prev) => prev.filter((_, i) => i !== idx))}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-all cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Profile Summary Avatar Card */}
        <div className="rounded-2xl bg-white dark:bg-[#13213a] border border-slate-200/80 dark:border-slate-700/80 p-6 text-center h-fit shadow-xs">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-brand-deep dark:from-sky-500 dark:to-blue-600 text-white grid place-items-center text-3xl font-bold font-display shadow-md">
            {initials(name)}
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-white dark:ring-[#13213a]" />
          </div>
          <div className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            {isInternal ? user?.department || "PT Widatra Bhakti" : location}
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isInternal ? "Verified Internal Account" : "Verified Applicant"}</span>
          </div>

          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setFormName(name);
                setFormEmail(email);
                setFormPhone(phone);
                setEditing(true);
              }}
              className="w-full h-10 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 hover:bg-primary hover:text-white dark:hover:bg-sky-400 dark:hover:text-slate-950 text-[11px] font-bold uppercase tracking-[0.18em] transition-all cursor-pointer"
            >
              {t("dashboard.profile.editContactInfo")}
            </button>
            <Link
              to="/applicant/security"
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 grid place-items-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200 hover:border-primary dark:hover:border-sky-400 hover:text-primary dark:hover:text-sky-300 transition-all"
            >
              {isId ? "Keamanan & Kata Sandi" : "Security & Password"}
            </Link>
          </div>
        </div>
      </div>
    </ApplicantShell>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 py-3 text-sm items-center">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />}
        <span>{label}</span>
      </div>
      <div className="sm:col-span-2 font-semibold text-slate-900 dark:text-white break-all">
        {value}
      </div>
    </div>
  );
}
