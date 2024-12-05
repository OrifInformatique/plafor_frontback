import React from 'react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    const { t } = useTranslation(["titles", "buttons"]);

    const [apprenticeSchoolReport, setApprenticeSchoolReport] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>
    {
        /**
         * Fetches school report details data.
         *
         * @returns {void}
         *
         */
        const fetchData = async () =>
        {
            try
            {
                /* TODO : Add user course ID as param */
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
            {isLoading ?
                <Loading />
            :
                <>
                    <h1>
                        {t("school_report_details", { ns: "titles" })}<br/>
                        {apprenticeSchoolReport?.username}
                    </h1>

                    {/* TODO : Let only trainers and admins see this button */}
                    <div className="w-max h-max mx-auto my-6">
                        <Link to={"/list"} className="btn-primary">
                            {t("back_to_list", { ns: "buttons" })}
                        </Link>
                    </div>

                    {apprenticeSchoolReport && apprenticeSchoolReport.user_course ?
                        <>

                            <Apprentice apprentice={apprenticeSchoolReport} showLink={false} />

                            {apprenticeSchoolReport.user_course.teaching_domains.map(
                                teachingDomain => <TeachingDomain key={teachingDomain.id} teachingDomain={teachingDomain} />
                            )}

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