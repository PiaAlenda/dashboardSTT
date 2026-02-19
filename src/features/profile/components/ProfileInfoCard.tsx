import type { LucideIcon } from 'lucide-react';

interface InfoItemProps {
    icon: LucideIcon;
    label: string;
    value: string | undefined;
    isPassword?: boolean;
}

export const InfoItem = ({ icon: Icon, label, value, isPassword }: InfoItemProps) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="p-2.5 bg-white rounded-xl shadow-sm text-orange-500">
            <Icon size={18} />
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                {label}
            </span>
            <span className="text-sm font-bold text-slate-700">
                {isPassword ? '••••••••••••' : value || 'No especificado'}
            </span>
        </div>
    </div>
);