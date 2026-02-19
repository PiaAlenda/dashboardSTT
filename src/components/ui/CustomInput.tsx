import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

export const CustomInput = ({ label, icon, className = '', ...props }: InputProps) => {
    return (
        <div className={className}>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">{label}</label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#ff8200]">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-[#ff8200] block ${icon ? 'pl-11' : 'pl-4'} p-3.5 outline-none transition-all font-bold placeholder:text-slate-300 placeholder:font-normal`}
                    {...props}
                />
            </div>
        </div>
    );
};
