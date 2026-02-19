import api from './api';
import type { Claim } from '../types';

export const claimService = {
    getAll: async (): Promise<Claim[]> => {
        const response = await api.get<Claim[]>('admin/claims');
        return response.data;
    },
    answer: async (id: number, answer: string): Promise<void> => {
        await api.put(`admin/claims/${id}/answer`, { replyMessage: answer });
    }
};