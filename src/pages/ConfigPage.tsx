import React, { useState, useEffect } from 'react';
import { Settings, Shield } from 'lucide-react';
import { configService, type SiteStatus } from '../services/configService';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { ConfigCard } from '../features/config/components/ConfigCard';

export const ConfigPage: React.FC = () => {
    const [statuses, setStatuses] = useState<SiteStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => { loadStatuses(); }, []);

    const loadStatuses = async () => {
        try {
            const data = await configService.getStatuses();
            setStatuses(data);
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        setIsUpdating(id);
        try {
            await configService.updateStatus(id, !currentStatus);
            setStatuses(prev => prev.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
        } catch (error) {
            alert("Error al actualizar");
        } finally {
            setIsUpdating(null);
        }
    };

    if (isLoading) return <LoadingOverlay message="Cargando configuración..." />;

    return (
        <div className="max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-6">
            
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-900 rounded-[2rem] text-[#ff8200] shadow-2xl shadow-orange-200/20 rotate-3">
                        <Settings size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl 2xl:text-5xl font-black text-slate-900 tracking-tighter">
                            Configuración de <span className="text-[#ff8200]">Red</span>
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                            Master Control Panel • Infraestructura
                        </p>
                    </div>
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

            {/* Footer */}
            <footer className="bg-slate-900 p-8 rounded-[3rem] flex items-center gap-6 shadow-2xl shadow-slate-900/20">
                <div className="p-4 bg-[#ff8200] rounded-2xl text-white animate-pulse">
                    <Shield size={24} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Protocolo de Seguridad Activo</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider leading-relaxed">
                        Cualquier cambio en los interruptores superiores afectará la visibilidad de la API y Documentación de forma global.
                    </p>
                </div>
            </footer>
        </div>
    );
};