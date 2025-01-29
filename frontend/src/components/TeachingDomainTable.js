import React from 'react';
import { useTranslation } from "react-i18next";

import ModuleRow from './ModuleRow';

/**
 * Displays the details of a teaching domain.
 *
 * @param {?array} subjects Subjects linked to the teaching domain.
 *
 * @param {?array} modules Mouldes linked to the teaching domain.
 *
 * @returns {JSX.Element}
 *
 */
const TeachingDomainTable = ({ subjects = null, modules = null }) =>
{
    const { t } = useTranslation("teachingDomain");

    let tableHeaders = [];
    let schoolModules = [];
    let nonSchoolModules = [];
    let unorderedModules = [];

    if(subjects && !modules)
    {
        tableHeaders.push(t("subject"));

        for(let i = 1; i <= 8; i++)
            tableHeaders.push(t("semester_prefix") + " " + i);

        tableHeaders.push(t("average"));

        subjects.forEach(subject =>
        {
            if(subject.grades?.length > 8)
            {
                console.error(`The subject ${subject.name} has more than 8 grades.`)
                return;
            }

            while(subject.grades?.length < 8)
            {
                subject.grades.push(
                {
                    // Prevent duplicate keys
                    id: Math.random(),
                    grade: null
                });
            }
        })
    }

    else if(!subjects && modules)
    {
        tableHeaders.push(t("module_number"), t("title"), t("grade"));

        schoolModules = modules.filter(module => module.is_school === true);
        nonSchoolModules = modules.filter(module => module.is_school === false);
        unorderedModules = modules.filter(module => module.is_school === null);
    }

    else
    {
        console.error("The teaching domain has subjects and modules or none of them.")
        return;
    }

    return (
        <table
            className={subjects && "subject-table w-max"}
            data-testid="teaching-domain-table"
        >
            <thead data-testid="teaching-domain-table-head">
                <tr data-testid="teaching-domain-table-head-row">
                    {tableHeaders.map(col => (
                        <th
                            key={col}
                            data-testid="teaching-domain-table-head-cell"
                        >
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody data-testid="teaching-domain-table-body">
                {subjects?.map(subject => (
                    <tr
                        key={subject.id}
                        data-testid="teaching-domain-table-subject-row"
                    >
                        <td data-testid="teaching-domain-table-subject-name">
                            {subject.name}
                        </td>

                        {subject.grades?.map(grade => (
                            <td
                                key={grade.id}
                                data-testid="teaching-domain-table-subject-grade"
                            >
                                {grade.grade}
                            </td>
                        ))}

                        <td data-testid="teaching-domain-table-subject-average">
                            {subject.average}
                        </td>
                    </tr>
                ))}

                {modules && (
                    <>
                        {schoolModules.length > 0 && (
                            <ModuleRow
                                modules={schoolModules}
                                average={modules.schoolModulesAverage}
                                isSchool={true}
                            />
                        )}

                        {nonSchoolModules.length > 0 && (
                            <ModuleRow
                                modules={nonSchoolModules}
                                average={modules.nonSchoolModulesAverage}
                                isSchool={false}
                            />
                        )}

                        {unorderedModules.length > 0 && (
                            <ModuleRow
                                modules={unorderedModules}
                                average={null}
                                isSchool={null}
                            />
                        )}
                    </>
                )}
            </tbody>
        </table>
    )
}

export default TeachingDomainTable;