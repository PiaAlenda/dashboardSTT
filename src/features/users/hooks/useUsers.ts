import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../../services/userService';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';

export const useUsers = () => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [historyUserDni, setHistoryUserDni] = useState<string | null>(null);
    const [dniToDelete, setDniToDelete] = useState<string | null>(null);
    const [showDeleted, setShowDeleted] = useState(false);

    const initialFormData = {
        id: 0,
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
        username: '',
        password: '',
        role: 'ROLE_AUDITOR',
        deleted: false
    };

    const [formData, setFormData] = useState(initialFormData);

    const isSuperAdmin = currentUser?.role === 'ROLE_SUPER_ADMIN';

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getAll,
    });

    const { data: history, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['user-history', historyUserDni],
        queryFn: () => historyUserDni ? userService.getHistory(historyUserDni) : Promise.resolve([]),
        enabled: !!historyUserDni
    });

    const deleteMutation = useMutation({
        mutationFn: (dni: string) => userService.delete(dni),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDniToDelete(null);
        }
    });

    const reactivateMutation = useMutation({
        mutationFn: (dni: string) => userService.reactivate(dni),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });

    const createMutation = useMutation({
        mutationFn: (data: typeof formData) => authService.register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseModal();
        }
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isSuperAdmin) {
            alert("Acceso denegado.");
            return;
        }

        const payload = {
            ...formData,
            id: Number(formData.id)
        };

        createMutation.mutate(payload);
    };

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        const term = searchTerm.toLowerCase();
        return users.filter((u: any) => {
            if (u.deleted && !showDeleted) return false;
            const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
            const email = u.email?.toLowerCase() || '';
            const username = u.username?.toLowerCase() || '';
            return fullName.includes(term) || email.includes(term) || username.includes(term);
        });
    }, [users, searchTerm, showDeleted]);

    return {
        users: filteredUsers,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        handleCloseModal,
        historyUserDni,
        setHistoryUserDni,
        dniToDelete,
        setDniToDelete,
        showDeleted,
        setShowDeleted,
        formData,
        setFormData,
        isSuperAdmin,
        history,
        isLoadingHistory,
        deleteMutation,
        reactivateMutation,
        createMutation,
        handleSubmit
    };
};