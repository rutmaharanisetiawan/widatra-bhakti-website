import { useCallback, useEffect, useState } from "react";
import {
  getFactoryTourContent,
  initFactoryTourContentStore,
  onFactoryTourContentChange,
  type FactoryTourContent,
} from "@/lib/factory-tour-content-store";

export function useFactoryTourContent() {
  const [content, setContent] = useState<FactoryTourContent>(getFactoryTourContent());

  const refresh = useCallback(() => {
    setContent(getFactoryTourContent());
  }, []);

  useEffect(() => {
    initFactoryTourContentStore();
    refresh();
    const unsubscribe = onFactoryTourContentChange(refresh);
    return unsubscribe;
  }, [refresh]);

  return { content, refresh };
}
