import axios from 'axios';

const rawUrl = import.meta.env.VITE_APP_ENV === 'prod'
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_TEST;

let baseUrl = rawUrl?.trim().endsWith('/') ? rawUrl.trim().slice(0, -1) : rawUrl?.trim();

if (baseUrl && !baseUrl.endsWith('/api/v1')) {
    baseUrl = `${baseUrl}/api/v1/`;
} else if (baseUrl && !baseUrl.endsWith('/')) {
    baseUrl = `${baseUrl}/`;
}

export const API_URL = baseUrl;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sube_token');

        if (token) {
            const isLogin = config.url?.includes('/auth/login');

            if (!isLogin) {
                config.headers.Authorization = `Bearer ${token}`;
                if (config.url?.includes('/auth/register')) {
                    console.log("Token adjuntado a /auth/register:", !!config.headers.Authorization);
                }
            }
        }

        if (import.meta.env.VITE_APP_ENV !== 'prod') {
            console.log(`Petición a: ${config.baseURL}${config.url}`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejo de sesión expirada
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            localStorage.removeItem('sube_token');
            localStorage.removeItem('sube_user');
            if (window.location.pathname !== '/auth/x82b9') {
                window.location.href = '/auth/x82b9';
            }
        }
        return Promise.reject(error);
    }
);

export default api;