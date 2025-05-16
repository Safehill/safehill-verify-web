import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;