import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';

export const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(username, password);
            await login(response.token);
            navigate('/4a12b69c3dcb/000c66e873233b66', { replace: true });
        } catch (err: any) {
            const message = err.response?.status === 401
                ? 'Credenciales inválidas'
                : 'Error de conexión';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};