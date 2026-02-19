import { LayoutGrid, Info } from 'lucide-react';
import { useEnrollments } from '../features/enrollments/hooks/useEnrollments';
import { EnrollmentList } from '../features/enrollments/components/EnrollmentList';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

import { EnrollmentFilters } from '../features/enrollments/components/EnrollmentFilters';
import { EnrollmentToolbar } from '../features/enrollments/components/EnrollmentToolbar';
import { EnrollmentModals } from '../features/enrollments/components/EnrollmentModals';

export const EnrollmentPage = () => {
    const {
        enrollments, isLoading, searchTerm, setSearchTerm,
        selectedEnrollment, setSelectedEnrollment,
        filters, toggleFilter, activeTab, setActiveTab,
        history, loadingHistory,
        statusSelector, setStatusSelector,
        confirmAction, setConfirmAction,
        dniToDelete, setDniToDelete,
        statusMutation, deleteMutation,
        exportCsv, exportDates, setExportDates, isExporting
    } = useEnrollments();

    if (isLoading) return <LoadingOverlay message="Sincronizando Padrón de Beneficiarios..." />;

    return (
        <div className="max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-500 pb-10">
            <header className="px-2 flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-2xl text-[#ff8200] shadow-lg">
                    <LayoutGrid size={28} />
                </div>
                <div>
                    <h1 className="text-2xl 2xl:text-4xl font-black text-slate-800 tracking-tight">
                        Atención de <span className="text-[#ff8200]">Inscripciones</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Control operativo del sistema
                    </p>
                </div>
            </header>

            {/* CONTROLES: Filtros, Búsqueda y Exportación */}
            <section className="space-y-8">
                <EnrollmentFilters 
                    filters={filters} 
                    onToggle={toggleFilter} 
                />
                
                <EnrollmentToolbar 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                    exportProps={{
                        onExport: exportCsv,
                        loading: isExporting,
                        dates: exportDates,
                        setDates: setExportDates
                    }}
                />

                {/* Badge de métricas rápidas */}
                <div className="flex items-center gap-4 px-4 py-3 bg-blue-50/50 rounded-2xl border border-blue-100 max-w-fit mx-2">
                    <Info size={14} className="text-blue-500" />
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        {enrollments.length} {enrollments.length === 1 ? 'registro activo' : 'registros activos'}
                    </p>
                </div>
            </section>

            {/* CONTENIDO: Tabla o Listado de resultados */}
            <main className="w-full">
                {enrollments.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <EnrollmentList
                            enrollments={enrollments}
                            selectedEnrollmentId={selectedEnrollment?.dni}
                            onViewDetail={setSelectedEnrollment}
                            onManageStatus={(e) => setStatusSelector({ dni: e.dni, currentStatus: e.status || '' })}
                            onReject={(e) => setConfirmAction({ dni: e.dni, status: 'RECHAZADO', currentStatus: e.status || '' })}
                            onDelete={setDniToDelete}
                            onReactivate={(dni) => deleteMutation.mutate({ dni, reactivate: true })}
                        />
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 mx-2">
                        <p className="text-slate-400 font-bold italic">
                            No se encontraron inscripciones con los criterios seleccionados.
                        </p>
                    </div>
                )}
            </main>

            {/* CAPA DE DIÁLOGOS: Modales centralizados */}
            <EnrollmentModals 
                state={{ 
                    selectedEnrollment, activeTab, history, loadingHistory, 
                    statusSelector, confirmAction, dniToDelete, 
                    isSubmitting: statusMutation.isPending 
                }}
                actions={{ 
                    setSelectedEnrollment, setActiveTab, setStatusSelector, 
                    setConfirmAction, setDniToDelete, statusMutation, deleteMutation 
                }}
            />
        </div>
    );
};