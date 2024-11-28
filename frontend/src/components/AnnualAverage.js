import { useState, useEffect } from "react";
import YearFilter from "./YearFilter";
import AnnualAverageDomain from "./AnnualAverageDomain";
import Grade from "./Grade";
import NoResults from "./NoResults";

/**
 * Displays the annual averages of a user course.
 *
 * @param {array} userCourse User course of the apprentice.
 *
 * @returns {JSX.Element}
 *
 */
const AnnualAverage = ({ userCourse }) =>
{
    // List of start and end dates of each school year
    const [yearsList, setYearsList] = useState([]);

    // Start and end dates of the selected year
    const [selectedYear, setSelectedYear] = useState([]);

    // User course containing only domains and subjects
    // that have at least one grade in it
    const [yearlyUserCourse, setYearlyUserCourse] = useState([]);

    /**
     * Selects data corresponding to the year selected.
     *
     * @param {array} userCourse User course of the apprentice.
     *
     * @param {Date} selectedYear Year selected via the filters, in `yyyy-mm-dd` format.
     *
     * @returns {void}
     *
     */
    const getYearlyUserCourse = (userCourse, selectedYear) =>
    {
        let year = 1;

        yearsList.forEach(schoolYear =>
        {
            if(schoolYear[0] === selectedYear[0]
                && schoolYear[1] === selectedYear[1])
            {
                setYearlyUserCourse(userCourse.yearly_reports.find(
                    yearlyReport => yearlyReport.year === year));
            }

            year += 1;
        });
    }

    /**
     * Creates the list of start and end dates of each year of the course plan duration.\
     * Also selects by default the filter corresponding to the current school year.
     *
     * @param {array} userCourse User course of the apprentice.
     *
     * @returns {void}
     *
     */
    const setYearsFilters = (userCourse) =>
    {
        const beginYear = new Date(userCourse.date_begin).getFullYear();
        const endYear = new Date(userCourse.date_end).getFullYear();

        const years = Array.from({ length: endYear - beginYear }, (_, i) =>
        {
            const year = beginYear + i;

            // School years always start the 1st of August and end the 31th of July
            return [`${year}-08-01`, `${year + 1}-07-31`];
        });

        setYearsList(years);

        const currentYear = new Date().getFullYear();

        if(currentYear >= beginYear && currentYear < endYear)
            setSelectedYear([`${currentYear}-08-01`, `${currentYear + 1}-07-31`]);
    }

    useEffect(() =>
    {
        setYearsFilters(userCourse);
    }, [userCourse]);

    // Updates the table content when selecting a year filter
    useEffect(() =>
    {
        getYearlyUserCourse(userCourse, selectedYear)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCourse, selectedYear]);


    return (
        <div className="w-full p-3 bg-beige-light
        sm:w-1/2 sm:m-auto sm:rounded-md
        xl:w-1/3">
            <div>
                <h2 className="text-blue text-xl tracking-wide">Moyenne annuelle</h2>
            </div>

            <div className="flex justify-evenly content-center my-2 px-3 py-1 overflow-auto space-x-5">
                {yearsList.map((year, index) => (
                    <YearFilter key={index} yearNum={index+1} year={year} setSelectedYear={setSelectedYear}
                    selected={(year[0] === selectedYear[0] && year[1] === selectedYear[1])} />
                ))}
            </div>

            {yearlyUserCourse ?
                <>
                    <div className="w-full py-2 px-5 bg-blue-light flex justify-between items-center space-x-2 text-white rounded-lg">
                        <strong className="text-lg">
                            Moyenne de l'année
                        </strong>

                        <strong>
                            <Grade grade={yearlyUserCourse.yearly_average} />
                        </strong>
                    </div>

                    <AnnualAverageDomain teachingDomains={yearlyUserCourse.teaching_domains} />
                </>
            :
                <NoResults />
            }
        </div>
    )
}

export default AnnualAverage;