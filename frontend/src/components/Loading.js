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
        <div className="text-center">
            <strong className="text-lg">
                {t("data_currently_loading")}
            </strong>

            <div className="mx-auto my-12 pt-6 w-max">
                <div className="w-10 h-10 rounded-full bg-night m-auto animate-bounce-on-surface"></div>

                <div className="w-24 h-3 rounded-md bg-night m-auto"></div>
            </div>
        </div>
    )
}

export default Loading;