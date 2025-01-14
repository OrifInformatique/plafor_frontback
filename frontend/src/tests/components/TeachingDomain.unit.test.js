import React from 'react';
import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';

import { getElementsByTestIds, queryElementsByTestIds } from "../utils/getElementsByTestIds";
import { getTeachingDomainsWithSubjects, getEliminatoryTeachingDomain } from '../utils/getTeachingDomainsData';
import { renderComponent } from '../utils/renderComponent';

import TeachingDomain from '../../components/TeachingDomain';

import frTeachingDomain from "../../../public/locales/fr/teachingDomain.json";

test("Component doesn't render anything when no teachingDomains are provided", () =>
{
    renderComponent(<TeachingDomain />);

    const teachingDomainContainer = queryElementsByTestIds("teaching-domain-container");

    expect(teachingDomainContainer).not.toBeInTheDocument();
});

test("Component contains the correct elements according to whether the teaching domain is eliminatory", () =>
{
    const tests =
    [
        { teachingDomain: getTeachingDomainsWithSubjects(), shouldBeEliminatory: false },
        { teachingDomain: getEliminatoryTeachingDomain(), shouldBeEliminatory: true },
    ];

    tests.forEach(({ teachingDomain, shouldBeEliminatory }) =>
    {
        renderComponent(<TeachingDomain teachingDomain={teachingDomain} />);

        const elements = getElementsByTestIds(
        [
            "teaching-domain-container", "teaching-domain-summary-container",
            "teaching-domain-title-text", "teaching-domain-grade-weighing-container",
            "teaching-domain-weighting", "teaching-domain-details-container"
        ]);

        Object.values(elements).forEach(element =>
        {
            expect(element).toBeInTheDocument();
        })

        if(shouldBeEliminatory)
        {
            const isEliminatoryText = getElementsByTestIds("teaching-domain-is-eliminatory-text")
            expect(isEliminatoryText).toBeInTheDocument();
        }

        else
        {
            const isEliminatoryText = queryElementsByTestIds("teaching-domain-is-eliminatory-text")
            expect(isEliminatoryText).not.toBeInTheDocument();
        }

        cleanup();
    })


});

test("Elements structure is correct", () =>
{
    renderComponent(<TeachingDomain teachingDomain={getEliminatoryTeachingDomain()} />);

    const elements = getElementsByTestIds(
    [
        "teaching-domain-container", "teaching-domain-summary-container",
        "teaching-domain-title-text", "teaching-domain-is-eliminatory-text",
        "teaching-domain-grade-weighing-container", "teaching-domain-weighting",
        "teaching-domain-details-container"
    ]);

    expect(elements["teaching-domain-container"]).toContainElement(elements["teaching-domain-summary-container"]);
    expect(elements["teaching-domain-container"]).toContainElement(elements["teaching-domain-details-container"]);

    expect(elements["teaching-domain-summary-container"]).toContainElement(elements["teaching-domain-title-text"]);
    expect(elements["teaching-domain-summary-container"]).toContainElement(elements["teaching-domain-grade-weighing-container"]);

    expect(elements["teaching-domain-title-text"]).toContainElement(elements["teaching-domain-is-eliminatory-text"]);

    expect(elements["teaching-domain-grade-weighing-container"]).toContainElement(elements["teaching-domain-weighting"]);

    expect(elements["teaching-domain-details-container"]).not.toBeEmptyDOMElement();
});

test("Correct translations are shown", () =>
{
    renderComponent(<TeachingDomain teachingDomain={getEliminatoryTeachingDomain()} />);

    const isEliminatoryText = getElementsByTestIds("teaching-domain-is-eliminatory-text");

    expect(isEliminatoryText).toHaveTextContent(frTeachingDomain.eliminatory);
});

test("Teaching domains details does show when clicking on the teaching domain", () =>
{
    const toggleDetailsSpy = jest.spyOn(document, 'getElementById').mockImplementation((id) =>
    {
        return {
            style: {
                maxHeight: null,
                scrollHeight: 100
            },
            classList: {
                toggle: jest.fn()
            }
        };
    });

    const teachingDomain = getTeachingDomainsWithSubjects();

    renderComponent(<TeachingDomain teachingDomain={teachingDomain} />);

    const teachingDomainSummary = getElementsByTestIds("teaching-domain-summary-container");

    userEvent.click(teachingDomainSummary);

    expect(toggleDetailsSpy).toHaveBeenCalledTimes(2);
});