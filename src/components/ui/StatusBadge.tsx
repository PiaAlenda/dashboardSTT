import { Trash2, CheckCircle2, Clock, XCircle, Ban, RefreshCcw, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
    status?: string;
    isDeleted?: boolean;
    className?: string;
}

export const StatusBadge = ({ status, isDeleted, className = '' }: StatusBadgeProps) => {
    // Estilo base común para que todos se vean igual de grandes
    const baseStyle = "inline-flex items-center gap-2 rounded-2xl border-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm transition-all";

    if (isDeleted) return (
        <span className={`${baseStyle} border-red-200 bg-red-50 text-red-600`}>
            <Trash2 size={14} strokeWidth={3} />
        </span>
    );

    const s = status?.toUpperCase() || '';
    const config: Record<string, { style: string; icon: any; label: string }> = {
        'APROBADO': { style: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2, label: '' },
        'PENDIENTE': { style: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: '' },
        'RECHAZADO': { style: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: '' },
        'CANCELADO': { style: "bg-slate-100 text-slate-500 border-slate-300", icon: Ban, label: '' },
        'EN_PROCESO': { style: "bg-blue-50 text-blue-700 border-blue-200", icon: RefreshCcw, label: '' },
        'SUSPENDIDA': { style: "bg-purple-50 text-purple-700 border-purple-200", icon: ShieldCheck, label: '' }
    };

    const active = config[s] || { style: "bg-slate-50 text-slate-700 border-slate-200", icon: Clock, label: s || 'Desconocido' };

    return (
        <span className={`${baseStyle} ${active.style} ${className}`}>
            <active.icon size={14} strokeWidth={3} />
            {active.label}
        </span>
    );
};