import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Displays a 404 error page.
 *
 * @returns {JSX.Element}
 *
 */
const PageNotFound = () =>
{
    const { t } = useTranslation(["titles", "texts", "buttons"]);

    return (
        <div
            className="h-screen w-screen flex flex-col justify-center content-center text-center"
            data-testid="page-not-found-container"
        >
            <h1 data-testid="page-not-found-title">
                {t("404_not_found", { ns: "titles" })}
            </h1>

            <p data-testid="page-not-found-text">
                {t("nothing_to_do_here", { ns: "texts" })}
            </p>

            <Link
                to="/"
                className="btn-primary"
                data-testid="back-to-home-button"
            >
                {t("back_to_home", { ns: "buttons" })}
            </Link>
        </div>
    )
}

export default PageNotFound;