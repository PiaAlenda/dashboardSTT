import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimService } from '../../../services/claimService';
import type { Claim } from '../../../types/index';

export const useClaims = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

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

    const claimsByDni = useMemo(() => {
        if (!claims) return [];

        const groups: Record<string, {
            dni: string;
            name: string;
            email: string;
            claims: Claim[];
            lastUpdate: string;
            totalClaims: number;
        }> = {};

        claims.forEach((c: Claim) => {
            if (!groups[c.dni]) {
                groups[c.dni] = {
                    dni: c.dni,
                    name: (c as any).firstName ? `${(c as any).firstName} ${(c as any).lastName}` : 'Usuario',
                    email: c.email,
                    claims: [],
                    lastUpdate: c.createdAt,
                    totalClaims: 0
                };
            }
            groups[c.dni].claims.push(c);
            groups[c.dni].totalClaims++;
            if (new Date(c.createdAt) > new Date(groups[c.dni].lastUpdate)) {
                groups[c.dni].lastUpdate = c.createdAt;
            }
        });

        // Ordenamos los reclamos dentro de cada grupo por fecha ascendente (mas viejo a mas nuevo)
        Object.values(groups).forEach(group => {
            group.claims.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });

        return Object.values(groups).sort((a, b) =>
            new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()
        );
    }, [claims]);

    const filteredThreads = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return claimsByDni.filter(group =>
            group.dni.includes(term) ||
            group.name.toLowerCase().includes(term) ||
            group.email.toLowerCase().includes(term) ||
            group.claims.some(c => c.cause?.toLowerCase().includes(term) || c.trackingCode?.toLowerCase().includes(term))
        );
    }, [claimsByDni, searchTerm]);

    const ranking = useMemo(() => {
        if (!claims) return [];
        const userCounts: Record<string, { name: string; count: number }> = {};
        claims.forEach((c: Claim) => {
            if (c.status === 'RESPONDIDO' || c.status === 'CONTESTADO') {
                const name = c.auditorName || c.userName || c.answeredBy || 'Usuario Desconocido';
                if (!userCounts[name]) userCounts[name] = { name, count: 0 };
                userCounts[name].count++;
            }
        });
        return Object.values(userCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [claims]);

    return {
        claims: filteredThreads,
        isLoading,
        searchTerm,
        setSearchTerm,
        selectedClaim,
        setSelectedClaim,
        answerMutation,
        ranking
    };
};