import axios from "axios";
import { clearStoredUser, loadStoredUser } from "../utils/storage";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  "https://lost-found-system-8q05.onrender.com/api";

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const user = loadStoredUser();

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredUser();
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(
      error.response?.data?.message
        ? new Error(error.response.data.message)
        : error
    );
  }
);

export const unwrap = async (request) => {
  const response = await request;
  return response.data?.data ?? response.data;
};

export default api;
