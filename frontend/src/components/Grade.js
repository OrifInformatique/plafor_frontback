import React from 'react';

/**
 * Displays a grade.\
 * The grade will be in red if it is inferior than 4.
 *
 * @param {string} grade The vaule of the grade.
 *
 * @param {boolean} [isLarge=true] Defines whether the grade is displayed bigger. True by befault.
 *
 * @returns {JSX.Element}
 *
 */
const Grade = ({ grade, isLarge = true }) =>
{
    return (
        <p className={`${isLarge && "note"} ${grade < 4 && "text-rose-500"}`} data-testid="grade-container">
            {grade}
        </p>
    )
}

export default Grade;