interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
}

export const Input = ({ label, icon, ...props }: InputProps) => (
    <div className="space-y-1">
        <label className="text-sm font-black uppercase tracking-tighter text-slate-500 ml-1">
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
            <input
                {...props}
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition-all focus:border-[#ff8200] focus:ring-4 focus:ring-[#ff8200]/5"
            />
        </div>
    </div>
);