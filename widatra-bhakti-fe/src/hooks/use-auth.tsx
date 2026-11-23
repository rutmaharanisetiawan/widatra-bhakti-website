import { useCallback, useEffect, useState } from "react";
import {
  getCurrentUser,
  refreshCurrentUser,
  onAuthStoreChange,
  type PublicUser,
} from "@/lib/auth-store";

export function useAuth() {
  // Lazily initialized synchronously from the cached session so there is
  // never a flash of "not authenticated" content before the real check
  // resolves.
  const [user, setUser] = useState<PublicUser | null>(() => getCurrentUser());
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    let cancelled = false;
    refreshCurrentUser().then((u) => {
      if (!cancelled) {
        setUser(u);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  return { user, isAuthenticated: Boolean(user), ready, refresh };
}
