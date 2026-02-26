import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    allowedUsernames?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    allowedUsernames
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    // 1. Mientras el AuthContext está verificando la sesión (ej. chequeando localStorage)
    if (isLoading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff8200] border-t-transparent" />
                <p className="mt-4 text-sm font-medium text-slate-500">Verificando credenciales...</p>
            </div>
        );
    }

    // 2. Si no está autenticado, lo mandamos al login
    if (!isAuthenticated) {
        return <Navigate to="/auth/x82b9" state={{ from: location }} replace />;
    }

    // 3. Si está autenticado pero el ROL no está permitido
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. Si hay restricción por NOMBRE DE USUARIO específico
    if (allowedUsernames && user && !allowedUsernames.includes(user.username)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 5. Si todo está ok, renderizamos el contenido
    return <>{children}</>;
};