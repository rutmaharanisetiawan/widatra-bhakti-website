import { createFileRoute, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { refreshCurrentUser } from "@/lib/auth-store";

export const Route = createFileRoute("/applicant")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const user = await refreshCurrentUser();
    if (!user) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
