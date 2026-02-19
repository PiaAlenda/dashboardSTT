import api from './api';
import type { User, Role } from '../types';

export interface AuthResponse {
    token: string;
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    username: string;
    role: string;
    deleted: boolean;
}

const mapRole = (backendRole: string): Role => {
    if (backendRole === 'ROLE_SUPER_ADMIN') return 'ROLE_SUPER_ADMIN';
    return backendRole as Role;
};

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', { username, password });
        const data = response.data;

        if (data.token) {
            localStorage.setItem('sube_token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            console.log("Token guardado y Header actualizado");
        }

        return data;
    },

    getMe: async (): Promise<User> => {
        // Verificamos si tenemos token antes de pedir nada
        const token = localStorage.getItem('sube_token');
        if (!token) {
            console.error("No hay token en localStorage para getMe");
            throw new Error("No hay sesión activa");
        }

        try {
            const response = await api.get<UserResponse>('/admin/users/me');
            const userData = response.data;

            localStorage.setItem('sube_user', JSON.stringify(userData));

            return {
                ...userData,
                role: mapRole(userData.role)
            };
        } catch (error: any) {
            console.error("Error en getMe detallado:", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                url: error.config?.url
            });
            throw error;
        }
    },

    register: async (userData: any): Promise<void> => {
        // Agregamos '/' inicial
        await api.post('/auth/register', userData);
    },

    logout: () => {
        localStorage.removeItem('sube_token');
        localStorage.removeItem('sube_user');
        window.location.href = '/auth/x82b9';
    }
};