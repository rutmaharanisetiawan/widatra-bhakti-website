import { useCallback, useEffect, useState } from "react";
import {
  getAllJobs,
  getPublishedJobs,
  initJobsStore,
  initJobsAdminStore,
  onJobsStoreChange,
  refreshJobsStore,
} from "@/lib/jobs-store";
import type { Job } from "@/lib/jobs-data";

/** All jobs including drafts — for the Admin Careers & ATS module. */
export function useAllJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const refresh = useCallback(() => {
    setJobs(getAllJobs());
  }, []);

  useEffect(() => {
    initJobsAdminStore();
    refresh();
    const unsubscribe = onJobsStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  const hardRefresh = useCallback(async () => {
    await refreshJobsStore();
    refresh();
  }, [refresh]);

  return { jobs, refresh: hardRefresh };
}

/** Only published jobs — for the public Careers page and job detail page. */
export function usePublishedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const refresh = useCallback(() => {
    setJobs(getPublishedJobs());
  }, []);

  useEffect(() => {
    initJobsStore();
    refresh();
    const unsubscribe = onJobsStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  return { jobs, refresh };
}
