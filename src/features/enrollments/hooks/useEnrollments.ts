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

    // Estado de Filtros
    const [filters, setFilters] = useState({
        // Estados
        PENDIENTE: false,
        EN_PROCESO: false,
        APROBADO: false,
        RECHAZADO: false,
        CANCELADO: false,
        SUSPENDIDO: false,
        // Niveles Educativos
        INICIAL: false,
        PRIMARIO: false,
        SECUNDARIO: false,
        'SUPERIOR/TECNICO': false,
        UNIVERSITARIO: false
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

    // Normalización de la data
    const allEnrollments = useMemo((): Enrollment[] => {
        if (!rawData) return [];
        const list: Enrollment[] = Array.isArray(rawData) ? rawData : (rawData.data || []);

        return list.map(e => {
            const dTramite = e.dniTramite || (e as any).dni_tramite || (e as any).tramite || e.customField1;

            let rejectionReasonName = e.rejectionReasonName || e.rejectionReason;

            // Si es RECHAZADO y no tiene nombre de motivo, lo buscamos en rejectionReasons por ID
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

    // Filtrado Inteligente con Búsqueda por Tipo de Reclamo y Rechazos
    const filteredEnrollments = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        // Separamos filtros por categoría
        const statusKeys = ['PENDIENTE', 'EN_PROCESO', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'SUSPENDIDO'];
        const educationKeys = ['INICIAL', 'PRIMARIO', 'SECUNDARIO', 'SUPERIOR/TECNICO', 'UNIVERSITARIO'];

        const activeStatusFilters = statusKeys.filter(k => (filters as any)[k]);
        const activeEducationFilters = educationKeys.filter(k => (filters as any)[k]);

        return allEnrollments.filter((e: Enrollment) => {
            const status = e.status?.toUpperCase() || '';

            // Normalización para Niveles Educativos
            let rawLevel = (e.educationLevel || '').toUpperCase();
            let eLevel = '';
            if (rawLevel.includes('INICIAL')) eLevel = 'INICIAL';
            else if (rawLevel.includes('PRIMARIO')) eLevel = 'PRIMARIO';
            else if (rawLevel.includes('SECUNDARIO')) eLevel = 'SECUNDARIO';
            else if (rawLevel.includes('SUPERIOR') || rawLevel.includes('TECNICO')) eLevel = 'SUPERIOR/TECNICO';
            else if (rawLevel.includes('UNIVERSITARIO')) eLevel = 'UNIVERSITARIO';

            // CAMPOS PARA BÚSQUEDA
            const firstName = (e.firstName || '').toLowerCase();
            const lastName = (e.lastName || '').toLowerCase();
            const dni = (e.dni || '').toLowerCase();
            const email = (e.email || '').toLowerCase();
            const rejectionReason = (e.rejectionReasonName || '').toLowerCase();

            // 1. LÓGICA DE BÚSQUEDA (Si hay texto, manda sobre los filtros)
            if (term !== '') {
                const searchString = `${firstName} ${lastName} ${dni} ${email} ${rejectionReason}`;
                return searchString.includes(term);
            }

            // 2. LÓGICA DE FILTROS COMBINADOS

            // Filtro de Suspendido es especial (mapea a deleted o status)
            if (filters.SUSPENDIDO && !e.deleted && status !== 'SUSPENDIDA' && status !== 'SUSPENDIDO') {
                return false;
            }

            if (!filters.SUSPENDIDO && e.deleted) return false;

            // Filtro de Estado
            if (activeStatusFilters.length > 0) {
                if (!activeStatusFilters.includes(status === 'SUSPENDIDA' ? 'SUSPENDIDO' : status)) {
                    return false;
                }
            } else {
                // Si no hay filtros de estado activos, por defecto mostramos Procesando/Pendiente (vistas operativas)
                if (!filters.SUSPENDIDO && status !== 'EN_PROCESO' && status !== 'PENDIENTE' && !activeEducationFilters.length) {
                    return false;
                }
            }

            // Filtro de Nivel Educativo
            if (activeEducationFilters.length > 0) {
                if (!activeEducationFilters.includes(eLevel)) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [allEnrollments, searchTerm, filters]);

    // Mutaciones
    const statusMutation = useMutation({
        mutationFn: ({ dni, status, rejectionReasonId, observation }: { dni: string; status: string; rejectionReasonId?: number; observation?: string }) =>
            enrollmentService.updateStatus(dni, status, rejectionReasonId, observation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            setConfirmAction(null);
            setStatusSelector(null);
            setSelectedEnrollment(null);
        }
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
        } finally {
            setIsExporting(false);
        }
    };

    const toggleFilter = (filterKey: string) => {
        const statusKeys = ['PENDIENTE', 'EN_PROCESO', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'SUSPENDIDO'];
        const educationKeys = ['INICIAL', 'PRIMARIO', 'SECUNDARIO', 'SUPERIOR/TECNICO', 'UNIVERSITARIO'];

        setFilters(prev => {
            const newState = { ...prev } as any;

            if (statusKeys.includes(filterKey)) {
                // Si tocamos un estado, deseleccionamos otros estados pero MANTENEMOS niveles
                statusKeys.forEach(k => {
                    newState[k] = (k === filterKey) ? !prev[k as keyof typeof prev] : false;
                });
            } else if (educationKeys.includes(filterKey)) {
                // Si tocamos un nivel, deseleccionamos otros niveles pero MANTENEMOS estados
                educationKeys.forEach(k => {
                    newState[k] = (k === filterKey) ? !prev[k as keyof typeof prev] : false;
                });
            }

            return newState;
        });
    };

    // Historial
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