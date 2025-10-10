import React from 'react';
import { act, waitFor } from '@testing-library/react';

import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { getApprenticeSummary } from "../utils/getApprenticeData"
import { renderComponent } from '../utils/renderComponent';

import SchoolReportList from '../../pages/SchoolReportList';

import { getSchoolReportsSummaries } from '../../services/api/school_reports';

import frApprenticesList from "../../../public/locales/fr/apprenticesList.json";
import frTitles from "../../../public/locales/fr/titles.json";

jest.mock("../../services/api/school_reports", () =>
({
    getSchoolReportsSummaries: jest.fn()
}));

beforeEach(() =>
{
    jest.resetAllMocks();
});

test("Component shows a loading animation on render", async () =>
{
    getSchoolReportsSummaries.mockImplementationOnce(() => new Promise(() => {}));

    await act(async () => renderComponent(<SchoolReportList />))

    const loading = getElementsByTestIds("loading-container");

    expect(loading).toBeInTheDocument();
});

test("Component shows no results when no data is fetched", async () =>
{
    getSchoolReportsSummaries.mockReturnValueOnce(null);

    await act(async () => renderComponent(<SchoolReportList />))

    await waitFor(() =>
    {
        const noResults = getElementsByTestIds("no-results-container");

        expect(noResults).toBeInTheDocument();
    });
});

test("Component contains 7 static elements", async () =>
{
    await act(async () => renderComponent(<SchoolReportList />))

    const elements = getElementsByTestIds(
    [
        "school-summaries-container", "school-summaries-title",
        "school-summaries-filters-container", "school-summaries-trainer-filter",
        "school-summaries-trainers-filters-all-option", "school-summaries-trainers-filters-unassigned-option",
        "school-summaries-apprentice-name-filter"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });
});

test("Static elements structure is correct", async() =>
{
    await act(async () => renderComponent(<SchoolReportList />))

    const elements = getElementsByTestIds(
    [
        "school-summaries-container", "school-summaries-title",
        "school-summaries-filters-container", "school-summaries-trainer-filter",
        "school-summaries-trainers-filters-all-option", "school-summaries-trainers-filters-unassigned-option",
        "school-summaries-apprentice-name-filter"
    ]);

    expect(elements["school-summaries-container"]).toContainElement(elements["school-summaries-title"]);
    expect(elements["school-summaries-container"]).toContainElement(elements["school-summaries-filters-container"]);

    expect(elements["school-summaries-filters-container"]).toContainElement(elements["school-summaries-trainer-filter"]);
    expect(elements["school-summaries-filters-container"]).toContainElement(elements["school-summaries-apprentice-name-filter"]);

    expect(elements["school-summaries-trainer-filter"]).toContainElement(elements["school-summaries-trainers-filters-all-option"]);
    expect(elements["school-summaries-trainer-filter"]).toContainElement(elements["school-summaries-trainers-filters-unassigned-option"]);
});

test("Traductions for static elements are correct", async () =>
{
    await act(async () => renderComponent(<SchoolReportList />))

    const elements = getElementsByTestIds(
    [
        "school-summaries-title", "school-summaries-trainers-filters-all-option",
        "school-summaries-trainers-filters-unassigned-option", "school-summaries-apprentice-name-filter"
    ]);

    expect(elements["school-summaries-title"]).toHaveTextContent(frTitles.school_report_list);
    expect(elements["school-summaries-trainers-filters-all-option"]).toHaveTextContent(frApprenticesList.all);
    expect(elements["school-summaries-trainers-filters-unassigned-option"]).toHaveTextContent(frApprenticesList.unassigned);
    expect(elements["school-summaries-apprentice-name-filter"]).toHaveAttribute("placeholder", frApprenticesList.search_for_apprentice);
});