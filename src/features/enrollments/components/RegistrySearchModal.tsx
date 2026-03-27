import { useState } from 'react';
import { X, Search, Fingerprint, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registryService } from '../../../services/registryService';

type SearchType = 'local' | 'ucc' | 'sige';
type SexType = 'M' | 'F' | 'X';

interface SigeResponse {
    titulo: string;
    resumen: string;
    campos: {
        label: string;
        tipo: string;
        resumen: string;
        temaId: string;
        temaIdParametros: string;
    }[];
}

interface RegistrySearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrySearchModal = ({ isOpen, onClose }: RegistrySearchModalProps) => {
    const [dni, setDni] = useState('');
    const [sex, setSex] = useState<SexType>('M');
    const [searchType, setSearchType] = useState<SearchType>('local');

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
        mutationFn: async ({ searchDni, searchSex }: { searchDni: string; searchSex: SexType }) => {
            const response = await fetch('/apicidi/certificadoInscripcionLST', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic YWtsc2RoZnlhbnlicnV1eXdobWZhcmphZ3ZyYXFlcnRocXc0dWk4NG5mbWlxd2ZrcTM0cmZidHNkeWZtamtsc2l1YWg2NTZ5NDZnaDZ1YXk=',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    servicio: 'fam_lst_j_certificadoInscripcionEducacionConsulta',
                    codValidacion: 'k7Djy8',
                    identidades: [
                        {
                            relacion: 'Usted',
                            tipo: 'persona',
                            valor: `${searchDni}.DNI.${searchSex}`
                        }
                    ]
                })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json() as Promise<SigeResponse>;
        }
    });

    if (!isOpen) return null;

    const isPending = localMutation.isPending || uccMutation.isPending || sigeMutation.isPending;

    const sigeFound = sigeMutation.isSuccess && sigeMutation.data && sigeMutation.data.campos && sigeMutation.data.campos.length > 0;
    const sigeNotFound = (sigeMutation.isSuccess && sigeMutation.data && (!sigeMutation.data.campos || sigeMutation.data.campos.length === 0)) || sigeMutation.isError;

    const isSuccess = (localMutation.isSuccess && localMutation.data) || (uccMutation.isSuccess && uccMutation.data?.existe) || sigeFound;
    const isNotFound = (localMutation.isSuccess && !localMutation.data) ||
        (uccMutation.isSuccess && uccMutation.data && !uccMutation.data.existe) ||
        localMutation.isError || uccMutation.isError || sigeNotFound;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dni.trim()) return;
        const cleanDni = dni.trim().replace(/\D/g, ''); 
        if (searchType === 'local') localMutation.mutate(cleanDni);
        else if (searchType === 'ucc') uccMutation.mutate(cleanDni);
        else if (searchType === 'sige') sigeMutation.mutate({ searchDni: cleanDni, searchSex: sex });
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

    // Build detail text for SIGE positive result
    const sigeDetail = sigeFound && sigeMutation.data?.campos?.[0]
        ? sigeMutation.data.campos[0].resumen
        : null;
    const sigeName = sigeFound && sigeMutation.data?.campos?.[0]
        ? sigeMutation.data.campos[0].label
        : null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-slate-900">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-200">

                {/* Header */}
                <div className="flex items-center justify-between px-10 py-7 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                            <Search size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Padrón Educativo</h2>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="p-10">

                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] mb-10 relative">
                        {(['local', 'ucc', 'sige'] as SearchType[]).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => { setSearchType(type); resetMutations(); }}
                                className={`
                                    relative flex-1 py-3.5 text-[11px] font-black tracking-widest uppercase rounded-[1rem] transition-all duration-300 flex items-center justify-center gap-2
                                    ${searchType === type
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-[1.02]'
                                        : 'text-slate-400 hover:text-slate-600'}
                                `}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-h-[320px] flex flex-col">

                        {/* FORMULARIO (Oculto si hay resultados) */}
                        {!isSuccess && !isNotFound && (
                            <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8 animate-in fade-in duration-500">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder={`DNI para consulta ${searchType.toUpperCase()}...`}
                                            value={dni}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 8) setDni(value);
                                            }}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] text-slate-700 font-bold text-lg focus:border-blue-600 transition-all outline-none"
                                        />
                                    </div>

                                    {/* Selector de sexo solo para SIGE */}
                                    {searchType === 'sige' && (
                                        <div className="flex bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] overflow-hidden">
                                            {([
                                                { value: 'M' as SexType, label: 'M' },
                                                { value: 'F' as SexType, label: 'F' },
                                                { value: 'X' as SexType, label: 'X' },
                                            ]).map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setSex(opt.value)}
                                                    className={`px-5 py-5 text-sm font-black tracking-wider transition-all
                                                        ${sex === opt.value
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!dni.trim() || isPending}
                                    className="w-full sm:w-auto self-end px-10 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-[1.25rem] shadow-xl shadow-blue-100 transition-all 
                                        disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Consultando...</span>
                                        </div>
                                    ) : (
                                        "Consultar"
                                    )}
                                </button>
                            </form>
                        )}

                        {/* RESULTADO POSITIVO */}
                        {isSuccess && (
                            <div className="flex-1 flex flex-col items-center justify-center bg-emerald-50 rounded-[2.5rem] border-2 border-emerald-100 border-dashed p-10 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
                                    <Check size={40} strokeWidth={4} />
                                </div>
                                <h3 className="text-3xl font-black text-emerald-900 tracking-tighter uppercase text-center">Está en el padrón</h3>
                                <p className="text-emerald-700/70 font-bold text-base mt-2">Documento {dni} Verificado</p>
                                {sigeName && (
                                    <p className="text-emerald-800 font-black text-lg mt-4">{sigeName}</p>
                                )}
                                {sigeDetail && (
                                    <p className="text-emerald-700/80 font-semibold text-sm mt-1 text-center">{sigeDetail}</p>
                                )}
                                <button onClick={resetMutations} className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-all active:scale-95">
                                    <RotateCcw size={16} /> Realizar otra consulta
                                </button>
                            </div>
                        )}

                        {/* RESULTADO NEGATIVO */}
                        {isNotFound && (
                            <div className="flex-1 flex flex-col items-center justify-center bg-red-50 rounded-[2.5rem] border-2 border-red-100 border-dashed p-10 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-red-200">
                                    <AlertCircle size={40} strokeWidth={4} />
                                </div>
                                <h3 className="text-3xl font-black text-red-900 tracking-tighter uppercase text-center">No figura</h3>
                                <p className="text-red-700/70 font-bold text-base mt-2">Sin registros para el DNI {dni}</p>
                                <button onClick={resetMutations} className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-red-600 hover:text-red-800 transition-all active:scale-95">
                                    <RotateCcw size={16} /> Reintentar búsqueda
                                </button>
                            </div>
                        )}

                        {!isSuccess && !isNotFound && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 border-dashed opacity-60">
                                <Search size={48} className="text-slate-200 mb-5" />
                                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">Esperando ingreso de datos</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};