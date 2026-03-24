import React, { useState } from 'react';
import { User, Lock, ExternalLink } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { CustomInput } from '../../../components/ui/CustomInput';
import { ActionButton } from '../../../components/ui/ActionButton';

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-2">
        {message}
    </div>
);

export const LoginForm = () => {
    const { handleLogin, loading, error } = useLogin();
    const [formData, setFormData] = useState({ username: '', password: '' });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(formData.username, formData.password);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {error && <ErrorMessage message={error} />}

            <div className="space-y-4">
                <CustomInput
                    label="Usuario"
                    icon={<User size={18} />}
                    placeholder="Ej: admin_sube"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                />

                <CustomInput
                    label="Contraseña"
                    type="password"
                    icon={<Lock size={18} />}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            <ActionButton
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="w-full py-4 text-sm"
                icon={ExternalLink}
            >
                {loading ? 'Verificando...' : 'Entrar al Sistema'}
            </ActionButton>
        </form>
    );
};
