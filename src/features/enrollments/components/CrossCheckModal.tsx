import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, Activity, Repeat } from 'lucide-react';
import { enrollmentService } from '../../../services/enrollmentService';
import { Modal } from '../../../components/ui/Modal';

interface CrossCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CrossCheckModal: React.FC<CrossCheckModalProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExecute = async () => {
        setStatus('processing');
        setError(null);

        try {
            const data = await enrollmentService.crossCheck();
            setResult(data);
            setStatus('success');
        } catch (err: any) {
            console.error('Error in cross-check:', err);
            setError(err.response?.data?.message || err.message || 'Error desconocido al ejecutar el cruce.');
            setStatus('error');
        }
    };

    const handleClose = () => {
        if (status !== 'processing') {
            onClose();
            setTimeout(() => {
                setStatus('idle');
                setResult(null);
                setError(null);
            }, 300);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Cruce de Inscripciones" maxWidth="md">
            <div className="space-y-8 py-4">
                {status === 'idle' && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-[#ff8200] shadow-xl shadow-orange-100/50 animate-in zoom-in duration-500">
                            <Repeat size={40} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Sincronización Manual</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-[280px]">
                                Al iniciar, el sistema realizará el cruce de padrones educativos contra las inscripciones actuales de forma automática.
                            </p>
                        </div>
                        <button
                            onClick={handleExecute}
                            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#ff8200] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
                        >
                            <Play size={18} fill="currentColor" />
                            Ejecutar Procedimiento
                        </button>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="flex flex-col items-center py-10 space-y-8 text-center">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-slate-100 border-t-[#ff8200] rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-[#ff8200]">
                                <Activity size={32} className="animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight animate-pulse">Procesando Datos</h4>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                Esto puede tardar unos momentos...
                            </p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-100">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-emerald-600 uppercase tracking-tight">Cruce Completado</h4>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                El procedimiento se ha ejecutado con éxito en el servidor.
                            </p>
                        </div>

                        {result && (
                            <div className="w-full bg-slate-50 rounded-3xl p-6 border border-slate-100 text-left">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Resumen del Servidor</span>
                                <div className="space-y-3">
                                    {Object.entries(result).map(([key, value]) => (
                                        <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-200/50 last:border-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{key}</span>
                                            <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 break-all sm:break-normal">
                                                {String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleClose}
                            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#ff8200] transition-colors shadow-lg"
                        >
                            Finalizar
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-xl shadow-red-100">
                            <AlertCircle size={48} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-red-600 uppercase tracking-tight">Fallo en la Operación</h4>
                            <p className="text-red-400/80 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[280px]">
                                {error}
                            </p>
                        </div>
                        <div className="flex flex-col w-full gap-3">
                            <button
                                onClick={handleExecute}
                                className="w-full py-5 bg-red-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 transition-colors shadow-lg"
                            >
                                Reintentar
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-slate-600 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
