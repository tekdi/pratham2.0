import axios, { AxiosError } from 'axios';
import { refresh } from './LoginService';
import TenantService from './TenantService';

// Define interfaces for custom error types
interface CustomError extends Error {
  originalError?: AxiosError;
  status?: number;
  response?: AxiosError['response'];
}

interface ValidationError {
  message?: string;
  [key: string]: unknown;
}

interface ErrorResponseData {
  errmsg?: string;
  errMsg?: string;
  error_message?: string;
  errorMessage?: string;
  message?: string;
  msg?: string;
  error?: string;
  result?: {
    errmsg?: string;
    errorMessage?: string;
  };
  params?: {
    errmsg?: string;
    errorMessage?: string;
  };
  errors?: Array<ValidationError | string>;
  validationErrors?: ValidationError[];
}

// Define interface for original request with retry flag
interface OriginalRequest {
  _retry?: boolean;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

// Helper function to extract error message from response data
const extractErrorMessage = (responseData: ErrorResponseData): string => {
  if (!responseData) return 'An error occurred';

  // Try different common error message fields
  const errorMessage =
    responseData.errmsg ||
    responseData.errMsg ||
    responseData.error_message ||
    responseData.errorMessage ||
    responseData.message ||
    responseData.msg ||
    responseData.error ||
    responseData.result?.errmsg ||
    responseData.result?.errorMessage ||
    responseData.params?.errmsg ||
    responseData.params?.errorMessage;

  if (errorMessage) return errorMessage;

  // Handle array of errors
  if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    const firstError = responseData.errors[0];
    return typeof firstError === 'string'
      ? firstError
      : firstError.message || 'Validation error';
  }

  // Handle validation errors
  if (
    responseData.validationErrors &&
    Array.isArray(responseData.validationErrors)
  ) {
    return responseData.validationErrors
      .map((err: ValidationError) => err.message || 'Validation error')
      .join(', ');
  }

  return 'An error occurred';
};

// Helper function to handle 401 authentication errors
const handle401Error = async (
  error: AxiosError,
  originalRequest: OriginalRequest
): Promise<unknown> => {
  const responseData = error.response?.data as ErrorResponseData & {
    responseCode?: number;
  };

  if (responseData?.responseCode !== 401 || originalRequest._retry) {
    return null;
  }

  if (error?.response?.request?.responseURL?.includes('/auth/refresh')) {
    window.location.href = '/logout';
    return Promise.reject(new Error('Authentication failed'));
  }

  originalRequest._retry = true;
  try {
    const accessToken = await refreshToken();
    if (!accessToken) {
      window.location.href = '/logout';
      return Promise.reject(new Error('Authentication failed'));
    }

    originalRequest.headers = originalRequest.headers || {};
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return instance(originalRequest);
  } catch (refreshError) {
    const refreshErr = new Error(
      refreshError instanceof Error
        ? refreshError.message
        : 'Token refresh failed'
    );
    return Promise.reject(refreshErr);
  }
};

// Helper function to create custom error with extracted message
const createCustomError = (error: AxiosError): CustomError => {
  if (!error.response) {
    throw new Error('Response is required to create custom error');
  }

  const { status, data } = error.response;
  const responseData = data as ErrorResponseData;

  const errorMessage = extractErrorMessage(responseData);

  const customError: CustomError = new Error(errorMessage);
  customError.name = `HTTP${status}Error`;
  customError.originalError = error;
  customError.status = status;
  customError.response = error.response;

  return customError;
};

const instance = axios.create();

const refreshToken = async (): Promise<string | null> => {
  const refresh_token = localStorage.getItem('refreshToken');
  if (refresh_token !== '' && refresh_token !== null) {
    try {
      const response = await refresh({ refresh_token });
      if (response) {
        const accessToken = response?.result?.access_token;
        const newRefreshToken = response?.result?.refresh_token;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        return accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Token refresh failed'
      );
    }
  }
  return null;
};

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token && config.url && !config.url.endsWith('user/v1/auth/login')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    config.headers.tenantid = TenantService.getTenantId();
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error('Request failed')
    );
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as OriginalRequest | undefined;

    // Handle 401 errors (authentication)
    if (originalRequest) {
      const authResult = await handle401Error(error, originalRequest);
      if (authResult !== null) return authResult;
    }

    // Handle other HTTP errors by extracting meaningful error messages
    if (error?.response) {
      return Promise.reject(createCustomError(error));
    }

    // Handle network errors or other non-response errors
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      const networkError: CustomError = new Error(
        'Network error. Please check your connection and try again.'
      );
      networkError.name = 'NetworkError';
      networkError.originalError = error;
      return Promise.reject(networkError);
    }

    // Fallback: create a proper Error object from the original error
    const fallbackError = new Error(
      error.message || 'An unknown error occurred'
    );
    return Promise.reject(fallbackError);
  }
);

export default instance;
