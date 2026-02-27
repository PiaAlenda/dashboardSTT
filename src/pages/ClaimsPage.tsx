import { useState, useMemo, useEffect } from 'react';
import { Search, MessageSquareQuote, FilterX, X as CloseIcon, Trophy } from 'lucide-react';
import { useClaims } from '../features/claims/hooks/useClaims';
import { ClaimTable } from '../features/claims/components/ClaimTable';
import { ClaimReplyModal } from '../features/claims/components/ClaimReplyModal';
import { ClaimsFilter } from '../features/claims/components/ClaimsFilter';
import { ClaimsRankingModal } from '../features/claims/components/ClaimsRankingModal';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { Pagination } from '../components/ui/Pagination';

export const ClaimsPage = () => {
    const {
        claims, isLoading, searchTerm, setSearchTerm,
        selectedClaim, setSelectedClaim, answerMutation,
        ranking
    } = useClaims();
    const [showAnswered, setShowAnswered] = useState(false);
    const [isRankingOpen, setIsRankingOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showAnswered]);

    const filteredThreads = useMemo(() => {
        return claims
            .filter(thread => {
                const hasAnyPending = thread.claims.some(c => c.status === 'PENDIENTE');
                // Si hay AL MENOS UN pendiente, el hilo va a "Pendientes" (showAnswered false).
                // Si NO hay pendientes (todos contestados), va a "Contestados" (showAnswered true).
                return showAnswered ? !hasAnyPending : hasAnyPending;
            });
    }, [claims, showAnswered]);

    const totalPages = Math.ceil(filteredThreads.length / itemsPerPage);
    const paginatedClaims = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredThreads.slice(start, start + itemsPerPage);
    }, [filteredThreads, currentPage]);

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
                <div className="shrink-0 w-full md:w-auto flex items-center gap-3">
                    <button
                        onClick={() => setIsRankingOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] 2xl:text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-200"
                        title="Ver Ranking de Resolutores"
                    >
                        <Trophy size={16} className="text-[#ff8200] animate-trophy-periodic" />
                        Top 10
                    </button>
                    <ClaimsFilter
                        showAnswered={showAnswered}
                        onChange={setShowAnswered}
                    />
                </div>
            </section>

            {/*  CONTENIDO PRINCIPAL */}
            <main className="min-h-[500px]">
                {paginatedClaims.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ClaimTable
                            claims={paginatedClaims}
                            onAction={setSelectedClaim}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
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
                claims={selectedClaim?.claims || []}
                isSubmitting={answerMutation.isPending}
                onAnswer={(id, text) => answerMutation.mutate({ id, answer: text })}
                onClose={() => setSelectedClaim(null)}
            />

            <ClaimsRankingModal
                isOpen={isRankingOpen}
                onClose={() => setIsRankingOpen(false)}
                ranking={ranking}
            />
        </div>
    );
};

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