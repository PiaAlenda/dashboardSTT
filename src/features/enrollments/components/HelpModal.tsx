import React from 'react';
import { X, CheckCircle2, Clock, AlertCircle, RefreshCcw, XCircle, HelpCircle, Ban } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const globalAnimation = (
        <style dangerouslySetInnerHTML={{
            __html: `
                @keyframes btn-help-active {
                    0%, 70%, 100% { transform: translateY(0) rotate(0); }
                    75% { transform: translateY(-5px) scale(1.1); }
                    80% { transform: translateY(-5px) rotate(-15deg); }
                    85% { transform: translateY(-5px) rotate(15deg); }
                    90% { transform: translateY(-5px) rotate(-15deg); }
                    95% { transform: translateY(0) scale(1); }
                }
            `
        }} />
    );

    const steps = [
        {
            icon: <RefreshCcw size={18} className="text-blue-500" />,
            bg: "bg-blue-50",
            title: 'En Proceso',
            desc: 'Revisión técnica en curso. Estado por defecto.'
        },
        {
            icon: <Clock size={18} className="text-[#ff8200]" />,
            bg: "bg-orange-50",
            title: 'Pendiente',
            desc: 'Evaluación inicial por el equipo administrativo.'
        },
        {
            icon: <CheckCircle2 size={18} className="text-emerald-500" />,
            bg: "bg-emerald-50",
            title: 'Aprobado',
            desc: 'Beneficiario validado y dado de alta en el padrón.'
        },
        {
            icon: <XCircle size={18} className="text-red-500" />,
            bg: "bg-red-50",
            title: 'Rechazado',
            desc: 'No cumple requisitos. Se especifica el motivo.'
        },
        {
            icon: <Ban size={18} className="text-slate-500" />,
            bg: "bg-slate-100",
            title: 'Cancelado',
            desc: 'Trámite desestimado o por vencimiento de plazos.'
        },
        {
            icon: <AlertCircle size={18} className="text-slate-400" />,
            bg: "bg-slate-100",
            title: 'Suspendido',
            desc: 'Inhabilitados temporalmente o borrado lógico.'
        }
    ];

    return (
        <>
            {globalAnimation}

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={onClose}
                >
                    <div
                        className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-[#ff8200] rounded-lg text-white shadow-md">
                                    <HelpCircle size={18} />
                                </div>
                                <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">Guía de Estados</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {steps.map((step, i) => (
                                <div key={i} className="flex gap-3 group items-start">
                                    <div className={`shrink-0 w-9 h-9 rounded-xl ${step.bg} flex items-center justify-center border border-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        {step.icon}
                                    </div>
                                    <div className="pt-0.5 text-left">
                                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{step.title}</h4>
                                        <p className="text-[11px] text-slate-500 leading-snug font-medium mt-0.5">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};