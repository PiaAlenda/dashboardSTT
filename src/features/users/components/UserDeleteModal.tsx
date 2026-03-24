import { Trash2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';

interface UserDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    dni: string | null;
    onConfirm: (dni: string) => void;
}

export const UserDeleteModal = ({ isOpen, onClose, dni, onConfirm }: UserDeleteModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="¿Eliminar Usuario?"
            maxWidth="sm"
        >
            <div className="text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-all">
                    <Trash2 size={40} />
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Confirmar Acción</h3>
                <p className="text-xs text-slate-400 mb-8 max-w-[280px] mx-auto font-medium">
                    ¿Estás seguro de que deseas eliminar a este usuario? Esta acción marcará la cuenta como inactiva.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 font-black text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all font-sans"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => dni && onConfirm(dni)}
                        className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100 font-sans"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </Modal>
    );
};
