import { useState } from 'react';
import { Lock, UserCircle, Briefcase, Eye, EyeOff, Fingerprint, AtSign, ShieldCheck, X, BadgeCheck, AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';

const FloatingInput = ({ label, icon: Icon, error, type = "text", showPasswordToggle, onTogglePassword, isPasswordVisible, success, ...props }: any) => {
    return (
        <div className="flex flex-col w-full group">
            <div className="relative">
                <input
                    {...props}
                    type={showPasswordToggle ? (isPasswordVisible ? 'text' : 'password') : type}
                    placeholder=" "
                    autoComplete="new-password"
                    className={`peer w-full bg-slate-50 border-2 text-sm pt-6 pb-2 px-4 outline-none transition-all rounded-xl text-slate-900
                        ${error
                            ? 'border-red-500 bg-red-50/50 focus:border-red-600'
                            : 'border-slate-200 focus:border-[#ff8200] focus:bg-white focus:ring-4 focus:ring-orange-500/10'}`}
                />

                <label className={`absolute left-4 transition-all duration-300 pointer-events-none uppercase font-black tracking-widest
                    ${error ? 'text-red-500' : 'text-slate-400 peer-focus:text-[#ff8200]'}
                    top-4 text-[10px] peer-focus:top-1.5 peer-focus:text-[9px] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[9px]`}>
                    {label}
                </label>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {success && !error && <BadgeCheck size={16} className="text-green-500" />}
                    {showPasswordToggle && (
                        <button type="button" onClick={onTogglePassword} className="text-slate-400 hover:text-slate-600 p-1">
                            {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    )}
                    {Icon && !success && <Icon size={16} className="text-slate-400 group-focus-within:text-[#ff8200] transition-colors" />}
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${error ? 'max-h-10 mt-1' : 'max-h-0'}`}>
                <div className="flex items-center gap-1.5 px-1">
                    <AlertCircle size={10} className="text-red-500" />
                    <span className="text-[9px] font-black text-red-500 uppercase italic leading-none">{error}</span>
                </div>
            </div>
        </div>
    );
};

export const UserCreateForm = ({ isOpen, onClose, formData, setFormData, onSubmit, isSubmitting }: any) => {
    const [showPass, setShowPass] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const passwordsMatch = formData.password && formData.password === confirmPassword;

    const validate = () => {
        const e: any = {};
        if (!formData.firstName) e.firstName = 'Requerido';
        if (!formData.lastName) e.lastName = 'Requerido';
        if (!formData.dni) e.dni = 'Obligatorio';
        if (!formData.email?.includes('@')) e.email = 'Email Inválido';
        if (formData.password?.length < 6) e.password = 'Muy corta';
        if (!passwordsMatch) e.confirmPassword = 'No coinciden';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Alta de Personal" maxWidth="4xl">
            <form className="p-1 md:p-2" onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(e); }} autoComplete="off">
                <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch">

                    {/* SECCIÓN DATOS */}
                    <div className="md:col-span-7 space-y-4 py-2 md:py-6">
                        <div className="flex items-center gap-2 mb-2 md:hidden">
                            <UserCircle size={18} className="text-[#ff8200]" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Datos Personales</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <FloatingInput
                                label="Nombre"
                                value={formData.firstName}
                                error={errors.firstName}
                                onChange={(e: any) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            <FloatingInput
                                label="Apellido"
                                value={formData.lastName}
                                error={errors.lastName}
                                onChange={(e: any) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>

                        <FloatingInput
                            label="DNI / Documento"
                            icon={Fingerprint}
                            value={formData.dni}
                            error={errors.dni}
                            onChange={(e: any) => setFormData({ ...formData, dni: e.target.value })}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FloatingInput
                                label="Usuario"
                                value={formData.username}
                                onChange={(e: any) => setFormData({ ...formData, username: e.target.value })}
                            />
                            <FloatingInput
                                label="Email"
                                icon={AtSign}
                                value={formData.email}
                                error={errors.email}
                                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* SECCIÓN SEGURIDAD */}
                    <div className="md:col-span-5 bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 text-white flex flex-col shadow-xl">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                            <div className="p-2 bg-orange-500 rounded-lg shrink-0">
                                <Lock size={16} className="text-white" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Credenciales y Acceso</h3>
                        </div>

                        <div className="space-y-4">
                            <FloatingInput
                                label="Contraseña"
                                type="password"
                                showPasswordToggle
                                isPasswordVisible={showPass}
                                onTogglePassword={() => setShowPass(!showPass)}
                                value={formData.password}
                                error={errors.password}
                                onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                            />

                            <FloatingInput
                                label="Confirmar"
                                type="password"
                                success={passwordsMatch}
                                error={errors.confirmPassword}
                                value={confirmPassword}
                                onChange={(e: any) => setConfirmPassword(e.target.value)}
                            />

                            <div className="space-y-2 pt-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Nivel de Privilegios</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white/5 border-2 border-white/10 text-white text-xs font-bold p-4 rounded-xl outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option className="bg-slate-800" value="ROLE_AUDITOR">AUDITOR</option>
                                        <option className="bg-slate-800" value="ROLE_ADMIN">ADMINISTRADOR</option>
                                        <option className="bg-slate-800" value="ROLE_SUPER_ADMIN">SUPER_ADMIN</option>
                                    </select>
                                    <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTONES ACCIÓN */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 border-t border-slate-100 pt-6 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="order-2 sm:order-1 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-all"
                    >
                        <X size={16} /> Descartar Cambios
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="order-1 sm:order-2 w-full sm:w-auto bg-[#ff8200] hover:bg-slate-800 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Procesando...' : 'Confirmar Alta'}
                        <ShieldCheck size={18} />
                    </button>
                </div>
            </form>
        </Modal>
    );
};