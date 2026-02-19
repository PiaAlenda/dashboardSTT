import React from 'react';
import { Mail, User, Lock, Info, Fingerprint, History } from 'lucide-react';
import { useProfile } from '../features/profile/hooks/useProfile';
import { ProfileHeader } from '../features/profile/components/ProfileHeader';
import { InfoItem } from '../features/profile/components/ProfileInfoCard';

export const ProfilePage: React.FC = () => {
    const { user, creatorInfo } = useProfile();

    if (!user) return null;

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cabecera  */}
            <ProfileHeader
                firstName={user.firstName}
                lastName={user.lastName}
                role={user.role}
                dni={user.dni}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna de Datos Personales */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                            <h2 className="font-black uppercase text-xs tracking-[0.2em] text-slate-800">
                                Información de la Cuenta
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={User} label="Nombre de Usuario" value={user.username} />
                            <InfoItem icon={Mail} label="Correo Electrónico" value={user.email} />
                            <InfoItem icon={Fingerprint} label="DNI" value={user.dni} />
                            <InfoItem icon={Lock} label="Contraseña" value="********" isPassword />
                        </div>
                    </div>
                </div>

                {/* Columna de Auditoría */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                            <h2 className="font-black uppercase text-xs tracking-[0.2em] text-slate-800">
                                Auditoría de Creación
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Creado por:</span>
                                <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl text-white">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <History size={16} className="text-orange-400" />
                                    </div>
                                    <span className="font-bold text-sm">{creatorInfo.name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Registro:</span>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Info size={16} className="text-slate-400" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-600">{creatorInfo.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <p className="text-[9px] font-bold text-orange-600 uppercase tracking-tight leading-relaxed">
                                Nota: Esta información es de solo lectura. Para cambios de datos, contacte con el Super Administrador.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};