import { Calendar, Hash, MessageSquare, UserCircle2, Eye } from 'lucide-react';
import { ClaimStatusBadge } from './ClaimStatusBadge';
import type { Claim } from '../../../types';

interface ClaimCardProps {
    claim: Claim;
    onAction: (claim: Claim) => void;
}

export const ClaimCard = ({ claim, onAction }: ClaimCardProps) => {
    const sanitize = (text: string) => text?.replace(/"/g, '').trim() || '';
    const isAnswered = claim.status === 'RESPONDIDO' || claim.status === 'CONTESTADO';

    return (
        <div className="group relative flex flex-col bg-white rounded-[2.5rem] border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden border-1 border-orange-200">
            {/* Header*/}
            <div className="p-8 pb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-100 transition-transform group-hover:scale-105">
                        <Hash size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-slate-300 tracking-[0.15em] leading-none mb-1">Expediente</span>
                        <span className="text-xs font-bold text-slate-800 tracking-tight">{claim.trackingCode}</span>
                    </div>
                </div>
                <ClaimStatusBadge status={claim.status} />
            </div>

            {/* Motivo */}
            <div className="px-8 py-4">
                <h4 className="text-lg font-bold text-slate-800 leading-snug min-h-[3.5rem] group-hover:text-[#ff8200] transition-colors line-clamp-2">
                    {sanitize(claim.cause)}
                </h4>
            </div>

            <div className="mx-8 h-px bg-slate-50" />

            {/* Info */}
            <div className="px-8 py-5 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[8px] uppercase tracking-wider">
                        <UserCircle2 size={10} /> DNI
                    </div>
                    <span className="text-[11px] font-black text-slate-700">{claim.dni}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[8px] uppercase tracking-wider">
                        <Calendar size={10} /> Creado
                    </div>
                    <span className="text-[11px] font-black text-slate-700">
                        {new Date(claim.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 mt-auto">
                <button
                    onClick={() => onAction(claim)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98]
                        ${isAnswered
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                            : 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-[#ff8200] hover:shadow-orange-200'}`}
                >
                    {isAnswered ? <Eye size={14} /> : <MessageSquare size={14} />}
                    
                    {isAnswered ? 'Ver Respuesta' : 'Responder Reclamo'}
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff8200] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
};