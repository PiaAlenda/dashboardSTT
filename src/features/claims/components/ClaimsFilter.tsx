import { Clock, CheckCircle2 } from 'lucide-react';

interface Props {
    showAnswered: boolean;
    onChange: (value: boolean) => void;
}

export const ClaimsFilter = ({ showAnswered, onChange }: Props) => (
    <div className="flex bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200 shadow-inner">
        <button
            onClick={() => onChange(false)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] 2xl:text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                !showAnswered ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
            <Clock size={14} className={!showAnswered ? 'text-[#ff8200]' : ''} />
            Pendientes
        </button>
        <button
            onClick={() => onChange(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] 2xl:text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                showAnswered ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
            <CheckCircle2 size={14} className={showAnswered ? 'text-green-500' : ''} />
            Contestados
        </button>
    </div>
);