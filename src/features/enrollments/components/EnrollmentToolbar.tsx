import { Search, Download, X as CloseIcon } from 'lucide-react';

interface EnrollmentToolbarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    showExport?: boolean;
    exportProps: {
        onOpenExportModal: () => void;
        loading: boolean;
    };
}

export const EnrollmentToolbar = ({ searchTerm, setSearchTerm, exportProps, showExport = false }: EnrollmentToolbarProps) => {
    const { onOpenExportModal, loading } = exportProps;

    return (
        <section className="space-y-6 px-2">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                {/* BUSCADOR PRINCIPAL (Visible para todos) */}
                <div className="relative group w-full max-w-2xl flex-1">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff8200] transition-colors"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Buscar por DNI, Nombre, Correo, Tipo de rechazo..."
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

                {/* Botón Exportar */}
                {showExport && (
                    <button
                        onClick={onOpenExportModal}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl transition-all shadow-lg shadow-emerald-200 whitespace-nowrap
                        cursor-pointer hover:-translate-y-0.5
                        disabled:cursor-not-allowed disabled:hover:translate-y-0
                        disabled:opacity-50 disabled:shadow-none disabled:grayscale"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Download size={18} />
                        )}
                        <span className="text-xs font-black uppercase tracking-widest sm:inline">Exportar CSV</span>
                    </button>
                )}
            </div>
        </section>
    );
};