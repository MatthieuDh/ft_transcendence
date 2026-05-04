import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const isUnauthorized = err.response?.status === 401;
    const isLoginRequest = err.config?.url?.includes('/auth/login');
    const isRefreshRequest = err.config?.url?.includes('/auth/refresh');
    const originalRequest = err.config;

    if (isUnauthorized && !isLoginRequest && !isRefreshRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return client.request(err.config);
      } catch {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default client;
