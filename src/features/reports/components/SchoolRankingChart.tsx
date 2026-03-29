import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface SchoolRankingChartProps {
    data: { name: string; value: number; color: string }[];
}

export const SchoolRankingChart = ({ data }: SchoolRankingChartProps) => {
    // Dynamic width based on the number of bars to enable horizontal scrolling
    const minWidth = useMemo(() => {
        if (data.length <= 15) return '100%';
        return `${data.length * 45}px`;
    }, [data.length]);

    // Dynamic Bar Styling
    const barSize = useMemo(() => {
        const len = data.length;
        if (len <= 10) return 40;
        if (len <= 20) return 25;
        return 15;
    }, [data.length]);

    return (
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <div style={{ width: minWidth, height: '400px', minWidth: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ left: -10, right: 10, top: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={(props) => {
                                const { x, y, index } = props;
                                
                                // Always show ranking number as it's cleaner in scrollable view
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight="900">
                                            {index + 1}
                                        </text>
                                    </g>
                                );
                            }}
                            interval={0}
                            height={30}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700' }}
                        />

                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ 
                                borderRadius: '20px', 
                                border: 'none', 
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                padding: '12px 16px'
                            }}
                            itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                            labelStyle={{ 
                                fontSize: '10px', 
                                fontWeight: 'black', 
                                textTransform: 'uppercase', 
                                color: '#94a3b8',
                                marginBottom: '4px',
                                borderBottom: '1px solid #f1f5f9',
                                paddingBottom: '4px'
                            }}
                            formatter={(value: number | undefined) => [value ?? 0, 'Alumnos Aprobados']}
                        />

                        <Bar 
                            dataKey="value" 
                            radius={[10, 10, 0, 0]} 
                            barSize={barSize}
                            minPointSize={2}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
