import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimService } from '../../../services/claimService';
import type { Claim } from '../../../types';

export const useClaims = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    const { data: claimsResponse, isLoading } = useQuery({
        queryKey: ['claims'],
        queryFn: claimService.getAll,
    });

    const claims = useMemo(() => {
        if (!claimsResponse) return [];
        return Array.isArray(claimsResponse) ? claimsResponse : [];
    }, [claimsResponse]);

    const answerMutation = useMutation({
        mutationFn: ({ id, answer }: { id: number; answer: string }) =>
            claimService.answer(id, answer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['claims'] });
            setSelectedClaim(null);
        }
    });

    const filteredClaims = useMemo(() => {
        if (!claims) return [];
        const term = searchTerm.toLowerCase();
        return claims.filter((c: Claim) =>
            c.cause?.toLowerCase().includes(term) ||
            c.dni?.includes(term) ||
            c.trackingCode?.toLowerCase().includes(term)
        );
    }, [claims, searchTerm]);

    return {
        claims: filteredClaims,
        isLoading,
        searchTerm,
        setSearchTerm,
        selectedClaim,
        setSelectedClaim,
        answerMutation
    };
};