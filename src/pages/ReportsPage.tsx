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

import { ChevronDown, Clock, Bus, Check } from 'lucide-react';

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

const HistogramDateFilter = ({ start, end, onStartChange, onEndChange }: { start: string, end: string, onStartChange: (v: string) => void, onEndChange: (v: string) => void }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-orange-100">
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Desde</span>
                <input
                    type="date"
                    className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-600 uppercase tracking-tight cursor-pointer focus:text-orange-600 transition-colors"
                    value={start}
                    onChange={(e) => onStartChange(e.target.value)}
                />
            </div>
            <div className="hidden sm:block w-[1px] h-4 bg-slate-100" />
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Hasta</span>
                <input
                    type="date"
                    className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-600 uppercase tracking-tight cursor-pointer focus:text-orange-600 transition-colors"
                    value={end}
                    onChange={(e) => onEndChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export const ReportsPage = () => {
    const [expandedChart, setExpandedChart] = useState<{ title: string; component: React.ReactNode; data: any[] } | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'logistics'>('general');
    const [academicRole, setAcademicRole] = useState<'students' | 'teachers'>('students');
    const [dateRange, setDateRange] = useState('all');
    const [customDates, setCustomDates] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const heroTitle = useMemo(() => {
        const titles: Record<string, string> = {
            today: 'Inscripciones de Hoy',
            yesterday: 'Inscripciones de Ayer',
            week: 'Inscripciones de la Semana',
            month: 'Inscripciones del Mes',
            last30: 'Inscripciones del Mes',
            custom: 'Inscripciones del Periodo',
            all: 'Total de Inscripciones'
        };
        return titles[dateRange] || 'Total de Inscripciones';
    }, [dateRange]);

    const heroDateRange = useMemo(() => {
        const fmt = (d: Date) =>
            d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const today = new Date();
        if (dateRange === 'month') {
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            return `${fmt(start)} — ${fmt(end)}`;
        }
        if (dateRange === 'last30') {
            const start = new Date(today);
            start.setDate(today.getDate() - 29);
            return `${fmt(start)} — ${fmt(today)}`;
        }
        return null;
    }, [dateRange]);

    const now = useMemo(() => new Date(), []);
    const firstDayOfMonth = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0], [now]);
    const lastDayOfMonth = useMemo(() => new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0], [now]);

    const [histDates, setHistDates] = useState({ start: firstDayOfMonth, end: lastDayOfMonth });
    const { charts, statsGrid, isLoading } = useReports(dateRange, customDates.start, customDates.end);

    const filteredHistogramData = useMemo(() => {
        const data = charts?.dailyDetailed || [];
        const start = new Date(histDates.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(histDates.end);
        end.setHours(23, 59, 59, 999);

        return data.filter((d: any) => d.date >= start && d.date <= end);
    }, [charts?.dailyDetailed, histDates]);

    if (isLoading) {
        return <LoadingOverlay message="Generando Reportes Estadísticos..." />;
    }

    const totalEnrollmentsStat = statsGrid.find(s => s.label === "Total Inscripciones");
    const otherStats = statsGrid.filter(s => s.label !== "Total Inscripciones");

    const tabs = [
        { id: 'general', label: 'General', icon: BarChart3 },
        { id: 'academic', label: 'Académico', icon: Calendar },
        { id: 'logistics', label: 'Empresas', icon: Bus },
    ];

    return (
        <div className="max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10">
            <ChartModal
                isOpen={!!expandedChart}
                onClose={() => setExpandedChart(null)}
                title={expandedChart?.title || ''}
                data={expandedChart?.data}
            >
                {expandedChart?.component}
            </ChartModal>

            {/* HEADER */}
            <header className="px-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-slate-900 rounded-[1.5rem] text-[#ff8200] shadow-xl shadow-slate-100 ring-4 ring-slate-50">
                        <BarChart3 size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl 2xl:text-5xl font-black text-slate-800 tracking-tight">
                            Panel de <span className="text-[#ff8200]">Analíticas</span>
                        </h1>
                        <p className="text-[11px] 2xl:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-orange-100 rounded-full" />
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

            {/* HERO KPI - TOTAL ENROLLMENTS */}
            <section className="px-2">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-orange-100 group">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff8200] opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 opacity-5 blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:opacity-10 transition-opacity duration-700" />

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#ff8200] mb-4 flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] animate-pulse" />
                                Métrica Principal del Sistema
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                                {heroTitle.split(' ').slice(0, -1).join(' ')} <span className="text-[#ff8200]">{heroTitle.split(' ').slice(-1)}</span>
                            </h2>
                            {heroDateRange && (
                                <p className="text-[#ff8200]/80 font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
                                    {heroDateRange}
                                </p>
                            )}
                            <p className="text-slate-400 font-medium text-sm md:text-base max-w-md">
                                Volumen consolidado de solicitudes procesadas en el periodo seleccionado.
                            </p>
                        </div>

                        <div className="flex flex-col items-center md:items-end">
                            <div className="text-7xl md:text-9xl font-black text-[#ff8200] leading-none tracking-tighter drop-shadow-2xl">
                                {totalEnrollmentsStat?.value}
                            </div>
                            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">Datos en Tiempo Real</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECONDARY STATS GRID */}
            <section className="px-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {otherStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300"
                    >
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </section>

            {/* TABS NAVIGATION */}
            <nav className="px-2 pt-6 flex flex-col items-center justify-between gap-4 w-full">
                <div className="flex flex-wrap justify-center p-1.5 bg-slate-100 rounded-[1.75rem] w-full md:w-fit shadow-inner gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300
                                ${activeTab === tab.id
                                    ? 'bg-white text-[#ff8200] shadow-md scale-[1.02]'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'}`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-[#ff8200]' : 'text-slate-400'} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'academic' && (
                    <div className="flex p-1 bg-orange-50 rounded-2xl border border-orange-100/50 animate-in fade-in slide-in-from-right-4 duration-500">
                        <button
                            onClick={() => setAcademicRole('students')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${academicRole === 'students' ? 'bg-[#ff8200] text-white shadow-lg shadow-orange-200' : 'text-orange-400 hover:text-orange-600'}`}
                        >
                            Alumnos
                        </button>
                        <button
                            onClick={() => setAcademicRole('teachers')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${academicRole === 'teachers' ? 'bg-[#ff8200] text-white shadow-lg shadow-orange-200' : 'text-orange-400 hover:text-orange-600'}`}
                        >
                            Profesores
                        </button>
                    </div>
                )}
            </nav>

            {/* TAB CONTENT (Charts) */}
            <main className="px-2 min-h-[600px]">
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-500">
                        <div className="grid grid-cols-1 gap-8">
                            <AnalyticsCard
                                title="Inscripciones por Día"
                                subtitle="Frecuencia diaria segmentada"
                                hideTypeToggle
                                headerAction={
                                    <HistogramDateFilter 
                                        start={histDates.start} 
                                        end={histDates.end} 
                                        onStartChange={(v) => setHistDates(prev => ({ ...prev, start: v }))} 
                                        onEndChange={(v) => setHistDates(prev => ({ ...prev, end: v }))} 
                                    />
                                }
                                onExpand={() => setExpandedChart({
                                    title: "Inscripciones por Día",
                                    component: (
                                        <HistogramChart 
                                            data={filteredHistogramData.map(d => ({ 
                                                name: d.label, 
                                                value: d.students + d.teachers, 
                                                students: d.students, 
                                                teachers: d.teachers, 
                                                color: '#ff8200' 
                                            }))} 
                                            color="#ff8200" 
                                        />
                                    ),
                                    data: [] // Hides "referencia y datos"
                                })}
                            >
                                {() => (
                                    <HistogramChart 
                                        data={filteredHistogramData.map(d => ({ 
                                            name: d.label, 
                                            value: d.students + d.teachers, 
                                            students: d.students, 
                                            teachers: d.teachers, 
                                            color: '#ff8200' 
                                        }))} 
                                        color="#ff8200" 
                                    />
                                )}
                            </AnalyticsCard>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        </div>
                    </div>
                )}

                {/* ACADEMIC TAB */}
                {activeTab === 'academic' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-500">
                        {academicRole === 'students' && charts.university.length > 0 && (
                            <div className="grid grid-cols-1 gap-8 animate-in zoom-in-95 duration-500">
                                <AnalyticsCard
                                    title="Estudiantes Universitarios"
                                    subtitle="Distribución por Institución (UNSJ, UC, UCC)"
                                    defaultType="bar"
                                    hideTypeToggle
                                    onExpand={() => setExpandedChart({
                                        title: "Estudiantes Universitarios",
                                        component: <BeneficiaryChart type="bar" data={charts.university} />,
                                        data: charts.university
                                    })}
                                >
                                    {(type) => <BeneficiaryChart type={type} data={charts.university} />}
                                </AnalyticsCard>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnalyticsCard
                                title={`Estado: ${academicRole === 'students' ? 'Alumnos' : 'Profesores'}`}
                                subtitle="Situación administrativa por rol"
                                onExpand={() => setExpandedChart({
                                    title: `Estado: ${academicRole === 'students' ? 'Alumnos' : 'Profesores'}`,
                                    component: <StatusChart type="bar" data={academicRole === 'students' ? charts.statusStudents : charts.statusTeachers} />,
                                    data: academicRole === 'students' ? charts.statusStudents : charts.statusTeachers
                                })}
                            >
                                {(type) => <StatusChart type={type} data={academicRole === 'students' ? charts.statusStudents : charts.statusTeachers} />}
                            </AnalyticsCard>

                            <AnalyticsCard
                                title="Distribución por Turno"
                                subtitle="Global (Alumnos y Profesores)"
                                onExpand={() => setExpandedChart({
                                    title: "Distribución por Turno",
                                    component: <ShiftChart type="bar" data={charts.shift} />,
                                    data: charts.shift
                                })}
                            >
                                {(type) => <ShiftChart type={type} data={charts.shift} />}
                            </AnalyticsCard>

                            <AnalyticsCard
                                title={`Nivel Educativo: ${academicRole === 'students' ? 'Alumnos' : 'Profesores'}`}
                                subtitle="Distribución por niveles de enseñanza"
                                onExpand={() => setExpandedChart({
                                    title: `Nivel Educativo: ${academicRole === 'students' ? 'Alumnos' : 'Profesores'}`,
                                    component: <LevelChart type="bar" data={academicRole === 'students' ? charts.levelStudents : charts.levelTeachers} />,
                                    data: academicRole === 'students' ? charts.levelStudents : charts.levelTeachers
                                })}
                            >
                                {(type) => <LevelChart type={type} data={academicRole === 'students' ? charts.levelStudents : charts.levelTeachers} />}
                            </AnalyticsCard>
                        </div>
                    </div>
                )}

                {/* LOGISTICS TAB */}
                {activeTab === 'logistics' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};