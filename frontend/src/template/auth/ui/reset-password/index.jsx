import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button,
         InputEmail,
         InputPassword
       } from "@orif-informatique/react-components-library";

const ResetPassword = () =>
{
    const { t } = useTranslation("auth", "common");
    const navigate = useNavigate();
    // TODO :  Control the InputEmail to display it in the explicative text of step 2 and fill the InputText when coming back from step 2 to step 1.

    const [formStep, setFormStep] = useState(1);

    const handleEmailForm = (e) =>
    {
        e.preventDefault();
        console.log(handleEmailForm);
        sendResetPasswordLinkToEmail();
        nextStep();
    }

    const sendResetPasswordLinkToEmail = (e) =>
    {
        // TODO : Implement backend interaction
        console.log(sendResetPasswordLinkToEmail);
    }

    const handleResetPasswordFormSubmit = (e) =>
    {
        e.preventDefault();
        console.log(handleResetPasswordFormSubmit);
    }

    const nextStep = () => setFormStep((prev) => prev + 1);

    return (
        <div className="flex flex-wrap place-content-center text-center w-full h-full">
            <div className="flex flex-col gap-4 w-full sm:w-[350px] h-fit p-8 border border-black sm:rounded-lg">
                <h1>{t("reset_password")}</h1>

                {formStep === 1 &&
                    <form
                        onSubmit={handleEmailForm}
                        className="flex flex-col gap-4"
                    >
                        <InputEmail
                            id="email"
                            name="email"
                            label={t("email", { ns: 'common' })}
                            placeholder="example@orif.ch"
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
                }

                {formStep === 2 &&
                    <form
                            onSubmit={handleResetPasswordFormSubmit}
                            className="flex flex-col gap-4"
                        >
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

                            <Button
                                variant="primary"
                                label={t("confirm", { ns: 'common' })}
                                className="w-full"
                            />
                    </form>
                }
            </div>
        </div>
    )
}

export default ResetPassword;