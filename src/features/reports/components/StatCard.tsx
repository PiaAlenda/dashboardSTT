import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    trend?: string;
    valueSuffix?: string;
    color: 'orange' | 'green' | 'blue' | 'purple';
}

export const StatCard = ({ icon: Icon, label, value, trend, valueSuffix, color }: StatCardProps) => {
    const colors = {
        orange: 'bg-orange-50 text-orange-500 border-orange-100',
        green: 'bg-emerald-50 text-emerald-500 border-emerald-100',
        blue: 'bg-blue-50 text-blue-500 border-blue-100',
        purple: 'bg-purple-50 text-purple-500 border-purple-100'
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-lg">
            <div className={`p-4 rounded-2xl border ${colors[color]}`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-800 tracking-tight">{value}</span>
                    {valueSuffix && <span className="text-[10px] font-bold text-slate-400 uppercase">{valueSuffix}</span>}
                    {trend && (
                        <span className={`text-[10px] font-black ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
