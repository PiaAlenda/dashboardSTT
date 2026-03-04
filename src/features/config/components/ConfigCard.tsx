import React from 'react';
import { ExternalLink, Globe, Shield, Activity, Lock } from 'lucide-react';
export interface SiteStatus {
    id: string;
    name: string;
    url: string;
    enabled: boolean;
}

interface ConfigCardProps {
    site: SiteStatus;
    isUpdating: boolean;
    onToggle: (id: string, currentStatus: boolean) => void;
}
export const ConfigCard: React.FC<ConfigCardProps> = ({ site, isUpdating, onToggle }) => {
    const handlePreviewClick = () => {
        if (site.enabled && !isUpdating) {
            window.open(site.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={`
            relative flex h-32 w-full bg-white rounded-2xl border transition-all duration-300 overflow-hidden
            ${site.enabled 
                ? 'border-slate-200 shadow-sm hover:shadow-md' 
                : 'border-slate-100 bg-slate-50/30'
            }
        `}>
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={`
                            p-2.5 rounded-xl transition-all duration-500
                            ${site.enabled 
                                ? 'bg-orange-100 text-[#ff8200] shadow-[0_0_15px_rgba(255,130,0,0.2)]' 
                                : 'bg-slate-200 text-slate-400'
                            }
                        `}>
                            {site.id === 'swagger' ? <Shield size={20} /> : <Globe size={20} />}
                        </div>

                        <div>
                            <h3 className={`text-sm font-black uppercase tracking-tight leading-none ${site.enabled ? 'text-slate-800' : 'text-slate-400'}`}>
                                {site.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${site.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${site.enabled ? 'text-green-600' : 'text-slate-400'}`}>
                                    {site.enabled ? 'Sistema Online' : 'Desactivado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={site.enabled}
                                onChange={() => onToggle(site.id, site.enabled)}
                                disabled={isUpdating}
                            />
                            <div className="w-10 h-5 bg-slate-200 peer-checked:bg-slate-900 rounded-full transition-all duration-300 relative border-2 border-transparent">
                                <div className={`
                                    absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 transform 
                                    peer-checked:translate-x-5 flex items-center justify-center shadow-sm
                                `}>
                                    {isUpdating && <Activity size={8} className="animate-spin text-[#ff8200]" />}
                                </div>
                            </div>
                        </label>
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Control</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <code className={`
                        text-[10px] font-mono px-2 py-1 rounded border flex-1 truncate transition-colors
                        ${site.enabled 
                            ? 'bg-slate-50 text-slate-500 border-slate-100' 
                            : 'bg-slate-100/50 text-slate-300 border-transparent'
                        }
                    `}>
                        {site.url.replace('https://', '').replace('http://', '')}
                    </code>
                </div>
            </div>

            <button 
                onClick={handlePreviewClick}
                disabled={!site.enabled || isUpdating}
                className={`
                    w-16 flex flex-col items-center justify-center gap-1 transition-all border-l
                    ${site.enabled 
                        ? 'bg-slate-50 hover:bg-[#ff8200] text-slate-400 hover:text-white border-slate-100 cursor-pointer active:scale-95' 
                        : 'bg-slate-100/50 text-slate-200 border-transparent cursor-not-allowed'
                    }
                `}
            >
                {site.enabled ? (
                    <>
                        <ExternalLink size={18} />
                        <span className="text-[8px] font-black uppercase">Abrir</span>
                    </>
                ) : (
                    <Lock size={18} />
                )}
            </button>
        </div>
    );
};