import React from 'react';
import { render } from '@testing-library/react';

import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import frTexts from "../../../public/locales/fr/texts.json";

/**
 * Render the specified component.
 *
 * @param {JSX.Element} component
 *
 * @param {bool} useI18n Defines whether to implement I18nextProvider in the render.
 *
 * @returns {JSX.Element}
 *
 */
export const renderComponent = (component, useI18n = false) =>
{
    if(useI18n)
    {
        initLanguage();

        return render(
            <I18nextProvider i18n={i18n}>
                {component}
            </I18nextProvider>
        );
    }

    return render(component);
}

const initLanguage = () =>
{
    i18n.init(
    {
        lng: "fr",
        resources:
        {
            fr:
            {
                texts: frTexts,
            },
        },
    });
}