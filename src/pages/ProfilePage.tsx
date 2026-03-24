import React, { useState, useEffect } from 'react';
import { Mail, User, Lock, Info, Fingerprint, History, Pencil, Save, X } from 'lucide-react';
import { useProfile } from '../features/profile/hooks/useProfile';
import { ProfileHeader } from '../features/profile/components/ProfileHeader';
import { InfoItem } from '../features/profile/components/ProfileInfoCard';

export const ProfilePage: React.FC = () => {
    const { user, creatorInfo, isEditing, setIsEditing, updateProfile, isLoading } = useProfile();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
            });
        }
    }, [user]);

    if (!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cabecera  */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <ProfileHeader
                    firstName={user.firstName}
                    lastName={user.lastName}
                    role={user.role}
                    dni={user.dni}
                />

                <div className="pb-4">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff8200] transition-all active:scale-95 shadow-lg shadow-slate-200"
                        >
                            <Pencil size={14} /> Editar Perfil
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                            >
                                <X size={14} /> Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-[#ff8200] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-orange-100 disabled:opacity-50"
                            >
                                <Save size={14} /> {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

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

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-[#ff8200] focus:bg-white transition-all text-sm font-bold text-slate-700"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Apellido</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-[#ff8200] focus:bg-white transition-all text-sm font-bold text-slate-700"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-[#ff8200] focus:bg-white transition-all text-sm font-bold text-slate-700"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="opacity-50 grayscale pointer-events-none">
                                    <InfoItem icon={Fingerprint} label="DNI (No editable)" value={user.dni} />
                                </div>
                                <div className="opacity-50 grayscale pointer-events-none">
                                    <InfoItem icon={User} label="Usuario (No editable)" value={user.username} />
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem icon={User} label="Nombre de Usuario" value={user.username} />
                                <InfoItem icon={Mail} label="Correo Electrónico" value={user.email} />
                                <InfoItem icon={Fingerprint} label="DNI" value={user.dni} />
                                <InfoItem icon={Lock} label="Contraseña" value="********" isPassword />
                            </div>
                        )}
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
                                {!isEditing
                                    ? "Para cambios de datos sensibles, contacte con el Super Administrador."
                                    : "Estás editando tus datos personales. El DNI y Usuario no pueden modificarse."}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};