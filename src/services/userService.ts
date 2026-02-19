import api from './api';
import type { User } from '../types';

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
};
