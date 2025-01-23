import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getApprenticeSchoolReport } from "../services/api/school_reports";

import AnnualAverage from "../components/AnnualAverage";
import Apprentice from "../components/Apprentice";
import Loading from "../components/Loading";
import NoResults from "../components/NoResults";
import TeachingDomain from "../components/TeachingDomain";

/**
 * Displays the school report details of an apprentice user course.
 *
 * @returns {JSX.Element}
 *
 */
const SchoolReportDetails = () =>
{
    const { userCourseId } = useParams();
    const { t } = useTranslation(["titles", "buttons"]);

    const [apprenticeSchoolReport, setApprenticeSchoolReport] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetches school report details data.
     *
     * @returns {void}
     *
     */
    const fetchSchoolReportDetails = async () =>
    {
        const data = await getApprenticeSchoolReport(userCourseId);

        setApprenticeSchoolReport(data);

        setIsLoading(false);
    }

    useEffect(() =>
    {
        fetchSchoolReportDetails();
    }, []);

    return (
        <>
            {isLoading ?
                <Loading />
            :
                <>
                    <h1 data-testid="school-report-details-title">
                        {t("school_report_details", { ns: "titles" })}<br/>
                        {apprenticeSchoolReport?.username}
                    </h1>

                    <div
                        className="w-max h-max mx-auto my-6"
                        data-testid="back-to-list-button-container"
                    >
                        <Link
                            to={"/list"}
                            className="btn-primary"
                            data-testid="back-to-list-button"
                        >
                            {t("back_to_list", { ns: "buttons" })}
                        </Link>
                    </div>

                    {apprenticeSchoolReport
                        && apprenticeSchoolReport.user_course
                        && apprenticeSchoolReport.user_course.teaching_domains
                    ?
                        <>
                            <Apprentice apprentice={apprenticeSchoolReport} />

                            {apprenticeSchoolReport.user_course.teaching_domains.map(teachingDomain =>
                            (
                                <TeachingDomain
                                    key={teachingDomain.id}
                                    teachingDomain={teachingDomain}
                                />
                            ))}

                            <AnnualAverage userCourse={apprenticeSchoolReport.user_course} />
                        </>
                    :
                        <NoResults />
                    }
                </>
            }
        </>
    )
}

export default SchoolReportDetails;