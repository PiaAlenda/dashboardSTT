import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex h-20 lg:h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 2xl:px-12">
            <div className="flex h-full items-center justify-between max-w-[1600px] mx-auto w-full">
                <div className="flex items-center h-full py-4">
                    <div className="relative h-full flex items-center group cursor-pointer">
                        <a className='relative h-full flex items-center group cursor-pointer' href="https://sj.sanjuan.gob.ar/" target="_blank" rel="noopener noreferrer">
                            <img
                                src="/stt_banner.png"
                                alt="Banner Institucional"
                                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                            />
                        </a>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="h-10 w-px bg-slate-100 hidden md:block" />

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-800 leading-tight uppercase tracking-tight">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <div className="flex items-center justify-end gap-2 mt-0.5">
                                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                                    user?.role === 'ROLE_SUPER_ADMIN' ? 'bg-purple-500' :
                                    user?.role === 'ROLE_ADMIN' ? 'bg-[#ff8200]' : 'bg-blue-500'
                                }`} />
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    {user?.role?.replace('ROLE_', '')}
                                </p>
                            </div>
                        </div>

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`flex h-12 w-12 items-center justify-center rounded-[1.25rem] transition-all duration-300 shadow-lg cursor-pointer
                                    ${isMenuOpen ? 'bg-[#ff8200] scale-95 shadow-orange-200' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'}`}
                            >
                                <UserCircle size={24} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuenta</p>
                                    </div>
                                    <button
                                        onClick={() => { navigate('/perfil'); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#ff8200] transition-colors"
                                    >
                                        <UserIcon size={18} /> Mi Perfil
                                    </button>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={18} /> Cambiar de Usuario
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};