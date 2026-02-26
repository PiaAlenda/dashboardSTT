import { ClaimThreadCard } from './ClaimThreadCard';

interface ClaimTableProps {
    claims: any[]; // Ahora son hilos (threads)
    onAction: (thread: any) => void;
}

export const ClaimTable = ({ claims, onAction }: ClaimTableProps) => {
    if (claims.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-2 py-4">
            {claims.map((thread) => (
                <ClaimThreadCard
                    key={thread.dni}
                    thread={thread}
                    onAction={onAction}
                />
            ))}
        </div>
    );
};