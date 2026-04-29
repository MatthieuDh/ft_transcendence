import axios from 'axios';

const client = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

client.interceptors.response.use(
    (res) =>  res,
    async (err) => {
        if (err.response?.status === 401){
            try {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {}, {withCredentials: true});
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

