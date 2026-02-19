import { ClaimCard } from './ClaimCard';
import type { Claim } from '../../../types';

interface ClaimTableProps {
    claims: Claim[];
    onAction: (claim: Claim) => void;
}

export const ClaimTable = ({ claims, onAction }: ClaimTableProps) => {
    if (claims.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-2 py-4">
            {claims.map((claim) => (
                <ClaimCard 
                    key={claim.id} 
                    claim={claim} 
                    onAction={onAction} 
                />
            ))}
        </div>
    );
};