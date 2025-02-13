import React from 'react';
import { cleanup } from '@testing-library/react';

import { getElementsByTestIds, queryElementsByTestIds } from "../utils/getElementsByTestIds";
import { getSchoolModule } from '../utils/getTeachingDomainsData';
import { renderComponent } from '../utils/renderComponent';

import ModuleRow from '../../components/ModuleRow';

import frTeachingDomain from "../../../public/locales/fr/teachingDomain.json";

test("Component is empty if no modules are provided", () =>
{
    renderComponent(<table><tbody><ModuleRow /></tbody></table>)

    const elements = queryElementsByTestIds(
    [
        "module-head-row", "module-head-text-cell", "module-head-average-cell",
        "module-details-row", "module-number-cell", "module-name-cell", "module-grade-cell"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).not.toBeInTheDocument();
    });
});

test("Component contains 7 elements", () =>
{
    renderComponent(<table><tbody><ModuleRow modules={getSchoolModule()} /></tbody></table>);

    const elements = getElementsByTestIds(
    [
        "module-head-row", "module-head-text-cell", "module-head-average-cell",
        "module-details-row", "module-number-cell", "module-name-cell", "module-grade-cell"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });
});

test("Elements structure is correct", () =>
{
    renderComponent(<table><tbody><ModuleRow modules={getSchoolModule()} /></tbody></table>);

    const elements = getElementsByTestIds(
    [
        "module-head-row", "module-head-text-cell", "module-head-average-cell",
        "module-details-row", "module-number-cell", "module-name-cell", "module-grade-cell"
    ]);

    expect(elements["module-head-row"]).toContainElement(elements["module-head-text-cell"]);
    expect(elements["module-head-row"]).toContainElement(elements["module-head-average-cell"]);

    expect(elements["module-details-row"]).toContainElement(elements["module-number-cell"]);
    expect(elements["module-details-row"]).toContainElement(elements["module-name-cell"]);
    expect(elements["module-details-row"]).toContainElement(elements["module-grade-cell"]);
});

test("Correct traductions are shown", () =>
{
    const tests = [false, true];

    tests.forEach(isSchoolValue =>
    {
        renderComponent(<table><tbody><ModuleRow modules={getSchoolModule()} isSchool={isSchoolValue} /></tbody></table>);

        const text = getElementsByTestIds("module-head-text-cell");

        if(isSchoolValue)
            expect(text).toHaveTextContent(frTeachingDomain.school_modules + " (80%)");

        else
            expect(text).toHaveTextContent(frTeachingDomain.non_school_modules + " (20%)");

        cleanup();
    })
});