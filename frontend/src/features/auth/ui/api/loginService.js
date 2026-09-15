import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../authStore';
import api from './apiClient';

export const useLogin = () => {
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);

    const login = async (event) => {
        if (event?.preventDefault) event.preventDefault();

        const formData = new FormData(event?.target);
        const identifier = formData.get('identifier')?.trim();
        const password = formData.get('password') ?? '';

        if (!identifier || !password) {
            console.warn('Login aborted: missing credentials');
            return;
        }

        setShowError(false);

        try {
            const response = await api.post('/auth/login', {
                login: identifier,
                password,
            });

            const data = response?.data || {};
            const token = data.accessToken || data.token || null;
            const user = data.user || (data.id ? data : null);

            if (token) setAccessToken(token);
            if (user) setUser(user);
            if (token) localStorage.setItem('loginType', 'local');
            setShowError(false);

            navigate(-1); // Navigate back to the previous page after login

            console.log('Logged in — token set:', !!token, 'user set:', !!user);
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            setShowError(true);
        }
    };

    return { login, showError };
};
