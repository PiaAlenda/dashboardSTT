import { ExternalLink, AlertCircle, Settings2, XCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Enrollment } from '../../../types';
import { EnrollmentFilePreview } from './EnrollmentFilePreview';
import { enrollmentService } from '../../../services/enrollmentService';

interface EnrollmentInfoProps {
    enrollment: Enrollment;
    onManageStatus?: (e: Enrollment) => void;
    onReject?: (e: Enrollment) => void;
    onDelete?: (dni: string) => void;
}

export const EnrollmentInfo = ({ enrollment, onManageStatus, onReject, onDelete }: EnrollmentInfoProps) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const handleDocumentationClick = async () => {
        setIsChecking(true);
        try {
            await enrollmentService.getFileBlob(enrollment.dni);
            setIsPreviewOpen(true);
        } catch (err) {
            console.error("Error checking document:", err);
            alert("No tiene ningún archivo subido esta persona.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-4">
                {/* Header */}
                <div className="p-6 bg-slate-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
                    <div className="flex items-center gap-5 min-w-0 w-full">
                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-xl font-black shrink-0">
                            {enrollment.firstName?.[0]}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-lg md:text-xl font-black truncate">{enrollment.firstName} {enrollment.lastName}</h3>
                            <p className="text-xs font-bold text-slate-400 truncate">{enrollment.email}</p>
                        </div>
                    </div>

                    {/* BOTONES DE LA IMAGEN */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => onManageStatus?.(enrollment)}
                            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors border border-orange-100/50"
                        >
                            <Settings2 size={20} />
                        </button>
                        <button
                            onClick={() => onReject?.(enrollment)}
                            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100/50"
                        >
                            <XCircle size={20} />
                        </button>
                        <button
                            onClick={() => onDelete?.(enrollment.dni)}
                            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100/50"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Detalle de Rechazo */}
                {enrollment.status?.toUpperCase() === 'RECHAZADO' && (
                    <div className="p-5 bg-red-50 border border-red-100 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-700">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shadow-sm shadow-red-200">
                                <AlertCircle size={16} />
                            </div>
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Motivo del Rechazo</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed italic ml-10">
                            {enrollment.rejectionReasonName ? `"${enrollment.rejectionReasonName}"` : 'Sin motivo especificado'}
                        </p>
                        {enrollment.observation && (
                            <div className="mt-4 pt-4 border-t border-red-100/50 ml-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Observación Administrativa</p>
                                <p className="text-xs font-medium text-slate-500 leading-tight">
                                    {enrollment.observation}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Grilla de Datos Técnicos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Identificación</p>
                        <p className="text-xs font-bold text-slate-700">DNI: {enrollment.dni}</p>
                        {enrollment.dniTramite && (
                            <p className="text-xs font-bold text-slate-700">TRÁMITE: {enrollment.dniTramite}</p>
                        )}
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Tipo de Beneficiario</p>
                        <p className="text-xs font-bold text-slate-700">{enrollment.beneficiaryType || '---'}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Institución Educativa</p>
                        <p className="text-xs font-bold text-slate-700 leading-tight">{enrollment.schoolName || 'No especificada'}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Nivel de Estudios</p>
                        <p className="text-xs font-bold text-slate-700">{enrollment.educationLevel || '---'}</p>
                    </div>
                    {/*{(enrollment.courseGrade || enrollment.courseDivision) && (
                        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Curso / División</p>
                            <p className="text-xs font-bold text-slate-700">
                                {enrollment.courseGrade || ''} {enrollment.courseDivision || ''}
                            </p>
                        </div>
                    )}*/}
                </div>
            </div>

            {/* Documentación */}
            <div className="space-y-3">
                <button
                    onClick={handleDocumentationClick}
                    disabled={isChecking}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-orange-400 hover:text-orange-500 transition-all hover:bg-orange-50/50 group w-full disabled:opacity-50 h-full min-h-[160px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        {isChecking ? (
                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ExternalLink size={24} />
                        )}
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] font-black uppercase tracking-tighter">
                            {isChecking ? 'Verificando...' : 'Documentación'}
                        </span>
                        <span className="text-[9px] font-bold opacity-60 italic">Ver archivo PDF</span>
                    </div>
                </button>
            </div>

            <EnrollmentFilePreview
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                dni={enrollment.dni}
                fullName={`${enrollment.firstName} ${enrollment.lastName}`}
            />
        </div>
    );
};