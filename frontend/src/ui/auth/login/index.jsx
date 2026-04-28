import React, { useState } from 'react';

import { useLogin } from '../api/authService';
import useAuthStore from '../../../../authStore';
import { Button,
         Image,
         InputText,
         InputPassword
       } from "@orif-informatique/react-components-library";
import Link from '../../link';

const Login = () => {
    const [showLocalAccountLoginForm, setShowLocalAccountLoginForm] =
        useState(false);
    const { login } = useLogin();
    const accessToken = useAuthStore((state) => state.accessToken);

    return (
        <div className="flex flex-wrap place-content-center text-center w-full h-full">
            <div className="flex flex-col gap-4 w-full sm:w-[350px] h-fit p-8 border border-black sm:rounded-lg">
                <h1>Connexion</h1>

                <div className="mx-auto">
                    <Link to="/azure">
                        <Image
                            src="https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-apps/ms-symbollockup_signin_light.svg"
                            alt="Connexion avec Microsoft Azure"
                        />
                    </Link>
                </div>

                <hr className="border border-black" />

                {showLocalAccountLoginForm ? (
                    <>
                        <form onSubmit={login} className="flex flex-col gap-4">
                            <InputText
                                id="identifier"
                                name="identifier"
                                label="Identifiant"
                                required={true}
                            />

                            <InputPassword
                                id="password"
                                name="password"
                                label="Mot de passe"
                                required={true}
                            />

                            <Button
                                variant="primary"
                                label="Se connecter"
                                className="w-full"
                            />
                        </form>

                        <Link to="/reset-password">
                            J'ai oublié mon mot de passe
                        </Link>
                    </>
                ) : (
                    <Button
                        variant="primary"
                        label="Connexion avec un compte local"
                        onClick={() => setShowLocalAccountLoginForm(true)}
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
