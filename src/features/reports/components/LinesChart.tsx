import { useMemo } from 'react';
import {
    PieChart, Pie, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';
import { ChartLegend } from './ChartLegend';

interface LinesChartProps {
    type: 'pie' | 'bar';
    data: { name: string; value: number; color?: string }[];
}

export const LinesChart = ({ type, data }: LinesChartProps) => {
    const chartData = useMemo(() => {
        let processed = data.map(d => ({ ...d, color: d.color || '#3b82f6' }));
        return processed.slice(0, 10);
    }, [data]);

    const isTreemap = type === 'pie';

    return (
        <div className="w-full flex flex-col gap-4">
            <div className={`${!isTreemap ? 'overflow-y-auto max-h-[300px] pr-2 custom-scrollbar' : ''}`}>
                <ResponsiveContainer width="100%" height={isTreemap ? 240 : Math.max(240, chartData.length * 25)}>
                    {isTreemap ? (
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1000}
                            >
                                {chartData.map((item, index) => (
                                    <Cell key={`cell-${index}`} fill={item.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                                content={<CustomTooltip />}
                            />
                        </PieChart>
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
            <ChartLegend data={chartData} />
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
