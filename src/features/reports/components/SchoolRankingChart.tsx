import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface SchoolRankingChartProps {
    data: { name: string; value: number; color: string }[];
}

export const SchoolRankingChart = ({ data }: SchoolRankingChartProps) => {
    // 1. Data Thinning & Aggregation
    const processedData = useMemo(() => {
        const THRESHOLD = 50;
        if (data.length <= THRESHOLD) return data;

        const mainItems = data.slice(0, THRESHOLD - 1);
        const otherItems = data.slice(THRESHOLD - 1);
        const otherSum = otherItems.reduce((acc, curr) => acc + curr.value, 0);

        return [
            ...mainItems,
            {
                name: "Otras instituciones",
                value: otherSum,
                color: "#94a3b8", // Darker gray for "Others"
                isOther: true
            }
        ];
    }, [data]);

    // 2. Dynamic Bar Styling
    const barSize = useMemo(() => {
        const len = processedData.length;
        if (len <= 10) return 40;
        if (len <= 20) return 25;
        if (len <= 50) return 15;
        return 8;
    }, [processedData]);

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={processedData}
                    margin={{ left: -10, right: 10, top: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    
                    {/* 4. Smart X-Axis Labeling */}
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={(props) => {
                            const { x, y, payload, index } = props;
                            const isLargeDataset = processedData.length > 15;
                            
                            // For large datasets, show ranking number (1-indexed)
                            // Show only every Nth tick for clarity if needed
                            if (isLargeDataset) {
                                const showTick = index === 0 || index === processedData.length - 1 || (index + 1) % 10 === 0;
                                if (!showTick) return null;
                                
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight="900">
                                            {index + 1}
                                        </text>
                                    </g>
                                );
                            }

                            // For small datasets, show names rotated and truncated
                            const displayName = payload.value.length > 15 
                                ? payload.value.substring(0, 12) + '...' 
                                : payload.value;

                            return (
                                <g transform={`translate(${x},${y})`}>
                                    <text x={0} y={0} dy={16} textAnchor="end" fill="#94a3b8" fontSize={9} fontWeight="700" transform="rotate(-45)">
                                        {displayName}
                                    </text>
                                </g>
                            );
                        }}
                        interval={0}
                        height={60}
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
                        radius={[10, 10, 0, 0]} // 3. Anatomía Visual de la Barra
                        barSize={barSize}
                        minPointSize={2} // Ensure never less than 2px
                        animationDuration={1500}
                    >
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
