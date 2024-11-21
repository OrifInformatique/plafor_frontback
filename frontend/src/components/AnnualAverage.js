import { useState, useEffect } from "react";
import YearFilter from "./YearFilter";
import AnnualAverageDomain from "./AnnualAverageDomain";
import Grade from "./Grade";

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
     * Arrange user course data to consider only domains and subjects
     * that contains at least one grade during the selected year.\
     * The subjects and domains weightings are considered in the calculation
     * of the averages.
     *
     * @param {array} userCourse User course of the apprentice.
     *
     * @param {Date} year Year selected via the filters, in `yyyy-mm-dd` format.
     *
     * @returns {void}
     *
     */
    const getYearlyUserCourse = (userCourse, year) =>
    {
        const yearDateBegin = Date.parse(year[0]);
        const yearDateEnd   = Date.parse(year[1]);

        let yearlyUserCourse = userCourse.teaching_domains.map(teachingDomain =>
        {
            let subjects = null;
            let modules = null;
            let domainAverage = null;

            if(teachingDomain.subjects && !teachingDomain.modules)
            {
                subjects = teachingDomain.subjects?.map(subject =>
                {
                    // Only keep grades that have been made during the year
                    const grades = subject.grades?.filter(grade =>
                    {
                        const gradeDate = Date.parse(grade.date);

                        return gradeDate >= yearDateBegin && gradeDate <= yearDateEnd;
                    });

                    if(grades?.length > 0)
                    {
                        const subjectAverage = grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
                        return { ...subject, grades: grades, average: subjectAverage}
                    }

                    return null;

                }).filter(subject => subject);

                if(subjects?.length > 0)
                {
                    const weightSum = subjects.reduce((sum, subject) => sum + subject.weight, 0);

                    domainAverage = subjects?.reduce(
                        (sum, subject) => sum + subject.average * subject.weight, 0) / weightSum;
                }
            }

            else if(teachingDomain.modules && !teachingDomain.subjects)
            {
                // Only keep grades that have been made during the year
                modules = teachingDomain.modules?.filter(module =>
                {
                    const moduleDate = Date.parse(module.grade_date);

                    return moduleDate >= yearDateBegin && moduleDate <= yearDateEnd;
                });


                if(modules?.length > 0)
                {
                    let schoolModules = modules.filter(module => module.is_school);
                    let nonSchoolModules = modules.filter(module => !module.is_school);

                    let schoolModulesAverage = schoolModules.reduce(
                        (sum, module) => sum + module.grade, 0) / schoolModules.length;

                    schoolModulesAverage = !isNaN(schoolModulesAverage) ? schoolModulesAverage : 0;

                    let nonSchoolModulesAverage = nonSchoolModules.reduce(
                        (sum, module) => sum + module.grade, 0) / nonSchoolModules.length;

                    nonSchoolModulesAverage = !isNaN(nonSchoolModulesAverage) ? nonSchoolModulesAverage : 0;

                    domainAverage = schoolModulesAverage * 0.8 + nonSchoolModulesAverage * 0.2;
                }
            }

            else
            {
                console.error("The teaching domain has both subject and modules defined or empty/undefined.")
                return null;
            }

            // Round average at 0.0 precision
            domainAverage = Math.round(domainAverage * 10) / 10;

            domainAverage = domainAverage > 0 ? domainAverage : null;

            return { ...teachingDomain, subjects: subjects, modules: modules, average: domainAverage };
        }).filter(teachingDomain => teachingDomain);

        const domainsWeightSum = yearlyUserCourse.reduce(
            (sum, teachingDomain) => sum + teachingDomain.weight, 0);

        const globalAverage = yearlyUserCourse.reduce(
            (sum, teachingDomain) => sum + teachingDomain.average * teachingDomain.weight, 0) / domainsWeightSum;

        yearlyUserCourse.globalAverage = Math.round(globalAverage * 10) / 10;

        yearlyUserCourse.globalAverage = yearlyUserCourse.globalAverage > 0 ? yearlyUserCourse.globalAverage : null;

        setYearlyUserCourse(yearlyUserCourse);
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
        {
            const currentSchoolYear = [`${currentYear}-08-01`, `${currentYear + 1}-07-31`];
            setSelectedYear(currentSchoolYear);
        }
    }

    useEffect(() =>
    {
        setYearsFilters(userCourse);
    }, [userCourse]);

    // Updates the table content when selecting a year filter
    useEffect(() =>
    {
        getYearlyUserCourse(userCourse, selectedYear)
    }, [userCourse, selectedYear]);

    return (
        <div className="w-full p-3 bg-beige-light
        sm:w-1/2 sm:m-auto sm:rounded-md
        xl:w-1/3">
            <div>
                <h2 className="text-blue text-xl tracking-wide">Moyenne annuelle</h2>
            </div>

            <div className="flex justify-evenly content-center my-2">
                {yearsList.map((year, index) => (
                    <YearFilter key={index} yearNum={index+1} year={year} setSelectedYear={setSelectedYear}
                    selected={(year[0] === selectedYear[0] && year[1] === selectedYear[1])} />
                ))}
            </div>

            <div className="w-full py-2 px-5 bg-blue-light flex justify-between items-center space-x-2 text-white rounded-lg">
                        <p className="text-lg font-bold">
                            Moyenne de l'année
                        </p>

                        <strong>
                            <Grade grade={yearlyUserCourse.globalAverage} />
                        </strong>
                    </div>

            <div className="">
                {yearlyUserCourse.length > 0 &&
                    <AnnualAverageDomain yearlyUserCourse={yearlyUserCourse} />
                }
            </div>
        </div>
    )
}

export default AnnualAverage;