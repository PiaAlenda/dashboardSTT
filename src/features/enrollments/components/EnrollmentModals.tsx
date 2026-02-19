import { useState } from 'react';
import {
    Settings2, Clock, RefreshCcw, CheckCircle2,
    XCircle, X, Trash2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge as StatusBadgeUI } from '../../../components/ui/StatusBadge';
import { masterDataService } from '../../../services/masterDataService';
import { EnrollmentInfo } from './EnrollmentInfo';
import { EnrollmentHistory } from './EnrollmentHistory';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    enrollment: any;
    activeTab: string;
    setActiveTab: (val: string) => void;
    history: any[];
    loadingHistory: boolean;
    onManageStatus: (e: { dni: string; status?: string }) => void;
    onReject: (e: { dni: string; status?: string }) => void;
    onDelete: (dni: string) => void;
}

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    dni: string;
    currentStatus: string;
    onUpdateStatus: (dni: string, status: string) => void;
}

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    dni: string;
    currentStatus: string;
    onConfirm: (dni: string, reasonId: number | string, observation: string) => void;
    isSubmitting: boolean;
}

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    dni: string | null;
    onConfirm: (dni: string) => void;
}

interface EnrollmentModalsProps {
    state: {
        selectedEnrollment: any;
        activeTab: string;
        history: any[];
        loadingHistory: boolean;
        statusSelector: { dni: string; currentStatus: string } | null;
        confirmAction: { dni: string; status: string; currentStatus: string } | null;
        dniToDelete: string | null;
        isSubmitting: boolean;
    };
    actions: {
        setSelectedEnrollment: (val: any) => void;
        setActiveTab: (val: string) => void;
        setStatusSelector: (val: any) => void;
        setConfirmAction: (val: any) => void;
        setDniToDelete: (val: any) => void;
        statusMutation: any;
        deleteMutation: any;
    };
}
export const EnrollmentModals = ({ state, actions }: EnrollmentModalsProps) => {
    return (
        <>
            {/* MODAL DE DETALLE DETALLADO */}
            <DetailModal
                isOpen={!!state.selectedEnrollment}
                onClose={() => actions.setSelectedEnrollment(null)}
                enrollment={state.selectedEnrollment}
                activeTab={state.activeTab}
                setActiveTab={actions.setActiveTab}
                history={state.history}
                loadingHistory={state.loadingHistory}
                onManageStatus={(e) => actions.setStatusSelector({ dni: e.dni, currentStatus: e.status || '' })}
                onReject={(e) => actions.setConfirmAction({ dni: e.dni, status: 'RECHAZADO', currentStatus: e.status || '' })}
                onDelete={actions.setDniToDelete}
            />

            {/* MODAL DE CAMBIO DE ESTADO */}
            <StatusModal
                isOpen={!!state.statusSelector}
                onClose={() => actions.setStatusSelector(null)}
                dni={state.statusSelector?.dni || ''}
                currentStatus={state.statusSelector?.currentStatus || ''}
                onUpdateStatus={(dni, status) => actions.statusMutation.mutate({ dni, status })}
            />

            {/* MODAL DE RECHAZO CON MOTIVOS */}
            <RejectModal
                isOpen={!!state.confirmAction}
                onClose={() => actions.setConfirmAction(null)}
                dni={state.confirmAction?.dni || ''}
                currentStatus={state.confirmAction?.currentStatus || ''}
                onConfirm={(dni, reasonId, observation) =>
                    actions.statusMutation.mutate({ dni, status: 'RECHAZADO', rejectionReasonId: reasonId, observation })
                }
                isSubmitting={state.isSubmitting}
            />

            {/* MODAL DE ELIMINACIÓN/SUSPENSIÓN */}
            <DeleteModal
                isOpen={!!state.dniToDelete}
                onClose={() => actions.setDniToDelete(null)}
                dni={state.dniToDelete}
                onConfirm={(dni) => actions.deleteMutation.mutate({ dni })}
            />
        </>
    );
};

// --- SUB-COMPONENTES PRIVADOS ---

