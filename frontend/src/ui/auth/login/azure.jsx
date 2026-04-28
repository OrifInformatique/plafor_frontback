import React, { useState } from "react";

import { Button,
         InputEmail,
         InputText
       } from "@orif-informatique/react-components-library";

const Azure = () =>
{
    // TODO :  Control the InputEmail to display it in the explicative text of step 2 and fill the InputText when coming back from step 2 to step 1.

    const [formStep, setFormStep] = useState(1);

    const handleAzureLinkEmailForm = (e) =>
    {
        e.preventDefault();
        console.log(handleAzureLinkEmailForm);
        sendVerificationCodeToEmail();
        nextStep();
    }

    const handleAzureConfirmationCodeForm = (e) =>
    {
        e.preventDefault();
        console.log(handleAzureConfirmationCodeForm);
    }

    const sendVerificationCodeToEmail = () =>
    {
        // TODO : Implement backend interaction
        console.log(sendVerificationCodeToEmail);
    }

    const nextStep = () => setFormStep((prev) => prev + 1);
    const prevStep = () => setFormStep((prev) => prev - 1);

    return (
        <div className="flex flex-wrap place-content-center text-center w-full h-full">
            <div className="flex flex-col gap-4 w-full sm:w-[350px] h-fit p-8 border border-black sm:rounded-lg">
                <h1>Authentification Azure</h1>

                {formStep === 1 &&
                    <>
                        <p className="text-left">
                            Vous utilisez la connexion Microsoft pour la première fois.<br />
                            Afin d'enregistrer votre compte, indiquez votre adresse e-mail se
                            terminant par <strong>@formation.orif.ch</strong> ou <strong>@orif.ch</strong>.
                        </p>

                        <form
                            onSubmit={handleAzureLinkEmailForm}
                            className="flex flex-col gap-4"
                        >
                            <InputEmail
                                id="email"
                                name="email"
                                label="Email"
                                placeholder="example@orif.ch"
                                required={true}
                            />

                            <Button
                                variant="primary"
                                label="Envoyer le code"
                                className="w-full"
                            />
                        </form>
                    </>
                }

                {formStep === 2 &&
                    <>
                        <p className="text-left">
                            Un code de vérification a été envoyé sur votre adresse e-mail. Entrez-le ci-dessous.
                        </p>

                        <form
                            onSubmit={handleAzureConfirmationCodeForm}
                            className="flex flex-col gap-4"
                        >
                            <InputText
                                id="code"
                                name="code"
                                label="Code de vérification"
                                required={true}
                            />

                            <Button
                                variant="primary"
                                label="Confirmer le code"
                                className="w-full"
                            />
                        </form>

                        <Button
                            variant="link"
                            label="Envoyer un nouveau code"
                            className="w-full"
                            onClick={() => sendVerificationCodeToEmail()}
                        />

                        <Button
                            variant="link"
                            label="Changer l'adresse e-mail"
                            className="w-full"
                            onClick={() => prevStep()}
                        />
                    </>
                }
            </div>
        </div>
    )
}

export default Azure;