import React from 'react';
import { useTranslation } from "react-i18next";

/**
 * Displays modules in the TeachingDomainTable component.
 *
 * @param {?array} modules An array of either school or non-school modules.
 *
 * @param {float} [average=0] The average of the modules provided to this component. 0 by default.
 *
 * @param {bool} [isSchool=true] Indicates if the modules are made in school or not. True by default.
 *
 * @returns {JSX.Element}
 *
 */
const ModuleRow = ({ modules = null, average = 0, isSchool = true }) =>
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
                    {isSchool ?
                        t("school_modules") + " (80%)" :
                        t("non_school_modules") + " (20%)"
                    }
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