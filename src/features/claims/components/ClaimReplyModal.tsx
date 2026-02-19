import { useState, useMemo } from 'react';
import {
    MessageSquare, Send, Mail, Calendar, User,
    CheckCircle2
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ActionButton } from '../../../components/ui/ActionButton';
import type { Claim } from '../../../types';

// ... imports

interface ClaimReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    claim: Claim | null;
    onAnswer: (id: number, text: string) => void;
    isSubmitting: boolean;
}

export const ClaimReplyModal = ({ isOpen, onClose, claim, onAnswer, isSubmitting }: ClaimReplyModalProps) => {
    const [answer, setAnswer] = useState('');

    const { userMessage, systemResponse, isAnswered } = useMemo(() => {
        if (!claim) return { userMessage: '', systemResponse: '', isAnswered: false };
        const sanitize = (val: any) => String(val || '').replace(/"/g, '').trim();
        return {
            userMessage: sanitize(claim.description || claim.comment),
            systemResponse: sanitize(claim.answer || claim.replyMessage),
            isAnswered: claim.status === 'RESPONDIDO' || claim.status === 'CONTESTADO'
        };
    }, [claim]);

    if (!claim) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isAnswered ? `Expediente Finalizado #${claim.trackingCode}` : `Gestión de Reclamo #${claim.trackingCode}`}
            maxWidth="2xl"
        >
            <div className="space-y-6 max-h-[75vh] md:max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar outline-none">

                {/* HEADER */}
                <div className="bg-slate-900 rounded-[24px] p-5 text-white shadow-xl sticky top-0 z-20 border border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                                <User className="text-orange-400" size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-black uppercase tracking-tight truncate">DNI {claim.dni}</h3>
                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 truncate">
                                    <Mail size={12} /> {claim.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center md:items-end justify-between md:flex-col gap-2">
                            <StatusBadge status={claim.status} />
                            <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase">
                                <Calendar size={10} /> {new Date(claim.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CUERPO */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <div className="w-1 h-3 bg-orange-500 rounded-full" />
                        <span className="font-black uppercase text-[9px] text-slate-400 tracking-widest">Consulta Recibida</span>
                    </div>
                    <div className="p-5 bg-white border border-slate-100 rounded-[20px] shadow-sm relative overflow-hidden group">
                        <MessageSquare className="absolute -right-4 -bottom-4 text-slate-50/50 group-hover:scale-110 transition-transform" size={80} />
                        <p className="relative z-10 text-slate-700 font-medium md:text-lg italic leading-relaxed break-words">
                            {userMessage ? `"${userMessage}"` : <span className="text-slate-300">Sin descripción adicional.</span>}
                        </p>
                    </div>
                </div>

                {/* SECCIÓN DE ACCIÓN */}
                {!isAnswered ? (
                    <div className="space-y-4 animate-in slide-in-from-bottom-3 duration-500">
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-1 h-3 bg-orange-500 rounded-full" />
                            <span className="font-black uppercase text-[9px] text-slate-400 tracking-widest">Tu Respuesta Oficial</span>
                        </div>
                        <textarea
                            className="w-full min-h-[160px] p-5 bg-slate-50 border-2 border-slate-100 rounded-[20px] text-slate-900 text-sm md:text-base outline-none focus:border-[#ff8200] transition-all resize-none shadow-inner"
                            placeholder="Escribe la respuesta que recibirá el ciudadano..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                        <ActionButton
                            onClick={() => onAnswer(claim.id, answer)}
                            disabled={isSubmitting || !answer.trim()}
                            isLoading={isSubmitting}
                            icon={Send}
                            className="w-full py-4 rounded-[20px] shadow-lg shadow-orange-500/10"
                        >
                            Enviar Respuesta
                        </ActionButton>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-1 h-3 bg-green-500 rounded-full" />
                            <span className="font-black uppercase text-[9px] text-slate-400 tracking-widest">Respuesta Enviada</span>
                        </div>
                        <div className="p-5 md:p-6 bg-green-50/50 border border-green-100 rounded-[20px] relative overflow-hidden group">
                            <CheckCircle2 className="absolute -right-4 -bottom-4 text-green-100 group-hover:scale-110 transition-transform" size={100} />
                            <p className="relative z-10 text-green-900 font-bold md:text-lg italic leading-relaxed break-words">
                                "{systemResponse || "No hay texto de respuesta registrado."}"
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-xl"
                        >
                            Cerrar Expediente
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};