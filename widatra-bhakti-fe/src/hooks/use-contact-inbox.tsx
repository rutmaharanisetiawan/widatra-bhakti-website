import { useCallback, useEffect, useState } from "react";
import {
  getAllContactInquiries,
  getUnreadContactCount,
  initContactStore,
  onContactStoreChange,
  refreshContactStore,
} from "@/lib/contact-store";
import type { ContactInquiry } from "@/lib/contact-data";

/**
 * All Contact Inbox items + live unread count. Used by the Admin Contact
 * Inbox page, the sidebar badge and the Overview dashboard.
 */
export function useContactInbox(enabled = true) {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(() => {
    setInquiries(getAllContactInquiries());
    setUnreadCount(getUnreadContactCount());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    initContactStore();
    refresh();
    const unsubscribe = onContactStoreChange(refresh);
    return unsubscribe;
  }, [enabled, refresh]);

  const hardRefresh = useCallback(async () => {
    if (!enabled) return;
    await refreshContactStore();
    refresh();
  }, [enabled, refresh]);

  return { inquiries, unreadCount, refresh: hardRefresh };
}

/** Lightweight variant for places that only need the live unread badge count. */
export function useUnreadContactCount(enabled = true) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(() => {
    setUnreadCount(getUnreadContactCount());
  }, []);

  useEffect(() => {
    if (!enabled) {
      setUnreadCount(0);
      return;
    }
    initContactStore();
    refresh();
    const unsubscribe = onContactStoreChange(refresh);
    return unsubscribe;
  }, [enabled, refresh]);

  return unreadCount;
}
