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
            <header className="bg-blue font-bold tracking-wide text-white text-center py-2 mb-4">
                <Link to={"/"} className="hover:no-underline hover:text-white">
                    {t("react_school_report")}
                </Link>
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="bg-blue-dark text-white text-center py-2 mt-4">
                <Link to={"https://plafor.sectioninformatique.ch"} target="_blank">
                    Plafor
                </Link>
            </footer>
        </>
    )
}

export default Layout;