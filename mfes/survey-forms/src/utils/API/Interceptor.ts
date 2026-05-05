import axios from 'axios';
import { tenantId } from '../../../app.config';

// basePath is '/plp-surveys' in next.config.js. Browser axios calls use
// origin-relative paths so we must prefix the basePath; otherwise requests
// hit the teachers shell (port 3001) which has no /api handler.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/plp-surveys';

// Relative /api/v1/... — survey-forms Next.js rewrites proxy to the Nest survey API upstream.
const instance = axios.create({
  baseURL: typeof window !== 'undefined' ? BASE_PATH : undefined,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token && config.url && !config.url.endsWith('user/v1/auth/login')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const academicYearId = localStorage.getItem('academicYearId');
      if (academicYearId) {
        config.headers.academicyearid = academicYearId;
      }
    }
    config.headers.tenantid = tenantId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error?.response?.data?.responseCode === 401 &&
      !originalRequest._retry
    ) {
      if (error?.response?.request?.responseURL.includes('/auth/refresh')) {
        window.location.href = '/logout';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
