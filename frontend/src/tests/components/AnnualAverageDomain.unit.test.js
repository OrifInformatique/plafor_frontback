import React from 'react';
import { cleanup } from '@testing-library/react';

import { getElementsByTestIds, queryElementsByTestIds } from "../utils/getElementsByTestIds";
import {
    getTeachingDomainsWithoutSubjectsAndModules, getTeachingDomainsWithSubjects,
    getTeachingDomainsWithModules, getTeachingDomainsWithSubjectsAndModules
} from "../utils/getTeachingDomainsData";
import { renderComponent } from '../utils/renderComponent';

import AnnualAverageDomain from '../../components/AnnualAverageDomain';

import frAnnualAverage from "../../../public/locales/fr/annualAverage.json"

test("Component is empty when no teachingDomains are provided", () =>
{
    renderComponent(<AnnualAverageDomain />);

    const annualAverageDomainContainers = queryElementsByTestIds("annual-average-domain-container");

    expect(annualAverageDomainContainers).not.toBeInTheDocument();
});

test("Component contains the correct elements according to teachingDomains' content", () =>
{
    const tests =
    [
        {
            teachingDomains: getTeachingDomainsWithoutSubjectsAndModules(),
            shouldDisplaySubjects: false,
            shouldDisplayModules: false
        },
        {
            teachingDomains: getTeachingDomainsWithSubjects(),
            shouldDisplaySubjects: true,
            shouldDisplayModules: false
        },
        {
            teachingDomains: getTeachingDomainsWithModules(),
            shouldDisplaySubjects: false,
            shouldDisplayModules: true
        },
        {
            teachingDomains: getTeachingDomainsWithSubjectsAndModules(),
            shouldDisplaySubjects: true,
            shouldDisplayModules: true
        }
    ];

    tests.forEach(({ teachingDomains, shouldDisplaySubjects, shouldDisplayModules }) =>
    {
        renderComponent(<AnnualAverageDomain teachingDomains={teachingDomains} />);

        const averageElements = getElementsByTestIds(
        [
            "annual-average-domain-container", "annual-average-container", "annual-average-text",
            "annual-average-subjects-modules-container"
        ]);

        Object.values(averageElements).forEach(averageElement =>
        {
            expect(averageElement).toBeInTheDocument();
        });

        if(shouldDisplaySubjects)
        {
            const subjectElements = getElementsByTestIds(
            [
                "annual-average-subject-container", "annual-average-subject-name-container",
                "annual-average-subject-name", "annual-average-semester-grades-text",
                "annual-average-subject-grade-container", "annual-average-subject-semester-grades-container",
                "annual-average-subject-semester-grade"
            ]);

            Object.values(subjectElements).forEach(subjectElement =>
            {
                expect(subjectElement).toBeInTheDocument();
            });
        }

        else
        {
            const subjectElements = queryElementsByTestIds(
            [
                "annual-average-subject-container", "annual-average-subject-name-container",
                "annual-average-subject-name", "annual-average-semester-grades-text",
                "annual-average-subject-grade-container", "annual-average-subject-semester-grades-container",
                "annual-average-subject-semester-grade"
            ]);

            Object.values(subjectElements).forEach(subjectElement =>
            {
                expect(subjectElement).not.toBeInTheDocument();
            });
        }

        if(shouldDisplayModules)
        {
            const moduleElements = getElementsByTestIds(
            [
                "annual-average-module", "annual-average-module-name"
            ]);

            Object.values(moduleElements).forEach(moduleElement =>
            {
                expect(moduleElement).toBeInTheDocument();
            });
        }

        else
        {
            const moduleElements = queryElementsByTestIds(
            [
                "annual-average-module", "annual-average-module-name"
            ]);

            Object.values(moduleElements).forEach(moduleElement =>
            {
                expect(moduleElement).not.toBeInTheDocument();
            });
        }

        cleanup();
    });
});

test("Elements structure is correct", () =>
{
    renderComponent(<AnnualAverageDomain teachingDomains={getTeachingDomainsWithSubjectsAndModules()} />);

    const elements = getElementsByTestIds(
    [
        "annual-average-domain-container", "annual-average-container", "annual-average-text",
        "annual-average-subjects-modules-container", "annual-average-subject-container",
        "annual-average-subject-name-container", "annual-average-subject-name",
        "annual-average-semester-grades-text", "annual-average-subject-grade-container",
        "annual-average-subject-semester-grades-container", "annual-average-subject-semester-grade",
        "annual-average-module", "annual-average-module-name"
    ]);

    expect(elements["annual-average-domain-container"]).toContainElement(elements["annual-average-container"]);
    expect(elements["annual-average-domain-container"]).toContainElement(elements["annual-average-subjects-modules-container"]);

    expect(elements["annual-average-container"]).toContainElement(elements["annual-average-text"]);

    expect(elements["annual-average-container"]).toContainElement(elements["annual-average-container"]);

    expect(elements["annual-average-subjects-modules-container"]).toContainElement(elements["annual-average-subject-container"]);
    expect(elements["annual-average-subjects-modules-container"]).toContainElement(elements["annual-average-module"]);

    expect(elements["annual-average-subject-container"]).toContainElement(elements["annual-average-subject-name-container"]);
    expect(elements["annual-average-subject-container"]).toContainElement(elements["annual-average-subject-grade-container"]);

    expect(elements["annual-average-subject-name-container"]).toContainElement(elements["annual-average-subject-name"]);
    expect(elements["annual-average-subject-name-container"]).toContainElement(elements["annual-average-semester-grades-text"]);

    expect(elements["annual-average-subject-grade-container"]).toContainElement(elements["annual-average-subject-semester-grades-container"]);

    expect(elements["annual-average-subject-semester-grades-container"]).toContainElement(elements["annual-average-subject-semester-grade"]);

    expect(elements["annual-average-module"]).toContainElement(elements["annual-average-module-name"]);
});

test("Elements have important classes for render", () =>
{
    renderComponent(<AnnualAverageDomain teachingDomains={getTeachingDomainsWithSubjectsAndModules()} />);

    const elements = getElementsByTestIds(
    [
        "annual-average-container", "annual-average-text",
        "annual-average-subjects-modules-container", "annual-average-subject-name",
        "annual-average-semester-grades-text", "annual-average-subject-semester-grade",
        "annual-average-module-name"
    ]);

    expect(elements["annual-average-container"]).toHaveClass("border-b-4 border-b-blue text-blue");

    expect(elements["annual-average-text"]).toHaveClass("text-lg");

    expect(elements["annual-average-subjects-modules-container"]).toHaveClass("divide-y-2 divide-black");

    expect(elements["annual-average-subject-name"]).toHaveClass("text-lg");

    expect(elements["annual-average-semester-grades-text"]).toHaveClass("text-sm mt-2");

    expect(elements["annual-average-subject-semester-grade"]).toHaveClass("inline-block mx-1");

    expect(elements["annual-average-module-name"]).toHaveClass("text-lg");
});

test("Correct traductions are shown", () =>
{
    renderComponent(<AnnualAverageDomain teachingDomains={getTeachingDomainsWithSubjectsAndModules()} />);

    const semestrialGradesText = getElementsByTestIds("annual-average-semester-grades-text");

    expect(semestrialGradesText).toHaveTextContent(frAnnualAverage.semestrial_grades);
});