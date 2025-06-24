import axios from 'axios';

// Use server-side or client-side environment variable
export const API_BASE_URL = (
  process.env.API_BASE_URL
  || 'http://localhost:8080'
  || 'https://safehill-stage-1-ec0cd53b3592.herokuapp.com'
);
export const WS_BASE_URL = (
  process.env.WS_BASE_URL
  || 'ws://localhost:8080'
  || 'wss://safehill-stage-1-ec0cd53b3592.herokuapp.com'
);
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

export default api
