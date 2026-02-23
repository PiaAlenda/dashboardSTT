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
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUserDni, setEditingUserDni] = useState<string | null>(null);
    const [historyUserDni, setHistoryUserDni] = useState<string | null>(null);
    const [dniToDelete, setDniToDelete] = useState<string | null>(null);
    const [showDeleted, setShowDeleted] = useState(false);

    const initialFormData = {
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
        username: '',
        password: '',
        role: 'ROLE_AUDITOR' as const
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

    const updateMutation = useMutation({
        mutationFn: ({ dni, data }: { dni: string, data: any }) => userService.update(dni, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleCloseModal();
        }
    });

    const handleEdit = (user: any) => {
        setIsEditMode(true);
        setEditingUserDni(user.dni);
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            dni: user.dni || '',
            email: user.email || '',
            username: user.username || '',
            password: '', // Password empty by default on edit
            role: user.role || 'ROLE_AUDITOR'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingUserDni(null);
        setFormData(initialFormData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSuperAdmin) {
            alert("Acceso denegado: Solo el SUPER_ADMIN puede gestionar usuarios.");
            return;
        }

        if (isEditMode && editingUserDni) {
            // On edit, if password is empty, don't send it or handle it in service/backend
            const { password, ...rest } = formData;
            const updateData = password ? formData : rest;
            updateMutation.mutate({ dni: editingUserDni, data: updateData });
        } else {
            createMutation.mutate(formData);
        }
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
        // State
        users: filteredUsers,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        isEditMode,
        handleCloseModal,
        historyUserDni,
        setHistoryUserDni,
        dniToDelete,
        setDniToDelete,
        showDeleted,
        setShowDeleted,
        formData,
        setFormData,

        // Derived
        isSuperAdmin,
        history,
        isLoadingHistory,

        // Actions
        deleteMutation,
        reactivateMutation,
        createMutation,
        updateMutation,
        handleEdit,
        handleSubmit
    };
};
