import React, { useState, useEffect } from 'react';
import { Settings, Shield } from 'lucide-react';
import { configService, type SiteStatus } from '../services/configService';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { ConfigCard } from '../features/config/components/ConfigCard';

export const ConfigPage: React.FC = () => {
    const [statuses, setStatuses] = useState<SiteStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    // Carga inicial
    useEffect(() => {
        let isMounted = true;
        const loadStatuses = async () => {
            try {
                const data = await configService.getStatuses();
                if (isMounted) setStatuses(data);
            } catch (error) {
                console.error("Error al cargar:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        loadStatuses();
        return () => { isMounted = false; };
    }, []);

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const nextStatus = !currentStatus;
        setIsUpdating(id);

        try {
            // Enviamos a la API
            await configService.updateStatus(id, nextStatus);
            
            // Actualizamos el estado local si la API fue exitosa
            setStatuses(prev => prev.map(s => 
                s.id === id ? { ...s, isActive: nextStatus } : s
            ));
        } catch (error) {
            // El error ya lo lanza el service, aquí solo detenemos la carga
            console.error("Fallo en el toggle");
        } finally {
            setIsUpdating(null);
        }
    };

    if (isLoading) return <LoadingOverlay message="Sincronizando..." />;

    return (
        <div className="max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700 pb-20 px-6 mt-10">
            <header className="flex items-center gap-6">
                <div className="p-4 bg-slate-900 rounded-[2rem] text-[#ff8200] shadow-xl">
                    <Settings size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                        Configuración de <span className="text-[#ff8200]">Red</span>
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {statuses.map((site) => (
                    <ConfigCard 
                        key={site.id} 
                        site={site} 
                        isUpdating={isUpdating === site.id}
                        onToggle={handleToggle}
                    />
                ))}
            </div>

            <footer className="bg-slate-900 p-8 rounded-[3rem] flex items-center gap-6">
                <div className="p-4 bg-[#ff8200] rounded-2xl text-white">
                    <Shield size={24} />
                </div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Protocolo de Seguridad Activo • Los cambios afectan la visibilidad global.
                </p>
            </footer>
        </div>
    );
};