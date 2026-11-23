import { useCallback, useEffect, useState } from "react";
import { getAllBookings, initTourStore, onTourStoreChange, refreshTourStore, type StoredTourBooking } from "@/lib/tour-store";

export function useTourBookings(enabled = true) {
  const [bookings, setBookings] = useState<StoredTourBooking[]>([]);

  const refresh = useCallback(() => {
    setBookings(getAllBookings());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    initTourStore();
    refresh();
    const unsubscribe = onTourStoreChange(refresh);
    return unsubscribe;
  }, [enabled, refresh]);

  const hardRefresh = useCallback(async () => {
    if (!enabled) return;
    await refreshTourStore();
    refresh();
  }, [enabled, refresh]);

  return { bookings, refresh: hardRefresh };
}
