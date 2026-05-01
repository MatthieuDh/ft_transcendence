import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost ? "http://localhost:3000" : "https://34.79.48.4.nip.io/api";

const client = axios.create({
    baseURL: API_URL,
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

    if (isUnauthorized && !isLoginRequest && !isRefreshRequest) {
      try {
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
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
