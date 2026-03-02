import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface HistogramChartProps {
    data: { name: string; value: number; color?: string }[];
    color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-50">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                    {label}
                </p>
                <div className="flex flex-col gap-1">
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-lg font-black text-slate-800 leading-none flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.value} <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Registros</span>
                        </p>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const HistogramChart = ({ data, color = '#3b82f6' }: HistogramChartProps) => {
    // Provide a default color if not specified
    const chartData = data.map(d => ({ ...d, color: d.color || color }));

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={320}>
                <ComposedChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: -20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                        dy={20}
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        content={<CustomTooltip />}
                    />
                    <Bar dataKey="value" barSize={30} radius={[4, 4, 0, 0]}>
                        {chartData.map((item, index) => (
                            <Cell key={`cell-${index}`} fill={item.color} />
                        ))}
                    </Bar>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0f172a"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#fff', strokeWidth: 2, stroke: '#0f172a' }}
                        activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
