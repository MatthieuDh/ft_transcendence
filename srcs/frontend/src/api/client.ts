import axios from 'axios';

const client = axios.create({
    baseURL: '/api',
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
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
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