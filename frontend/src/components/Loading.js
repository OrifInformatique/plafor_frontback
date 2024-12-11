import React from 'react';
import { useTranslation } from "react-i18next";

/**
 * Displays a loading animation.
 *
 * @returns {JSX.Element}
 *
 */
const Loading = () =>
{
    const { t } = useTranslation("texts");

    return (
        <div className="text-center" data-testid="loading-container">
            <strong className="text-lg" data-testid="loading-text">
                {t("data_currently_loading")}
            </strong>

            <div className="mx-auto my-12 pt-6 w-max" data-testid="loading-animation">
                <div className="w-10 h-10 rounded-full bg-night m-auto animate-bounce-on-surface" data-testid="loading-animation-ball"></div>

                <div className="w-24 h-3 rounded-md bg-night m-auto" data-testid="loading-animation-ground"></div>
            </div>
        </div>
    )
}

export default Loading;