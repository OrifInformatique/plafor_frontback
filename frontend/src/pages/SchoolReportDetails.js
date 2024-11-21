import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getApprenticeSchoolReport } from "../services/api/school_reports";

import Apprentice from "../components/Apprentice";
import TeachingDomain from "../components/TeachingDomain";
import AnnualAverage from "../components/AnnualAverage";
import Loading from "../components/Loading";

/**
 * Displays the school report details of an apprentice user course.
 *
 * @returns {JSX.Element}
 *
 */
const SchoolReportDetails = () =>
{
    const [apprenticeSchoolReport, setApprenticeSchoolReport] = useState([]);

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            const data = await getApprenticeSchoolReport();
            setApprenticeSchoolReport(data);
        }

        fetchData();
    }, [])

    if(!apprenticeSchoolReport.user_courses)
        return <Loading />;

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

            {apprenticeSchoolReport.user_courses.map(userCourse => (
                <div key={userCourse.id}>
                    <Apprentice apprentice={apprenticeSchoolReport} showLink={false} />

                    {userCourse.teaching_domains.map(teachingDomain => (
                        <TeachingDomain key={teachingDomain.id} teachingDomain={teachingDomain} />
                    ))}

                    <AnnualAverage userCourse={userCourse} />
                </div>
            ))}
        </>
    )
}

export default SchoolReportDetails;