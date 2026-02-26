import { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Info, HelpCircle } from 'lucide-react';
import { useEnrollments } from '../features/enrollments/hooks/useEnrollments';
import { useAuth } from '../context/AuthContext';
import { EnrollmentList } from '../features/enrollments/components/EnrollmentList';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { EnrollmentFilters } from '../features/enrollments/components/EnrollmentFilters';
import { EnrollmentToolbar } from '../features/enrollments/components/EnrollmentToolbar';
import { EnrollmentModals } from '../features/enrollments/components/EnrollmentModals';
import { HelpModal } from '../features/enrollments/components/HelpModal';
import { Pagination } from '../components/ui/Pagination';

export const EnrollmentPage = () => {
    const { user } = useAuth();
    const [isHelpOpen, setIsHelpOpen] = useState(false);

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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const totalPages = Math.ceil(enrollments.length / itemsPerPage);
    const paginatedEnrollments = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return enrollments.slice(start, start + itemsPerPage);
    }, [enrollments, currentPage]);

    if (isLoading) return <LoadingOverlay message="Sincronizando Padrón de Beneficiarios..." />;

    return (
        <div className="max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-500 pb-10">
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

            <header className="px-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-[#ff8200] shadow-lg">
                        <LayoutGrid size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl 2xl:text-4xl font-black text-slate-800 tracking-tight">
                                Atención de <span className="text-[#ff8200]">Inscripciones</span>
                            </h1>
                            <button
                                onClick={() => setIsHelpOpen(true)}
                                className="p-1.5 text-slate-300 hover:text-[#ff8200] hover:bg-orange-50 rounded-lg transition-all active:scale-90"
                                style={{ animation: 'btn-help-active 3s ease-in-out infinite' }}
                            >
                                <HelpCircle size={22} strokeWidth={2.5} />
                            </button>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Control operativo del sistema
                        </p>
                    </div>
                </div>
            </header>

            <section className="space-y-8">
                <EnrollmentFilters filters={filters} onToggle={toggleFilter} />

                <EnrollmentToolbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showExport={user?.role === 'ROLE_SUPER_ADMIN'}
                    exportProps={{
                        onExport: exportCsv,
                        loading: isExporting,
                        dates: exportDates,
                        setDates: setExportDates
                    }}
                />

                <div className="flex items-center gap-4 px-4 py-3 bg-blue-50/50 rounded-2xl border border-blue-100 max-w-fit mx-2">
                    <Info size={14} className="text-blue-500" />
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        {enrollments.length} {enrollments.length === 1 ? 'registro activo' : 'registros activos'}
                    </p>
                </div>
            </section>

            <main className="w-full text-left">
                {paginatedEnrollments.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <EnrollmentList
                            enrollments={paginatedEnrollments}
                            selectedEnrollmentId={selectedEnrollment?.dni}
                            onViewDetail={setSelectedEnrollment}
                            onManageStatus={(e) => setStatusSelector({ dni: e.dni, currentStatus: e.status || '' })}
                            onReject={(e) => setConfirmAction({ dni: e.dni, status: 'RECHAZADO', currentStatus: e.status || '' })}
                            onDelete={setDniToDelete}
                            onReactivate={(dni) => deleteMutation.mutate({ dni, reactivate: true })}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
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