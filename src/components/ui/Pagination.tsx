import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8 py-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border-2 border-slate-100 bg-white text-slate-500 hover:border-[#ff8200] hover:text-[#ff8200] disabled:opacity-50 disabled:hover:border-slate-100 disabled:hover:text-slate-500 transition-all active:scale-95"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === 'ellipsis' ? (
                            <div className="w-10 h-10 flex items-center justify-center text-slate-300">
                                <MoreHorizontal size={20} />
                            </div>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`
                                    w-10 h-10 rounded-xl text-sm font-bold transition-all active:scale-95
                                    ${currentPage === page
                                        ? 'bg-[#ff8200] text-white shadow-lg shadow-orange-500/30'
                                        : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-[#ff8200] hover:text-[#ff8200]'
                                    }
                                `}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border-2 border-slate-100 bg-white text-slate-500 hover:border-[#ff8200] hover:text-[#ff8200] disabled:opacity-50 disabled:hover:border-slate-100 disabled:hover:text-slate-500 transition-all active:scale-95"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};
