import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, StatusPill } from "@/components/admin-shell";
import { Search, X, Building2, UserRound } from "lucide-react";
import {
  getAllUsers,
  adminUpdateUserRole,
  adminSetAccountStatus,
  type PublicUser,
  type AccountType,
  type UserRole,
  type AccountStatus,
} from "@/lib/auth-store";
import { useEffect, useCallback } from "react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users & Roles — Admin" }] }),
  component: AdminUsersPage,
});

const ROLE_OPTIONS: UserRole[] = [
  "Super Admin",
  "Content Admin",
  "HR Manager",
  "Event Moderator",
  "Factory Tour Admin",
  "Internal Employee",
  "External User",
  "Administrator",
  "Content Editor",
  "CSR Coordinator",
];

const ACCOUNT_TYPE_FILTERS: Array<{ value: AccountType | "All"; label: string }> = [
  { value: "All", label: "All Accounts" },
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
];

function useAllUsers() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return { users, loading, reload: load };
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function AccountTypeBadge({ type }: { type: AccountType }) {
  const isInternal = type === "internal";
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold ${
        isInternal
          ? "bg-brand-tint text-primary"
          : "bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-muted-foreground"
      }`}
    >
      {isInternal ? <Building2 className="w-3 h-3" /> : <UserRound className="w-3 h-3" />}
      {isInternal ? "Internal" : "External"}
    </span>
  );
}

function AdminUsersPage() {
  const { users, reload } = useAllUsers();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AccountType | "All">("All");
  const [viewing, setViewing] = useState<PublicUser | null>(null);
  const [editingRole, setEditingRole] = useState<PublicUser | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesType = typeFilter === "All" || u.accountType === typeFilter;
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        (u.department ?? "").toLowerCase().includes(q) ||
        (u.employeeId ?? "").toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [users, search, typeFilter]);

  async function handleToggleStatus(u: PublicUser) {
    const next: AccountStatus = u.status === "Active" ? "Disabled" : "Active";
    await adminSetAccountStatus(u.id, next);
    reload();
  }

  async function handleRoleChange(u: PublicUser, role: UserRole) {
    await adminUpdateUserRole(u.id, role);
    setEditingRole(null);
    reload();
  }

  const internalCount = users.filter((u) => u.accountType === "internal").length;
  const externalCount = users.filter((u) => u.accountType === "external").length;

  return (
    <AdminShell
      title="Users & Role Management"
      subtitle="Internal employees and external users with access to the Widatra portal."
      actions={
        <div className="inline-flex items-center h-10 px-4 border border-hairline text-[11px] font-semibold uppercase tracking-[0.18em] text-corporate-gray rounded">
          {internalCount} Internal &middot; {externalCount} External
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-sm h-10 px-3 border border-hairline rounded bg-white dark:bg-card">
          <Search className="w-4 h-4 text-corporate-gray shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role, department..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-corporate-gray"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-corporate-gray hover:text-primary">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {ACCOUNT_TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`h-9 px-3.5 rounded text-[11px] font-semibold uppercase tracking-[0.14em] border transition-colors ${
                typeFilter === f.value
                  ? "bg-primary text-white border-primary"
                  : "border-hairline text-corporate-gray hover:border-primary hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-soft text-[11px] uppercase tracking-[0.18em] text-corporate-gray">
              <th className="text-left px-5 py-3 font-semibold">Name</th>
              <th className="text-left px-5 py-3 font-semibold">Email</th>
              <th className="text-left px-5 py-3 font-semibold">Account Type</th>
              <th className="text-left px-5 py-3 font-semibold">Role</th>
              <th className="text-left px-5 py-3 font-semibold">Status</th>
              <th className="text-left px-5 py-3 font-semibold">Joined</th>
              <th className="text-left px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-hairline hover:bg-brand-soft/50">
                <td className="px-5 py-3.5 font-medium">{u.name}</td>
                <td className="px-5 py-3.5 text-corporate-gray">{u.email}</td>
                <td className="px-5 py-3.5"><AccountTypeBadge type={u.accountType} /></td>
                <td className="px-5 py-3.5">
                  {editingRole?.id === u.id ? (
                    <select
                      autoFocus
                      defaultValue={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                      onBlur={() => setEditingRole(null)}
                      className="h-8 px-2 border border-hairline rounded text-[12px] bg-white dark:bg-card focus:outline-none focus:border-primary"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingRole(u)}
                      className="text-[13px] hover:text-primary hover:underline"
                      title="Edit role (UI only)"
                    >
                      {u.role}
                    </button>
                  )}
                </td>
                <td className="px-5 py-3.5"><StatusPill status={u.status === "Active" ? "Active" : "Inactive"} label={u.status} /></td>
                <td className="px-5 py-3.5 text-corporate-gray">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewing(u)} className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline">
                      View
                    </button>
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`text-[11px] font-bold uppercase tracking-[0.18em] hover:underline ${
                        u.status === "Active" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {u.status === "Active" ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-sm text-corporate-gray py-14">No users match your search.</div>
        )}
      </div>

      <div className="mt-6 card-elevated p-6">
        <div className="eyebrow text-primary mb-3">Roles</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { r: "Super Admin", d: "Mengelola seluruh sistem dan semua permission" },
            { r: "Content Admin", d: "Products, News & Events, CSR, Company CMS, Media Library" },
            { r: "HR Manager", d: "Career, Job Posting, Applicant, ATS" },
            { r: "Event Moderator", d: "Review, Approve / Reject Community Event" },
            { r: "Factory Tour Admin", d: "Mengelola dan menyetujui booking kunjungan pabrik" },
            { r: "Internal Employee", d: "Submit Event, My Event Submissions, Profile, Notifications (No ATS / Tour)" },
            { r: "External User", d: "Career / ATS, Job Applications, Factory Tour Booking, Profile, Notifications (No Submit Event)" },
          ].map((x) => (
            <div key={x.r} className="p-4 border border-hairline rounded">
              <div className="font-semibold">{x.r}</div>
              <div className="text-[12px] text-corporate-gray mt-1">{x.d}</div>
            </div>
          ))}
        </div>
      </div>

      {viewing && (
        <div
          className="fixed inset-0 z-[70] bg-corporate-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setViewing(null); }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-card max-w-lg w-full my-10 rounded-2xl overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setViewing(null)}
              className="absolute top-4 right-5 w-9 h-9 grid place-items-center rounded-full text-corporate-gray hover:text-corporate-black dark:hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary text-white grid place-items-center text-lg font-semibold">
                  {viewing.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-semibold font-display">{viewing.name}</div>
                  <div className="text-[12px] text-corporate-gray">{viewing.email}</div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <ProfileRow label="Account Type" value={viewing.accountType === "internal" ? "Internal Employee" : "External User"} />
                <ProfileRow label="Role" value={viewing.role} />
                <ProfileRow label="Status" value={viewing.status} />
                <ProfileRow label="Joined" value={formatDate(viewing.createdAt)} />
                {viewing.accountType === "internal" ? (
                  <>
                    <ProfileRow label="Employee ID (NIK)" value={viewing.employeeId || "—"} />
                    <ProfileRow label="Department" value={viewing.department || "—"} />
                    <ProfileRow label="Position" value={viewing.position || "—"} />
                  </>
                ) : (
                  <ProfileRow label="Phone" value={viewing.phone || "—"} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2 border-b border-hairline/70">
      <div className="text-corporate-gray">{label}</div>
      <div className="col-span-2 font-medium">{value}</div>
    </div>
  );
}
