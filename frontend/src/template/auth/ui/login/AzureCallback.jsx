import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../../authStore';
import { getAccessToken } from '../api/azureLogin';

const AzureCallback = () => {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        let cancelled = false;

        const completeAzureLogin = async () => {
            const token = await getAccessToken();

            if (cancelled) return;

            if (token) {
                localStorage.setItem('loginType', 'azure');
                navigate('/', { replace: true });
                return;
            }

            localStorage.removeItem('loginType');
            clearAuth();
            navigate('/login', { replace: true });
        };

        completeAzureLogin();

        return () => {
            cancelled = true;
        };
    }, [clearAuth, navigate]);

    return null;
};

export default AzureCallback;
