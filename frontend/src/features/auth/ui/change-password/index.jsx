import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button,
         InputPassword,
       } from "@orif-informatique/react-components-library";

const ChangePassword = () =>
{
    const { t } = useTranslation("auth", "common");
    const handleChangePasswordFormSubmit = (e) =>
    {
        e.preventDefault();
        console.log(handleChangePasswordFormSubmit);
    }

    return (
        <div className="flex flex-wrap place-content-center text-center w-full h-full">
            <div className="flex flex-col gap-4 w-[300px] sm:w-[350px] h-fit p-4 sm:p-8 border border-black sm:rounded-lg">
                <h1>{t("changing_password")}</h1>

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
                            className="basis-1/2"
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