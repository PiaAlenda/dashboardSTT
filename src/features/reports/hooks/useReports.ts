import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { statsService } from '../../../services/statsService';
import { claimService } from '../../../services/claimService';
import { enrollmentService } from '../../../services/enrollmentService';
import { masterDataService } from '../../../services/masterDataService';
import type { Enrollment, ChartDataItem } from '../../../types';

export const useReports = (range: string = 'month', customStart?: string, customEnd?: string, rankingLimit: number = 15) => {
    const statsQuery = useQuery({
        queryKey: ['statistics', range],
        queryFn: () => statsService.getStatistics(range),
    });

    const detailedStatsQuery = useQuery({
        queryKey: ['detailed-statistics'],
        queryFn: statsService.getDetailedStatistics,
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

    const schoolRankingQuery = useQuery({
        queryKey: ['school-ranking', rankingLimit],
        queryFn: () => enrollmentService.getSchoolRanking(rankingLimit),
    });

    const isLoading =
        statsQuery.isLoading ||
        detailedStatsQuery.isLoading ||
        enrollmentsQuery.isLoading ||
        claimsQuery.isLoading ||
        beneficiaryTypesQuery.isLoading ||
        rejectionReasonsQuery.isLoading ||
        schoolRankingQuery.isLoading;

    const detailedStats = detailedStatsQuery.data || null;
    const rawEnrollments = (enrollmentsQuery.data as any)?.data || enrollmentsQuery.data || [];
    const claims = (claimsQuery.data as any)?.data || claimsQuery.data || [];
    const rejectionReasons = rejectionReasonsQuery.data || [];

    const isDateInRange = (dateStr: string) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        if (range === 'today') return date >= startOfToday && date <= endOfToday;
        if (range === 'yesterday') {
            const yesterday = new Date(startOfToday);
            yesterday.setDate(yesterday.getDate() - 1);
            const endOfYesterday = new Date(startOfToday);
            endOfYesterday.setMilliseconds(-1);
            return date >= yesterday && date <= endOfYesterday;
        }
        if (range === 'week') {
            const last7Days = new Date(startOfToday);
            last7Days.setDate(last7Days.getDate() - 7);
            return date >= last7Days && date <= endOfToday;
        }
        if (range === 'month') {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return date >= firstDayOfMonth && date <= endOfToday;
        }
        if (range === 'last30') {
            const last30Days = new Date(startOfToday);
            last30Days.setDate(last30Days.getDate() - 30);
            return date >= last30Days && date <= endOfToday;
        }
        if (range === 'all') return true;
        if (range === 'custom' && customStart && customEnd) {
            const localYear = date.getFullYear();
            const localMonth = String(date.getMonth() + 1).padStart(2, '0');
            const localDay = String(date.getDate()).padStart(2, '0');
            const dateStrLocal = `${localYear}-${localMonth}-${localDay}`;
            return dateStrLocal >= customStart && dateStrLocal <= customEnd;
        }
        return true;
    };

    const filteredEnrollments = useMemo(() => {
        if (!rawEnrollments.length) return [];
        return rawEnrollments.filter((e: Enrollment) => isDateInRange(e.createdAt));
    }, [rawEnrollments, range, customStart, customEnd]);

    const studentEnrollments = useMemo(() => 
        filteredEnrollments.filter((e: Enrollment) => 
            e.beneficiaryType?.toLowerCase().includes('estudiante')), 
    [filteredEnrollments]);

    const teacherEnrollments = useMemo(() => 
        filteredEnrollments.filter((e: Enrollment) => 
            e.beneficiaryType?.toLowerCase().includes('docente') || 
            e.beneficiaryType?.toLowerCase().includes('profesor')), 
    [filteredEnrollments]);

    const filteredClaims = useMemo(() => {
        if (!claims.length) return [];
        return claims.filter((c: any) => isDateInRange(c.createdAt));
    }, [claims, range, customStart, customEnd]);

    const STATUS_COLORS: Record<string, string> = {
        'APROBADO': '#22c55e', 'PENDIENTE': '#f59e0b', 'RECHAZADO': '#ef4444',
        'EN_PROCESO': '#3b82f6', 'CANCELADO': '#94a3b8', 'SUSPENDIDO': '#64748b'
    };

    const getStatusChartData = (data: Enrollment[]) => {
        const counts = data.reduce((acc: Record<string, number>, curr: Enrollment) => {
            const status = curr.status?.toUpperCase() || 'PENDIENTE';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, count]) => ({
            name: name.replace(/_/g, ' '),
            value: count,
            color: STATUS_COLORS[name] || '#6366f1'
        })).sort((a, b) => b.value - a.value) as ChartDataItem[];
    };

    // --- MAPPING DE TURNOS ---
    const SHIFT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const shiftChartData = useMemo<ChartDataItem[]>(() => {
        const byShift = statsQuery.data?.byShift || [];
        return byShift.map((s: any, index: number) => ({
            name: s.name,
            value: s.count,
            color: SHIFT_COLORS[index % SHIFT_COLORS.length]
        }));
    }, [statsQuery.data?.byShift]);


    const getLevelChartData = (data: Enrollment[]) => {
        const counts = data.reduce((acc: Record<string, number>, curr: Enrollment) => {
            const level = curr.educationLevel || 'No especificado';
            const cleanLevel = level.toLowerCase().replace(/nivel/g, '').trim();
            const name = `n. ${cleanLevel}`;
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const LEVEL_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];
        return Object.entries(counts).map(([name, count], index) => ({
            name, value: count, color: LEVEL_COLORS[index % LEVEL_COLORS.length]
        })).sort((a, b) => b.value - a.value) as ChartDataItem[];
    };

    const getRejectionChartData = (data: Enrollment[]) => {
        const counts = data.reduce((acc: Record<string, number>, curr: Enrollment) => {
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
        }, {} as Record<string, number>);

        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];
        return Object.entries(counts).map(([name, count], index) => ({
            name, value: count, color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value) as ChartDataItem[];
    };

    const busLinesChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f43f5e', '#14b8a6'];
        filteredEnrollments.forEach((e: any) => {
            for (let i = 1; i <= 10; i++) {
                const lineName = e[`busLine${i}Name`];
                if (lineName?.trim()) counts[lineName.trim()] = (counts[lineName.trim()] || 0) + 1;
            }
        });
        return Object.entries(counts).map(([name, value], index) => ({
            name, value, color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value) as ChartDataItem[];
    }, [filteredEnrollments]);

    const busCompaniesChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f43f5e', '#14b8a6'];
        filteredEnrollments.forEach((e: any) => {
            const uniqueCompanies = new Set<string>();
            for (let i = 1; i <= 10; i++) {
                const company = e[`busCompany${i}Name`];
                if (company?.trim()) uniqueCompanies.add(company.trim());
            }
            uniqueCompanies.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
        });
        return Object.entries(counts).map(([name, value], index) => ({
            name, value, color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value) as ChartDataItem[];
    }, [filteredEnrollments]);

    const dailyEnrollmentsData = useMemo(() => {
        const counts: Record<string, { count: number, dateObj: Date, label: string }> = {};
        filteredEnrollments.forEach((e: Enrollment) => {
            if (!e.createdAt) return;
            const dateObj = new Date(e.createdAt);
            const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            if (!counts[key]) {
                counts[key] = {
                    count: 0,
                    dateObj: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
                    label: `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`
                };
            }
            counts[key].count += 1;
        });
        return Object.entries(counts).map(([_, d]) => ({
            name: d.label, value: d.count, color: '#ff8200', fullDate: d.dateObj
        })).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    }, [filteredEnrollments]);

    const dailyDetailedData = useMemo(() => {
        if (!detailedStats) return [];
        const dateMap: Record<string, { date: Date, label: string, students: number, teachers: number }> = {};
        const process = (arr: any[], type: 'students' | 'teachers') => {
            arr?.forEach(d => {
                const dateObj = new Date(d.date);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const key = `${dateObj.getFullYear()}-${month}-${day}`;
                if (!dateMap[key]) {
                    dateMap[key] = { date: dateObj, label: `${day}/${month}`, students: 0, teachers: 0 };
                }
                dateMap[key][type] += d.count;
            });
        };
        process(detailedStats.dailyEstudiantes, 'students');
        process(detailedStats.dailyDocentes, 'teachers');
        return Object.values(dateMap).sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [detailedStats]);

    const schoolRankingData = useMemo<ChartDataItem[]>(() => {
        const raw = schoolRankingQuery.data || [];
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f43f5e', '#14b8a6'];
        return raw.map((s: any, index: number) => ({
            name: s.schoolName || s.name || 'Desconocido',
            value: s.approvedCount || s.count || 0,
            color: colors[index % colors.length]
        }));
    }, [schoolRankingQuery.data]);

    const totalEnrollments = filteredEnrollments.length;
    const approvalsInPeriod = rawEnrollments.filter((e: Enrollment) =>
        e.status?.toUpperCase() === 'APROBADO' && isDateInRange(e.updatedAt || e.createdAt || '')
    ).length;
    const answersInPeriod = claims.filter((c: any) =>
        (c.status === 'RESPONDIDO' || c.status === 'CONTESTADO') && isDateInRange(c.answeredAt || '')
    ).length;

    const statsGrid = [
        { label: "Total Inscripciones", value: totalEnrollments.toLocaleString(), color: 'orange' as const },
        { label: "Aprobados", value: approvalsInPeriod.toLocaleString(), color: 'green' as const },
        { label: "% Aprobados", value: `${totalEnrollments > 0 ? Math.round((approvalsInPeriod/totalEnrollments)*100) : 0}%`, color: 'green' as const },
        { label: "Reclamos Activos", value: filteredClaims.filter((c: any) => c.status === 'PENDIENTE').length.toString(), color: 'blue' as const },
        { label: "Reclamos Contestados", value: answersInPeriod.toLocaleString(), color: 'emerald' as const },
    ];

    return {
        isLoading,
        charts: {
            status: getStatusChartData(filteredEnrollments),
            statusStudents: getStatusChartData(studentEnrollments),
            statusTeachers: getStatusChartData(teacherEnrollments),
            shift: shiftChartData,
            level: getLevelChartData(filteredEnrollments),
            levelStudents: getLevelChartData(studentEnrollments),
            levelTeachers: getLevelChartData(teacherEnrollments),
            rejection: getRejectionChartData(filteredEnrollments),
            rejectionStudents: getRejectionChartData(studentEnrollments),
            rejectionTeachers: getRejectionChartData(teacherEnrollments),
            beneficiary: getStatusChartData(filteredEnrollments),
            source: (() => {
                const SOURCE_METADATA: Record<string, { name: string; color: string }> = {
                    '1': { name: 'Bot WhatsApp', color: '#22c55e' },
                    '2': { name: 'Formulario Web', color: '#3b82f6' },
                    '3': { name: 'Formulario Web MFyDH', color: '#8b5cf6' },
                    '4': { name: 'Bot WhatsApp MFyDH', color: '#10b981' },
                };

                const counts = filteredEnrollments.reduce((acc: Record<string, number>, curr: Enrollment) => {
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

                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                return Object.entries(counts).map(([key, count]) => ({
                    name: SOURCE_METADATA[key]?.name || 'Otros',
                    value: count,
                    color: SOURCE_METADATA[key]?.color || '#94a3b8'
                })).filter((item: any) => item.value > 0) as ChartDataItem[];
            })(),
            busLines: busLinesChartData,
            busCompanies: busCompaniesChartData,
            dailyEnrollments: dailyEnrollmentsData,
            dailyDetailed: dailyDetailedData,
            schoolRanking: schoolRankingData,
            university: detailedStats ? [
                { name: 'UNSJ', value: detailedStats.totalEstudiantesUnsj, color: '#3b82f6' },
                { name: 'UC', value: detailedStats.totalEstudiantesUc, color: '#8b5cf6' },
                { name: 'UCC', value: detailedStats.totalEstudiantesUcc, color: '#10b981' }
            ].filter(v => v.value > 0) : []
        },
        statsGrid,
        detailedStats,
        schoolRanking: schoolRankingData,
        isSchoolRankingLoading: schoolRankingQuery.isFetching
    };
};