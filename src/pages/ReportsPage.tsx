import { useState, useMemo } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import { AnalyticsCard } from '../features/reports/components/AnalyticsCard';
import { StatusChart } from '../features/reports/components/StatusChart';
import { BeneficiaryChart } from '../features/reports/components/BeneficiaryChart';
import { ShiftChart } from '../features/reports/components/ShiftChart';
import { LevelChart } from '../features/reports/components/LevelChart';
import { SourceChart } from '../features/reports/components/SourceChart';
import { RejectionChart } from '../features/reports/components/RejectionChart';
import { LinesChart } from '../features/reports/components/LinesChart';
import { CompanyChart } from '../features/reports/components/CompanyChart';
import { HistogramChart } from '../features/reports/components/HistogramChart';
import { ChartModal } from '../features/reports/components/ChartModal';
import { useReports } from '../features/reports/hooks/useReports';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

import { ChevronDown, Clock, Check } from 'lucide-react';

const AdvancedDateFilter = ({
    selected,
    onChange,
    customDates,
    setCustomDates
}: {
    selected: string;
    onChange: (val: string) => void;
    customDates: { start: string; end: string };
    setCustomDates: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const presets = [
        { id: 'today', label: 'Hoy', icon: Clock },
        { id: 'yesterday', label: 'Ayer', icon: Clock },
        { id: 'week', label: 'Esta Semana', icon: Calendar },
        { id: 'month', label: 'Este Mes', icon: Calendar },
        { id: 'last30', label: 'Últimos 30 días', icon: Calendar },
        { id: 'custom', label: 'Rango Personalizado', icon: Calendar },
        { id: 'all', label: 'Todo el Historial', icon: BarChart3 }
    ];

    const currentLabel = presets.find(p => p.id === selected)?.label || 'Filtrar por fecha';

    return (
        <div className="relative">
            <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                {/* Selector Dropdown */}
                <div className="relative min-w-[200px]">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-[1.25rem] border-2 border-slate-100 shadow-sm hover:border-[#ff8200]/30 transition-all font-bold text-slate-700 text-xs uppercase tracking-widest active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-[#ff8200]" />
                            <span>{currentLabel}</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsOpen(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2 space-y-1">
                                    {presets.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                onChange(opt.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all
                                                ${selected === opt.id
                                                    ? 'bg-orange-50 text-[#ff8200]'
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <opt.icon size={14} className={selected === opt.id ? 'text-[#ff8200]' : 'text-slate-400'} />
                                                <span>{opt.label}</span>
                                            </div>
                                            {selected === opt.id && <Check size={12} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Controles de Rango Personalizado (Solo si está seleccionado) */}
                {selected === 'custom' && (
                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border-2 border-orange-100 shadow-sm animate-in zoom-in-95 duration-300">
                        <input
                            type="date"
                            className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-600 uppercase tracking-tight cursor-pointer"
                            value={customDates.start}
                            onChange={(e) => setCustomDates(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-slate-300 font-bold px-1">/</span>
                        <input
                            type="date"
                            className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-600 uppercase tracking-tight cursor-pointer"
                            value={customDates.end}
                            onChange={(e) => setCustomDates(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const WeekSelector = ({ dailyData, selectedWeekKey, onSelectWeek }: { dailyData: any[], selectedWeekKey: string | null, onSelectWeek: (val: string | null) => void }) => {
    const weeksMap = useMemo(() => {
        const map = new Map<string, string>();
        dailyData.forEach((d: any) => {
            const date = d.fullDate;
            if (!date) return;
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(date);
            monday.setDate(diff);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            const key = `${monday.toISOString().split('T')[0]}_${sunday.toISOString().split('T')[0]}`;

            const fM = `${String(monday.getDate()).padStart(2, '0')}/${String(monday.getMonth() + 1).padStart(2, '0')}`;
            const fS = `${String(sunday.getDate()).padStart(2, '0')}/${String(sunday.getMonth() + 1).padStart(2, '0')}`;

            if (!map.has(key)) {
                map.set(key, `S. del ${fM} al ${fS}`);
            }
        });
        return Array.from(map.entries());
    }, [dailyData]);

    if (weeksMap.length === 0) return null;

    return (
        <select
            className="text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
            value={selectedWeekKey || 'all'}
            onChange={(e) => onSelectWeek(e.target.value === 'all' ? null : e.target.value)}
        >
            <option value="all">Todas las Semanas</option>
            {weeksMap.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
            ))}
        </select>
    );
};

export const ReportsPage = () => {
    const [expandedChart, setExpandedChart] = useState<{ title: string; component: React.ReactNode; data: any[] } | null>(null);
    const [dateRange, setDateRange] = useState('last30');
    const [customDates, setCustomDates] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
    const { charts, statsGrid, isLoading } = useReports(dateRange, customDates.start, customDates.end);

    const filteredEnrollmentsHistogram = useMemo(() => {
        if (!selectedWeek) return charts.dailyEnrollments;
        const [startStr, endStr] = selectedWeek.split('_');
        const start = new Date(startStr);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endStr);
        end.setHours(23, 59, 59, 999);

        return charts.dailyEnrollments.filter((d: any) => {
            return d.fullDate >= start && d.fullDate <= end;
        });
    }, [charts.dailyEnrollments, selectedWeek]);

    if (isLoading) {
        return <LoadingOverlay message="Generando Reportes Estadísticos..." />;
    }

    return (
        <div className="max-w-[1700px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10">
            <ChartModal
                isOpen={!!expandedChart}
                onClose={() => setExpandedChart(null)}
                title={expandedChart?.title || ''}
                data={expandedChart?.data}
            >
                {expandedChart?.component}
            </ChartModal>

            {/* HEADER */}
            <header className="px-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-[#ff8200] shadow-lg shadow-slate-200">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl 2xl:text-4xl font-black text-slate-800 tracking-tight">
                            Panel de <span className="text-[#ff8200]">Analíticas</span>
                        </h1>
                        <p className="text-[11px] 2xl:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Métricas operativas consolidadas
                        </p>
                    </div>
                </div>

                <div className="shrink-0">
                    <AdvancedDateFilter
                        selected={dateRange}
                        onChange={setDateRange}
                        customDates={customDates}
                        setCustomDates={setCustomDates}
                    />
                </div>
            </header>

            {/* DASHBOARD DATA (Stats Grid) */}
            <section className="px-4 pt-10 border-t border-slate-50">
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] select-none">
                        Resumen de Métricas
                    </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory lg:justify-center hide-scrollbar">
                    {statsGrid.map((stat) => (
                        <div
                            key={stat.label}
                            className="group relative bg-white p-6 rounded-[1.2rem] border border-slate-100 
                           min-w-[180px] md:min-w-[210px] shrink-0 snap-center
                           shadow-sm overflow-hidden
                           hover:-translate-y-1.5 hover:shadow-md hover:border-orange-100
                           transition-all duration-200 ease-out will-change-transform"
                        >
                            <div className="absolute top-0 left-0 w-[5px] h-full bg-[#ff8200] transform-gpu" />

                            <div className="flex flex-col items-center text-center">
                                <span className="text-[9px] font-black uppercase text-[#ff8200] tracking-widest mb-1 select-none">
                                    {stat.label}
                                </span>
                                <span className="text-3xl font-black tracking-tighter text-slate-800 leading-none">
                                    {stat.value}
                                </span>
                                <div className="w-6 h-[1.5px] bg-slate-50 mt-3 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* GRILLA DE GRÁFICOS (Charts) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-2">
                <AnalyticsCard
                    title="Estado de Solicitudes"
                    subtitle="Distribución por estado administrativo"
                    onExpand={() => setExpandedChart({
                        title: "Estado de Solicitudes",
                        component: <StatusChart type="bar" data={charts.status} />,
                        data: charts.status
                    })}
                >
                    {(type) => <StatusChart type={type} data={charts.status} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Distribución por Turno"
                    subtitle="Inscripciones según horario escolar"
                    onExpand={() => setExpandedChart({
                        title: "Distribución por Turno",
                        component: <ShiftChart type="bar" data={charts.shift} />,
                        data: charts.shift
                    })}
                >
                    {(type) => <ShiftChart type={type} data={charts.shift} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Fuente de Ingreso"
                    subtitle="Canal de origen de la solicitud"
                    onExpand={() => setExpandedChart({
                        title: "Fuente de Ingreso",
                        component: <SourceChart type="bar" data={charts.source} />,
                        data: charts.source
                    })}
                >
                    {(type) => <SourceChart type={type} data={charts.source} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Tipos de Beneficiario"
                    subtitle="Perfil por rol (Estudiante/Docente)"
                    onExpand={() => setExpandedChart({
                        title: "Tipos de Beneficiario",
                        component: <BeneficiaryChart type="bar" data={charts.beneficiary} />,
                        data: charts.beneficiary
                    })}
                >
                    {(type) => <BeneficiaryChart type={type} data={charts.beneficiary} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Nivel Educativo"
                    subtitle="Distribución por niveles de enseñanza"
                    onExpand={() => setExpandedChart({
                        title: "Nivel Educativo",
                        component: <LevelChart type="bar" data={charts.level} />,
                        data: charts.level
                    })}
                >
                    {(type) => <LevelChart type={type} data={charts.level} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Motivos de Rechazo"
                    subtitle="Causas principales identificadas"
                    onExpand={() => setExpandedChart({
                        title: "Motivos de Rechazo",
                        component: <RejectionChart type="bar" data={charts.rejection} />,
                        data: charts.rejection
                    })}
                >
                    {(type) => <RejectionChart type={type} data={charts.rejection} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Líneas de Colectivo"
                    subtitle="Impacto por línea de transporte (Top 10)"
                    onExpand={() => setExpandedChart({
                        title: "Líneas de Colectivo",
                        component: <LinesChart type="pie" data={charts.busLines} />,
                        data: charts.busLines
                    })}
                >
                    {(type) => <LinesChart type={type} data={charts.busLines} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Empresas de Colectivo"
                    subtitle="Distribución por prestataria"
                    onExpand={() => setExpandedChart({
                        title: "Empresas de Colectivo",
                        component: <CompanyChart type="bar" data={charts.busCompanies} />,
                        data: charts.busCompanies
                    })}
                >
                    {(type) => <CompanyChart type={type} data={charts.busCompanies} />}
                </AnalyticsCard>
            </section>

            {/* HISTOGRAMAS */}
            <section className="flex flex-col gap-8 px-2 mt-8">
                <AnalyticsCard
                    title="Inscripciones por Día"
                    subtitle="Frecuencia diaria de solicitudes"
                    hideTypeToggle
                    headerAction={<WeekSelector dailyData={charts.dailyEnrollments} selectedWeekKey={selectedWeek} onSelectWeek={setSelectedWeek} />}
                    onExpand={() => setExpandedChart({
                        title: "Inscripciones por Día",
                        component: <HistogramChart data={filteredEnrollmentsHistogram} color="#ff8200" />,
                        data: filteredEnrollmentsHistogram
                    })}
                >
                    {() => <HistogramChart data={filteredEnrollmentsHistogram} color="#ff8200" />}
                </AnalyticsCard>

            </section>
        </div>
    );
};