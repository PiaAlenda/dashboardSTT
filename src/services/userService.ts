import api from './api';
import type { User } from '../types';
import type { UserResponse } from './authService';

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('admin/users');
        return response.data;
    },

    delete: async (dni: string): Promise<void> => {
        await api.delete(`admin/users/${dni}`);
    },

    reactivate: async (dni: string): Promise<void> => {
        await api.post(`admin/users/${dni}/reactivate`);
    },

    getHistory: async (dni: string): Promise<any[]> => {
        const response = await api.get(`admin/users/${dni}/history`);
        return response.data;
    },

    update: async (dni: string, userData: any): Promise<UserResponse> => {
        // Para administración: podemos cambiar rol y otros datos
        const payload = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role
        };
        const response = await api.patch<UserResponse>(`admin/users/${dni}`, payload);
        return response.data;
    },

    updateMe: async (userData: any): Promise<UserResponse> => {
        // Para uso personal: el backend suele restringir qué campos puede editar uno mismo
        const payload = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        };
        const response = await api.patch<UserResponse>(`admin/users/me`, payload);
        return response.data;
    },
};
