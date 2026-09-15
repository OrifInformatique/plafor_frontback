import React, { useEffect, useState } from 'react';

import { useLogin } from '../api/loginService';
import api from '../api/apiClient';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../authStore';
import useLayoutAuth from '../../../../common/hooks/useLayoutAuth';
import {
    Button,
    Image,
    InputText,
    InputPassword,
} from '@orif-informatique/react-components-library';
import Link from '../../../../common/ui/link';
import LoginTestIndicator from '../../../../common/ui/tests/loginTestIndicator';
import { handleOAuth2Login } from '../api/azureLogin';

const Login = () => {
    const BACKEND_API_URL = process.env.BACKEND_API_URL;
    const [loginType, setLoginType] = useState(
        localStorage.getItem('loginType'),
    );
    const { t } = useTranslation("auth", "common");
    const [showLocalAccountLoginForm, setShowLocalAccountLoginForm] =
        useState(false);
    const { login, showError } = useLogin();
    const accessToken = useAuthStore((state) => state.accessToken);
    const { setAccessToken, clearAuth } = useAuthStore();
    const { handleLogout } = useLayoutAuth();

    useEffect(() => {
        const storedLoginType = localStorage.getItem('loginType');
        setLoginType(storedLoginType);
    }, []);

    useEffect(() => {
        // If we know the login type (user had a session) but lost the in-memory access token,
        // try to refresh using the HttpOnly refresh cookie.
        if (!loginType || accessToken) return;

        const refreshAccessToken = async () => {
            try {
                const response = await api.post(
                    '/auth/refresh',
                    {},
                    {
                        baseURL: BACKEND_API_URL || undefined,
                    },
                );
                if (response?.data?.accessToken) {
                    setAccessToken(response.data.accessToken);
                }
            } catch (error) {
                console.error(
                    '%c Token refresh failed',
                    'background: #D4000E; color: white; padding: 2px 5px; border-radius: 3px;',
                );
                console.error('Error details:', error.response?.data || error.message);
                // If refresh fails, clear stale login type so UI falls back to unauthenticated.
                localStorage.removeItem('loginType');
                setLoginType(null);
                clearAuth();
            }
        };

        refreshAccessToken();
    }, [BACKEND_API_URL, accessToken, clearAuth, loginType, setAccessToken]);


    const handleLogoutClick = async () => {
        await handleLogout();
        setLoginType(null);
    };

    return (
        <div className="flex flex-wrap place-content-center text-center w-full h-full">
            <div className="flex flex-col gap-4 w-full sm:w-[350px] h-fit p-8 border border-black sm:rounded-lg">
                <LoginTestIndicator/>
                <h1>{t("sign_in")}</h1>

                {accessToken ? (
                    <div className="flex items-center justify-between gap-2 border border-black rounded-md p-2 text-sm">
                        <span>
                            Connecté via {loginType === 'azure' ? 'Azure' : 'local'}
                        </span>
                        <Button
                            variant="secondary"
                            label="Se déconnecter"
                            onClick={handleLogoutClick}
                        />
                    </div>
                ) : null}

                <div className="mx-auto">
                    <button
                        onClick={handleOAuth2Login}
                        className="flex items-center gap-2 border border-black rounded-lg p-2 hover:bg-gray-200"
                    >
                        <Image
                            src="https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-apps/ms-symbollockup_signin_light.svg"
                            alt="Connexion avec Microsoft Azure"
                        />
                    </button>
                </div>

                <hr className="border border-black" />

                {!accessToken && showLocalAccountLoginForm ? (
                    <>
                        {showError && (
                            <div
                                className="border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                                role="alert"
                                aria-live="polite"
                            >
                                {t("invalid_credentials")}
                            </div>
                        )}

                        <form onSubmit={login} className="flex flex-col gap-4">
                            <InputText
                                id="identifier"
                                name="identifier"
                                label={t("username")}
                                required={true}
                            />

                            <InputPassword
                                id="password"
                                name="password"
                                label={t("password")}
                                required={true}
                            />

                            <Button
                                variant="primary"
                                label={t("sign_in")}
                                className="w-full"
                            />
                        </form>

                        <Link to="/reset-password">
                            {t("forgot_password")}
                        </Link>
                    </>
                ) : !accessToken ? (
                    <Button
                        variant="primary"
                        label={t("sign_in_with_local_account")}
                        onClick={() => setShowLocalAccountLoginForm(true)}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default Login;
