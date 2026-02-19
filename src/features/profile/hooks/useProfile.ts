import { useAuth } from '../../../context/AuthContext';

export const useProfile = () => {
    const { user } = useAuth();
    const creatorInfo = {
        name: user?.createdBy || "Administrador del Sistema",
        date: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Fecha no disponible"
    };

    return {
        user,
        creatorInfo
    };
};
