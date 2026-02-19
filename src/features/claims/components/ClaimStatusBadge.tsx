interface ClaimStatusBadgeProps {
    status: string;
}

export const ClaimStatusBadge = ({ status }: ClaimStatusBadgeProps) => {
    const s = status?.toUpperCase();

    const config: Record<string, { label: string; bg: string; text: string; dot: string }> = {
        'PENDIENTE': { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
        'RESPONDIDO': { label: 'Respondido', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
        'CONTESTADO': { label: 'Contestado', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
        'RECHAZADO': { label: 'Rechazado', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
    };

    const style = config[s] || { label: s || 'Desconocido', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${style.bg} ${style.text} border border-current/10 shadow-sm`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot} animate-pulse`} />
            {style.label}
        </span>
    );
};
