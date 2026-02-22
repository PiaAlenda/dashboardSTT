import { Eye, Settings2, XCircle, RefreshCcw, AlertCircle } from 'lucide-react';
import type { Enrollment } from '../../../types';

interface EnrollmentActionsProps {
    enrollment: Enrollment;
    onViewDetail: (e: Enrollment) => void;
    onManageStatus: (e: Enrollment) => void;
    onReject: (e: Enrollment) => void;
    onDelete: (dni: string) => void;
    onReactivate: (dni: string) => void;
}

export const EnrollmentActions = ({
    enrollment: e,
    onViewDetail,
    onManageStatus,
    onReject,
    onDelete,
    onReactivate
}: EnrollmentActionsProps) => {
    const btnBase = "flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-300 active:scale-90 shadow-sm";

    return (
        <div className="flex items-center justify-center gap-2.5 w-full">
            {!e.deleted ? (
                <>
                    {/* Ver Detalle */}
                    <button
                        title="Ver Expediente"
                        onClick={() => onViewDetail(e)}
                        className={`${btnBase} bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-900 hover:border-slate-900 hover:text-white`}
                    >
                        <Eye size={18} strokeWidth={2.5} />
                    </button>

                    {/* Gestionar */}
                    <button
                        title="Gestionar Estado"
                        onClick={() => onManageStatus(e)}
                        className={`${btnBase} bg-orange-50 border-orange-100 text-[#ff8200] hover:bg-[#ff8200] hover:text-white`}
                    >
                        <Settings2 size={18} strokeWidth={2.5} />
                    </button>

                    {/* Rechazar */}
                    {e.status?.toUpperCase() !== 'RECHAZADO' && (
                        <button
                            title="Rechazar Solicitud"
                            onClick={() => onReject(e)}
                            className={`${btnBase} bg-red-50 border-red-100 text-red-500 hover:bg-red-500 hover:text-white`}
                        >
                            <XCircle size={18} strokeWidth={2.5} />
                        </button>
                    )}

                    {/* Eliminar/Suspender */}
                    <button
                        title="Suspender Registro"
                        onClick={() => onDelete(e.dni)}
                        className={`${btnBase} bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-500 hover:border-slate-500 hover:text-white transition-all`}
                    >
                        <AlertCircle size={18} strokeWidth={2.5} />
                    </button>
                </>
            ) : (
                /* Botón de Reactivación  */
                <button
                    onClick={() => onReactivate(e.dni)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-[0.15em] w-full"
                >
                    <RefreshCcw size={16} strokeWidth={3} className="animate-spin-slow" />
                    Reactivar Beneficiario
                </button>
            )}
        </div>
    );
};