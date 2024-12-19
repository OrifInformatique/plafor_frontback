import React from 'react';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import AnnualAverageDomain from "./AnnualAverageDomain";
import Grade from "./Grade";
import NoResults from "./NoResults";
import YearFilter from "./YearFilter";

import { setYearsFilters, getYearlyUserCourse } from '../utils/annualAverageUtils';

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
    const { t } = useTranslation("annualAverage");

    // List of start and end dates of each school year
    const [yearsList, setYearsList] = useState([]);

    // Start and end dates of the selected year
    const [selectedYear, setSelectedYear] = useState([]);

    // User course containing only domains and subjects
    // that have at least one grade in it
    const [yearlyUserCourse, setYearlyUserCourse] = useState([]);

    useEffect(() =>
    {
        const yearsFilters = setYearsFilters(userCourse);

        setYearsList(yearsFilters.list);
        setSelectedYear(yearsFilters.selectedYear);
    }, [userCourse]);

    // Updates the table content when selecting a year filter
    useEffect(() =>
    {
        setYearlyUserCourse(getYearlyUserCourse(userCourse, yearsList, selectedYear));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCourse, yearsList, selectedYear]);

    return (
        <div className="w-full p-3 bg-beige-light
            sm:w-1/2 sm:m-auto sm:rounded-md xl:w-1/3"
            data-testid="annual-average-container">
            <h2 className="text-blue text-xl tracking-wide" data-testid="annual-average-heading">
                {t("yearly_average")}
            </h2>

            <div className="flex justify-evenly content-center my-2 px-3 py-1 overflow-auto space-x-5"
                data-testid="years-filters-container">
                {yearsList?.map((year, index) => (
                    <YearFilter key={index} yearNum={index+1} year={year} setSelectedYear={setSelectedYear}
                    selected={(year[0] === selectedYear[0] && year[1] === selectedYear[1])} />
                ))}
            </div>

            {yearlyUserCourse ?
                <>
                    <div className="w-full py-2 px-5 bg-blue-light flex justify-between items-center space-x-2 text-white rounded-lg"
                        data-testid="annual-average-grade-container">
                        <strong className="text-lg"
                            data-testid="annual-average-grade-text">
                            {t("average_of_the_year")}
                        </strong>

                        <strong data-testid="annual-average-grade-value">
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