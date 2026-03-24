import { Clock } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { ActionButton } from '../../../components/ui/ActionButton';

interface UserHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: any[];
    isLoading: boolean;
}

export const UserHistoryModal = ({ isOpen, onClose, history, isLoading }: UserHistoryModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Historial de Acciones"
            maxWidth="xl"

        >
            <div className="max-h-[60vh] overflow-y-auto p-2">
                {isLoading ? (
                    <div className="text-center py-10 text-slate-400 font-bold animate-pulse">CARGANDO HISTORIAL...</div>
                ) : (history && history.length > 0) ? (
                    <div className="space-y-4">
                        {history.map((h) => (
                            <div key={h.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-[#ff8200]">
                                    <Clock size={16} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-xs uppercase text-[#ff8200]">{h.action}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">•</span>
                                        <span className="text-[10px] text-slate-400 font-bold">{new Date(h.changedAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{h.details}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Autor:</span>
                                        <span className="text-[10px] font-bold text-[#ff8200]">{h.changedBy || 'Sistema'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-400 font-bold">SIN REGISTROS DISPONIBLES</div>
                )}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex justify-end">
                <ActionButton onClick={onClose} variant="ghost">Cerrar</ActionButton>
            </div>
        </Modal>
    );
};
