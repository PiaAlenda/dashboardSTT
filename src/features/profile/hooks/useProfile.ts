import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/userService';

export const useProfile = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const updateProfileMutation = useMutation({
        mutationFn: (data: any) => userService.updateMe(data),
        onSuccess: (updatedUser) => {
            // Actualizamos el usuario en el contexto/localStorage si es necesario
            // El backend devuelve el usuario actualizado
            localStorage.setItem('sube_user', JSON.stringify(updatedUser));
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsEditing(false);
            // Si el contexto de auth tiene un método para recargar datos, se usaría aquí.
            // Por ahora, asumimos que al invalidar queries o refrescar se verá el cambio.
            window.location.reload(); // Opción drástica pero segura para refrescar todo el estado
        }
    });

    const creatorInfo = {
        name: user?.createdBy || "Administrador del Sistema",
        date: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Fecha no disponible"
    };

    return {
        user,
        creatorInfo,
        isEditing,
        setIsEditing,
        updateProfile: updateProfileMutation.mutate,
        isLoading: updateProfileMutation.isPending
    };
};
