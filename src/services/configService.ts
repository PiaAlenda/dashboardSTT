import api from './api';

export interface SiteStatus {
    id: string;
    name: string;
    isActive: boolean;
    url: string;
}

export const configService = {
    getStatuses: async (): Promise<SiteStatus[]> => {
        // Mocking for now as requested/assumed, but using api.get if backend is ready
        // const response = await api.get<SiteStatus[]>('admin/config/site-statuses');
        // return response.data;

        return [
            { id: 'swagger', name: 'Swagger API', isActive: true, url: 'https://transitoytransporte.sanjuan.gob.ar/swagger-ui/index.html#/' },
            { id: 'formulario', name: 'Formulario de Inscripción', isActive: true, url: 'https://boletoescolar.sanjuan.gob.ar/' }
        ];
    },

    updateStatus: async (id: string, isActive: boolean): Promise<void> => {
        await api.put(`admin/config/site-statuses/${id}`, { isActive });
    }
};
