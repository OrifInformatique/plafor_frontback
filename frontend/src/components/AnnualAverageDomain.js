import React from 'react';
import { useTranslation } from "react-i18next";

import Grade from "./Grade";

/**
 * Displays the average of a domain in a annual average.
 *
 * @param {array} yearlyUserCourse User course containg all grades made during a selected year.
 *
 * @returns {JSX.Element}
 *
 */
const AnnualAverageDomain = ({ teachingDomains }) =>
{
    const { t } = useTranslation("annualAverage");

   return (
       <>
           {teachingDomains?.map(teachingDomain => (
                <div
                    key={teachingDomain.id}
                    className="my-4"
                    data-testid="annual-average-domain-container"
                >
                    <div
                        className="w-full p-2 bg-white flex justify-between items-center space-x-2 border-b-4 border-b-blue text-blue"
                        data-testid="annual-average-domain-head-container"
                    >
                        <p
                            className="text-lg"
                            data-testid="annual-average-text"
                        >
                            {teachingDomain.title}
                        </p>

                        <Grade grade={teachingDomain.average} />
                    </div>

                    <div
                        className="divide-y-2 divide-black"
                        data-testid="annual-average-subjects-modules-container"
                    >
                        {teachingDomain.subjects?.map(subject => (
                            <div
                                key={subject.id}
                                className="bg-white flex justify-between items-center space-x-2 p-2"
                                data-testid="annual-average-subject-container"
                            >
                                <div
                                    className="flex flex-col justify-center"
                                    data-testid="annual-average-subject-name-container"
                                >
                                    <p
                                        className="text-lg"
                                        data-testid="annual-average-subject-name"
                                    >
                                        {subject.name}
                                    </p>

                                    <em
                                        className="text-sm mt-2"
                                        data-testid="annual-average-semester-grades-text"
                                    >
                                        {t("semestrial_grades")}
                                    </em>
                                </div>

                                <div
                                    className="flex flex-col justfiy-center items-center"
                                    data-testid="annual-average-subject-grade-container"
                                >
                                    <Grade grade={subject.average} />

                                    <div
                                        className="flex flex-row justify-center items-center"
                                        data-testid="annual-average-subject-semester-grades-container"
                                    >
                                        {subject.grades.map(grade => (
                                            <div
                                                key={grade.id}
                                                className="inline-block mx-1"
                                                data-testid="annual-average-subject-semester-grade"
                                            >
                                                <Grade grade={grade.grade} isLarge={false} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {teachingDomain.modules?.map(module => (
                            <div
                                key={module.id}
                                className="bg-white flex justify-between items-center space-x-2 p-2"
                                data-testid="annual-average-module"
                            >
                                <p
                                    className="text-lg"
                                    data-testid="annual-average-module-name"
                                >
                                    {module.module_number + " - " + module.name}
                                </p>

                                <Grade grade={module.grade} />
                            </div>
                        ))}
                    </div>
                </div>
           ))}
       </>
   )
}

export default AnnualAverageDomain;