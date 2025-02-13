import React from 'react';
import { useTranslation } from "react-i18next";

/**
 * Displays modules in the TeachingDomainTable component.
 *
 * @param {?array} modules An array of either school or non-school modules.
 *
 * @param {float} [average=null] The average of the modules provided to this component. 0 by default.
 *
 * @param {bool} [isSchool=null] Indicates if the modules are made in school or not. True by default.
 *
 * @returns {JSX.Element}
 *
 */
const ModuleRow = ({ modules = null, average = null, isSchool = null }) =>
{
    const { t } = useTranslation("teachingDomain");

    if(!modules)
        return;

    return (
        <>
             <tr data-testid="module-head-row">
                <th
                    colSpan={2}
                    data-testid="module-head-text-cell"
                >
                    {isSchool === true && t("school_modules") + " (80%)"}
                    {isSchool === false && t("non_school_modules") + " (20%)"}
                    {isSchool === null && t("unordered_modules")}
                </th>

                <th data-testid="module-head-average-cell">
                    {average}
                </th>
            </tr>

            {modules.map(module => (
                <tr
                    key={module.id}
                    data-testid="module-details-row"
                >
                    <td data-testid="module-number-cell">
                        {module.module_number}
                    </td>

                    <td data-testid="module-name-cell">
                        {module.name}
                    </td>

                    <td data-testid="module-grade-cell">
                        {module.grade}
                    </td>
                </tr>
            ))}
        </>
    )
}

export default ModuleRow;