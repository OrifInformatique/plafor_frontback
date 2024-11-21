/**
 * Gets the minimun school report data of all apprentices.
 *
 * @return {array}
 *
 */
export const getSchoolReportsSummaries = async () =>
{
    try
    {
        const response = await fetch("http://localhost/plafor/public/api/school_reports");
        const data = await response.json();

        return data;
    }

    catch(error)
    {
        console.error("Erreur :" + error);
        return [];
    }
}



/**
 * Gets the all school report data of a specified apprentice user course.
 *
 * @param {int} user_course_id ID of the user course.
 *
 * @return {array}
 *
 */
export const getApprenticeSchoolReport = async (user_course_id = null) =>
{
    try
    {
        const response = await fetch(`http://localhost/plafor/public/api/school_report/${user_course_id}`);
        const data = await response.json();

        return data;
    }

    catch(error)
    {
        console.error("Erreur :" + error);
        return [];
    }
}