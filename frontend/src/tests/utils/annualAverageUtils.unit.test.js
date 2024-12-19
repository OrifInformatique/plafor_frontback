import { setYearsFilters, getYearlyUserCourse } from "../../utils/annualAverageUtils";

import { getMockedUserCourseData, getMockedUserCourseDataWithSameDates, getMockedYearlyUserCourse } from "./getUserCourseData"

const userCourse = getMockedUserCourseData();
const userCourseWithSameYears = getMockedUserCourseDataWithSameDates();

describe("setYearsFilters()", () =>
{
    it("Returns no data if no userCourse provided", () =>
    {
        const yearsFilters = setYearsFilters();

        expect(yearsFilters.list).toStrictEqual([]);
        expect(yearsFilters.selectedYear).toBeNull();
    });

    it("Returns no data if userCourse start date and end dates are equal (equal years)", () =>
    {
        const yearsFilters = setYearsFilters(userCourseWithSameYears);

        expect(yearsFilters.list).toStrictEqual([]);
        expect(yearsFilters.selectedYear).toBeNull();
    });

    it("Returns the years list and selected year correctly", () =>
    {
        const yearsFilters = setYearsFilters(userCourse);

        const expectedValue =
        {
            list:
            [
                ["2024-08-01", "2025-07-31"],
                ["2025-08-01", "2026-07-31"],
                ["2026-08-01", "2027-07-31"],
                ["2027-08-01", "2028-07-31"]
            ],
            selectedYear: ["2024-08-01", "2025-07-31"]
        };

        expect(yearsFilters).toStrictEqual(expectedValue);
    });
});

describe("getYearlyUserCourse()", () =>
{
    it("Returns null if param is missing or null", () =>
    {
        const functions =
        [
            getYearlyUserCourse(), getYearlyUserCourse(null, undefined, []),
            getYearlyUserCourse(userCourse)
        ]

        functions.forEach(element =>
        {
            expect(element).toBeNull();
        })
    });

    it("Returns null if the selected year is not found in the years list", () =>
    {
        const yearsList = [["2024-08-01", "2025-07-31"]];
        const selectedYear = ["9998-08-01", "9999-07-31"];

        const yearlyUserCourse = getYearlyUserCourse(userCourse, yearsList, selectedYear);

        expect(yearlyUserCourse).toBeNull();
    });

    it("Returns the correct data of the selected year", () =>
    {
        const yearsList = [["2024-08-01", "2025-07-31"]];
        const selectedYear = ["2024-08-01", "2025-07-31"];

        const yearlyUserCourse = getYearlyUserCourse(userCourse, yearsList, selectedYear);

        expect(yearlyUserCourse).toBeDefined();
        expect(yearlyUserCourse.year).toBe(1);
    });
});