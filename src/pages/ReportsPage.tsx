import { useState } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import { AnalyticsCard } from '../features/reports/components/AnalyticsCard';
import { StatusChart } from '../features/reports/components/StatusChart';
import { BeneficiaryChart } from '../features/reports/components/BeneficiaryChart';
import { ShiftChart } from '../features/reports/components/ShiftChart';
import { LevelChart } from '../features/reports/components/LevelChart';
import { SourceChart } from '../features/reports/components/SourceChart';
import { RejectionChart } from '../features/reports/components/RejectionChart';
import { ChartModal } from '../features/reports/components/ChartModal';
import { useReports } from '../features/reports/hooks/useReports';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

const DateFilter = ({ selected, onChange }: { selected: string; onChange: (val: string) => void }) => {
    const options = [
        { id: 'today', label: 'Hoy' },
        { id: 'week', label: 'Semana' },
        { id: 'month', label: 'Este Mes' }
    ];

    return (
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <div className="pl-3 pr-2 text-slate-400">
                <Calendar size={14} strokeWidth={3} />
            </div>
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => onChange(opt.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all
                        ${selected === opt.id
                            ? 'bg-white text-[#ff8200] shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export const ReportsPage = () => {
    const [expandedChart, setExpandedChart] = useState<{ title: string; component: React.ReactNode; data: any[] } | null>(null);
    const [dateRange, setDateRange] = useState('month');
    const { charts, statsGrid, isLoading } = useReports(dateRange);

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
                    <DateFilter selected={dateRange} onChange={setDateRange} />
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
            </section>
        </div>
    );
};