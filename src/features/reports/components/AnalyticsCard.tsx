import React, { useState } from 'react';
import { Maximize2, PieChart as PieIcon, BarChart3 as BarIcon } from 'lucide-react';

interface AnalyticsCardProps {
    title: string;
    subtitle?: string;
    children: (type: 'pie' | 'bar') => React.ReactNode;
    onExpand?: () => void;
}

export const AnalyticsCard = ({ title, subtitle, children, onExpand }: AnalyticsCardProps) => {
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 flex flex-col h-full group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#ff8200] transition-colors">{title}</h3>
                    {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center p-1 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                        <button
                            onClick={() => setChartType('pie')}
                            className={`p-1.5 rounded-lg transition-all ${chartType === 'pie' ? 'bg-white text-[#ff8200] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Ver en Torta"
                        >
                            <PieIcon size={14} />
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`p-1.5 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white text-[#ff8200] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Ver en Barras"
                        >
                            <BarIcon size={14} />
                        </button>
                    </div>

                    <button
                        onClick={onExpand}
                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all shadow-sm active:scale-90"
                        title="Expandir"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
            <div className="flex-1 bg-slate-50/30 rounded-[2rem] border border-slate-50 relative p-4">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 pointer-events-none" />
                <div className="relative z-10 w-full h-full">
                    {children(chartType)}
                </div>
            </div>
        </div>
    );
};
