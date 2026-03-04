import React, { useState, useEffect } from 'react';
import { Settings, Database, ArrowRight, Zap } from 'lucide-react';
import { configService, type SiteStatus } from '../services/configService';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { CrossCheckModal } from '../features/enrollments/components/CrossCheckModal';
import { ConfigServiceCard } from '../features/config/components/ConfigServiceCard';

export const ConfigPage: React.FC = () => {
    const [statuses, setStatuses] = useState<SiteStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isCrossCheckOpen, setIsCrossCheckOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadStatuses = async () => {
            try {
                const data = await configService.getStatuses();
                if (isMounted) setStatuses(data);
            } catch (error) {
                console.error("Error cargando infraestructura:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        loadStatuses();
        return () => { isMounted = false; };
    }, []);

    const handleToggle = async (id: string, currentStatus: boolean) => {
        setIsUpdating(id);
        try {
            await configService.updateStatus(id, !currentStatus);
            setStatuses(prev => prev.map(s => s.id === id ? { ...s, enabled: !currentStatus } : s));
        } catch (error) {
            console.error("Error en el toggle del servicio");
        } finally {
            setIsUpdating(null);
        }
    };

    if (isLoading) return <LoadingOverlay message="Sincronizando Infraestructura..." />;

    return (
        <div className="max-w-[1700px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 px-4 sm:px-6 mt-10">

            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-[#ff8200] shadow-lg shadow-slate-200">
                        <Settings size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl 2xl:text-4xl font-black text-slate-800 tracking-tight">
                            Panel de <span className="text-[#ff8200]">Infraestructura</span>
                        </h1>
                        <p className="text-[11px] 2xl:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Gestión de pasarelas y servicios core
                        </p>
                    </div>
                </div>
            </header>

            {/* SECCIÓN ESTADOS/HERRAMIENTAS */}
            <section className="pt-10 border-t border-slate-50">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] select-none">
                        Estado de los Servicios
                    </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 max-w-[1500px] mx-auto">
                    {statuses.map(site => (
                        <div key={site.id} className="w-full sm:w-[calc(50%-20px)] lg:w-[420px] flex justify-center">
                            <ConfigServiceCard
                                site={site}
                                isUpdating={isUpdating === site.id}
                                onToggle={handleToggle}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="pt-10 border-t border-slate-50">
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                        Herramientas de Mantenimiento
                    </h2>
                </div>

                <div
                    onClick={() => setIsCrossCheckOpen(true)}
                    className="group relative bg-white rounded-[1.5rem] border border-slate-100 
                               p-6 sm:p-10 shadow-sm hover:shadow-xl hover:border-orange-100 
                               transition-all duration-500 cursor-pointer overflow-hidden 
                               flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 
                               max-w-5xl mx-auto"
                >
                    <div className="absolute top-0 left-0 w-full lg:w-[8px] h-[6px] lg:h-full bg-[#ff8200]" />

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 relative z-10 w-full lg:w-auto">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-orange-50 text-[#ff8200] rounded-[1.2rem] sm:rounded-[1.5rem] 
                                        flex items-center justify-center group-hover:bg-[#ff8200] group-hover:text-white 
                                        transition-all duration-500 shrink-0">
                            <Zap size={28} className="sm:w-8 sm:h-8" fill="currentColor" />
                        </div>

                        <div className="space-y-2 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                <h3 className="text-xl sm:text-3xl font-black text-slate-800 uppercase tracking-tighter">
                                    Cruce de Inscripciones
                                </h3>
                                <span className="px-2 py-0.5 bg-slate-900 text-white rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                    Sistema Core
                                </span>
                            </div>
                            <p className="text-slate-400 font-bold uppercase text-[9px] sm:text-[11px] tracking-widest leading-relaxed max-w-xs sm:max-w-none">
                                Ejecuta la conciliación masiva de registros.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 w-full lg:w-auto flex items-center justify-center gap-3 
                                    bg-slate-900 text-white px-6 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl 
                                    group-hover:bg-[#ff8200] transition-all font-black uppercase tracking-widest 
                                    text-[10px] sm:text-xs shadow-xl active:scale-95 lg:group-hover:translate-x-2">
                        <span>Ejecutar Proceso</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="hidden md:block absolute -right-10 -bottom-10 text-slate-50 opacity-40 
                                    group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                        <Database size={200} strokeWidth={1} />
                    </div>
                </div>
            </section>

            <CrossCheckModal isOpen={isCrossCheckOpen} onClose={() => setIsCrossCheckOpen(false)} />
        </div>
    );
};