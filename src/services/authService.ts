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
    // Aseguramos que el rol coincida con el enum de tu frontend
    if (backendRole === 'ROLE_SUPER_ADMIN') return 'ROLE_SUPER_ADMIN';
    return backendRole as Role;
};

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', { username, password });
        const data = response.data;

        if (data.token) {
            localStorage.setItem('sube_token', data.token);
            // No es estrictamente necesario setear defaults si usas interceptores, 
            // pero ayuda a la consistencia.
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }

        return data;
    },

    getMe: async (): Promise<User> => {
        const token = localStorage.getItem('sube_token');
        if (!token) throw new Error("No hay sesión activa");

        try {
            const response = await api.get<UserResponse>('/admin/users/me');
            const userData = response.data;
            localStorage.setItem('sube_user', JSON.stringify(userData));

            return {
                ...userData,
                role: mapRole(userData.role)
            };
        } catch (error: any) {
            console.error("Error en getMe:", error.response?.data || error.message);
            throw error;
        }
    },

    register: async (userData: any): Promise<void> => {
        // CORRECCIÓN: Formateamos el objeto para que el backend no lo rechace
        const formattedData = {
            ...userData,
            id: Number(userData.id) || 0, // Convertir a número (0 si es nuevo)
            deleted: userData.deleted ?? false, // Asegurar que sea booleano
        };
        
        // El backend espera el objeto limpio
        await api.post('/auth/register', formattedData);
    },

    logout: () => {
        localStorage.removeItem('sube_token');
        localStorage.removeItem('sube_user');
        window.location.href = '/auth/x82b9';
    }
};