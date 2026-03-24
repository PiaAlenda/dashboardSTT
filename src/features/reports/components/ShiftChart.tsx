import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ChartLegend } from './ChartLegend';

interface ShiftChartProps {
    type: 'pie' | 'bar';
    data: { name: string; value: number; color: string }[];
}

export const ShiftChart = ({ type, data }: ShiftChartProps) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="w-full">
            {type === 'pie' ? (
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontWeight: '900', fontSize: '11px' }}
                            formatter={(value: number | undefined) => [`${value ?? 0} (${total > 0 && typeof value === 'number' ? ((value / total) * 100).toFixed(1) : "0"}%)`, 'Inscripciones']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height={Math.max(300, data.length * 60)}>
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10, top: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={120}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            <ChartLegend data={data} />
        </div>
    );
};
