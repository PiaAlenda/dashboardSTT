import { useState, useMemo } from 'react';
import { Search, MessageSquareQuote, FilterX, X as CloseIcon } from 'lucide-react';
import { useClaims } from '../features/claims/hooks/useClaims';
import { ClaimTable } from '../features/claims/components/ClaimTable';
import { ClaimReplyModal } from '../features/claims/components/ClaimReplyModal';
import { ClaimsFilter } from '../features/claims/components/ClaimsFilter';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

const sanitize = (text: string) => text?.replace(/^"|"$/g, '') || '';

export const ClaimsPage = () => {
    const {
        claims, isLoading, searchTerm, setSearchTerm,
        selectedClaim, setSelectedClaim, answerMutation
    } = useClaims();
    const [showAnswered, setShowAnswered] = useState(false);

    const filteredClaims = useMemo(() => {
        return claims
            .filter(claim => {
                const hasResponse = !!claim.replyMessage || !!claim.answer;
                return hasResponse === showAnswered;
            })
            .map(claim => ({
                ...claim,
                cause: sanitize(claim.cause),
                description: sanitize(claim.description || ''),
                replyMessage: sanitize(claim.replyMessage || claim.answer || '')
            }));
    }, [claims, showAnswered]);

    if (isLoading) {
        return <LoadingOverlay message="Sincronizando Reclamos Ciudadanos..." />;
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 pb-10">

            {/* 1. HEADER  */}
            <div className="px-2">
                <HeaderTitle />
            </div>

            {/* 2. BARRA DE ACCIONES*/}
            <section className="flex flex-col md:flex-row items-center gap-4 px-2">
            
                <div className="relative group flex-1 w-full max-w-2xl">
                    <Search 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff8200] transition-colors" 
                        size={18} 
                    />
                    <input
                        type="text"
                        placeholder={`Buscar en ${showAnswered ? 'contestados' : 'pendientes'}...`}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-12 pr-12 text-sm font-bold text-slate-700 outline-none transition-all focus:border-[#ff8200] focus:ring-4 focus:ring-orange-500/5 placeholder:text-slate-300 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                        >
                            <CloseIcon size={16} />
                        </button>
                    )}
                </div>
                <div className="shrink-0 w-full md:w-auto">
                    <ClaimsFilter
                        showAnswered={showAnswered}
                        onChange={setShowAnswered}
                    />
                </div>
            </section>

            {/*  CONTENIDO PRINCIPAL */}
            <main className="min-h-[500px]">
                {filteredClaims.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ClaimTable
                            claims={filteredClaims}
                            onAction={setSelectedClaim}
                        />
                    </div>
                ) : (
                    <EmptyState showAnswered={showAnswered} />
                )}
            </main>

            {/* Modal de Respuesta / Detalle */}
            <ClaimReplyModal
                isOpen={!!selectedClaim}
                claim={selectedClaim}
                isSubmitting={answerMutation.isPending}
                onAnswer={(id, text) => answerMutation.mutate({ id, answer: text })}
                onClose={() => setSelectedClaim(null)}
            />
        </div>
    );
};
// --- SUB-COMPONENTES LOCALES ---

const HeaderTitle = () => (
    <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-900 rounded-2xl text-[#ff8200] shadow-lg">
            <MessageSquareQuote size={28} />
        </div>
        <div>
            <h1 className="text-2xl 2xl:text-4xl font-black text-slate-800 tracking-tight">
                Atención de <span className="text-[#ff8200]">Reclamos</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Centro de gestión y respuesta ciudadana
            </p>
        </div>
    </div>
);

const EmptyState = ({ showAnswered }: { showAnswered: boolean }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 mx-2 animate-in zoom-in-95 duration-500">
        <div className="p-6 bg-slate-50 rounded-full mb-6">
            <FilterX size={40} className="text-slate-200" />
        </div>
        <h3 className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">
            Bandeja de {showAnswered ? 'Contestados' : 'Pendientes'} Vacía
        </h3>
        <p className="text-[11px] text-slate-300 font-bold mt-2 uppercase tracking-widest">
            No se encontraron reclamos en esta sección
        </p>
    </div>
);