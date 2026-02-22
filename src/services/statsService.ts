import api from './api';
import type { Statistics } from '../types';

export const statsService = {
    getStatistics: (): Promise<Statistics> =>
        api.get('admin/statistics').then(res => res.data),
};
