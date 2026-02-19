import { UserCircle, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { EnrollmentActions } from './EnrollmentActions';
import type { Enrollment } from '../../../types';

interface EnrollmentListProps {
    enrollments: Enrollment[];
    selectedEnrollmentId?: string;
    onViewDetail: (e: Enrollment) => void;
    onManageStatus: (e: Enrollment) => void;
    onReject: (e: Enrollment) => void;
    onDelete: (dni: string) => void;
    onReactivate: (dni: string) => void;
}

export const EnrollmentList = ({
    enrollments,
    selectedEnrollmentId,
    onViewDetail,
    onManageStatus,
    onReject,
    onDelete,
    onReactivate
}: EnrollmentListProps) => {

    if (enrollments.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-2 pt-2">
            {enrollments.map((e) => (
                <div
                    key={e.dni}
                    className={`group relative flex flex-col bg-white rounded-[3rem] p-8 transition-all duration-300 hover:-translate-y-2 border-2 
                        ${selectedEnrollmentId === e.dni
                            ? 'border-[#ff8200] shadow-2xl shadow-orange-500/10'
                            : 'border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50'
                        }`}
                >
                    {/* CABECERA */}
                    <div className="flex items-start justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4 min-w-0"> 
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 shrink-0
                                ${selectedEnrollmentId === e.dni ? 'bg-[#ff8200]' : 'bg-slate-900 group-hover:bg-[#ff8200]'}`}>
                                <UserCircle size={28} />
                            </div>

                            <div className="flex flex-col min-w-0 leading-tight">
                                <h3 className="text-sm md:text-base font-black text-slate-800 tracking-tight truncate group-hover:text-[#ff8200] transition-colors">
                                    {e.firstName}
                                </h3>
                                <p className="text-sm md:text-base font-black text-slate-400 tracking-tight uppercase truncate">
                                    {e.lastName}
                                </p>
                            </div>
                        </div>

                        {/* BADGE */}
                        <div className="shrink-0">
                            <StatusBadge status={e.status} isDeleted={e.deleted} />
                        </div>
                    </div>

                    {/* Mid */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-50">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Identificación</span>
                            <span className="text-xs font-black text-slate-700 tracking-tight">DNI {e.dni}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Categoría</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-lg">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Beneficiario</span>
                            </div>
                        </div>
                    </div>

                    {/* Detalle de Rechazo */}
                    {e.status?.toUpperCase() === 'RECHAZADO' && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-500">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={14} className="text-red-500" />
                                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Motivo del Rechazo</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">
                                {e.rejectionReasonName ? `"${e.rejectionReasonName}"` : 'Sin motivo especificado'}
                            </p>
                            {e.observation && (
                                <p className="mt-2 text-[10px] text-slate-400 font-medium leading-tight">
                                    Nota: {e.observation}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="mt-auto">
                        <EnrollmentActions
                            enrollment={e}
                            onViewDetail={onViewDetail}
                            onManageStatus={onManageStatus}
                            onReject={onReject}
                            onDelete={onDelete}
                            onReactivate={onReactivate}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};