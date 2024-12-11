import { screen } from '@testing-library/react';

/**
 * Gets HTML elements for testing.
 *
 * @param {string|Array<String>} testIds Names of data-testid attrbutes defined in elements.
 *
 * @returns {Array<HTMLElement>}
 *
 */
export const getElementsByTestIds = (testIds) =>
{
    if(!Array.isArray(testIds))
    {
        return screen.getByTestId(testIds)
    }

    return testIds.reduce((acc, testId) =>
    {
        acc[testId] = screen.getByTestId(testId);
        return acc;
    }, {});
};