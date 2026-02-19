import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    message?: string;
    fullPage?: boolean;
}

export const LoadingOverlay = ({ 
    message = "Sincronizando Sistema...", 
    fullPage = true 
}: LoadingOverlayProps) => {
    const containerClasses = fullPage 
        ? "fixed inset-0 z-[200] bg-white/80 backdrop-blur-sm flex items-center justify-center" 
        : "flex h-[400px] w-full items-center justify-center bg-slate-50/50 rounded-[3rem]";

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-6">
                {/* Spinner Animado */}
                <div className="relative flex items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-100 border-t-[#ff8200] shadow-md" />
                    <Loader2 
                        size={24} 
                        className="absolute text-slate-300 animate-pulse" 
                    />
                </div>

                {/* Mensaje */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse text-center">
                        {message}
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
};