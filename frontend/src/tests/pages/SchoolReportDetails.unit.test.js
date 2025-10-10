import React from 'react';
import { waitFor } from '@testing-library/react';

import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { getApprenticeData } from "../utils/getApprenticeData"
import { renderComponent } from '../utils/renderComponent';

import SchoolReportDetails from '../../pages/SchoolReportDetails';

import { getApprenticeSchoolReport } from '../../services/api/school_reports';

import frTitles from "../../../public/locales/fr/titles.json";
import frButtons from "../../../public/locales/fr/buttons.json";

jest.mock("../../services/api/school_reports", () =>
({
    getApprenticeSchoolReport: jest.fn()
}));

beforeEach(() =>
{
    jest.resetAllMocks();
});

test("Component shows a loading animation on render", () =>
{
    getApprenticeSchoolReport.mockImplementationOnce(() => new Promise(() => {}));

    renderComponent(<SchoolReportDetails />);

    const loading = getElementsByTestIds("loading-container");

    expect(loading).toBeInTheDocument();
});

test("Component shows no results when no data is fetched", async () =>
{
    getApprenticeSchoolReport.mockReturnValueOnce(null);

    renderComponent(<SchoolReportDetails />);

    await waitFor(() =>
    {
        const noResults = getElementsByTestIds("no-results-container");

        expect(noResults).toBeInTheDocument();
    });
});

test("Component shows data when data is fetched", async () =>
{
    getApprenticeSchoolReport.mockReturnValueOnce(getApprenticeData());

    renderComponent(<SchoolReportDetails />);

    await waitFor(() =>
    {
        const elements = getElementsByTestIds(
        [
            "apprentice-container", "teaching-domain-container",
            "annual-average-container"
        ]);

        Object.values(elements).forEach(element =>
        {
            expect(element).toBeInTheDocument();
        });
    });
});

test("Component contains 3 static elements", async () =>
{
    getApprenticeSchoolReport.mockReturnValueOnce(null);

    renderComponent(<SchoolReportDetails />)

    await waitFor(() =>
    {
        const elements = getElementsByTestIds(
        [
            "school-report-details-title", "back-to-list-button-container",
            "back-to-list-button"
        ]);

        Object.values(elements).forEach(element =>
        {
            expect(element).toBeInTheDocument();
        });
    });
});

test("Static elements structure is correct", async () =>
{
    getApprenticeSchoolReport.mockReturnValueOnce(null);

    renderComponent(<SchoolReportDetails />)

    await waitFor(() =>
    {
        const elements = getElementsByTestIds(
        [
            "school-report-details-title", "back-to-list-button-container",
            "back-to-list-button"
        ]);

        expect(elements["school-report-details-title"]).not.toContainElement(elements["back-to-list-button-container"]);
        expect(elements["school-report-details-title"]).not.toContainElement(elements["back-to-list-button"]);

        expect(elements["back-to-list-button-container"]).toContainElement(elements["back-to-list-button"]);
        expect(elements["back-to-list-button-container"]).not.toContainElement(elements["school-report-details-title"]);
    });
});

test("Traductions for static elements are correct", async () =>
{
    getApprenticeSchoolReport.mockReturnValueOnce(null);

    renderComponent(<SchoolReportDetails />)

    await waitFor(() =>
    {
        const elements = getElementsByTestIds(
        [
            "school-report-details-title", "back-to-list-button-container",
            "back-to-list-button"
        ]);

        expect(elements["school-report-details-title"]).toHaveTextContent(frTitles.school_report_details);
        expect(elements["back-to-list-button"]).toHaveTextContent(frButtons.back_to_list);
    });
});