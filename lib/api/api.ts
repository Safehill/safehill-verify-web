import axios, { type AxiosRequestConfig } from 'axios';

// Global mock flag for S3 uploads only
export const USE_MOCK_UPLOAD = false;

// Logout callback - will be set by AuthProvider
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: (() => void) | null) => {
  logoutCallback = callback;
};

// Use server-side or client-side environment variable
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8080' ||
  'https://safehill-stage-1-ec0cd53b3592.herokuapp.com';
export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_BASE_URL ||
  'ws://localhost:8080' ||
  'wss://safehill-stage-1-ec0cd53b3592.herokuapp.com';
export const API_KEY = process.env.API_KEY || '';

// Create singleton Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // Optional: send cookies if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add x-api-key to every request
// api.interceptors.request.use(
//   (config) => {
//
//     const apiKey = import.meta.env.VITE_API_KEY;
//
//     if (apiKey) {
//       config.headers["x-api-key"] = apiKey;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses by logging out
    if (error.response?.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper function for unauthenticated requests
export const createUnauthenticatedRequest = <T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  switch (method) {
    case 'get':
      return api.get<T>(url, config).then((response) => response.data);
    case 'post':
      return api.post<T>(url, data, config).then((response) => response.data);
    case 'put':
      return api.put<T>(url, data, config).then((response) => response.data);
    case 'delete':
      return api.delete<T>(url, config).then((response) => response.data);
    case 'patch':
      return api.patch<T>(url, data, config).then((response) => response.data);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

// Helper function to reduce API duplication
export const createAuthenticatedRequest = <T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  authedSession: { authToken: string },
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const headers = {
    Authorization: `Bearer ${authedSession.authToken}`,
    ...config?.headers,
  };

  const requestConfig = {
    ...config,
    headers,
  };

  const makeRequest = async (): Promise<T> => {
    try {
      switch (method) {
        case 'get':
          return api
            .get<T>(url, requestConfig)
            .then((response) => response.data);
        case 'post':
          return api
            .post<T>(url, data, requestConfig)
            .then((response) => response.data);
        case 'put':
          return api
            .put<T>(url, data, requestConfig)
            .then((response) => response.data);
        case 'delete':
          return api
            .delete<T>(url, requestConfig)
            .then((response) => response.data);
        case 'patch':
          return api
            .patch<T>(url, data, requestConfig)
            .then((response) => response.data);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (error) {
      // Re-throw 401 errors immediately to ensure interceptor handles logout
      // Don't let calling code catch and suppress these
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw error;
      }
      // For all other errors, let them propagate normally
      throw error;
    }
  };

  return makeRequest();
};
