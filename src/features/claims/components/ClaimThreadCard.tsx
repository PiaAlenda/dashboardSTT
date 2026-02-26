import { UserCircle2, MessageCircle, ChevronRight, Mail, Calendar } from 'lucide-react';
import type { Claim } from '../../../types';

interface ClaimThread {
    dni: string;
    name: string;
    email: string;
    claims: Claim[];
    lastUpdate: string;
    totalClaims: number;
}

interface ClaimThreadCardProps {
    thread: ClaimThread;
    onAction: (thread: any) => void;
}

export const ClaimThreadCard = ({ thread, onAction }: ClaimThreadCardProps) => {
    const latestClaim = thread.claims[0];
    const getPreviewText = (text: string) => {
        const cleanText = text?.replace(/"/g, '').trim() || 'Sin descripción...';
        return cleanText.length > 110 ? `${cleanText.substring(0, 110)}...` : cleanText;
    };

    return (
        <div className="group relative flex flex-col w-full h-[400px] bg-white rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">
            
            {/* HEADER  */}
            <div className="p-6 sm:p-7 pb-3 shrink-0">
                <div className="flex justify-between items-start gap-2 mb-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-[#ff8200] transition-colors duration-500 shadow-lg">
                            <UserCircle2 className="w-6 h-6" />
                        </div>
                        {thread.claims.some(c => c.status === 'PENDIENTE') && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full animate-pulse" />
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                        <Calendar size={10} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-wider">
                            {new Date(thread.lastUpdate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="min-w-0">
                    <h3 className="text-base font-black text-slate-800 uppercase truncate tracking-tight group-hover:text-[#ff8200] transition-colors">
                        {thread.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DNI {thread.dni}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black text-[#ff8200] uppercase tracking-widest">{thread.totalClaims} Reclamos</span>
                    </div>
                </div>
            </div>

            {/* CONTACTO */}
            <div className="px-6 sm:px-7 pb-3 shrink-0">
                <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100/50 w-full sm:w-fit">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate lowercase">
                        {thread.email}
                    </span>
                </div>
            </div>
            
            <div className="px-6 sm:px-7 py-2 grow flex flex-col justify-center">
                <div className="bg-slate-50/50 rounded-[1.5rem] p-4 border border-dashed border-slate-200 group-hover:border-orange-200/50 transition-all">
                    <div className="flex items-center gap-2 mb-1.5">
                        <MessageCircle size={10} className="text-orange-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">
                            Motivo: {latestClaim.cause}
                        </span>
                    </div>
                    <p className="text-[12px] font-medium text-slate-600 leading-snug italic line-clamp-2">
                        "{getPreviewText(latestClaim.description || latestClaim.comment)}"
                    </p>
                </div>
            </div>

            {/* FOOTER  */}
            <div className="p-6 sm:p-7 pt-2 shrink-0">
                <button
                    onClick={() => onAction(thread)}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#ff8200] transition-all active:scale-[0.97]"
                >
                    <span className="truncate mr-2">Ver Conversación</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
            </div>
        </div>
    );
};