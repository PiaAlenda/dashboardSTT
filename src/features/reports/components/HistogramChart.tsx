import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area
} from 'recharts';

interface HistogramChartProps {
    data: { 
        name: string; 
        value: number; 
        students?: number; 
        teachers?: number; 
        color?: string 
    }[];
    color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // Filter payload to show only unique names to avoid "Total" duplication
        const uniquePayload = payload.reduce((acc: any[], current: any) => {
            const name = current.name === 'value' ? 'Total' : current.name === 'students' ? 'Alumnos' : 'Profesores';
            if (!acc.find(item => item.displayName === name)) {
                acc.push({ ...current, displayName: name });
            }
            return acc;
        }, []);

        return (
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 border-b border-slate-50 pb-2">
                    {label}
                </p>
                <div className="space-y-3">
                    {uniquePayload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.stroke }} />
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                    {entry.displayName}
                                </span>
                            </div>
                            <span className="text-sm font-black text-slate-800">
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const HistogramChart = ({ data, color = '#ff8200' }: HistogramChartProps) => {
    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: -20,
                    }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }}
                        dy={20}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }}
                    />
                    <Tooltip
                        cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                        content={<CustomTooltip />}
                    />
                    <Legend 
                        verticalAlign="top" 
                        align="right" 
                        height={36}
                        content={({ payload }) => {
                            // Filter legend payload to show only unique items
                            const uniqueLegend = payload?.reduce((acc: any[], current: any) => {
                                const label = current.value === 'value' ? 'Total' : current.value === 'students' ? 'Alumnos' : 'Profesores';
                                if (!acc.find(item => item.label === label)) {
                                    acc.push({ ...current, label });
                                }
                                return acc;
                            }, []);

                            return (
                                <div className="flex flex-wrap justify-end gap-3 md:gap-6 mb-4">
                                    {uniqueLegend?.map((entry: any, index: number) => (
                                        <div key={`item-${index}`} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                                {entry.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }}
                    />
                    
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="none" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={1500}
                        legendType="none"
                        tooltipType="none"
                    />

                    <Bar dataKey="value" barSize={12} radius={[6, 6, 0, 0]} fill="#f1f5f9" hide legendType="none" tooltipType="none" />
                    
                    <Line
                        name="students"
                        type="monotone"
                        dataKey="students"
                        stroke="#ff8200"
                        strokeWidth={3}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6, fill: '#ff8200', stroke: '#fff', strokeWidth: 3 }}
                        animationDuration={1200}
                    />
                    
                    <Line
                        name="teachers"
                        type="monotone"
                        dataKey="teachers"
                        stroke="#64748b"
                        strokeWidth={3}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6, fill: '#64748b', stroke: '#fff', strokeWidth: 3 }}
                        animationDuration={1800}
                    />

                    <Line
                        name="value"
                        type="monotone"
                        dataKey="value"
                        stroke="#0f172a"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        dot={{ r: 0 }}
                        activeDot={{ r: 4, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
