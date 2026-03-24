import api from './api';
import type { Statistics } from '../types';

export const statsService = {
    getStatistics: (range: string = 'month'): Promise<Statistics> => {
        return api.get(`admin/statistics${range ? `?range=${range}` : ''}`).then(res => res.data);
    },
    getDetailedStatistics: (): Promise<any> => {
        return api.get('admin/statistics/detailed').then(res => res.data);
    }
};