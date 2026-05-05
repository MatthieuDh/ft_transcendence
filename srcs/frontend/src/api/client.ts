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
    const originalRequest = err.config;

    if (isUnauthorized && !isLoginRequest && !isRefreshRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {
          refresh_token: localStorage.getItem('refresh_token'),
        }, { withCredentials: true });

        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        return client.request(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default client;