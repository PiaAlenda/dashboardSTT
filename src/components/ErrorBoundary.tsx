import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200/50">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="mt-6 text-xl font-bold text-slate-900">Algo salió mal</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            La aplicación encontró un error inesperado al intentar cargar.
                        </p>
                        <div className="mt-6 rounded-lg bg-slate-50 p-3 text-left">
                            <code className="text-xs text-red-500 break-all">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-sube-orange px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sube-orange/20 transition-all hover:bg-sube-orange-dark"
                        >
                            <RefreshCcw size={18} />
                            Reintentar Cargar
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
