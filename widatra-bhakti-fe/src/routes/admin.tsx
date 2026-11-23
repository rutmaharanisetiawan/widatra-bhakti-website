import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { refreshCurrentUser, type UserRole } from "@/lib/auth-store";

const ADMIN_ROLES: UserRole[] = [
  "Super Admin",
  "Content Admin",
  "HR Manager",
  "Event Moderator",
  "Factory Tour Admin",
  "Administrator",
  "Content Editor",
  "CSR Coordinator",
];

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    // The sign-in page itself must never be gated, or every redirect to it
    // would immediately bounce back here (infinite redirect loop).
    if (location.pathname === "/admin/login") return;

    const user = await refreshCurrentUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: () => <Outlet />,
});