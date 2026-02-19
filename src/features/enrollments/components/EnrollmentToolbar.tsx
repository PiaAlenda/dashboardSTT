import React from 'react';
import { Search, Calendar, Download, X as CloseIcon } from 'lucide-react';

interface EnrollmentToolbarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    exportProps: {
        onExport: () => void;
        loading: boolean;
        dates: { start: string; end: string };
        setDates: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
    };
}

export const EnrollmentToolbar = ({ searchTerm, setSearchTerm, exportProps }: EnrollmentToolbarProps) => {
    const { dates, setDates, onExport, loading } = exportProps;

    return (
        <section className="space-y-6 px-2">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm transition-focus-within focus-within:border-orange-500/50">
                    <Calendar size={16} className="text-slate-400 ml-2" />
                    <input
                        type="date"
                        className="text-xs font-bold text-slate-600 outline-none uppercase tracking-wide bg-transparent cursor-pointer"
                        value={dates.start}
                        onChange={(e) => setDates(prev => ({ ...prev, start: e.target.value }))}
                    />
                    <span className="text-slate-300 font-bold">-</span>
                    <input
                        type="date"
                        className="text-xs font-bold text-slate-600 outline-none uppercase tracking-wide bg-transparent cursor-pointer"
                        value={dates.end}
                        onChange={(e) => setDates(prev => ({ ...prev, end: e.target.value }))}
                    />
                </div>

                {/* Botón Exportar */}
                <button
                    onClick={onExport}
                    disabled={loading || !dates.start || !dates.end}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none disabled:grayscale"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Download size={16} />
                    )}
                    <span className="text-xs font-black uppercase tracking-widest">Exportar CSV</span>
                </button>
            </div>

            {/* BUSCADOR PRINCIPAL */}
            <div className="relative group w-full max-w-2xl">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff8200] transition-colors"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Buscar por DNI, Nombre, Correo..."
                    className="w-full rounded-[1.25rem] border-2 border-slate-200 bg-white py-4 pl-12 pr-12 text-sm font-bold text-slate-700 outline-none transition-all focus:border-[#ff8200] focus:ring-4 focus:ring-orange-500/5 placeholder:text-slate-300 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                    >
                        <CloseIcon size={16} />
                    </button>
                )}
            </div>
        </section>
    );
};