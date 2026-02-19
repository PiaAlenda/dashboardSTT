import { Clock, ArrowRight, User, Search } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

interface EnrollmentHistoryProps {
    history: any[];
    isLoading: boolean;
}

export const EnrollmentHistory = ({ history, isLoading }: EnrollmentHistoryProps) => {
    if (isLoading) {
        return (
            <div className="text-center py-20 animate-pulse font-black text-slate-300 text-xs uppercase italic tracking-widest">
                Consultando auditoría de seguridad...
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-20 text-slate-300 font-bold uppercase text-[10px] tracking-widest flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center"><Search size={24} /></div>
                Sin movimientos registrados
            </div>
        );
    }

    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:to-slate-100">
            {history.map((h: any, i: number) => (
                <div key={i} className="relative flex items-center gap-8 group">
                    <div className="w-10 h-10 rounded-full bg-white border-4 border-orange-500 text-orange-500 flex items-center justify-center shrink-0 z-10 shadow-md group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Clock size={14} strokeWidth={3} />
                    </div>

                    <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm w-full hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-black text-slate-400 line-through uppercase tracking-tighter">
                                    {h.previousStatus || 'ORIGEN'}
                                </span>
                                <ArrowRight size={14} className="text-orange-500" strokeWidth={3} />
                                <StatusBadge status={h.newStatus || h.status} />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                {(() => {
                                    const dateVal = h.date || h.changedAt || h.createdAt;
                                    if (!dateVal) return 'SIN FECHA';
                                    const d = new Date(dateVal);
                                    return isNaN(d.getTime()) ? 'FECHA INVÁLIDA' : d.toLocaleString();
                                })()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Operador</p>
                                    <p className="text-xs font-bold text-slate-700">{h.changedBy || 'Sistema Automático'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
