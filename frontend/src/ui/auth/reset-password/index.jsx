import React, { useState } from "react";

import { Button,
         InputEmail,
         InputPassword
       } from "@orif-informatique/react-components-library";

const ResetPassword = () =>
{
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
                <h1>Restauration du mot de passe</h1>

                {formStep === 1 &&
                    <form
                        onSubmit={handleEmailForm}
                        className="flex flex-col gap-4"
                    >
                        <InputEmail
                            id="email"
                            name="email"
                            label="Email"
                            placeholder="example@orif.ch"
                            required={true}
                        />

                        <div className="flex gap-2 w-full">
                            <Button
                                variant="tertiary"
                                label="Annuler"
                                className="basis-1/2"
                            />

                            <Button
                                variant="primary"
                                label="Valider"
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
                                label="Nouveau mot de passe"
                                required={true}
                            />

                            <InputPassword
                                id="new-password-confirmation"
                                name="new-password-confirmation"
                                label="Confirmation du nouveau mot de passe"
                                required={true}
                            />

                            <Button
                                variant="primary"
                                label="Valider"
                                className="w-full"
                            />
                    </form>
                }
            </div>
        </div>
    )
}

export default ResetPassword;