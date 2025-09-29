import axios from 'axios';

// Global mock flag for testing
export const USE_MOCK_API = true;

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
    return Promise.reject(error);
  }
);

export default api;

// Helper function for unauthenticated requests
export const createUnauthenticatedRequest = <T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data?: any,
  config?: any
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
  authenticatedUser: { authToken: string },
  data?: any,
  config?: any
): Promise<T> => {
  const headers = {
    Authorization: `Bearer ${authenticatedUser.authToken}`,
    ...config?.headers,
  };

  const requestConfig = {
    ...config,
    headers,
  };

  // Debug logging
  // console.debug('createAuthenticatedRequest debug:', {
  //   method,
  //   url,
  //   hasAuthToken: !!authenticatedUser.authToken,
  //   authTokenLength: authenticatedUser.authToken?.length || 0,
  //   authTokenPrefix: authenticatedUser.authToken?.substring(0, 10) + '...',
  //   headers: headers,
  // });

  switch (method) {
    case 'get':
      return api.get<T>(url, requestConfig).then((response) => response.data);
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
};
