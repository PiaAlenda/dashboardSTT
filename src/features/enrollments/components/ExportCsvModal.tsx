import React, { useState } from 'react';
import { X, Download, Calendar } from 'lucide-react';

interface ExportCsvModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (level: string, startDate: string, endDate: string) => void;
    isExporting: boolean;
}

export const ExportCsvModal: React.FC<ExportCsvModalProps> = ({ isOpen, onClose, onExport, isExporting }) => {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const levels = [
        { id: 'inicial', label: 'Inicial', color: 'bg-pink-100 text-pink-700 hover:bg-pink-500 hover:text-white border-pink-200' },
        { id: 'primario', label: 'Primario', color: 'bg-blue-100 text-blue-700 hover:bg-blue-500 hover:text-white border-blue-200' },
        { id: 'secundario', label: 'Secundario', color: 'bg-green-100 text-green-700 hover:bg-green-500 hover:text-white border-green-200' },
        { id: 'superior', label: 'Superior', color: 'bg-purple-100 text-purple-700 hover:bg-purple-500 hover:text-white border-purple-200' },
        { id: 'universitario', label: 'Universitario', color: 'bg-orange-100 text-orange-700 hover:bg-orange-500 hover:text-white border-orange-200' },
        { id: 'docentes', label: 'Docentes', color: 'bg-slate-100 text-slate-700 hover:bg-slate-500 hover:text-white border-slate-200' }
    ];

    if (!isOpen) return null;

    const handleExport = () => {
        if (!selectedLevel || !startDate) return;

        let finalEndDate = endDate;
        if (!finalEndDate) {
            const today = new Date();
            finalEndDate = today.toISOString().split('T')[0];
        }

        onExport(selectedLevel, startDate, finalEndDate);
    };

    const resetAndClose = () => {
        setSelectedLevel(null);
        setStartDate('');
        setEndDate('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={resetAndClose}>
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-md shadow-emerald-200">
                            <Download size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">Exportar Datos</h3>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">Archivo CSV por Nivel</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 active:scale-95">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Selector de Nivel */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">1. Seleccionar Nivel</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {levels.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedLevel === level.id ? level.color.replace('hover:', '') + ' ring-4 ring-slate-100' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:border-slate-300'}`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selector de Fechas (Solo visible si hay nivel seleccionado) */}
                    {selectedLevel && (
                        <div className="space-y-3 animate-in slide-in-from-top-4 fade-in duration-300">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">2. Rango de Fechas</label>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 focus-within:border-emerald-500/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                        <Calendar size={14} />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desde:</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="text-xs font-black text-slate-700 bg-transparent outline-none uppercase cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 focus-within:border-emerald-500/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                        <Calendar size={14} />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hasta:</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="text-xs font-black text-slate-700 bg-transparent outline-none uppercase cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 px-2 uppercase tracking-wide">* Si no se especifica "Hasta", se usará la fecha de hoy.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={resetAndClose}
                        className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 bg-white border-2 border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={!selectedLevel || !startDate || isExporting}
                        className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {isExporting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Download size={14} />
                        )}
                        {isExporting ? 'Procesando...' : 'Descargar CSV'}
                    </button>
                </div>

            </div>
        </div >
    );
};
