import { useCallback, useEffect, useState } from "react";
import {
  getAllArticles,
  getPublishedArticles,
  initNewsStore,
  initNewsAdminStore,
  onNewsStoreChange,
  refreshNewsStore,
} from "@/lib/news-store";
import type { Article } from "@/lib/news-data";

/** All articles including drafts — for the Admin module. */
export function useAllArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  const refresh = useCallback(() => {
    setArticles(getAllArticles());
  }, []);

  useEffect(() => {
    initNewsAdminStore();
    refresh();
    const unsubscribe = onNewsStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  const hardRefresh = useCallback(async () => {
    await refreshNewsStore();
    refresh();
  }, [refresh]);

  return { articles, refresh: hardRefresh };
}

/** Only published articles — for the public News & Event page. */
export function usePublishedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  const refresh = useCallback(() => {
    setArticles(getPublishedArticles());
  }, []);

  useEffect(() => {
    initNewsStore();
    refresh();
    const unsubscribe = onNewsStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  return { articles, refresh };
}
