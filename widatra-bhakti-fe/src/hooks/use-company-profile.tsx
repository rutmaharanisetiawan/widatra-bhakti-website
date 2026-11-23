import { useCallback, useEffect, useState } from "react";
import {
  getCompanyProfile,
  initCompanyProfileStore,
  onCompanyProfileChange,
  type CompanyProfile,
} from "@/lib/cms-store";

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>(getCompanyProfile());

  const refresh = useCallback(() => {
    setProfile(getCompanyProfile());
  }, []);

  useEffect(() => {
    initCompanyProfileStore();
    refresh();
    const unsubscribe = onCompanyProfileChange(refresh);
    return unsubscribe;
  }, [refresh]);

  return { profile, refresh };
}
