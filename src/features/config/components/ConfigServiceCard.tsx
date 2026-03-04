import React from 'react';
import { Shield, Globe, Activity, ExternalLink, Lock } from 'lucide-react';
import { type SiteStatus } from '../../../services/configService';

interface ConfigServiceCardProps {
    site: SiteStatus;
    isUpdating: boolean;
    onToggle: (id: string, currentStatus: boolean) => void;
}

export const ConfigServiceCard: React.FC<ConfigServiceCardProps> = ({ 
    site, 
    isUpdating, 
    onToggle 
}) => {
    
    const handlePreviewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (site.enabled && !isUpdating && site.url) {
            window.open(site.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={`
            group relative bg-white p-6 sm:p-8 rounded-[1.25rem] border border-slate-100 shadow-sm
            transition-all duration-300 flex flex-col justify-between h-[220px] w-full
            ${site.enabled ? 'hover:shadow-md hover:border-orange-100' : 'bg-slate-50/50'}
        `}>
            <div className={`absolute top-0 left-0 w-[5px] h-full transition-colors duration-500 
                ${site.enabled ? 'bg-[#ff8200]' : 'bg-slate-200'}`} 
            />

            <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 sm:gap-5 min-w-0">
                    <div className={`p-3 sm:p-4 rounded-2xl transition-all duration-500 shrink-0 ${
                        site.enabled ? 'bg-orange-50 text-[#ff8200]' : 'bg-slate-200 text-slate-400'
                    }`}>
                        {site.id === 'swagger' ? <Shield size={24} /> : <Globe size={24} />}
                    </div>
                    
                    <div className="min-w-0 mt-1">
                        <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight leading-none truncate ${
                            site.enabled ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                            {site.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className={`h-2 w-2 rounded-full shrink-0 ${
                                site.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300'
                            }`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
                                {site.enabled ? 'Sistema Online' : 'Desconectado'}
                            </span>
                        </div>
                    </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer scale-110 shrink-0">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={site.enabled}
                        onChange={() => onToggle(site.id, site.enabled)}
                        disabled={isUpdating}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-checked:bg-slate-900 rounded-full transition-all duration-300 relative shadow-inner">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform peer-checked:translate-x-5 flex items-center justify-center shadow-sm">
                            {isUpdating && <Activity size={10} className="animate-spin text-orange-500" />}
                        </div>
                    </div>
                </label>
            </div>

            <div className="flex items-center gap-3">
                <code className="text-[10px] font-mono text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 truncate flex-1">
                    {site.url?.replace('https://', '').replace('http://', '') || 'no-url'}
                </code>
                <button
                    onClick={handlePreviewClick}
                    disabled={!site.enabled || isUpdating}
                    className={`p-3 rounded-xl transition-all ${
                        site.enabled
                        ? 'bg-slate-900 text-white hover:bg-[#ff8200] shadow-lg active:scale-90'
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    }`}
                >
                    {site.enabled ? <ExternalLink size={18} /> : <Lock size={18} />}
                </button>
            </div>
        </div>
    );
};