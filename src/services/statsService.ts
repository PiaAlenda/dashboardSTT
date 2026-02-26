import api from './api';
import type { Statistics } from '../types';

export const statsService = {
    getStatistics: ({ queryKey }: { queryKey: any }): Promise<Statistics> => {
        const [_, range] = queryKey;
        return api.get(`admin/statistics${range ? `?range=${range}` : ''}`).then(res => res.data);
    },
};

