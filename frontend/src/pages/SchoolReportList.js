import { useEffect, useState } from "react";
import { getSchoolReportsSummaries } from "../services/api/school_reports";
import Apprentice from "../components/Apprentice";
import Loading from "../components/Loading";

/**
 * Displays the list of all apprentices, with their user courses and their global averages.
 *
 * @returns {JSX.Element}
 *
 */
const SchoolReportList = () =>
{
    const [schoolReportsSummaries, setSchoolReportsSummaries] = useState([]);

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            const data = await getSchoolReportsSummaries();
            setSchoolReportsSummaries(data);
        }

        fetchData();
    }, [])

    return (
        <div className="space-y-4">
            <h1>Liste des bulletins de notes des apprentis</h1>
            {/* TODO : Create trainer filters */}
            {/* TODO : Create searchbar */}
            {schoolReportsSummaries && schoolReportsSummaries.length > 0 ?
                schoolReportsSummaries.map(schoolReportSummary =>
                (
                    <Apprentice key={schoolReportSummary.user_id} apprentice={schoolReportSummary} showLink={true} />
                ))
            :
                <Loading />
            }
        </div>
    )
}

export default SchoolReportList;