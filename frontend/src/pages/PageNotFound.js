import { Link } from "react-router-dom";

/**
 * Displays a 404 error page.
 *
 * @returns {JSX.Element}
 *
 */
const PageNotFound = () =>
{
    return (
        <div className="h-screen w-screen flex flex-col justify-center content-center text-center">
            <h1>Page introuvable</h1>

            <p>Il n'y a rien à faire ici...</p>

            <Link to="/" className="btn-primary">
                Retourner à l'accueil
            </Link>
        </div>
    )
}

export default PageNotFound;