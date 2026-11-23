// Real authentication store — talks to the Laravel Sanctum API.
// Replaces the old localStorage mock. Token is kept in localStorage so the
// session survives reloads; the authoritative user record always comes
// from the backend (/auth/me, /auth/login, ...).

import { api, ApiError, getToken, setToken, onAuthStoreChange as onTokenChange } from "@/lib/api-client";

export type AccountType = "internal" | "external";

export type UserRole =
  | "Guest / Visitor"
  | "Internal Employee"
  | "External User"
  | "Super Admin"
  | "Content Admin"
  | "HR Manager"
  | "Event Moderator"
  | "Factory Tour Admin"
  | "Administrator"
  | "Content Editor"
  | "CSR Coordinator";

export type AccountStatus = "Active" | "Disabled";

export type PublicUser = {
  id: string;
  accountType: AccountType;
  role: UserRole;
  status: AccountStatus;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  employeeId?: string;
  department?: string;
  position?: string;
};

export type AuthResult =
  | { ok: true; user: PublicUser }
  | { ok: false; error: string };

type ApiUser = {
  id: string;
  account_type: AccountType;
  role: UserRole;
  status: AccountStatus;
  name: string;
  email: string;
  phone: string | null;
  employee_id: string | null;
  department: string | null;
  position: string | null;
  created_at: string | null;
};

function mapUser(u: ApiUser): PublicUser {
  return {
    id: u.id,
    accountType: u.account_type,
    role: u.role,
    status: u.status,
    name: u.name,
    email: u.email,
    phone: u.phone ?? "",
    createdAt: u.created_at ?? "",
    employeeId: u.employee_id ?? undefined,
    department: u.department ?? undefined,
    position: u.position ?? undefined,
  };
}

const CACHE_KEY = "widatra_auth_user_cache_v1";

function cacheUser(user: PublicUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(CACHE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(CACHE_KEY);
}

function readCachedUser(): PublicUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as PublicUser) : null;
  } catch {
    return null;
  }
}

export { onTokenChange as onAuthStoreChange };

/** No-op kept for call-site compatibility; session is now driven by the API. */
export function initAuthStore() {}

/** Synchronous read of the last-known session (used for optimistic UI / route guards). */
export function getCurrentUser(): PublicUser | null {
  if (typeof window === "undefined") return null;
  if (!getToken()) return null;
  return readCachedUser();
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/** Authoritative check against the backend — call on app/route init. */
export async function refreshCurrentUser(): Promise<PublicUser | null> {
  if (!getToken()) {
    cacheUser(null);
    return null;
  }
  try {
    const apiUser = await api.get<ApiUser>("/auth/me");
    const user = mapUser(apiUser);
    cacheUser(user);
    return user;
  } catch {
    setToken(null);
    cacheUser(null);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Registration / Login                                                */
/* ------------------------------------------------------------------ */

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  try {
    const res = await api.post<{ user: ApiUser; token: string }>("/auth/register", {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      password: input.password,
      password_confirmation: input.password,
    });
    setToken(res.token);
    const user = mapUser(res.user);
    cacheUser(user);
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Registration failed." };
  }
}

export type RegisterInternalInput = {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  password: string;
};

export async function registerInternalUser(input: RegisterInternalInput): Promise<AuthResult> {
  try {
    const res = await api.post<{ user: ApiUser; token: string }>("/auth/register/internal", {
      name: input.name.trim(),
      employee_id: input.employeeId.trim(),
      department: input.department.trim(),
      position: input.position.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      password_confirmation: input.password,
    });
    setToken(res.token);
    const user = mapUser(res.user);
    cacheUser(user);
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Registration failed." };
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await api.post<{ user: ApiUser; token: string }>("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    setToken(res.token);
    const user = mapUser(res.user);
    cacheUser(user);
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Incorrect email or password. Please try again." };
  }
}

/** Admin & HR console sign-in — Employee ID + Password. */
export async function adminLogin(employeeId: string, password: string): Promise<AuthResult> {
  try {
    const res = await api.post<{ user: ApiUser; token: string }>("/auth/admin/login", {
      employee_id: employeeId.trim(),
      password,
    });
    setToken(res.token);
    const user = mapUser(res.user);
    cacheUser(user);
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Incorrect employee ID or password." };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    if (getToken()) await api.post("/auth/logout");
  } catch {
    // ignore network errors on logout — clear local session regardless
  } finally {
    setToken(null);
    cacheUser(null);
  }
}

export async function updateProfile(
  _userId: string,
  updates: Partial<Pick<PublicUser, "name" | "phone" | "email" | "department" | "position">>
): Promise<AuthResult> {
  try {
    const body: Record<string, string> = {};
    if (updates.name) body.name = updates.name.trim();
    if (updates.phone !== undefined) body.phone = updates.phone.trim();
    if (updates.email) body.email = updates.email.trim().toLowerCase();
    if (updates.department) body.department = updates.department.trim();
    if (updates.position) body.position = updates.position.trim();

    const apiUser = await api.patch<ApiUser>("/auth/profile", body);
    const user = mapUser(apiUser);
    cacheUser(user);
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Could not update profile." };
  }
}

export async function changePassword(
  _userId: string,
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    await api.post("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    });
    const user = getCurrentUser();
    return user ? { ok: true, user } : { ok: false, error: "Session expired. Please sign in again." };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Could not update password." };
  }
}

/* ------------------------------------------------------------------ */
/* Admin — Users & Role Management                                     */
/* ------------------------------------------------------------------ */

export async function getAllUsers(): Promise<PublicUser[]> {
  const users = await api.get<ApiUser[]>("/admin/users");
  return users.map(mapUser);
}

export async function adminUpdateUserRole(userId: string, role: UserRole): Promise<AuthResult> {
  try {
    const apiUser = await api.patch<ApiUser>(`/admin/users/${userId}/role`, { role });
    return { ok: true, user: mapUser(apiUser) };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Could not update role." };
  }
}

export async function adminSetAccountStatus(userId: string, status: AccountStatus): Promise<AuthResult> {
  try {
    const apiUser = await api.patch<ApiUser>(`/admin/users/${userId}/status`, { status });
    return { ok: true, user: mapUser(apiUser) };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Could not update status." };
  }
}

/* ------------------------------------------------------------------ */
/* Forgot / reset password                                             */
/* ------------------------------------------------------------------ */

export async function requestPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Could not send reset link." };
  }
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    await api.post("/auth/reset-password", {
      email: email.trim().toLowerCase(),
      token,
      password: newPassword,
      password_confirmation: newPassword,
    });
    return { ok: true, user: getCurrentUser() as PublicUser };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.firstError : "Could not reset password." };
  }
}
