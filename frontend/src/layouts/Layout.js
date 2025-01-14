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
    const { t } = useTranslation("titles");

    return (
        <>
            <header
                className="bg-blue font-bold tracking-wide text-white text-center py-2 mb-4"
                data-testid="layout-header"
            >
                <Link
                    to={"/"}
                    className="hover:no-underline hover:text-white"
                    data-testid="layout-header-link"
                >
                    {t("react_school_report")}
                </Link>
            </header>

            <main data-testid="layout-main">
                <Outlet />
            </main>

            <footer
                className="bg-blue-dark text-white text-center py-2 mt-4"
                data-testid="layout-footer"
            >
                <Link
                    to={"https://plafor.sectioninformatique.ch"}
                    target="_blank"
                    data-testid="layout-footer-link"
                >
                    Plafor
                </Link>
            </footer>
        </>
    )
}

export default Layout;