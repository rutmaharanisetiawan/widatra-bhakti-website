import { useCallback, useEffect, useState } from "react";
import {
  getAllApplications,
  getMyApplications,
  initAtsStore,
  initMyApplicationsStore,
  onAtsStoreChange,
  refreshAtsStore,
  type StoredApplication,
} from "@/lib/ats-store";
import { useAuth } from "@/hooks/use-auth";

const HR_ROLES = ["Super Admin", "Administrator", "HR Manager"];

/**
 * Loads the applications relevant to the signed-in viewer: HR/Admin see
 * every application (GET /applications); everyone else sees only their own
 * (GET /applications/mine, already scoped server-side).
 */
export function useAtsApplications() {
  const { user } = useAuth();
  const isHr = !!user && HR_ROLES.includes(user.role);
  const [applications, setApplications] = useState<StoredApplication[]>([]);

  const refresh = useCallback(() => {
    setApplications(isHr ? getAllApplications() : getMyApplications());
  }, [isHr]);

  useEffect(() => {
    if (isHr) initAtsStore();
    else initMyApplicationsStore();
    refresh();
    const unsubscribe = onAtsStoreChange(refresh);
    return unsubscribe;
  }, [isHr, refresh]);

  const hardRefresh = useCallback(async () => {
    await refreshAtsStore();
    refresh();
  }, [refresh]);

  return { applications, refresh: hardRefresh };
}
