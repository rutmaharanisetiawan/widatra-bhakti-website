import { useCallback, useEffect, useState } from "react";
import {
  getAllCsrPrograms,
  getPublishedCsrPrograms,
  initCsrStore,
  initCsrAdminStore,
  onCsrStoreChange,
  refreshCsrStore,
} from "@/lib/csr-store";
import type { CsrProgram } from "@/lib/csr-data";

/** All CSR programs including drafts — for the Admin module. */
export function useAllCsrPrograms() {
  const [programs, setPrograms] = useState<CsrProgram[]>([]);

  const refresh = useCallback(() => {
    setPrograms(getAllCsrPrograms());
  }, []);

  useEffect(() => {
    initCsrAdminStore();
    refresh();
    const unsubscribe = onCsrStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  const hardRefresh = useCallback(async () => {
    await refreshCsrStore();
    refresh();
  }, [refresh]);

  return { programs, refresh: hardRefresh };
}

/** Only published programs — for the public CSR page. */
export function usePublishedCsrPrograms() {
  const [programs, setPrograms] = useState<CsrProgram[]>([]);

  const refresh = useCallback(() => {
    setPrograms(getPublishedCsrPrograms());
  }, []);

  useEffect(() => {
    initCsrStore();
    refresh();
    const unsubscribe = onCsrStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  return { programs, refresh };
}
