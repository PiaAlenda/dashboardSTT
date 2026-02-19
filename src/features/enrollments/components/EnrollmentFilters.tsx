import { Filter } from 'lucide-react';

export type EnrollmentFilterStatus = 'PENDIENTE' | 'EN_PROCESO' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO' | 'SUSPENDIDO';

interface EnrollmentFiltersProps {
    filters: Record<EnrollmentFilterStatus, boolean>;
    onToggle: (key: EnrollmentFilterStatus) => void;
}

export const EnrollmentFilters = ({ filters, onToggle }: EnrollmentFiltersProps) => {

    const getBgClass = (key: EnrollmentFilterStatus) => {
        const classes: Record<EnrollmentFilterStatus, string> = {
            PENDIENTE: 'bg-amber-500 shadow-amber-200',
            EN_PROCESO: 'bg-blue-600 shadow-blue-200',
            APROBADO: 'bg-emerald-600 shadow-emerald-200',
            RECHAZADO: 'bg-red-500 shadow-red-200',
            CANCELADO: 'bg-slate-500 shadow-slate-200',
            SUSPENDIDO: 'bg-slate-900 shadow-slate-400'
        };
        return classes[key] || 'bg-slate-500';
    };

    const statusKeys = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'SUSPENDIDO'] as const;

    return (
        <div className="px-2">
            <div className="flex items-center gap-2 mb-4">
                <Filter size={12} className="text-[#ff8200]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Filtrar por Estado
                </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                {statusKeys.map((key) => {
                    const active = filters[key];
                    const bgClass = getBgClass(key);

                    return (
                        <button
                            key={key}
                            onClick={() => onToggle(key)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all duration-300 active:scale-95 shrink-0 snap-start
                                ${active
                                    ? `${bgClass} border-transparent text-white shadow-lg shadow-current/20 font-black`
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 font-bold'
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
    );
};