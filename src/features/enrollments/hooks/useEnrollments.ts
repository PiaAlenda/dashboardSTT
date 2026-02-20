import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../../../services/enrollmentService';
import { masterDataService } from '../../../services/masterDataService';
import type { Enrollment } from '../../../types';

export const useEnrollments = () => {
    const queryClient = useQueryClient();

    // Estados de UI
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
    const [dniToDelete, setDniToDelete] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ dni: string; status: string; currentStatus: string } | null>(null);
    const [statusSelector, setStatusSelector] = useState<{ dni: string; currentStatus: string } | null>(null);
    const [activeTab, setActiveTab] = useState('info');

    // Estado para exportación CSV
    const [exportDates, setExportDates] = useState({ start: '', end: '' });
    const [isExporting, setIsExporting] = useState(false);

    // Estado de Filtros (Solo uno activo a la vez por tu lógica de toggleFilter)
    const [filters, setFilters] = useState({
        PENDIENTE: false,
        EN_PROCESO: false,
        APROBADO: false,
        RECHAZADO: false,
        CANCELADO: false,
        SUSPENDIDO: false
    });

    // Queries: Datos maestros y lista principal
    const { data: rawData, isLoading } = useQuery({
        queryKey: ['enrollments'],
        queryFn: enrollmentService.getAll,
    });

    const { data: rejectionReasons = [] } = useQuery({
        queryKey: ['rejection-reasons'],
        queryFn: masterDataService.getRejectionReasons,
    });

    // Normalización: Inyectamos el nombre del motivo de rechazo si falta
    const allEnrollments = useMemo((): Enrollment[] => {
        if (!rawData) return [];
        const list: Enrollment[] = Array.isArray(rawData) ? rawData : (rawData.data || []);

        return list.map(e => {
            // Normalización de DNI Trámite (por si viene snake_case, tramite, o customField1)
            const dTramite = e.dniTramite || (e as any).dni_tramite || (e as any).tramite || (e as any).numero_tramite || e.customField1 || (e as any).custom_field1;

            let rejectionReasonName = e.rejectionReasonName || e.rejectionReason;

            if (e.status?.toUpperCase() === 'RECHAZADO' && !rejectionReasonName) {
                const rId = e.rejectionReasonId || (e as any).rejection_reason_id;
                if (rId) {
                    const reason = rejectionReasons.find(r => r.id == rId);
                    if (reason) rejectionReasonName = reason.name;
                }
            }

            return {
                ...e,
                rejectionReasonName: rejectionReasonName || undefined,
                dniTramite: dTramite
            };
        });
    }, [rawData, rejectionReasons]);

    // Filtrado Inteligente
    const filteredEnrollments = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        const anyFilterActive = Object.values(filters).some(Boolean);

        return allEnrollments.filter((e: Enrollment) => {
            const status = e.status?.toUpperCase() || '';
            const fullName = `${e.firstName} ${e.lastName} ${e.dni} ${e.email}`.toLowerCase();

            // LÓGICA DE BÚSQUEDA (Prioridad 1)
            // Si el usuario escribe, buscamos en TODO independientemente del estado seleccionado
            if (term !== '') {
                return fullName.includes(term);
            }

            // LÓGICA DE FILTROS (Prioridad 2 - Solo si el buscador está vacío)

            // Caso especial: Suspendidos (Borrados lógicos)
            if (filters.SUSPENDIDO) {
                return e.deleted || status === 'SUSPENDIDA' || status === 'SUSPENDIDO';
            }

            // Si no estamos viendo suspendidos, ocultar los eliminados
            if (e.deleted) return false;

            // Si no hay ningún botón de filtro seleccionado, mostramos EN_PROCESO por defecto
            if (!anyFilterActive) {
                return status === 'EN_PROCESO' || status === 'PENDIENTE';
            }

            // Filtrar por el estado del botón activo
            return (filters as any)[status];
        });
    }, [allEnrollments, searchTerm, filters]);

    // Mutaciones: Actualización de estados y eliminaciones
    const statusMutation = useMutation({
        mutationFn: ({ dni, status, rejectionReasonId, observation }: { dni: string; status: string; rejectionReasonId?: number; observation?: string }) =>
            enrollmentService.updateStatus(dni, status, rejectionReasonId, observation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            setConfirmAction(null);
            setStatusSelector(null);
            setSelectedEnrollment(null);
        },
        onError: () => alert("Error al actualizar el estado")
    });

    const deleteMutation = useMutation({
        mutationFn: ({ dni, reactivate }: { dni: string; reactivate?: boolean }) =>
            reactivate ? enrollmentService.reactivate(dni) : enrollmentService.delete(dni),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            setDniToDelete(null);
        }
    });

    const exportCsv = async () => {
        try {
            if (!exportDates.start || !exportDates.end) {
                alert("Por favor seleccione un rango de fechas");
                return;
            }

            setIsExporting(true);
            const activeFilter = Object.keys(filters).find(key => filters[key as keyof typeof filters]) || 'EN_PROCESO';
            const blob = await enrollmentService.exportCsv(exportDates.start, exportDates.end, activeFilter);

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `inscripciones_${activeFilter}_${exportDates.start}_${exportDates.end}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exportando CSV", error);
            alert("Error al exportar CSV");
        } finally {
            setIsExporting(false);
        }
    };

    // Helpers
    const toggleFilter = (filterKey: keyof typeof filters) => {
        setFilters(prev => ({
            PENDIENTE: false, EN_PROCESO: false, APROBADO: false, RECHAZADO: false, CANCELADO: false, SUSPENDIDO: false,
            [filterKey]: !prev[filterKey]
        }));
    };

    // Historial dinámico
    const { data: historyData, isLoading: loadingHistory } = useQuery({
        queryKey: ['enrollment-history', selectedEnrollment?.dni],
        queryFn: () => enrollmentService.getHistory(selectedEnrollment?.dni || ''),
        enabled: !!selectedEnrollment?.dni && activeTab === 'history',
    });

    const history = useMemo(() => {
        if (!historyData) return [];
        return Array.isArray(historyData) ? historyData : ((historyData as any).data || []);
    }, [historyData]);

    return {
        enrollments: filteredEnrollments,
        isLoading,
        searchTerm,
        setSearchTerm,
        selectedEnrollment,
        setSelectedEnrollment,
        filters,
        toggleFilter,
        activeTab,
        setActiveTab,
        history,
        loadingHistory,
        statusSelector,
        setStatusSelector,
        confirmAction,
        setConfirmAction,
        dniToDelete,
        setDniToDelete,
        statusMutation,
        deleteMutation,
        exportCsv,
        exportDates,
        setExportDates,
        isExporting
    };
};