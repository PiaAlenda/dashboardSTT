import { useState } from 'react';
import { X, Search, Fingerprint, Check, AlertCircle, RotateCcw, GraduationCap, MapPin, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registryService } from '../../../services/registryService';
import { enrollmentService } from '../../../services/enrollmentService';

type SearchType = 'local' | 'ucc' | 'sige';

interface RegistrySearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrySearchModal = ({ isOpen, onClose }: RegistrySearchModalProps) => {
    const [dni, setDni] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('local');
    const [gender, setGender] = useState<'F' | 'M' | 'X'>('F');

    const localMutation = useMutation({
        mutationFn: (searchDni: string) => registryService.getByDni(searchDni)
    });
    
    const uccMutation = useMutation({
        mutationFn: async (searchDni: string) => {
            const response = await fetch(`/apiuccuyo/verificar_dni.php?dni=${searchDni}&t=${Date.now()}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        }
    });

    const sigeMutation = useMutation({
        mutationFn: ({ searchDni, sexo }: { searchDni: string, sexo: string }) => 
            enrollmentService.searchSige(searchDni, sexo)
    });

    if (!isOpen) return null;

    const isPending = localMutation.isPending || uccMutation.isPending || sigeMutation.isPending;
    const isSigeMode = searchType === 'sige';

    const isSuccess = (localMutation.isSuccess && localMutation.data) || 
                      (uccMutation.isSuccess && uccMutation.data?.existe) ||
                      (sigeMutation.isSuccess && sigeMutation.data);

    const isNotFound = (localMutation.isSuccess && !localMutation.data) ||
        (uccMutation.isSuccess && uccMutation.data && !uccMutation.data.existe) ||
        localMutation.isError || uccMutation.isError || sigeMutation.isError;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni.trim()) return;
        const cleanDni = dni.trim().replace(/\D/g, ''); 
        if (searchType === 'local') localMutation.mutate(cleanDni);
        else if (searchType === 'ucc') uccMutation.mutate(cleanDni);
        else if (searchType === 'sige') sigeMutation.mutate({ searchDni: cleanDni, sexo: gender });
    };

    const resetMutations = () => {
        setDni('');
        localMutation.reset();
        uccMutation.reset();
        sigeMutation.reset();
    };

    const handleClose = () => {
        setDni('');
        setSearchType('local');
        resetMutations();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500" onClick={handleClose} />

            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                            <Search size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Padrón Educativo</h2>
                    </div>
                    <button onClick={handleClose} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="p-8">
                    {!isSuccess && !isNotFound && (
                        <div className="flex bg-slate-100/80 p-1 rounded-2xl mb-8 relative">
                            {(['local', 'ucc', 'sige'] as SearchType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => { setSearchType(type); resetMutations(); }}
                                    className={`flex-1 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all duration-300
                                        ${searchType === type ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex flex-col">
                        {/* FORMULARIO */}
                        {!isSuccess && !isNotFound && (
                            <form onSubmit={handleSearch} className="space-y-6 animate-in fade-in">
                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block group-focus-within:text-blue-600 transition-colors">
                                        Documento del Titular
                                    </label>
                                    <div className="relative">
                                        <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Ingresa el DNI..."
                                            value={dni}
                                            onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold text-lg focus:border-blue-500 focus:bg-white transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {isSigeMode && (
                                    <div className="space-y-3 animate-in slide-in-from-top-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Sexo del Titular</label>
                                        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                                            {(['F', 'M', 'X'] as const).map((g) => (
                                                <button
                                                    key={g} type="button" onClick={() => setGender(g)}
                                                    className={`py-3 text-xs font-black rounded-xl transition-all border
                                                        ${gender === g ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white text-slate-400 border-transparent hover:border-slate-200'}`}
                                                >
                                                    {g === 'F' ? 'F' : g === 'M' ? 'M' : 'X'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!dni.trim() || isPending}
                                    className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                    {isPending ? "Procesando..." : "Realizar Búsqueda"}
                                </button>
                            </form>
                        )}

                        {/* RESULTADO POSITIVO SIGE */}
                        {isSuccess && isSigeMode && sigeMutation.data && (
                            <div className="flex flex-col animate-in slide-in-from-bottom-4 duration-500">
                                {/* Banner de Título */}
                                <div className="bg-blue-600 text-white p-6 rounded-t-[2rem] shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <GraduationCap size={100} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{sigeMutation.data.titulo || 'Certificado de Regularidad'}</h3>
                                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-80">{sigeMutation.data.resumen}</p>
                                    </div>
                                </div>

                                {/* Mensaje de Confirmación y Datos */}
                                <div className="bg-slate-50/50 border-x-2 border-b-2 border-slate-100 rounded-b-[2rem] p-6 pt-8 space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in-95 delay-150">
                                        <div className="shrink-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                                            <Check size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-emerald-900 font-black text-sm uppercase tracking-tight">¡Alumno Encontrado!</p>
                                            <p className="text-emerald-700/70 text-xs font-bold">El alumno figura como Regular en el sistema.</p>
                                        </div>
                                    </div>

                                    {/* Lista de Detalles */}
                                    <div className="space-y-3">
                                        {sigeMutation.data.campos?.map((campo: any, idx: number) => (
                                            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 transition-colors">
                                                    {campo.label.toLowerCase().includes('escuela') ? <MapPin size={16} /> : <User size={16} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{campo.label}</p>
                                                    <p className="text-[13px] font-bold text-slate-700 leading-snug">{campo.resumen || '-'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={resetMutations} className="w-full flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95">
                                        <RotateCcw size={14} /> Nueva consulta 
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ÉXITO LOCAL/UCC */}
                        {isSuccess && !isSigeMode && (
                            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95 text-center">
                                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-200">
                                    <Check size={40} strokeWidth={4} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Verificado con éxito</h3>
                                <p className="text-slate-500 font-bold mt-2">DNI {dni} encontrado en {searchType.toUpperCase()}</p>
                                <button onClick={resetMutations} className="mt-8 px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-slate-800 transition-all">
                                    Realizar otra búsqueda
                                </button>
                            </div>
                        )}

                        {/* NO ENCONTRADO */}
                        {isNotFound && (
                            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95 text-center">
                                <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-200">
                                    <AlertCircle size={40} strokeWidth={4} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sin registros</h3>
                                <p className="text-slate-500 font-bold mt-2 px-6">No se encontraron datos asociados al DNI {dni} en esta base.</p>
                                <button onClick={resetMutations} className="mt-8 px-10 py-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100">
                                    Intentar de nuevo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};