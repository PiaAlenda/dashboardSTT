import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService'; // Asegúrate de importar tu servicio
import type { AuthState } from '../types';

interface AuthContextType extends AuthState {
    login: (token: string) => Promise<void>; // Ahora es una Promesa
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('sube_token');
        const savedUser = localStorage.getItem('sube_user');

        if (token && savedUser) {
            try {
                // Si ya tenemos el usuario en localStorage, lo cargamos directamente
                setState({
                    user: JSON.parse(savedUser),
                    isAuthenticated: true,
                    isLoading: false,
                });
            } catch (error) {
                console.error('Error parsing saved user', error);
                logout();
            }
        } else {
            setState(s => ({ ...s, isLoading: false }));
        }
    }, []);

    const login = async (token: string) => {
        setState(s => ({ ...s, isLoading: true }));
        try {
            // 1. Guardar el token primero
            localStorage.setItem('sube_token', token);

            // 2. Llamar al servicio para obtener el perfil real (ya tipeado correctamente)
            const user = await authService.getMe();

            // 3. Persistir el objeto de usuario completo
            localStorage.setItem('sube_user', JSON.stringify(user));

            // 4. Actualizar estado global
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error fetching user profile during login', error);
            logout(); // Limpiamos todo si falla
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('sube_user');
        localStorage.removeItem('sube_token');
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};