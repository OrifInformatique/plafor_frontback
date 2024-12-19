/**
 * Creates the list of start and end dates of each year of the course plan duration.\
 * Also selects by default the filter corresponding to the current school year.
 *
 * @param {array} userCourse User course of the apprentice.
 *
 * @returns {object}
 *
 */
export const setYearsFilters = (userCourse) =>
{
    if(!userCourse || !userCourse.date_begin || !userCourse.date_end)
        return {
            list: [],
            selectedYear: null
        }

    const beginYear = new Date(userCourse.date_begin).getFullYear();
    const endYear = new Date(userCourse.date_end).getFullYear();

    const years = Array.from({ length: endYear - beginYear }, (_, i) =>
    {
        const year = beginYear + i;

        // School years always start the 1st of August and end the 31th of July
        return [`${year}-08-01`, `${year + 1}-07-31`];
    });

    const currentYear = new Date().getFullYear();

    return {
        list: years,
        selectedYear: currentYear >= beginYear && currentYear < endYear
        ? [`${currentYear}-08-01`, `${currentYear + 1}-07-31`]
        : null
    }
}

/**
 * Selects data corresponding to the year selected.
 *
 * @param {array} userCourse User course of the apprentice.
 *
 * @param {string[]} yearsList List of years of course plan.
 *
 * @param {string[]} selectedYear Year selected via the filters, in `yyyy-mm-dd` format.
 *
 * @returns {?array}
 *
 */
export const getYearlyUserCourse = (userCourse, yearsList, selectedYear) =>
{
    if(!userCourse || !yearsList || !selectedYear)
        return null;

    let year = 1;

    for(const schoolYear of yearsList)
    {
        if(schoolYear[0] === selectedYear[0]
            && schoolYear[1] === selectedYear[1])
        {
            return userCourse.yearly_reports.find(
                yearlyReport => yearlyReport.year === year);
        }

        year += 1;
    };

    return null;
}