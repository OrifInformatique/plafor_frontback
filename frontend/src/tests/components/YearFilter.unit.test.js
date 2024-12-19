import React from 'react';
import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';

import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { renderComponent } from '../utils/renderComponent';

import YearFilter from '../../components/YearFilter';

import AnnualAverage from '../../../public/locales/fr/annualAverage.json';

test("Component contains a container", () =>
{
    renderComponent(<YearFilter />);

    const yearFilterContainer = getElementsByTestIds("year-filter-container");

    expect(yearFilterContainer).toBeInTheDocument();
    expect(yearFilterContainer).toHaveRole("generic");
});

test("Suffix is properly choosed and displayed based on yearNum value", () =>
{
    const tests =
    [
        { yearNum: 1, shouldDisplayFirstSuffix: true },
        { yearNum: 2, shouldDisplayFirstSuffix: false }
    ];

    tests.forEach(({ yearNum, shouldDisplayFirstSuffix }) =>
    {
        renderComponent(<YearFilter yearNum={yearNum} />);

        const yearFilterContainer = getElementsByTestIds("year-filter-container");

        if(shouldDisplayFirstSuffix)
            expect(yearFilterContainer).toHaveTextContent(yearNum + AnnualAverage.first_suffix);

        else
            expect(yearFilterContainer).toHaveTextContent(yearNum + AnnualAverage.number_suffix);

        cleanup();
    })
});

test("setState function is correctly called when filter is clicked", () =>
{
    const mockSetSelectedYear = jest.fn();

    const year = ["2023-08-01", "2024-07-31"];

    renderComponent(<YearFilter year={year} setSelectedYear={mockSetSelectedYear} />);

    const yearFilterContainer = getElementsByTestIds("year-filter-container");

    userEvent.click(yearFilterContainer);

    expect(mockSetSelectedYear).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedYear).toHaveBeenCalledWith(year);
});

test("Filter is underlined and colored if selected", () =>
{
    const tests =
    [
        { selected: undefined, shouldAppearSelected: false },
        { selected: false, shouldAppearSelected: false },
        { selected: true, shouldAppearSelected: true },
    ];

    tests.forEach(({ selected, shouldAppearSelected }) =>
    {
        renderComponent(<YearFilter selected={selected} />);

        const yearFilterContainer = getElementsByTestIds("year-filter-container");

        if(shouldAppearSelected)
            expect(yearFilterContainer).toHaveClass("border-b-blue-light text-blue-light");

        else
            expect(yearFilterContainer).not.toHaveClass("border-b-blue-light text-blue-light");

        cleanup();
    })

});