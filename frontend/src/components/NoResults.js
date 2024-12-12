import React from 'react';
import { useTranslation } from "react-i18next";

/**
 * Displays an "No result !" text.
 *
 * @returns {JSX.Element}
 *
 */
const NoResults = () =>
{
    const { t } = useTranslation("texts");

    return (
        <div className="w-max mx-auto" data-testid="no-results-container">
            <strong className="text-lg" data-testid="no-results-text">
                {t("no_results")}
            </strong>
        </div>
    )
}

export default NoResults;