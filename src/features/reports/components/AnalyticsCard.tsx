import React, { useState } from 'react';
import { Maximize2, PieChart as PieIcon, BarChart3 as BarIcon } from 'lucide-react';

interface AnalyticsCardProps {
    title: string;
    subtitle?: string;
    children: (type: 'pie' | 'bar') => React.ReactNode;
    onExpand?: () => void;
    hideTypeToggle?: boolean;
    headerAction?: React.ReactNode;
    defaultType?: 'pie' | 'bar';
}

export const AnalyticsCard = ({ title, subtitle, children, onExpand, hideTypeToggle, headerAction, defaultType = 'pie' }: AnalyticsCardProps) => {
    const [chartType, setChartType] = useState<'pie' | 'bar'>(defaultType);

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-100/50 flex flex-col h-full group relative overflow-hidden">
            {/* Corner Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-[#ff8200] transition-colors duration-300">{title}</h3>
                    {subtitle && (
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                             <span className="w-4 h-[1px] bg-slate-200 group-hover:bg-orange-200 transition-colors" />
                             {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {headerAction}

                    {!hideTypeToggle && (
                        <div className="flex items-center p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 shadow-inner backdrop-blur-sm">
                            <button
                                onClick={() => setChartType('pie')}
                                className={`p-2 rounded-xl transition-all duration-300 ${chartType === 'pie' ? 'bg-white text-[#ff8200] shadow-md scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Ver en Torta"
                            >
                                <PieIcon size={14} />
                            </button>
                            <button
                                onClick={() => setChartType('bar')}
                                className={`p-2 rounded-xl transition-all duration-300 ${chartType === 'bar' ? 'bg-white text-[#ff8200] shadow-md scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Ver en Barras"
                            >
                                <BarIcon size={14} />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onExpand}
                        className="p-3 text-slate-400 hover:text-[#ff8200] hover:bg-orange-50 rounded-2xl transition-all duration-300 shadow-sm active:scale-90 border border-transparent hover:border-orange-100"
                        title="Expandir"
                    >
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-slate-50/50 to-white/50 rounded-[2.5rem] border border-slate-100/50 relative p-6 shadow-inner ring-1 ring-black/5">
                <div className="relative z-10 w-full h-full min-h-[250px]">
                    {children(chartType)}
                </div>
            </div>
        </div>
    );
};
