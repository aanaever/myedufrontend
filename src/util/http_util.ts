import axios, { AxiosError } from "axios";
import { ElMessage } from "element-plus";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_ROOT_URL;

/** global axios instance */
const httpUtil = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "X-Requested-With": "XMLHttpRequest"
  },
  timeout: 15000, // 15 seconds
  withCredentials: true
});

// Добавление токена в заголовки запросов, если он существует
httpUtil.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// global simple Axios error handler
export function handleApiError(err: AxiosError | unknown) {
  // @ts-ignore
  const msg = err.response?.data?.message ?? err.message;
  ElMessage.error(msg);
  console.error("AXIOS", msg);
}

export { httpUtil }; // Экспортируем только один раз и только здесь
