import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ChartLegend } from './ChartLegend';

interface CompanyChartProps {
    type: 'pie' | 'bar';
    data: { name: string; value: number; color?: string }[];
}

export const CompanyChart = ({ type, data }: CompanyChartProps) => {
    const chartData = data.map(d => ({ ...d, color: d.color || '#3b82f6' }));

    return (
        <div className="w-full">
            {type === 'pie' ? (
                <ResponsiveContainer width="100%" height={240}>
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
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((item, index) => (
                                <Cell key={`cell-${index}`} fill={item.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            <ChartLegend data={chartData} />
        </div>
    );
};
