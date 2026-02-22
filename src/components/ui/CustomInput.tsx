import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

export const CustomInput = ({ label, icon, className = '', ...props }: InputProps) => {
    return (
        <div className={`relative ${className}`}>
            <div className="relative group mt-2">
                {/* 1. Icono con z-index alto para quedar sobre el input */}
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#ff8200] z-10">
                        {icon}
                    </div>
                )}

                {/* 2. Input: El placeholder debe ser idéntico al label pero invisible */}
                <input
                    {...props}
                    placeholder={label}
                    className={`
                        peer w-full bg-white border-2 border-slate-100 text-slate-900 text-sm rounded-2xl 
                        focus:ring-4 focus:ring-orange-100 focus:border-[#ff8200] block 
                        ${icon ? 'pl-11' : 'pl-4'} p-4 outline-none transition-all font-bold 
                        placeholder-transparent
                    `}
                />

                {/* 3. El Label Flotante */}
                {/* - Por defecto está centrado y sobre el texto (text-slate-400).
                  - Cuando el input NO muestra el placeholder (porque hay texto) o tiene foco, sube.
                */}
                <label 
                    className={`
                        absolute transition-all duration-200 pointer-events-none cursor-text
                        /* Posición inicial (dentro del input) */
                        ${icon ? 'left-11' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 font-medium
                        
                        /* Posición al subir (Floating) */
                        peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-[#ff8200] peer-focus:bg-white peer-focus:px-2 peer-focus:uppercase peer-focus:tracking-widest
                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:text-[#ff8200] peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest
                    `}
                >
                    {label}
                </label>
            </div>
        </div>
    );
};