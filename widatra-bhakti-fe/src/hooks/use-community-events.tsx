import { useCallback, useEffect, useState } from "react";
import {
  getAdminQueueEvents,
  getEventsForUser,
  initCommunityEventsStore,
  initMyCommunityEventsStore,
  onCommunityEventsStoreChange,
  refreshCommunityEventsStore,
  type StoredCommunityEvent,
} from "@/lib/community-events-store";

/** Admin — Community Event Approval queue. */
export function useAdminCommunityEvents() {
  const [events, setEvents] = useState<StoredCommunityEvent[]>([]);

  const refresh = useCallback(() => {
    setEvents(getAdminQueueEvents());
  }, []);

  useEffect(() => {
    initCommunityEventsStore();
    refresh();
    const unsubscribe = onCommunityEventsStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  const hardRefresh = useCallback(async () => {
    await refreshCommunityEventsStore();
    refresh();
  }, [refresh]);

  return { events, refresh: hardRefresh };
}

/** Internal Employee — "My Event Submissions". */
export function useMyCommunityEvents(userId?: string) {
  const [events, setEvents] = useState<StoredCommunityEvent[]>([]);

  const refresh = useCallback(() => {
    setEvents(userId ? getEventsForUser(userId) : []);
  }, [userId]);

  useEffect(() => {
    initMyCommunityEventsStore();
    refresh();
    const unsubscribe = onCommunityEventsStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  const hardRefresh = useCallback(async () => {
    await refreshCommunityEventsStore();
    refresh();
  }, [refresh]);

  return { events, refresh: hardRefresh };
}
