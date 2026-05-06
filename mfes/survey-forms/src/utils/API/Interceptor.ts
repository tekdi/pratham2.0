import axios from 'axios';
import { tenantId } from '../../../app.config';

// basePath '/plp-surveys' is hardcoded in next.config.js. Browser axios calls
// are origin-relative so we prefix it here — otherwise they hit the teachers
// shell which has no /api handler.
const instance = axios.create({
  baseURL: typeof window !== 'undefined' ? '/plp-surveys' : undefined,
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
