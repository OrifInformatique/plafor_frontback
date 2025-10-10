import React from 'react';
import { cleanup } from '@testing-library/react';

import { getElementsByTestIds, queryElementsByTestIds } from "../utils/getElementsByTestIds";
import { getApprenticeData } from '../utils/getApprenticeData';
import { renderComponent } from '../utils/renderComponent';

import Apprentice from '../../components/Apprentice';

test("Component doesn't render anything when no apprentice is provided", () =>
{
    renderComponent(<Apprentice />);

    const apprenticeContainer = queryElementsByTestIds("apprentice-container");

    expect(apprenticeContainer).not.toBeInTheDocument();
});

test("Component contains the correct elements according to showLink prop", () =>
{
    const tests =
    [
        { showLinkValue: undefined, shouldShowLink: false},
        { showLinkValue: null, shouldShowLink: false},
        { showLinkValue: false, shouldShowLink: false},
        { showLinkValue: true, shouldShowLink: true},
    ];

    tests.forEach(({ showLinkValue, shouldShowLink }) =>
    {
        renderComponent(<Apprentice apprentice={getApprenticeData()} showLink={showLinkValue} />);

        const elements = getElementsByTestIds(
        [
            "apprentice-container", "apprentice-name", "apprentice-user-courses-container",
            "apprentice-user-course", "apprentice-user-course-name", "apprentice-global-average-container"
        ]);

        Object.values(elements).forEach(element =>
        {
            expect(element).toBeInTheDocument();
        });

        if(shouldShowLink)
        {
            const link = getElementsByTestIds("apprentice-user-course-name-link");
            expect(link).toBeInTheDocument();
        }

        else
        {
            const link = queryElementsByTestIds("apprentice-user-course-name-link");
            expect(link).not.toBeInTheDocument();
        }

        cleanup();
    });
});

test("Elements structure is correct", () =>
{
    renderComponent(<Apprentice apprentice={getApprenticeData()} showLink={true} />);

    const elements = getElementsByTestIds(
    [
        "apprentice-container", "apprentice-name", "apprentice-user-courses-container",
        "apprentice-user-course", "apprentice-user-course-name-link", "apprentice-user-course-name",
        "apprentice-global-average-container", "grade-container"
    ]);

    expect(elements["apprentice-container"]).toContainElement(elements["apprentice-name"]);
    expect(elements["apprentice-container"]).toContainElement(elements["apprentice-user-courses-container"]);

    expect(elements["apprentice-user-courses-container"]).toContainElement(elements["apprentice-user-course"]);

    expect(elements["apprentice-user-course"]).toContainElement(elements["apprentice-user-course-name-link"]);
    expect(elements["apprentice-user-course"]).toContainElement(elements["apprentice-global-average-container"]);

    expect(elements["apprentice-user-course-name-link"]).toContainElement(elements["apprentice-user-course-name"]);

    expect(elements["apprentice-global-average-container"]).toContainElement(elements["grade-container"]);
});