const DetailModal = ({ isOpen, onClose, enrollment, activeTab, setActiveTab, history, loadingHistory, onManageStatus, onReject, onDelete }: DetailModalProps) => {
    if (!isOpen || !enrollment) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="relative z-10 bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
                    <div className="flex gap-5 items-center">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-orange-500 flex items-center justify-center text-white shadow-lg capitalize text-2xl font-black">
                            {enrollment.firstName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{enrollment.firstName} {enrollment.lastName}</h2>
                            <div className="flex items-center gap-3 mt-1.5">
                                <StatusBadgeUI status={enrollment.status} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-lg">DNI: {enrollment.dni}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"><X size={24} /></button>
                </div>
                <div className="flex px-10 pt-4 bg-white">
                    <TabButton label="Perfil Detallado" active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                    <TabButton label="Historial Operativo" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                </div>
                <div className="p-8 overflow-y-auto grow custom-scrollbar bg-slate-50/20">
                    {activeTab === 'info' ? <EnrollmentInfo enrollment={enrollment} onManageStatus={onManageStatus} onReject={onReject} onDelete={onDelete} /> : <EnrollmentHistory history={history} isLoading={loadingHistory} />}
                </div>
                <div className="p-6 bg-white border-t flex justify-end px-10">
                    <button onClick={onClose} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#ff8200] transition-all">Cerrar Expediente</button>
                </div>
            </div>
        </div>
    );
};

const StatusModal = ({ isOpen, onClose, dni, currentStatus, onUpdateStatus }: StatusModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestionar Estado" maxWidth="sm">
        <div className="text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Settings2 size={32} /></div>
            <div className="flex flex-col gap-3">
                {['PENDIENTE', 'EN_PROCESO', 'APROBADO'].map((status) => (
                    currentStatus.toUpperCase() !== status && (
                        <button key={status} onClick={() => { onUpdateStatus(dni, status); onClose(); }} className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 transition-all ${status === 'PENDIENTE' ? 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white' :
                                status === 'EN_PROCESO' ? 'bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white' :
                                    'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white'
                            }`}>
                            {status === 'PENDIENTE' ? <Clock size={16} /> : status === 'EN_PROCESO' ? <RefreshCcw size={16} /> : <CheckCircle2 size={16} />}
                            {status.replace('_', ' ')}
                        </button>
                    )
                ))}
            </div>
            <button onClick={onClose} className="w-full mt-6 py-4 text-slate-400 font-black uppercase text-[10px] hover:text-red-500 transition-colors">Cancelar</button>
        </div>
    </Modal>
);

const RejectModal = ({ isOpen, onClose, dni, currentStatus, onConfirm, isSubmitting }: RejectModalProps) => {
    const [reasonId, setReasonId] = useState<number | ''>('');
    const [observation, setObservation] = useState('');
    const { data: reasons = [] } = useQuery({ queryKey: ['rejection-reasons'], queryFn: masterDataService.getRejectionReasons, enabled: isOpen });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Rechazo" maxWidth="md">
            <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4"><XCircle size={32} /></div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Motivo de Rechazo</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">DNI: {dni} • Estado: {currentStatus}</p>
                </div>
                <div className="space-y-4">
                    <select value={reasonId} onChange={(e) => setReasonId(Number(e.target.value))} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-red-500/50 transition-all">
                        <option value="">-- Seleccionar motivo --</option>
                        {reasons.filter((r: any) => r.active).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <textarea value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Observaciones..." className="w-full min-h-[100px] p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none resize-none" />
                </div>
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-slate-100 font-black text-slate-400 uppercase text-[10px]">Cancelar</button>
                    <button onClick={() => onConfirm(dni, reasonId, observation)} disabled={!reasonId || isSubmitting} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] shadow-lg shadow-red-200">{isSubmitting ? '...' : 'Rechazar Ahora'}</button>
                </div>
            </div>
        </Modal>
    );
};

const DeleteModal = ({ isOpen, onClose, dni, onConfirm }: DeleteModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Suspender solicitud?" maxWidth="sm">
        <div className="text-center">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Trash2 size={40} /></div>
            <p className="text-xs text-slate-400 mb-8 max-w-[280px] mx-auto">El registro se moverá a la papelera. Podrás recuperarlo desde el filtro "Suspendidas".</p>
            <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-slate-100 font-black text-slate-400 uppercase text-[10px]">Volver</button>
                <button onClick={() => dni && onConfirm(dni)} className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] hover:bg-orange-600 transition-all">Suspender</button>
            </div>
        </div>
    </Modal>
);

const TabButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`py-4 px-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${active ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{label}</button>
);