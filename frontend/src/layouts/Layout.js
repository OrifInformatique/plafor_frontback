import { Link, Outlet } from "react-router-dom";

const Layout = () =>
    {
        return (
            <>
                <header className="bg-blue font-bold tracking-wide text-white text-center py-2 mb-4">
                    <Link to={"/"} className="hover:no-underline hover:text-white">
                        Bulletin de notes en React
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