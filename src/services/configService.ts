import api from './api';

export interface SiteStatus {
    id: 'swagger' | 'enrollment';
    name: string;
    enabled: boolean;
    url: string;
}

export const configService = {
    getStatuses: async (): Promise<SiteStatus[]> => {
        return [
            {
                id: 'swagger',
                name: 'Swagger API',
                enabled: true,
                url: 'https://transitoytransporte.sanjuan.gob.ar/swagger-ui/index.html'
            },
            {
                id: 'enrollment',
                name: 'Boleto Escolar (Inscripción)',
                enabled: true,
                url: 'https://boletoescolar.sanjuan.gob.ar/'
            }
        ];
    },

    updateStatus: async (id: string, enabled: boolean): Promise<void> => {
        const path = id === 'swagger'
            ? 'admin/configs/swagger'
            : 'admin/configs/enrollment';

        try {
            const response = await api.patch(path, { 
                enabled: Boolean(enabled) 
            });

            if (import.meta.env.VITE_APP_ENV !== 'prod') {
                console.log(`[ConfigService] Éxito en ${id}:`, response.data);
            }
        } catch (error: any) {
            // Usamos configService directamente para evitar problemas de 'this' en el catch
            configService.handleError(error, id);
        }
    },

    handleError: (error: any, id: string) => {
        const status = error.response?.status;
        const serverData = error.response?.data;
        const message = serverData?.message || error.message;

        console.group(`🛑 Error de Configuración: ${id}`);
        console.error("Status:", status);
        console.error("Mensaje:", message);
        console.error("Detalles:", serverData);
        console.groupEnd();

        if (status === 403) {
            alert("🔒 Error 403: No tienes permisos de Administrador para realizar esta acción.");
        } else if (status === 401) {
            alert("🔑 Sesión expirada. Por favor, vuelve a loguearte.");
        } else {
            alert(`⚠️ No se pudo actualizar ${id}: ${message}`);
        }

        throw error;
    }
};