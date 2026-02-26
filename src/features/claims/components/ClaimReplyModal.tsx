import { useState, useMemo, useEffect } from 'react';
import {
    Send, User,
    CheckCircle2, History,
    ChevronLeft
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ActionButton } from '../../../components/ui/ActionButton';
import type { Claim } from '../../../types';

interface ClaimReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    claim: any;
    claims: Claim[];
    onAnswer: (id: number, text: string) => void;
    isSubmitting: boolean;
}

export const ClaimReplyModal = ({ isOpen, onClose, claim, claims = [], onAnswer, isSubmitting }: ClaimReplyModalProps) => {
    const [answerText, setAnswerText] = useState('');
    const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');

    // Resetear estado cuando cambia el reclamo o abre el modal
    useEffect(() => {
        if (isOpen) {
            setSelectedClaimId(null);
            setAnswerText('');
            setMobileView('chat');
        }
    }, [claim?.dni, isOpen]);

    const sortedClaims = useMemo(() => {
        return [...claims].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [claims]);

    const activeClaim = useMemo(() => {
        if (selectedClaimId) return claims.find(c => c.id === selectedClaimId);
        return [...claims].reverse().find(c => c.status === 'PENDIENTE') || claims[claims.length - 1];
    }, [claims, selectedClaimId]);

    if (!claim || !activeClaim) return null;

    const sanitize = (val: any) => String(val || '').replace(/"/g, '').trim();

    // Extraemos el nombre del auditor o quien respondió
    const responderName = activeClaim.answeredBy || activeClaim.auditorName || activeClaim.userName || "el Auditor";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Historial de Reclamos - DNI ${claim.dni}`}
            maxWidth="3xl"
        >
            <div className="flex flex-col md:flex-row h-[75vh] md:h-[80vh] overflow-hidden -m-6 bg-slate-50">

                {/* Lateral: Lista de Reclamos (Timeline) */}
                <div className={`w-full md:w-80 bg-white border-r border-slate-100 flex flex-col h-full shrink-0 transition-all duration-300
                    ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="p-6 border-b border-slate-50 bg-slate-900 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                <History size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Conversaciones</h4>
                                <p className="text-sm font-black text-white">{claims.length} registros</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto grow custom-scrollbar p-4 space-y-3">
                        {sortedClaims.map((c, idx) => {
                            const isSelected = activeClaim.id === c.id;
                            const isPending = c.status === 'PENDIENTE';

                            return (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        setSelectedClaimId(c.id);
                                        setMobileView('chat');
                                    }}
                                    className={`w-full text-left p-4 rounded-[1.5rem] border-2 transition-all duration-300 relative overflow-hidden group
                                        ${isSelected
                                            ? 'bg-orange-50 border-orange-200 shadow-lg shadow-orange-500/5'
                                            : 'bg-white border-slate-50 hover:border-slate-100'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md
                                            ${isPending ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            #{idx + 1}
                                        </span>
                                        <span className="text-[8px] font-black text-slate-300 uppercase">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h5 className={`text-[11px] font-black uppercase tracking-tight line-clamp-1 mb-1 transition-colors
                                        ${isSelected ? 'text-orange-600' : 'text-slate-600'}`}>
                                        {sanitize(c.cause)}
                                    </h5>
                                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1 italic">
                                        {sanitize(c.description || c.comment)}
                                    </p>

                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Principal: Chat View */}
                <div className={`grow flex flex-col min-w-0 bg-slate-50/50 transition-all duration-300
                    ${mobileView === 'chat' ? 'flex' : 'hidden md:flex'}`}>
                    {/* Inbox Header */}
                    <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {/* Botón Volver (Solo Móvil) */}
                            <button
                                onClick={() => setMobileView('list')}
                                className="md:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                                <User size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase leading-none mb-1 truncate">{sanitize(activeClaim.cause)}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">ID {activeClaim.trackingCode}</span>
                                    <StatusBadge status={activeClaim.status} className="scale-75 origin-left" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Bubbles */}
                    <div className="grow overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar">
                        {/* Mensaje del Ciudadano */}
                        <div className="flex flex-col gap-2 max-w-[90%] md:max-w-[85%] animate-in slide-in-from-left-4 duration-500">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-4">Ciudadano • {new Date(activeClaim.createdAt).toLocaleTimeString()}</span>
                            <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm relative">
                                <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed">
                                    {sanitize(activeClaim.description || activeClaim.comment) || "Sin descripción adicional."}
                                </p>
                            </div>
                        </div>

                        {/* Respuesta del Auditor (Nombre Dinámico) */}
                        {(activeClaim.status === 'RESPONDIDO' || activeClaim.status === 'CONTESTADO') && (
                            <div className="flex flex-col items-end gap-2 max-w-[90%] md:max-w-[85%] ml-auto animate-in slide-in-from-right-4 duration-500 text-right">
                                <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] pr-4 flex items-center gap-1.5 flex-wrap justify-end">
                                    <CheckCircle2 size={12} />
                                    Respondido por <span className="text-slate-900 underline decoration-orange-500/20">{responderName}</span> • {activeClaim.answeredAt ? new Date(activeClaim.answeredAt).toLocaleTimeString() : ''}
                                </span>
                                <div className="bg-slate-900 text-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] rounded-tr-none shadow-xl shadow-slate-900/10 border border-slate-800 relative">
                                    <p className="font-bold text-sm md:text-base leading-relaxed">
                                        {sanitize(activeClaim.answer || activeClaim.replyMessage) || "Sin respuesta guardada."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
                        {activeClaim.status === 'PENDIENTE' ? (
                            <div className="space-y-4">
                                <textarea
                                    className="w-full min-h-[80px] md:min-h-[100px] p-4 md:p-5 bg-slate-50 border-2 border-slate-100 rounded-[20px] text-slate-900 text-sm outline-none focus:border-orange-500 transition-all resize-none shadow-inner"
                                    placeholder="Escribe la respuesta oficial..."
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <ActionButton
                                        onClick={() => onAnswer(activeClaim.id, answerText)}
                                        disabled={isSubmitting || !answerText.trim()}
                                        isLoading={isSubmitting}
                                        icon={Send}
                                        className="h-12 md:h-14 grow rounded-[20px] shadow-lg shadow-orange-500/10"
                                    >
                                        Enviar Respuesta
                                    </ActionButton>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Este reclamo ya ha sido atendido</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};