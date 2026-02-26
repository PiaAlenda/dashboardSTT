import { useState, useEffect } from 'react';
import { Filter, GraduationCap, ChevronDown } from 'lucide-react';

export type EnrollmentFilterStatus = 'PENDIENTE' | 'EN_PROCESO' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO' | 'SUSPENDIDO';
export type EducationLevelStatus = 'INICIAL' | 'PRIMARIO' | 'SECUNDARIO' | 'SUPERIOR/TECNICO' | 'UNIVERSITARIO';

interface EnrollmentFiltersProps {
    filters: Record<string, boolean>;
    onToggle: (key: string) => void;
}

export const EnrollmentFilters = ({ filters, onToggle }: EnrollmentFiltersProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusKeys = ['PENDIENTE', 'EN_PROCESO', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'SUSPENDIDO'] as const;
    const educationKeys = ['INICIAL', 'PRIMARIO', 'SECUNDARIO', 'SUPERIOR/TECNICO', 'UNIVERSITARIO'] as const;
    useEffect(() => {
        const hasEducationFilter = educationKeys.some(key => filters[key]);
        if (hasEducationFilter) setIsExpanded(true);
    }, [filters]);

    const getStatusBg = (key: string) => {
        const classes: Record<string, string> = {
            PENDIENTE: 'bg-amber-500 shadow-amber-200',
            EN_PROCESO: 'bg-blue-600 shadow-blue-200',
            APROBADO: 'bg-emerald-600 shadow-emerald-200',
            RECHAZADO: 'bg-red-500 shadow-red-200',
            CANCELADO: 'bg-slate-500 shadow-slate-200',
            SUSPENDIDO: 'bg-slate-900 shadow-slate-400'
        };
        return classes[key] || 'bg-slate-500';
    };
    const handleStatusToggle = (key: string) => {
        onToggle(key);
        setIsExpanded(true);
    };

    return (
        <div className="px-2 space-y-6">
            {/* --- SECCIÓN 1: ESTADOS (Canal A) --- */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={12} className="text-[#ff8200]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        1. Estado del trámite
                    </span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
                    {statusKeys.map((key) => {
                        const active = filters[key];
                        const bgClass = getStatusBg(key);

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleStatusToggle(key)}
                                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all duration-300 active:scale-95 shrink-0 snap-start
                                    ${active
                                        ? `${bgClass} border-transparent text-white shadow-xl scale-105 font-black z-10`
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 font-bold opacity-60'
                                    }`}
                            >
                                <span className="text-[10px] uppercase tracking-widest leading-none">
                                    {key.replace('_', ' ')}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- SECCIÓN 2: NIVELES EDUCATIVOS (Canal B) --- */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap size={14} className="text-[#ff8200]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            2. Filtrar por Nivel
                        </span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
                        {educationKeys.map((level) => {
                            const active = filters[level];

                            return (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => onToggle(level)}
                                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all duration-300 active:scale-95 shrink-0 snap-start
                                        ${active
                                            ? 'bg-slate-900 border-transparent text-white shadow-lg font-black scale-105'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 font-bold'
                                        }`}
                                >
                                    <span className="text-[10px] uppercase tracking-widest leading-none">
                                        {level}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Flecha de control de UI */}
            {isExpanded && (
                <div className="flex justify-center border-t border-slate-50 pt-2">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="group flex items-center gap-2 px-4 py-1 rounded-full hover:bg-slate-50 transition-all"
                    >
                        <span className="text-[9px] font-black text-slate-300 group-hover:text-slate-500 uppercase tracking-tighter transition-colors">Ocultar Niveles</span>
                        <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-500 rotate-180 transition-colors" />
                    </button>
                </div>
            )}
        </div>
    );
};