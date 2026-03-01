import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import {
    Users,
    LogOut,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    BarChart3,
    Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

export interface NavItem {
    label: string;
    icon: React.ElementType;
    path: string;
    roles: Role[];
    allowedUsernames?: string[];
}

export const NAV_ITEMS: NavItem[] = [
    { label: 'Inscripciones', icon: CreditCard, path: '/4a12b69c3dcb/000c66e873233b66', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_AUDITOR', 'ROLE_OBSERVER'] },
    { label: 'Reclamos', icon: MessageSquare, path: '/4a12b69c3dcb/f7e8d9c0b1a2', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_AUDITOR', 'ROLE_OBSERVER'] },
    { label: 'Usuarios', icon: Users, path: '/4a12b69c3dcb/d3e4f5a6b7c8', roles: ['ROLE_SUPER_ADMIN'] },
    { label: 'Reportes', icon: BarChart3, path: '/4a12b69c3dcb/a3b2c1d0e9f8', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_OBSERVER'] },
    { label: 'Configuración', icon: Settings, path: '/4a12b69c3dcb/c0nfig', roles: ['ROLE_SUPER_ADMIN'], allowedUsernames: ['falenda'] },
];

export const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate(); // Declaramos la función navigate
    const [isCollapsed, setIsCollapsed] = useState(false);

    const filteredItems = NAV_ITEMS.filter(item => {
        if (!user) return false;
        const hasRole = item.roles.includes(user.role as Role);
        const isUsernameAllowed = item.allowedUsernames ? item.allowedUsernames.includes(user.username) : true;
        return hasRole && isUsernameAllowed;
    });

    return (
        <>
            <div className={`hidden lg:block shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`} />

            <aside
                className={`fixed left-0 top-0 h-screen hidden lg:flex flex-col bg-[#f8f9fa] transition-all duration-300 border-r border-slate-200 z-50
                ${isCollapsed ? 'w-16' : 'w-60'}`}
            >
                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-24 bg-white text-slate-400 p-1 rounded-full border border-slate-200 hover:text-slate-600 shadow-sm transition-all z-[60] active:scale-90"
                >
                    {isCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
                </button>

                {/* Logo / Header */}
                <div className={`flex h-20 shrink-0 items-center px-4 transition-all ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="relative shrink-0">
                        {/* CORRECCIÓN AQUÍ: onClick={() => navigate('/')} */}
                        <div
                            className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-slate-200/60 border border-slate-100 cursor-pointer active:scale-95 transition-transform"
                            onClick={() => navigate('/')}
                        >
                            <img src="/favicon.png" alt="Logo" className="h-full w-full object-cover p-1" />
                        </div>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-500">
                            <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none">
                                Dashboard<span className="text-[#ff8400]">STT</span>
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">San Juan</span>
                        </div>
                    )}
                </div>

                <div className="w-full h-px bg-slate-200" />

                {/* NAV ITEMS */}
                <nav className="flex-1 px-2.5 mt-6 space-y-1 overflow-y-auto overflow-x-hidden">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                group relative flex items-center rounded-xl transition-all duration-200
                                ${isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2.5 gap-3'}
                                ${isActive ? 'bg-[#ff8400]/10 text-[#ff8400]' : 'text-slate-500 hover:bg-slate-100'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={18}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#ff8400]' : 'text-slate-400'}`}
                                    />

                                    {!isCollapsed && (
                                        <span className={`text-[13px] tracking-tight truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                                            {item.label}
                                        </span>
                                    )}

                                    {isCollapsed && (
                                        <div className="absolute left-14 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl z-[70] whitespace-nowrap">
                                            {item.label}
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* FOOTER */}
                <div className="p-3 mt-auto border-t border-slate-200 bg-white/40">
                    <button
                        onClick={logout}
                        className={`group relative flex items-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all
                            ${isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2.5 gap-3 w-full'}`}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span className="text-[13px] font-black uppercase tracking-tight">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};