import { X } from 'lucide-react';

// ... imports
interface ChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    data?: { name: string; color?: string; value: number }[];
}

export const ChartModal = ({ isOpen, onClose, title, children, data }: ChartModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
                {/* Header Compacto */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 shrink-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{title}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Vista detallada del reporte</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/10">
                    <div className="w-full min-h-[450px] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 relative">
                        {children}
                    </div>

                    {data && data.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                                Referencias y Datos
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {data.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                            style={{ backgroundColor: item.color || '#cbd5e1' }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold text-slate-700 truncate uppercase mt-0.5">
                                                {item.name}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 shrink-0 bg-slate-50 px-1.5 py-0.5 rounded-md">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-50 flex justify-end bg-white shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ff8200] transition-all shadow-lg shadow-slate-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
