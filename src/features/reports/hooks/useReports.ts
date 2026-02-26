import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { statsService } from '../../../services/statsService';
import { claimService } from '../../../services/claimService';
import { enrollmentService } from '../../../services/enrollmentService';
import { masterDataService } from '../../../services/masterDataService';
import type { Statistics, Enrollment } from '../../../types';

export const useReports = (range: string = 'month') => {
    const statsQuery = useQuery({
        queryKey: ['statistics', range],
        queryFn: statsService.getStatistics,
    });

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
        statsQuery.isLoading ||
        enrollmentsQuery.isLoading ||
        claimsQuery.isLoading ||
        beneficiaryTypesQuery.isLoading ||
        rejectionReasonsQuery.isLoading;

    const stats: Statistics = statsQuery.data || { byStatus: [], byShift: [], byRoleAndLevel: [] };
    const rawEnrollments = (enrollmentsQuery.data as any)?.data || enrollmentsQuery.data || [];
    const claims = (claimsQuery.data as any)?.data || claimsQuery.data || [];
    const rejectionReasons = rejectionReasonsQuery.data || [];

    // --- Filter logic for Client-side based on range ---
    const filteredEnrollments = useMemo(() => {
        if (!rawEnrollments.length) return [];
        const now = new Date();
        return rawEnrollments.filter((e: Enrollment) => {
            if (!e.createdAt) return true;
            const date = new Date(e.createdAt);
            if (range === 'today') return date.toDateString() === now.toDateString();
            if (range === 'week') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                return date >= oneWeekAgo;
            }
            return true;
        });
    }, [rawEnrollments, range]);

    const STATUS_COLORS: Record<string, string> = {
        'APROBADO': '#22c55e',
        'PENDIENTE': '#f59e0b',
        'RECHAZADO': '#ef4444',
        'EN_PROCESO': '#3b82f6',
        'CANCELADO': '#94a3b8',
    };

    const statusChartData = useMemo(() => stats.byStatus.map(s => ({
        name: s.name.replace(/_/g, ' '),
        value: s.count,
        color: STATUS_COLORS[s.name.toUpperCase()] || '#6366f1'
    })), [stats.byStatus]);

    const SHIFT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const shiftChartData = useMemo(() => stats.byShift.map((s, index) => ({
        name: s.name,
        value: s.count,
        color: SHIFT_COLORS[index % SHIFT_COLORS.length]
    })), [stats.byShift]);

    const roleStats = useMemo(() => stats.byRoleAndLevel.reduce((acc: any, curr) => {
        const name = curr.beneficiaryTypeName;
        acc[name] = (acc[name] || 0) + curr.count;
        return acc;
    }, {}), [stats.byRoleAndLevel]);

    const ROLE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const beneficiaryChartData = useMemo(() => Object.entries(roleStats).map(([name, count], index) => ({
        name,
        value: count as number,
        color: ROLE_COLORS[index % ROLE_COLORS.length]
    })), [roleStats]);

    const levelStats = useMemo(() => stats.byRoleAndLevel.reduce((acc: any, curr) => {
        const cleanLevel = curr.educationLevelName.toLowerCase().replace(/nivel/g, '').trim();
        const name = `n. ${cleanLevel}`;

        acc[name] = (acc[name] || 0) + curr.count;
        return acc;
    }, {}), [stats.byRoleAndLevel]);

    const LEVEL_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];
    const levelChartData = useMemo(() => Object.entries(levelStats).map(([name, count], index) => ({
        name,
        value: count as number,
        color: LEVEL_COLORS[index % LEVEL_COLORS.length]
    })), [levelStats]);

    const SOURCE_METADATA: Record<string, { name: string; color: string }> = {
        '1': { name: 'Bot WhatsApp', color: '#22c55e' },
        '2': { name: 'Formulario Web', color: '#3b82f6' },
        '3': { name: 'Formulario Web MFyDH', color: '#8b5cf6' },
        '4': { name: 'Bot WhatsApp MFyDH', color: '#10b981' },
    };

    const sourceStats = useMemo(() => filteredEnrollments.reduce((acc: Record<string, number>, curr: Enrollment) => {
        const rawSource = curr.dataSource ?? (curr as any).datasource ?? (curr as any).data_source;

        let key = '2';

        if (rawSource === null || rawSource === undefined || rawSource === 'null' || rawSource === 1 || rawSource === '1') {
            key = '1';
        } else if (rawSource === 2 || rawSource === '2' || rawSource === 'web' || rawSource === 'WEB') {
            key = '2';
        } else if (rawSource === 3 || rawSource === '3') {
            key = '3';
        } else if (rawSource === 4 || rawSource === '4') {
            key = '4';
        } else if (typeof rawSource === 'string' && rawSource.toLowerCase().includes('bot')) {
            key = '1';
        }

        acc[key] = ((acc[key] as number) || 0) + 1;
        return acc;
    }, {}), [filteredEnrollments]);

    const sourceChartData = useMemo(() => Object.entries(sourceStats)
        .map(([key, count]) => ({
            name: SOURCE_METADATA[key]?.name || 'Otros',
            value: count as number,
            color: SOURCE_METADATA[key]?.color || '#94a3b8'
        }))
        .filter(item => item.value > 0), [sourceStats]);

    const rejectionStats = useMemo(() => filteredEnrollments.reduce((acc: Record<string, number>, curr: Enrollment) => {
        if (curr.status?.toUpperCase() === 'RECHAZADO') {
            let name = curr.rejectionReasonName || curr.rejectionReason;
            const rId = curr.rejectionReasonId || (curr as any).rejection_reason_id;

            if (!name && rId) {
                const reason = rejectionReasons.find(r => r.id == rId);
                if (reason) name = reason.name;
            }

            if (name) {
                let transformedName = name;
                if (transformedName.toLowerCase().includes('certificado de escolaridad')) {
                    transformedName = transformedName.toLowerCase().replace('certificado de escolaridad', 'cert. de esc.');
                }
                if (transformedName === 'Este DNI no figura en base de datos de las instituciones (Adjuntá documentación)') {
                    transformedName = 'este DNI no figura en los padrones educativos';
                }
                acc[transformedName] = (acc[transformedName] || 0) + 1;
            }
        }
        return acc;
    }, {}), [filteredEnrollments, rejectionReasons]);

    const REJECTION_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];
    const rejectionChartData = Object.entries(rejectionStats).map(([name, count], index) => ({
        name,
        value: count as number,
        color: REJECTION_COLORS[index % REJECTION_COLORS.length]
    })).filter(item => item.value > 0);

    const totalEnrollments = useMemo(() => stats.byStatus.reduce((acc, curr) => acc + curr.count, 0), [stats.byStatus]);
    const approvedCount = useMemo(() => stats.byStatus.find(s => s.name.toUpperCase() === 'APROBADO')?.count || 0, [stats.byStatus]);

    // Real data from enrollments for bus lines
    const busLinesChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f43f5e', '#14b8a6'];

        filteredEnrollments.forEach((e: any) => {
            for (let i = 1; i <= 10; i++) {
                const lineName = e[`busLine${i}Name`];
                if (lineName && typeof lineName === 'string' && lineName.trim() !== '') {
                    const normalized = lineName.trim();
                    counts[normalized] = (counts[normalized] || 0) + 1;
                }
            }
        });

        return Object.entries(counts)
            .map(([name, value], index) => ({
                name,
                value,
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [filteredEnrollments]);

    // Real data from enrollments for bus companies
    const busCompaniesChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f43f5e', '#14b8a6'];

        filteredEnrollments.forEach((e: any) => {
            for (let i = 1; i <= 10; i++) {
                const companyName = e[`busCompany${i}Name`];
                if (companyName && typeof companyName === 'string' && companyName.trim() !== '') {
                    const normalized = companyName.trim();
                    counts[normalized] = (counts[normalized] || 0) + 1;
                }
            }
        });

        return Object.entries(counts)
            .map(([name, value], index) => ({
                name,
                value,
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [filteredEnrollments]);

    const statsGrid = useMemo(() => [
        {
            label: "Total Inscripciones",
            value: totalEnrollments.toLocaleString(),
            color: 'orange' as const
        },
        {
            label: "Tasa de Aprobación",
            value: totalEnrollments > 0 ? `${Math.round((approvedCount / totalEnrollments) * 100)}%` : '0%',
            color: 'green' as const
        },
        {
            label: "Reclamos Activos",
            value: claims.filter((c: any) => c.status === 'PENDIENTE').length.toString(),
            color: 'blue' as const
        },
        {
            label: "Reclamos Contestados",
            value: claims.filter((c: any) => c.status === 'RESPONDIDO' || c.status === 'CONTESTADO').length.toString(),
            color: 'emerald' as const
        },
    ], [totalEnrollments, approvedCount, claims]);

    return {
        isLoading,
        charts: {
            status: statusChartData,
            shift: shiftChartData,
            beneficiary: beneficiaryChartData,
            level: levelChartData,
            source: sourceChartData,
            rejection: rejectionChartData,
            busLines: busLinesChartData,
            busCompanies: busCompaniesChartData
        },
        statsGrid
    };
};