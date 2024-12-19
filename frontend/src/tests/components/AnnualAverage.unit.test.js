import React from 'react';
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/react';

import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { renderComponent } from '../utils/renderComponent';
import { getMockedUserCourseData, getMockedYearlyUserCourse } from '../utils/getUserCourseData';

import { setYearsFilters, getYearlyUserCourse } from "../../utils/annualAverageUtils";

import AnnualAverage from '../../components/AnnualAverage';

import frAnnualAverage from "../../../public/locales/fr/annualAverage.json"

const userCourse = getMockedUserCourseData();
const yeralyUserCourse = getMockedYearlyUserCourse();

const yearsFilters =
{
    list:
    [
        [`2021-08-01`, `2022-07-31`],
        [`2022-08-01`, `2023-07-31`],
        [`2023-08-01`, `2024-07-31`],
        [`2024-08-01`, `2025-07-31`],
    ],
    selectedYear: [`2023-08-01`, `2024-07-31`]
};

// Mock des utilitaires
jest.mock("../../utils/annualAverageUtils", () => ({
    setYearsFilters: jest.fn(),
    getYearlyUserCourse: jest.fn(),
}));

test("Component contains 4 elements when no userCourse is provided", () =>
{
    setYearsFilters.mockReturnValue(yearsFilters);

    renderComponent(<AnnualAverage />);

    const shownElements = getElementsByTestIds(
    [
        "annual-average-container", "annual-average-heading",
        "years-filters-container", "no-results-container"
    ]);

    Object.values(shownElements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });

    const hiddenElements = [
        "annual-average-grade-container", "annual-average-grade-text",
        "annual-average-grade-value"
    ];

    hiddenElements.forEach(element =>
    {
        const HTMLElement = screen.queryByTestId(element)
        expect(HTMLElement).not.toBeInTheDocument();
    });

    const annualAverageDomainContainers = screen.queryAllByTestId("annual-average-domain-container");

    annualAverageDomainContainers.forEach(element =>
    {
        expect(element).not.toBeInTheDocument();
    });
});

test("Component contains 7 elements when userCourse is provided", () =>
{
    setYearsFilters.mockReturnValue(yearsFilters);
    getYearlyUserCourse.mockReturnValue(yeralyUserCourse);

    renderComponent(<AnnualAverage userCourse={userCourse} />);

    const elements = getElementsByTestIds(
    [
        "annual-average-container", "annual-average-heading",
        "years-filters-container", "annual-average-grade-container",
        "annual-average-grade-text", "annual-average-grade-value"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });

    const noResults = screen.queryByTestId("no-results-container");

    expect(noResults).not.toBeInTheDocument();

    const annualAverageDomainContainers = screen.getAllByTestId("annual-average-domain-container");

    annualAverageDomainContainers.forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });
});

test("Elements structure is correct", () =>
{
    setYearsFilters.mockReturnValue(yearsFilters);
    getYearlyUserCourse.mockReturnValue(yeralyUserCourse);

    renderComponent(<AnnualAverage userCourse={userCourse} />);

    const elements = getElementsByTestIds(
    [
        "annual-average-container", "annual-average-heading",
        "years-filters-container", "annual-average-grade-container",
        "annual-average-grade-text", "annual-average-grade-value"
    ]);

    expect(elements["annual-average-container"]).toContainElement(elements["annual-average-heading"]);
    expect(elements["annual-average-container"]).toContainElement(elements["years-filters-container"]);
    expect(elements["annual-average-container"]).toContainElement(elements["annual-average-grade-container"]);

    expect(elements["annual-average-grade-container"]).toContainElement(elements["annual-average-grade-text"]);
    expect(elements["annual-average-grade-container"]).toContainElement(elements["annual-average-grade-value"]);

    const annualAverageDomainContainers = screen.getAllByTestId("annual-average-domain-container");

    annualAverageDomainContainers.forEach(element =>
    {
        expect(elements["annual-average-container"]).toContainElement(element);
    });
});

test("Correct traductions are shown", () =>
{
    setYearsFilters.mockReturnValue(yearsFilters);
    getYearlyUserCourse.mockReturnValue(yeralyUserCourse);

    renderComponent(<AnnualAverage userCourse={userCourse} />);

    const elements = getElementsByTestIds(
    [
        "annual-average-heading", "annual-average-grade-text"
    ]);

    expect(elements["annual-average-heading"]).toHaveTextContent(frAnnualAverage.yearly_average)
    expect(elements["annual-average-grade-text"]).toHaveTextContent(frAnnualAverage.average_of_the_year)
});

test("Year filters are set on component render", () =>
{
    setYearsFilters.mockReturnValue(yearsFilters);
    getYearlyUserCourse.mockReturnValue(yeralyUserCourse);

    renderComponent(<AnnualAverage userCourse={userCourse} />);

    expect(setYearsFilters).toHaveBeenCalled();
    expect(setYearsFilters).toHaveBeenCalledWith(userCourse);
});

test("No year filter is displayed if yearsList is empty", () =>
{
    setYearsFilters.mockReturnValue({ list: [], selectedYear: []});

    renderComponent(<AnnualAverage userCourse={userCourse} />);

    const yearsFiltersContainer = getElementsByTestIds("years-filters-container");

    expect(yearsFiltersContainer).toBeEmptyDOMElement();
});

test("yearlyUserCourse is updated when selecting a year", () =>
{
    const firstYearFilterTextContent = `1${frAnnualAverage.first_suffix}`;
    const firstYear = [`2021-08-01`, `2022-07-31`];

    setYearsFilters.mockReturnValue(yearsFilters);
    getYearlyUserCourse.mockReturnValue(yeralyUserCourse);

    renderComponent(<AnnualAverage userCourse={userCourse} />);

    const firstYearFilter = screen.getByText(firstYearFilterTextContent);

    userEvent.click(firstYearFilter);

    expect(getYearlyUserCourse).toHaveBeenCalled();
    expect(getYearlyUserCourse).toHaveBeenCalledWith(userCourse, yearsFilters.list, firstYear);
});