/**
 * Displays a loading animation.
 *
 * @returns {JSX.Element}
 *
 */
const Loading = () =>
{
    return (
        <div className="text-center">
            <strong className="text-lg">Données en cours de chargement...</strong>
            <div className="mx-auto my-12 pt-6 w-max">
                <div className="w-10 h-10 rounded-full bg-night m-auto animate-bounce-on-surface"></div>

                <div className="w-24 h-3 rounded-md bg-night m-auto"></div>
            </div>
        </div>
    )
}

export default Loading;