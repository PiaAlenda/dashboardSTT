import { Trophy, Medal, MessageSquare, User as UserIcon } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';

interface RankingItem {
    name: string;
    count: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ranking: RankingItem[];
}

export const ClaimsRankingModal = ({ isOpen, onClose, ranking }: Props) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Top 10 - Resolutores de Reclamos"
            maxWidth="2xl"
        >
            <div className="p-2 space-y-6">
                <div className="flex items-center gap-4 bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                    <div className="p-4 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200 animate-bounce">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Cruce de Gestión</h3>
                        <p className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mt-1">
                            Usuarios con mayor índice de respuestas
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {ranking.length > 0 ? (
                        ranking.map((item, index) => (
                            <div
                                key={item.name}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${index === 0
                                    ? 'bg-slate-900 text-white border-slate-800 scale-[1.02] shadow-xl'
                                    : 'bg-white text-slate-700 border-slate-100 hover:border-orange-200 hover:shadow-md'
                                    }`}
                            >
                                {/* PUESTO */}
                                <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl font-black text-sm ${index === 0 ? 'bg-orange-500 text-white' :
                                    index === 1 ? 'bg-slate-200 text-slate-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                            'bg-slate-50 text-slate-400'
                                    }`}>
                                    {index === 0 ? <Medal size={18} /> : index + 1}
                                </div>

                                {/* USUARIO */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <UserIcon size={14} className={index === 0 ? 'text-orange-400' : 'text-slate-300'} />
                                        <p className="font-black text-xs uppercase tracking-wider truncate">
                                            {item.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-orange-500' : 'bg-slate-300'
                                                    }`}
                                                style={{ width: `${(item.count / ranking[0].count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* CONTADOR */}
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className={`text-lg font-black ${index === 0 ? 'text-[#ff8200]' : 'text-slate-900'}`}>
                                            {item.count}
                                        </span>
                                        <MessageSquare size={14} className="text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        Resueltos
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No hay datos suficientes para generar el ranking</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
