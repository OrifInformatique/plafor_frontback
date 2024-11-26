import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getApprenticeSchoolReport } from "../services/api/school_reports";

import Apprentice from "../components/Apprentice";
import TeachingDomain from "../components/TeachingDomain";
import AnnualAverage from "../components/AnnualAverage";
import Loading from "../components/Loading";
import NoResults from "../components/NoResults";

/**
 * Displays the school report details of an apprentice user course.
 *
 * @returns {JSX.Element}
 *
 */
const SchoolReportDetails = () =>
{
    const [apprenticeSchoolReport, setApprenticeSchoolReport] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            try
            {
                const data = await getApprenticeSchoolReport();
                setApprenticeSchoolReport(data);
            }

            catch(error)
            {
                console.error("Erreur lors de l'affichage des données.", error)
            }

            finally
            {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [])

    return (
        <>
            <h1>
                Bulletin de notes de<br/>
                {apprenticeSchoolReport.username}
            </h1>

            {/* TODO : Let only trainers and admins see this button */}
            <div className="w-max h-max mx-auto my-6">
                <Link to={"/list"} className="btn-primary">
                    Retour à la liste
                </Link>
            </div>

            {isLoading ?
                <Loading />
            :
                <>
                    {apprenticeSchoolReport.user_courses.length > 0 ?
                            apprenticeSchoolReport.user_courses.map(userCourse => (
                                <div key={userCourse.id}>
                                    <Apprentice apprentice={apprenticeSchoolReport} showLink={false} />

                                    {userCourse.teaching_domains.map(teachingDomain => (
                                        <TeachingDomain key={teachingDomain.id} teachingDomain={teachingDomain} />
                                    ))}

                                    <AnnualAverage userCourse={userCourse} />
                                </div>
                            ))
                    :
                        <NoResults />
                    }
                </>
            }
        </>
    )
}

export default SchoolReportDetails;