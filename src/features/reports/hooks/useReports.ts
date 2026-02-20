import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { enrollmentService } from '../../../services/enrollmentService';
import { claimService } from '../../../services/claimService';
import { masterDataService } from '../../../services/masterDataService';
import type { Enrollment, Claim } from '../../../types';

export const useReports = (dateRange: string = 'month') => {
    // 1. Fetching raw data
    const enrollmentsQuery = useQuery({
        queryKey: ['enrollments'],
        queryFn: enrollmentService.getAll,
    });

    const claimsQuery = useQuery({
        queryKey: ['claims'],
        queryFn: claimService.getAll,
    });

    const beneficiaryTypesQuery = useQuery({
        queryKey: ['beneficiary-types'],
        queryFn: masterDataService.getBeneficiaryTypes,
    });

    const rejectionReasonsQuery = useQuery({
        queryKey: ['rejection-reasons'],
        queryFn: masterDataService.getRejectionReasons,
    });

    const isLoading =
        enrollmentsQuery.isLoading ||
        claimsQuery.isLoading ||
        beneficiaryTypesQuery.isLoading ||
        rejectionReasonsQuery.isLoading;

    // 2. Lógica de Filtrado por Fecha (Memoizada para performance)
    const filteredEnrollments = useMemo(() => {
        const raw = enrollmentsQuery.data || [];
        if (dateRange === 'all') return raw;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return raw.filter((e: Enrollment) => {
            if (!e.createdAt) return false;
            const createdDate = new Date(e.createdAt);

            switch (dateRange) {
                case 'today':
                    return createdDate >= startOfToday;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return createdDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    return createdDate >= monthAgo;
                default:
                    return true;
            }
        });
    }, [enrollmentsQuery.data, dateRange]);

    // 3. Data Aggregation Logic (Usando filteredEnrollments)
    const claims: Claim[] = claimsQuery.data || [];
    const beneficiaryTypes = beneficiaryTypesQuery.data || [];
    const rejectionReasons = rejectionReasonsQuery.data || [];

    // --- Status Statistics ---
    const statusStats = useMemo(() => filteredEnrollments.reduce((acc: any, curr: Enrollment) => {
        const s = curr.status?.toUpperCase() || 'UNKNOWN';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {}), [filteredEnrollments]);

    const statusChartData = [
        { name: 'Aprobados', value: statusStats['APROBADO'] || 0, color: '#22c55e' },
        { name: 'Pendientes', value: statusStats['PENDIENTE'] || 0, color: '#f59e0b' },
        { name: 'Rechazados', value: statusStats['RECHAZADO'] || 0, color: '#ef4444' },
        { name: 'En Proceso', value: statusStats['EN_PROCESO'] || 0, color: '#3b82f6' },
        { name: 'Cancelados', value: statusStats['CANCELADO'] || 0, color: '#94a3b8' },
    ];

    // --- Beneficiary Type Statistics ---
    const typeStats = useMemo(() => filteredEnrollments.reduce((acc: any, curr: Enrollment) => {
        const t = curr.beneficiaryType || 'UNKNOWN';
        acc[t] = (acc[t] || 0) + 1;
        return acc;
    }, {}), [filteredEnrollments]);

    const BENEFICIARY_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const beneficiaryChartData = beneficiaryTypes.map((bt, index) => ({
        name: bt.name,
        value: typeStats[bt.code] || typeStats[bt.name] || 0,
        color: BENEFICIARY_COLORS[index % BENEFICIARY_COLORS.length]
    }));

    // --- Rejection Reasons Statistics ---
    const rejectionStats = useMemo(() => filteredEnrollments.reduce((acc: Record<string, number>, curr: Enrollment) => {
        if (curr.status?.toUpperCase() === 'RECHAZADO') {
            let name = curr.rejectionReasonName || curr.rejectionReason;
            const rId = curr.rejectionReasonId || (curr as any).rejection_reason_id;

            if (!name && rId) {
                const reason = rejectionReasons.find(r => r.id == rId);
                if (reason) name = reason.name;
            }
            if (name) acc[name] = (acc[name] || 0) + 1;
        }
        return acc;
    }, {}), [filteredEnrollments, rejectionReasons]);

    const REJECTION_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];
    const rejectionChartData = rejectionReasons.map((r, index) => ({
        name: r.name,
        value: rejectionStats[r.name] || 0,
        color: REJECTION_COLORS[index % REJECTION_COLORS.length]
    })).filter(item => item.value > 0 || dateRange === 'all');

    const sourceStats = useMemo(() => filteredEnrollments.reduce((acc: { bot: number; web: number }, curr: Enrollment) => {
        if (!curr.dataSource) acc.bot++;
        else acc.web++;
        return acc;
    }, { bot: 0, web: 0 }), [filteredEnrollments]);

    const sourceChartData = [
        { name: 'Bot WhatsApp', value: sourceStats.bot, color: '#ff8200' },
        { name: 'Formulario Web', value: sourceStats.web, color: '#1e293b' },
    ];
    const statsGrid = useMemo(() => [
        {
            label: "Total Inscripciones",
            value: filteredEnrollments.length.toLocaleString(),
            color: 'orange' as const
        },
        {
            label: "Tasa de Aprobación",
            value: filteredEnrollments.length > 0 ? `${Math.round(((statusStats['APROBADO'] || 0) / filteredEnrollments.length) * 100)}%` : '0%',
            color: 'green' as const
        },
        {
            label: "Reclamos Activos",
            value: claims.filter(c => c.status === 'PENDIENTE').length.toString(),
            color: 'blue' as const
        },
        {
            label: "Crecimiento Periodo",
            value: `+${filteredEnrollments.length}`,
            color: 'purple' as const
        },
    ], [filteredEnrollments, statusStats, claims]);

    return {
        isLoading,
        charts: {
            status: statusChartData,
            beneficiary: beneficiaryChartData,
            rejection: rejectionChartData,
            source: sourceChartData
        },
        statsGrid
    };
};