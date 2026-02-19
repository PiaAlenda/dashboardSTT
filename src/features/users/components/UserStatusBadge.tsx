
interface UserStatusBadgeProps {
    deleted?: boolean;
    role?: string;
}

export const UserStatusBadge = ({ deleted, role }: UserStatusBadgeProps) => {
    if (deleted) {
        return (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-black uppercase text-red-600 border border-red-100 italic">
                Eliminado
            </span>
        );
    }

    const config: Record<string, { label: string; bg: string; text: string }> = {
        'ROLE_SUPER_ADMIN': { label: 'Super Admin', bg: 'bg-orange-50', text: 'text-orange-700' },
        'ROLE_ADMIN': { label: 'Admin', bg: 'bg-purple-50', text: 'text-purple-700' },
        'ROLE_AUDITOR': { label: 'Auditor', bg: 'bg-blue-50', text: 'text-blue-700' },
    };

    const style = config[role || ''] || { label: role || 'Usuario', bg: 'bg-slate-50', text: 'text-slate-600' };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase border ${style.bg} ${style.text} border-current/10`}>
            {style.label}
        </span>
    );
};
