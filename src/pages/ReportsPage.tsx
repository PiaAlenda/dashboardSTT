import React, { useState } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import { AnalyticsCard } from '../features/reports/components/AnalyticsCard';
import { SourceChart } from '../features/reports/components/SourceChart';
import { StatusChart } from '../features/reports/components/StatusChart';
import { BeneficiaryChart } from '../features/reports/components/BeneficiaryChart';
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
    const { charts, isLoading } = useReports(dateRange);

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
                            Métricas operativas en tiempo real
                        </p>
                    </div>
                </div>

                <div className="shrink-0">
                    <DateFilter selected={dateRange} onChange={setDateRange} />
                </div>
            </header>

            {/* GRILLA DE GRÁFICOS (Charts) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-2">
                <AnalyticsCard
                    title="Fuente de Ingreso"
                    subtitle={`Periodo seleccionado: ${dateRange}`}
                    onExpand={() => setExpandedChart({
                        title: "Fuente de Ingreso",
                        component: <SourceChart type="bar" data={charts.source} />,
                        data: charts.source
                    })}
                >
                    {(type) => <SourceChart type={type} data={charts.source} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Estado de Solicitudes"
                    subtitle="Distribución actual del padrón"
                    onExpand={() => setExpandedChart({
                        title: "Estado de Solicitudes",
                        component: <StatusChart type="bar" data={charts.status} />,
                        data: charts.status
                    })}
                >
                    {(type) => <StatusChart type={type} data={charts.status} />}
                </AnalyticsCard>

                <AnalyticsCard
                    title="Tipos de Beneficiario"
                    subtitle="Perfil del universo estudiantil"
                    onExpand={() => setExpandedChart({
                        title: "Tipos de Beneficiario",
                        component: <BeneficiaryChart type="bar" data={charts.beneficiary} />,
                        data: charts.beneficiary
                    })}
                >
                    {(type) => <BeneficiaryChart type={type} data={charts.beneficiary} />}
                </AnalyticsCard>

                <div className="lg:col-span-2 xl:col-span-3">
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
                </div>
            </section>
        </div>
    );
};