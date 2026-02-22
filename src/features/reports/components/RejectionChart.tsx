import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { ChartLegend } from './ChartLegend';

interface RejectionChartProps {
    type?: 'pie' | 'bar';
    data: { name: string; value: number; color: string }[];
}

export const RejectionChart = ({ type = 'bar', data }: RejectionChartProps) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    const isEmpty = total === 0;

    return (
        <div className="w-full">
            {type === 'pie' ? (
                <div className="relative w-full min-h-[240px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={isEmpty ? [{ name: 'Sin datos', value: 1 }] : data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={isEmpty ? 0 : 5}
                                dataKey="value"
                                animationDuration={1000}
                            >
                                {isEmpty ? (
                                    <Cell fill="#f1f5f9" stroke="none" />
                                ) : (
                                    data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))
                                )}
                            </Pie>
                            {!isEmpty && (
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: '900', fontSize: '11px' }}
                                />
                            )}
                        </PieChart>
                    </ResponsiveContainer>
                    {isEmpty && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin Rechazos</span>
                        </div>
                    )}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={Math.max(300, data.length * 50)}>
                    <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={150}
                            tick={(props) => {
                                const { x, y, payload } = props;
                                const text = payload.value.length > 25 ? `${payload.value.substring(0, 22)}...` : payload.value;
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            x={0}
                                            y={0}
                                            dy={4}
                                            textAnchor="end"
                                            fill="#64748b"
                                            fontSize={10}
                                            fontWeight="bold"
                                            className="uppercase tracking-tighter"
                                        >
                                            {text}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={isEmpty ? '#f1f5f9' : entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
            {!isEmpty && <ChartLegend data={data} />}
        </div>
    );
};
