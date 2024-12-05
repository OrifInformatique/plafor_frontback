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
        const response = await fetch(`${process.env.API_URL}/school_reports`);
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
 * @param {int} userCourseId ID of the user course.
 *
 * @return {array}
 *
 */
export const getApprenticeSchoolReport = async (userCourseId = null) =>
{
    try
    {
        const response = await fetch(`${process.env.API_URL}/school_report/${userCourseId}`);
        const data = await response.json();

        return data;
    }

    catch(error)
    {
        console.error("Erreur :" + error);
        return [];
    }
}