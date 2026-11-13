import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/changePassword';

import { Button,
         InputPassword,
       } from "@orif-informatique/react-components-library";


const ChangePassword = () =>
{
    const { t } = useTranslation("auth", "common");
    const navigate = useNavigate();
    const [errorKey, setErrorKey] = useState(null);

    const handleChangePasswordFormSubmit = async (e) =>
    {
        e.preventDefault();

        const formData = new FormData(e.target);
        const currentPassword = formData.get("current-password");
        const newPassword = formData.get("new-password");
        const newPasswordConfirmation = formData.get("new-password-confirmation");

        setErrorKey(null);

        if (newPassword !== newPasswordConfirmation)
        {
            setErrorKey("passwords_do_not_match");
            return;
        }

        try
        {
            await changePassword(currentPassword, newPassword);
            navigate(-1);
        }
        catch (error)
        {
            console.error("Change password failed:", error);

            const status = error.response?.status;

            if (status === 401 || status === 403)
            {
                setErrorKey("wrong_current_password");
            }
            else if (status === 400)
            {
                setErrorKey("invalid_new_password");
            }
            else
            {
                setErrorKey("change_password_failed");
            }
        }
    }

    return (
        <div className="flex flex-wrap place-content-center text-center w-full h-full">
            <div className="flex flex-col gap-4 w-[300px] sm:w-[350px] h-fit p-4 sm:p-8 border border-black sm:rounded-lg">
                <h1>{t("changing_password")}</h1>

                {errorKey && (
                    <div
                        className="border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                        role="alert"
                        aria-live="polite"
                    >
                        {t(errorKey)}
                    </div>
                )}

                <form
                    onSubmit={handleChangePasswordFormSubmit}
                    className="flex flex-col gap-4"
                >
                    <InputPassword
                        id="current-password"
                        name="current-password"
                        label={t("current_password")}
                        required={true}
                    />

                    <InputPassword
                        id="new-password"
                        name="new-password"
                        label={t("new_password")}
                        required={true}
                    />

                    <InputPassword
                        id="new-password-confirmation"
                        name="new-password-confirmation"
                        label={t("confirm_new_password")}
                        required={true}
                    />

                    <div className="flex gap-2 w-full">
                        <Button
                            variant="tertiary"
                            label={t("cancel", { ns: 'common' })}
                            type="button"
                            className="basis-1/2"
                            onClick={() => navigate(-1)}
                        />

                        <Button
                            variant="primary"
                            label={t("confirm", { ns: 'common' })}
                            className="basis-1/2"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword;