import api from './api';

export const enrollmentService = {
    getAll: () =>
        api.get('admin/enrollments').then(res => res.data),

    getHistory: (dni: string) =>
        api.get(`admin/enrollments/${dni}/history`).then(res => res.data),

    updateStatus: async (dni: string, statusName: string, rejectionReasonId?: number, observation: string = '') => {
        const normalizedStatus = statusName.toUpperCase().trim().replace(/\s+/g, '_');

        if (normalizedStatus === 'RECHAZADO') {
            const reasonId = rejectionReasonId || 1;
            return api.patch(`admin/enrollments/${dni}/reject?rejectionReasonId=${reasonId}&observation=${encodeURIComponent(observation)}`)
                .then(res => res.data);
        }

        const statusMap: Record<string, number> = {
            'PENDIENTE': 1,
            'APROBADO': 2,
            'SUSPENDIDA': 4,
            'EN_PROCESO': 5,
            'CANCELADO': 6
        };

        const id = statusMap[normalizedStatus] || 1;

        return api.patch(`admin/enrollments/${dni}/status?statusId=${id}`)
            .then(res => res.data);
    },

    delete: (dni: string) =>
        api.delete(`admin/enrollments/${dni}`).then(res => res.data),

    reactivate: (dni: string) =>
        api.post(`admin/enrollments/${dni}/reactivate`).then(res => res.data),

    viewFile: (dni: string) => {
        const baseUrl = api.defaults.baseURL || '';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBase}/admin/enrollments/files/${dni?.trim()}/view`;
    },

    getFileBlob: async (dni: string) => {
        return api.get(`admin/enrollments/files/${dni?.trim()}/view`, {
            responseType: 'blob'
        }).then(res => res.data);
    },

    exportCsv: (startDate: string, endDate: string, status: string) => {
        return api.get('admin/enrollments/export/csv/filtered', {
            params: { startDate, endDate, status },
            responseType: 'blob'
        }).then(res => res.data);
    }
};