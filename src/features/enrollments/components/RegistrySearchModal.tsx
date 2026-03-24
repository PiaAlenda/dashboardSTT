import { useState } from 'react';
import { X, Search, User, Building2, GraduationCap, MapPin, Clock, Fingerprint } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registryService } from '../../../services/registryService';

interface RegistrySearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrySearchModal = ({ isOpen, onClose }: RegistrySearchModalProps) => {
    const [dni, setDni] = useState('');
    
    // Mutation to fetch registry data manually
    const searchMutation = useMutation({
        mutationFn: (searchDni: string) => registryService.getByDni(searchDni)
    });

    if (!isOpen) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (dni.trim()) {
            const cleanDni = dni.trim().replace(/\s+/g, '');
            searchMutation.mutate(cleanDni);
        }
    };


    const handleClose = () => {
        setDni('');
        searchMutation.reset();
        onClose();
    };

    const person = searchMutation.data;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                            <Search size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Buscar en Padrón</h2>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Consulta de datos registrales por DNI
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                        <div className="relative flex-1">
                            <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Ingrese el DNI a buscar..."
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!dni.trim() || searchMutation.isPending}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-blue-200 disabled:shadow-none min-w-[140px] flex items-center justify-center"
                        >
                            {searchMutation.isPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Buscar'
                            )}
                        </button>
                    </form>

                    {/* Results / Empty State */}
                    <div className="min-h-[200px]">
                        {searchMutation.isError && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-[2rem] border border-red-100">
                                <p className="text-red-500 font-bold mt-4">
                                    No se encontró el DNI en el padrón educativo.
                                </p>
                            </div>
                        )}

                        {!searchMutation.isError && !person && !searchMutation.isPending && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                                <Search size={48} className="text-slate-200 mb-4" />
                                <p className="text-slate-400 font-medium">
                                    Ingrese un DNI y presione buscar para visualizar los detalles del padrón.
                                </p>
                            </div>
                        )}

                        {person && (
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-start gap-4 mb-8 pb-8 border-b border-slate-100">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{person.fullName}</h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold font-mono">
                                                DNI: {person.dni}
                                            </span>
                                            {person.gender && (
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                                    Género: {person.gender}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                <Building2 size={14} /> Institución
                                            </p>
                                            <p className="font-bold text-slate-700">{person.institution || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                <GraduationCap size={14} /> Nivel / Carrera
                                            </p>
                                            <p className="font-bold text-slate-700">
                                                {person.educationLevel || '-'} 
                                                {person.career ? ` - ${person.career}` : ''}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                <Clock size={14} /> Turno
                                            </p>
                                            <p className="font-bold text-slate-700">{person.shift || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                <User size={14} /> Tipo de Beneficiario
                                            </p>
                                            <p className="font-bold text-slate-700">
                                                {person.beneficiaryType ? person.beneficiaryType.name : '-'}
                                                {person.beneficiaryType?.active ? <span className="ml-2 text-green-500 text-xs">(Activo)</span> : null}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                <MapPin size={14} /> Localidad
                                            </p>
                                            <p className="font-bold text-slate-700">{person.locality || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                <Building2 size={14} /> Fuente del Padrón
                                            </p>
                                            <p className="font-bold text-slate-700">
                                                {person.registrySource ? person.registrySource.name : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
