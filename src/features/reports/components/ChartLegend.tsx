import React from 'react';

interface ChartLegendProps {
    data: { name: string; value: number; color: string }[];
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ data }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6 px-1">
            {data.map((item, index) => {
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
                return (
                    <div key={index} className="flex items-center gap-2 group cursor-default">
                        <div
                            className="w-3 h-3 rounded-full shadow-sm transition-transform group-hover:scale-125"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            {item.name.replace('_', ' ')}
                            <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                {percentage}%
                            </span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
