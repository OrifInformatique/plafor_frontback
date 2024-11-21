import { Link } from "react-router-dom";
import Grade from "./Grade";

/**
 * Displays the summary of an apprentice school report (apprentice name, user courses and their global averages).
 *
 * @param {array} apprentice
 *
 * @param {boolean} showLink Defines whether to put a link to the school report details of the user course on the user course official name.
 *
 * @returns {JSX.Element}
 *
 */
const Apprentice = ({ apprentice, showLink }) =>
{
    if(Array.isArray(apprentice.user_courses))
    {
        return (
            <div className="w-full p-3 bg-beige-light
                sm:w-1/2 sm:m-auto sm:rounded-md
                xl:w-1/3">
                <div>
                    <h2 className="text-blue text-xl tracking-wide">{apprentice.username}</h2>
                </div>

                <div className="divide-y divide-blue">
                    {apprentice.user_courses.map(user_course => (
                        <div className="flex justify-between items-center py-3" key={user_course.id}>
                            {showLink ?
                                <Link to={`/details/${user_course.id}`} title="Voir le bulletin de notes" className="w-fit sm:w-5/6">
                                    <p>{user_course.official_name}</p>
                                </Link>
                            :
                                <p>{user_course.official_name}</p>
                            }

                            <div className="ml-3">
                                <Grade grade={user_course.global_average} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Apprentice;