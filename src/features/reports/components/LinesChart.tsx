import { useState, useMemo } from 'react';
import {
    Treemap, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';
import { ChartLegend } from './ChartLegend';
import { LayoutGrid, List } from 'lucide-react';

interface LinesChartProps {
    type: 'pie' | 'bar';
    data: { name: string; value: number; color?: string }[];
}

export const LinesChart = ({ type, data }: LinesChartProps) => {
    const [showOnlyTop, setShowOnlyTop] = useState(false);

    const chartData = useMemo(() => {
        let processed = data.map(d => ({ ...d, color: d.color || '#3b82f6' }));
        if (showOnlyTop) {
            processed = processed.slice(0, 10);
        }
        return processed;
    }, [data, showOnlyTop]);

    const isTreemap = type === 'pie';

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowOnlyTop(!showOnlyTop)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all
                            ${showOnlyTop
                                ? 'bg-[#ff8200] text-white border-orange-500'
                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                        {showOnlyTop ? 'Ver Todas' : 'Ver Top 10'}
                    </button>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <div className="p-1.5 text-slate-400" title={isTreemap ? "Vista Treemap" : "Vista Lista"}>
                        {isTreemap ? <LayoutGrid size={12} /> : <List size={12} />}
                    </div>
                </div>
            </div>

            <div className={`${!isTreemap ? 'overflow-y-auto max-h-[300px] pr-2 custom-scrollbar' : ''}`}>
                <ResponsiveContainer width="100%" height={isTreemap ? 240 : Math.max(240, chartData.length * 25)}>
                    {isTreemap ? (
                        <Treemap
                            data={chartData}
                            dataKey="value"
                            aspectRatio={4 / 3}
                            stroke="#fff"
                            animationDuration={1000}
                        >
                            <Tooltip
                                content={<CustomTooltip />}
                            />
                        </Treemap>
                    ) : (
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                content={<CustomTooltip />}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={15}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
            {showOnlyTop && <ChartLegend data={chartData} />}
        </div>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-50">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                    {payload[0].payload.name}
                </p>
                <p className="text-lg font-black text-slate-800 leading-none">
                    {payload[0].value} <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Inscritos</span>
                </p>
            </div>
        );
    }
    return null;
};
