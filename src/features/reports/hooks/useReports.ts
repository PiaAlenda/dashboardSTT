import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { statsService } from '../../../services/statsService';
import { claimService } from '../../../services/claimService';
import { enrollmentService } from '../../../services/enrollmentService';
import { masterDataService } from '../../../services/masterDataService';
import type { Statistics, Enrollment, ChartDataItem } from '../../../types';

export const useReports = (range: string = 'month', customStart?: string, customEnd?: string) => {
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

    // Helper to check if a date is within the selected range
    const isDateInRange = (dateStr: string) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (range === 'today') {
            return date >= startOfToday;
        }

        if (range === 'yesterday') {
            const yesterday = new Date(startOfToday);
            yesterday.setDate(yesterday.getDate() - 1);
            const endOfYesterday = new Date(startOfToday);
            return date >= yesterday && date < endOfYesterday;
        }

        if (range === 'week') {
            const last7Days = new Date(startOfToday);
            last7Days.setDate(last7Days.getDate() - 7);
            return date >= last7Days;
        }

        if (range === 'month') {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return date >= firstDayOfMonth;
        }

        if (range === 'last30') {
            const last30Days = new Date(startOfToday);
            last30Days.setDate(last30Days.getDate() - 30);
            return date >= last30Days;
        }

        if (range === 'all') {
            return true;
        }

        if (range === 'custom' && customStart && customEnd) {
            const start = new Date(customStart);
            start.setHours(0, 0, 0, 0);
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999);
            return date >= start && date <= end;
        }

        return true; // Default to showing everything if no range matches (backward compatibility)
    };

    const filteredEnrollments = useMemo(() => {
        if (!rawEnrollments.length) return [];
        return rawEnrollments.filter((e: Enrollment) => isDateInRange(e.createdAt));
    }, [rawEnrollments, range, customStart, customEnd]);

    const filteredClaims = useMemo(() => {
        if (!claims.length) return [];
        return claims.filter((c: any) => isDateInRange(c.createdAt));
    }, [claims, range, customStart, customEnd]);

    const STATUS_COLORS: Record<string, string> = {
        'APROBADO': '#22c55e',
        'PENDIENTE': '#f59e0b',
        'RECHAZADO': '#ef4444',
        'EN_PROCESO': '#3b82f6',
        'CANCELADO': '#94a3b8',
    };

    const statusChartData = useMemo(() => {
        const counts = filteredEnrollments.reduce((acc: Record<string, number>, curr: Enrollment) => {
            const status = curr.status?.toUpperCase() || 'PENDIENTE';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return (Object.entries(counts).map(([name, count]) => ({
            name: name.replace(/_/g, ' '),
            value: count,
            color: STATUS_COLORS[name] || '#6366f1'
        })) as ChartDataItem[]).sort((a, b) => b.value - a.value);
    }, [filteredEnrollments]);

    const SHIFT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const shiftChartData = useMemo<ChartDataItem[]>(() => stats.byShift.map((s, index) => ({
        name: s.name,
        value: s.count,
        color: SHIFT_COLORS[index % SHIFT_COLORS.length]
    })), [stats.byShift]);

    const ROLE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const beneficiaryChartData = useMemo(() => {
        const counts = filteredEnrollments.reduce((acc: Record<string, number>, curr: Enrollment) => {
            const name = curr.beneficiaryType || 'Otros';
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return (Object.entries(counts).map(([name, count], index) => ({
            name,
            value: count,
            color: ROLE_COLORS[index % ROLE_COLORS.length]
        })) as ChartDataItem[]).sort((a, b) => b.value - a.value);
    }, [filteredEnrollments]);

    const LEVEL_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];
    const levelChartData = useMemo(() => {
        const counts = filteredEnrollments.reduce((acc: Record<string, number>, curr: Enrollment) => {
            const level = curr.educationLevel || 'No especificado';
            const cleanLevel = level.toLowerCase().replace(/nivel/g, '').trim();
            const name = `n. ${cleanLevel}`;
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return (Object.entries(counts).map(([name, count], index) => ({
            name,
            value: count,
            color: LEVEL_COLORS[index % LEVEL_COLORS.length]
        })) as ChartDataItem[]).sort((a, b) => b.value - a.value);
    }, [filteredEnrollments]);

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

    const sourceChartData = useMemo<ChartDataItem[]>(() => Object.entries(sourceStats)
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
    })).filter(item => item.value > 0) as ChartDataItem[];

    const totalEnrollments = useMemo(() => filteredEnrollments.length, [filteredEnrollments]);

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
            .sort((a, b) => b.value - a.value) as ChartDataItem[];
    }, [filteredEnrollments]);

    // Real data from enrollments for bus companies
    const busCompaniesChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f43f5e', '#14b8a6'];

        filteredEnrollments.forEach((e: any) => {
            // Creamos un Set por cada inscripción (persona) para evitar duplicados internos
            const uniqueCompaniesPerPerson = new Set<string>();

            for (let i = 1; i <= 10; i++) {
                const companyName = e[`busCompany${i}Name`];
                if (companyName && typeof companyName === 'string' && companyName.trim() !== '') {
                    // Agregamos al Set (si ya existe, no hace nada)
                    uniqueCompaniesPerPerson.add(companyName.trim());
                }
            }

            // Ahora volcamos lo que hay en el Set al contador global
            uniqueCompaniesPerPerson.forEach((normalizedName) => {
                counts[normalizedName] = (counts[normalizedName] || 0) + 1;
            });
        });

        return Object.entries(counts)
            .map(([name, value], index) => ({
                name,
                value, // Ahora este valor representa "Cantidad de Personas"
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.value - a.value) as ChartDataItem[];
    }, [filteredEnrollments]);

    // Daily Stats for Histogram (Inscripciones por Día)
    const dailyEnrollmentsData = useMemo(() => {
        const counts: Record<string, { count: number, dateObj: Date }> = {};

        filteredEnrollments.forEach((e: Enrollment) => {
            if (!e.createdAt) return;
            const dateObj = new Date(e.createdAt);
            // Formatear a DD/MM
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const key = `${day}/${month}`;

            if (!counts[key]) counts[key] = { count: 0, dateObj };
            counts[key].count += 1;
        });

        return Object.entries(counts)
            .map(([name, data]) => ({
                name,
                value: data.count,
                color: '#ff8200',
                fullDate: data.dateObj
            })).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime()) as (ChartDataItem & { fullDate: Date })[];
    }, [filteredEnrollments]);

    // Daily Stats for Histogram (Líneas Registradas por Día)
    const dailyLinesData = useMemo(() => {
        const counts: Record<string, { count: number, dateObj: Date }> = {};

        filteredEnrollments.forEach((e: any) => {
            if (!e.createdAt) return;
            const dateObj = new Date(e.createdAt);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const key = `${day}/${month}`;

            // Contamos cuántas líneas declaró este usuario
            let linesSum = 0;
            for (let i = 1; i <= 10; i++) {
                const lineName = e[`busLine${i}Name`];
                if (lineName && typeof lineName === 'string' && lineName.trim() !== '') {
                    linesSum++;
                }
            }

            if (linesSum > 0) {
                if (!counts[key]) counts[key] = { count: 0, dateObj };
                counts[key].count += linesSum;
            }
        });

        return Object.entries(counts)
            .map(([name, data]) => ({
                name,
                value: data.count,
                color: '#3b82f6',
                fullDate: data.dateObj
            })).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime()) as (ChartDataItem & { fullDate: Date })[];
    }, [filteredEnrollments]);

    const statsGrid = useMemo(() => {
        // Activity-based metrics (regardless of when the record was created)
        const approvalsInPeriod = rawEnrollments.filter((e: Enrollment) =>
            e.status?.toUpperCase() === 'APROBADO' && isDateInRange(e.updatedAt || e.createdAt || '')
        ).length;

        const answersInPeriod = claims.filter((c: any) =>
            (c.status === 'RESPONDIDO' || c.status === 'CONTESTADO') && isDateInRange(c.answeredAt || '')
        ).length;

        return [
            {
                label: "Total Inscripciones",
                value: totalEnrollments.toLocaleString(),
                color: 'orange' as const
            },
            {
                label: "Aprobados",
                value: approvalsInPeriod.toLocaleString(),
                color: 'green' as const
            },
            {
                label: "Reclamos Activos",
                value: filteredClaims.filter((c: any) => c.status === 'PENDIENTE').length.toString(),
                color: 'blue' as const
            },
            {
                label: "Reclamos Contestados",
                value: answersInPeriod.toLocaleString(),
                color: 'emerald' as const
            },
        ];
    }, [rawEnrollments, claims, totalEnrollments, filteredClaims, range, customStart, customEnd]);

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
            busCompanies: busCompaniesChartData,
            dailyEnrollments: dailyEnrollmentsData,
            dailyLines: dailyLinesData
        },
        statsGrid
    };
};