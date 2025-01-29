import React from 'react';
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Displays the header and the footer of the app.\
 * It is displayed on all routes, except for the 404 error page.
 *
 * @returns {JSX.Element}
 *
 */
const Layout = () =>
{
    const { t } = useTranslation(["titles", "texts"]);

    return (
        <>
            <header
                className="flex justify-center sm:!justify-between items-center bg-blue font-bold tracking-wide text-white p-2 mb-4"
                data-testid="layout-header"
            >
                <img
                    src="/images/logo.png"
                    alt={t("ORIF_logo_alt", { ns: "texts" })}
                    className="sm:!block hidden bg-white rounded-lg p-1"
                    data-testid="layout-header-orif-logo"
                />

                <Link
                    to={"/"}
                    className="hover:no-underline hover:text-white"
                    data-testid="layout-header-link"
                >
                    {t("course_plans_management", { ns: "titles" })}
                </Link>
            </header>

            <main data-testid="layout-main">
                <Outlet />
            </main>

            <footer
                className="bg-blue-dark text-white text-center py-2 mt-4"
                data-testid="layout-footer"
            >
                <p data-testid="layout-footer-text">
                    {t("app_created_by_the_IT_department_of_ORIF", { ns: "texts" })}
                </p>
            </footer>
        </>
    )
}

export default Layout;