import React from 'react';
import { ExternalLink, Globe, Shield, Activity, Power } from 'lucide-react';
import { type SiteStatus } from '../../../services/configService';

interface ConfigCardProps {
    site: SiteStatus;
    isUpdating: boolean;
    onToggle: (id: string, currentStatus: boolean) => void;
}

export const ConfigCard: React.FC<ConfigCardProps> = ({ site, isUpdating, onToggle }) => {
    
    // Función para abrir la web al hacer click en la preview
    const handlePreviewClick = () => {
        if (site.isActive) {
            window.open(site.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col overflow-hidden h-[650px]">
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

                {/* Switch */}
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
                                {site.isActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                {isUpdating && <Activity size={10} className="animate-spin text-orange-500" />}
                            </div>
                        </div>
                    </label>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Acceso</span>
                </div>
            </div>

            {/* Preview  */}
            <div className="p-8 space-y-4 flex-1 flex flex-col bg-slate-50/30">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className={site.isActive ? 'text-green-500' : 'text-slate-300'} /> 
                        Panel de Control Directo
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
                        Click para entrar <ExternalLink size={12} />
                    </div>
                </div>

                {/* Contenedor Interactivo */}
                <div 
                    onClick={handlePreviewClick}
                    className={`relative flex-1 w-full bg-slate-900 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden group/preview transition-all duration-500 ${site.isActive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'cursor-not-allowed'}`}
                >
                    {/* Overlay si está Inactivo */}
                    {!site.isActive && (
                        <div className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                            <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-6 border border-white/10">
                                <Power size={40} className="text-white/40 animate-pulse" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-[0.3em] text-sm">Servicio Desconectado</h4>
                            <p className="text-white/30 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
                                El acceso público ha sido revocado por seguridad.
                            </p>
                        </div>
                    )}

                    {/* Overlay de Hover cuando está activo */}
                    {site.isActive && (
                        <div className="absolute inset-0 z-40 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 bg-slate-900/20 flex items-center justify-center">
                            <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 transform translate-y-4 group-hover/preview:translate-y-0 transition-all duration-500">
                                <div className="p-2 bg-orange-100 rounded-xl text-[#ff8200]">
                                    <ExternalLink size={18} />
                                </div>
                                <span className="text-[11px] font-black uppercase text-slate-800 tracking-widest">Abrir Sitio Web</span>
                            </div>
                        </div>
                    )}

                    {/* Iframe (Visualización real) */}
                    <iframe
                        src={site.isActive ? site.url : 'about:blank'}
                        className={`relative z-20 w-full h-full border-none transition-all duration-1000 ${!site.isActive ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                        title={site.name}
                        style={{ pointerEvents: 'none' }} 
                    />
                </div>
            </div>
        </div>
    );
};