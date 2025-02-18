import { useEffect, useState } from "react";
import TenantService from "@workspace/services/TenantService";
import { TenantConfig } from "@workspace/utils/fetchTenantConfig";

const useTenantConfig = () => {
  const [tenantConfig, setTenantConfig] = useState<TenantConfig>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await TenantService.getTenantConfig();
        setTenantConfig(config);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConfig();
  }, []);

  return tenantConfig;
};

export default useTenantConfig;
