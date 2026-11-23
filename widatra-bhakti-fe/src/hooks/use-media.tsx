import { useCallback, useEffect, useState } from "react";
import { getAllMedia, initMediaStore, onMediaStoreChange, type MediaAsset } from "@/lib/media-store";

export function useMedia() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  const refresh = useCallback(() => {
    setAssets(getAllMedia());
  }, []);

  useEffect(() => {
    initMediaStore();
    refresh();
    const unsubscribe = onMediaStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  return { assets, refresh };
}
