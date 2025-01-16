import React from 'react';
import { render } from '@testing-library/react';

import i18n from "i18next";
import { I18nextProvider } from "react-i18next";

import { MemoryRouter } from "react-router-dom";

import frAnnualAverage from "../../../public/locales/fr/annualAverage.json";
import frApprenticesList from "../../../public/locales/fr/apprenticesList.json";
import frButtons from "../../../public/locales/fr/buttons.json";
import frTeachingDomain from "../../../public/locales/fr/teachingDomain.json";
import frTitles from "../../../public/locales/fr/titles.json";
import frTexts from "../../../public/locales/fr/texts.json";

/**
 * Render the specified component.
 *
 * @param {JSX.Element} component
 *
 * @returns {JSX.Element}
 *
 */
export const renderComponent = (component) =>
{
    initLanguage();

    return render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <I18nextProvider i18n={i18n}>
                {component}
            </I18nextProvider>
        </MemoryRouter>
    );
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
                annualAverage: frAnnualAverage,
                apprenticesList: frApprenticesList,
                buttons: frButtons,
                teachingDomain: frTeachingDomain,
                titles: frTitles,
                texts: frTexts,
            },
        },
    });
}