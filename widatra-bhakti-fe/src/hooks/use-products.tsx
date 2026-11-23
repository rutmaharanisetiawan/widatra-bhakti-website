import { useCallback, useEffect, useState } from "react";
import { getAllProducts, initProductsStore, onProductsStoreChange, refreshProductsStore } from "@/lib/products-store";
import type { Product } from "@/lib/products-data";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const refresh = useCallback(() => {
    setProducts(getAllProducts());
  }, []);

  useEffect(() => {
    initProductsStore();
    refresh();
    const unsubscribe = onProductsStoreChange(refresh);
    return unsubscribe;
  }, [refresh]);

  const hardRefresh = useCallback(async () => {
    await refreshProductsStore();
    refresh();
  }, [refresh]);

  return { products, refresh: hardRefresh };
}
