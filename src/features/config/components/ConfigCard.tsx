import React from 'react';
import { ExternalLink, Globe, Shield, Activity, Lock, Terminal } from 'lucide-react';
import { type SiteStatus } from '../../../services/configService';

interface ConfigCardProps {
    site: SiteStatus;
    isUpdating: boolean;
    onToggle: (id: string, currentStatus: boolean) => void;
}

export const ConfigCard: React.FC<ConfigCardProps> = ({ site, isUpdating, onToggle }) => {
    
    // Función para abrir la web en pestaña nueva (evita el bloqueo de iframe)
    const handlePreviewClick = () => {
        if (site.isActive) {
            window.open(site.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col overflow-hidden h-[550px]">
            
            {/* 1. Header de la Card */}
            <div className="p-8 flex items-center justify-between border-b border-slate-50 bg-white">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-[1.5rem] transition-all duration-500 ${site.isActive ? 'bg-orange-100 text-[#ff8200] scale-110 shadow-lg shadow-orange-100' : 'bg-slate-100 text-slate-400'}`}>
                        {site.id === 'swagger' ? <Shield size={26} /> : <Globe size={26} />}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{site.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`h-2 w-2 rounded-full ${site.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-[11px] font-black uppercase tracking-widest ${site.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                {site.isActive ? 'Sistema en línea' : 'Desconectado'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Switch Moderno */}
                <div className="flex flex-col items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={site.isActive}
                            onChange={() => onToggle(site.id, site.isActive)}
                            disabled={isUpdating}
                        />
                        <div className="w-20 h-10 bg-slate-200 rounded-full peer peer-checked:bg-slate-900 transition-all duration-300 relative border-4 border-slate-100 shadow-inner">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-400 peer-checked:opacity-0 transition-opacity">OFF</span>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] font-black text-white opacity-0 peer-checked:opacity-100 transition-opacity">ON</span>
                            
                            <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 transform peer-checked:translate-x-10 flex items-center justify-center shadow-md">
                                {isUpdating ? (
                                    <Activity size={10} className="animate-spin text-[#ff8200]" />
                                ) : (
                                    site.isActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                )}
                            </div>
                        </div>
                    </label>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Control</span>
                </div>
            </div>

            {/* 2. Área Visual Reemplazada (Sin Iframe para evitar 403) */}
            <div className="p-8 space-y-4 flex-1 flex flex-col bg-slate-50/30">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={14} className={site.isActive ? 'text-[#ff8200]' : 'text-slate-300'} /> 
                        Consola de Infraestructura
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
                        Abrir Externo <ExternalLink size={12} />
                    </div>
                </div>

                {/* Contenedor de Estado Interactivo */}
                <div 
                    onClick={handlePreviewClick}
                    className={`relative flex-1 w-full rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden transition-all duration-500 flex flex-col items-center justify-center ${
                        site.isActive 
                        ? 'bg-slate-900 cursor-pointer hover:scale-[1.02] active:scale-[0.98] group/preview' 
                        : 'bg-slate-200 cursor-not-allowed'
                    }`}
                >
                    {site.isActive ? (
                        <>
                            {/* Vista de Sistema Activo */}
                            <div className="flex flex-col items-center text-center p-8 space-y-5 animate-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                                    <Globe size={48} className="text-green-500 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm">Tráfico Autorizado</h4>
                                    <p className="text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-widest max-w-[220px] leading-relaxed">
                                        Servidor respondiendo correctamente. Haz clic para acceder a la documentación oficial.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl">
                                    <div className="flex gap-1">
                                        {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-green-500/40 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
                                    </div>
                                    <span className="text-[10px] font-mono text-green-400 tracking-tighter">STATUS_OK_200</span>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#ff8200]/10 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-white text-slate-900 px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 transform translate-y-4 group-hover/preview:translate-y-0 transition-all duration-500">
                                    <span className="text-[12px] font-black uppercase tracking-tight">Lanzar Aplicación</span>
                                    <ExternalLink size={16} className="text-[#ff8200]" />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Vista de Sistema Inactivo */
                        <div className="flex flex-col items-center text-center p-8 space-y-4 animate-in fade-in duration-700">
                            <div className="w-20 h-20 bg-slate-300/50 rounded-full flex items-center justify-center">
                                <Lock size={40} className="text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">Puerta de Enlace Cerrada</h4>
                                <p className="text-slate-400 text-[10px] font-bold mt-3 uppercase tracking-widest max-w-[200px] leading-relaxed">
                                    El acceso ha sido revocado. Los servicios no aceptarán peticiones externas.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer de la Card con URL */}
                <div className="bg-white/50 p-4 rounded-2xl border border-white flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Host Destino</span>
                    <code className="text-[10px] font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-lg truncate max-w-[200px]">
                        {site.url.replace('https://', '')}
                    </code>
                </div>
            </div>
        </div>
    );
};