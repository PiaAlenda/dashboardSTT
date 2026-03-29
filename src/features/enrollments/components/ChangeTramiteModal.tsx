import { useState } from 'react';
import { X, Fingerprint, Check, AlertCircle, RotateCcw, Save, Hash } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface ChangeTramiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (dni: string, tramite: string) => Promise<any>;
}

export const ChangeTramiteModal = ({ isOpen, onClose, onUpdate }: ChangeTramiteModalProps) => {
    const [dni, setDni] = useState('');
    const [tramite, setTramite] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: () => onUpdate(dni, tramite),
    });

    if (!isOpen) return null;

    const handleDniChange = (val: string) => {
        const onlyNums = val.replace(/\D/g, '');
        setDni(onlyNums.slice(0, 8));
    };

    const handleTramiteChange = (val: string) => {
        const onlyNums = val.replace(/\D/g, '');
        setTramite(onlyNums.slice(0, 11));
    };

    const isTramiteValid = tramite.length === 11 && tramite.startsWith('00');
    const isFormValid = dni.length >= 7 && isTramiteValid;

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        setErrorMsg(null);
        mutation.mutate(undefined, {
            onError: (error: any) => {
                setErrorMsg(error.response?.data?.message || error.message || 'Error en el servidor');
            }
        });
    };

    const reset = () => {
        setDni('');
        setTramite('');
        setErrorMsg(null);
        mutation.reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-100">
                            <Save size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Actualizar Trámite</h2>
                    </div>
                    <button onClick={handleClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-all">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative flex flex-col">

                        {/* FORM STATE */}
                        {!mutation.isSuccess && !mutation.isError && (
                            <form onSubmit={handleUpdate} className="space-y-6 animate-in fade-in duration-500">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-orange-600 transition-colors">
                                            DNI del Titular
                                        </label>
                                        <div className="relative">
                                            <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="Ej: 35123456"
                                                value={dni}
                                                onChange={(e) => handleDniChange(e.target.value)}
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold text-lg focus:border-orange-500 focus:bg-white transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <div className="flex justify-between items-center mb-2 px-1">
                                            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest block group-focus-within:text-orange-600 transition-colors">
                                                N° Trámite (11 dígitos)
                                            </label>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${tramite.length === 11 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {tramite.length}/11
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <Hash className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${tramite.length > 0 && !tramite.startsWith('00') ? 'text-red-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={20} />
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="00123456789"
                                                value={tramite}
                                                onChange={(e) => handleTramiteChange(e.target.value)}
                                                className={`w-full pl-14 pr-6 py-4 border-2 rounded-2xl text-slate-700 font-bold text-lg transition-all outline-none
                                                    ${tramite.length > 0 && !tramite.startsWith('00')
                                                        ? 'border-red-200 bg-red-50 text-red-700 focus:border-red-400'
                                                        : 'bg-slate-50 border-slate-100 focus:border-orange-500 focus:bg-white'}
                                                `}
                                                required
                                            />
                                        </div>
                                        {tramite.length > 0 && !tramite.startsWith('00') && (
                                            <p className="flex items-center gap-1 text-[11px] text-red-500 font-bold mt-2 ml-1 animate-in slide-in-from-top-1">
                                                <AlertCircle size={12} /> Debe comenzar con "00"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isFormValid || mutation.isPending}
                                    className="w-full py-5 bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? "Procesando..." : "Confirmar Cambio"}
                                </button>

                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <AlertCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <p className="text-[10px] font-bold text-slate-500 leading-normal uppercase tracking-wider">
                                        Esta acción es irreversible. Se vinculará permanentemente al historial.
                                    </p>
                                </div>
                            </form>
                        )}


                        {/* SUCCESS STATE */}
                        {mutation.isSuccess && (
                            <div className="flex-1 flex flex-col items-center justify-center bg-emerald-50/50 rounded-[2rem] border-2 border-emerald-100 border-dashed p-8 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-200 rotate-3">
                                    <Check size={40} strokeWidth={4} />
                                </div>
                                <h3 className="text-2xl font-black text-emerald-900 tracking-tight uppercase text-center">¡Éxito Total!</h3>
                                <p className="text-emerald-700/80 font-medium text-center mt-3 max-w-[240px]">
                                    El trámite para el DNI <span className="font-bold text-emerald-900">{dni}</span> se actualizó correctamente.
                                </p>
                                <button onClick={reset} className="mt-8 flex items-center gap-2 px-6 py-3 bg-white border border-emerald-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 transition-all active:scale-95">
                                    <RotateCcw size={16} /> Volver a Empezar
                                </button>
                            </div>
                        )}

                        {/* ERROR STATE */}
                        {mutation.isError && (
                            <div className="flex-1 flex flex-col items-center justify-center bg-red-50/50 rounded-[2rem] border-2 border-red-100 border-dashed p-8 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-red-500 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-200 -rotate-3">
                                    <X size={40} strokeWidth={4} />
                                </div>
                                <h3 className="text-2xl font-black text-red-900 tracking-tight uppercase text-center">Algo salió mal</h3>
                                <p className="text-red-700/80 font-medium text-center mt-3 max-w-[240px]">
                                    {errorMsg}
                                </p>
                                <button onClick={reset} className="mt-8 flex items-center gap-2 px-6 py-3 bg-white border border-red-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-100 transition-all active:scale-95">
                                    <RotateCcw size={16} /> Reintentar Operación
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};