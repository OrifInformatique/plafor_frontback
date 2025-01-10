import React from 'react';
import { Link } from "react-router-dom";

import Grade from "./Grade";

/**
 * Displays the summary of an apprentice school report (apprentice name, user courses and their global averages).
 *
 * @param {array} apprentice
 *
 * @param {boolean} [showLink=false] Defines whether to put a link to the school report details of the user course on the user course official name. False by default.
 *
 * @returns {JSX.Element}
 *
 */
const Apprentice = ({ apprentice, showLink = false }) =>
{
    let apprenticeUserCourses = {};

    if(!apprentice)
    {
        return;
    }

    else if(Array.isArray(apprentice.user_courses))
    {
        apprenticeUserCourses = apprentice.user_courses;
    }

    else if(apprentice.user_course)
    {
        apprenticeUserCourses = [apprentice.user_course];
    }

    return (
        <div
            className="w-full p-3 bg-beige-light sm:w-1/2 sm:m-auto sm:rounded-md xl:w-1/3"
            data-testid="apprentice-container"
        >
            <h2
                className="text-blue text-xl tracking-wide"
                data-testid="apprentice-name"
            >
                {apprentice.username}
            </h2>

            <div
                className="divide-y divide-blue"
                data-testid="apprentice-user-courses-container"
            >
                {apprenticeUserCourses.map(user_course => (
                    <div
                        key={user_course.id}
                        className="flex justify-between items-center py-3"
                        data-testid="apprentice-user-course"
                    >
                        {showLink ?
                            <Link
                                to={`/details/${user_course.id}`}
                                className="w-fit sm:w-5/6"
                                data-testid="apprentice-user-course-name-link"
                            >
                                <p data-testid="apprentice-user-course-name">
                                    {user_course.official_name}
                                </p>
                            </Link>
                        :
                            <p data-testid="apprentice-user-course-name">
                                {user_course.official_name}
                            </p>
                        }

                        <div
                            className="ml-3"
                            data-testid="apprentice-global-average-container"
                        >
                            <Grade grade={user_course.global_average} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Apprentice;