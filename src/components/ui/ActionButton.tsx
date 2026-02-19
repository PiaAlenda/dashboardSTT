import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    icon?: LucideIcon;
    isLoading?: boolean;
    children: React.ReactNode;
}

export const ActionButton = ({
    variant = 'primary',
    icon: Icon,
    isLoading,
    children,
    className = '',
    disabled,
    ...props
}: ActionButtonProps) => {
    const baseStyles = "flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#ff8200] text-white hover:bg-[#e67500] shadow-lg shadow-orange-200 hover:shadow-orange-300",
        secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200",
        danger: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-50"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : Icon ? (
                <Icon size={16} />
            ) : null}
            {children}
        </button>
    );
};
