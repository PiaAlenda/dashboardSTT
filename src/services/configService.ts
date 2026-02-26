import api from './api';

export interface SiteStatus {
    id: 'swagger' | 'enrollment';
    name: string;
    isActive: boolean;
    url: string;
}

export const configService = {
    getStatuses: async (): Promise<SiteStatus[]> => {
        // Mantenemos el Mock pero listo para switch a API
        return [
            {
                id: 'swagger',
                name: 'Swagger API',
                isActive: true,
                url: 'https://transitoytransporte.sanjuan.gob.ar/swagger-ui/index.html'
            },
            {
                id: 'enrollment',
                name: 'Boleto Escolar (Inscripción)',
                isActive: true,
                url: 'https://boletoescolar.sanjuan.gob.ar/'
            }
        ];
    },

    updateStatus: async (id: string, isActive: boolean): Promise<void> => {
        // IMPORTANTE: Eliminamos cualquier '/' inicial para que Axios use la baseURL correctamente
        const path = id === 'swagger'
            ? 'admin/configs/swagger'
            : 'admin/configs/enrollment';

        try {
            /**
             * NOTA TÉCNICA: 
             * Si el backend sigue dando 403 o 400, prueba cambiar { isActive } 
             * por { status: isActive } o { value: isActive } según la documentación del Swagger.
             */
            const response = await api.patch(path, { 
                isActive: Boolean(isActive) // Aseguramos que sea booleano puro
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