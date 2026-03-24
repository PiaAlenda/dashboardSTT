import api from './api';
import type { RegistryPerson } from '../types';

export const registryService = {
    getByDni: async (dni: string): Promise<RegistryPerson> => {
        const response = await api.get<RegistryPerson>(`admin/registry/${dni}`);
        return response.data;
    }
};