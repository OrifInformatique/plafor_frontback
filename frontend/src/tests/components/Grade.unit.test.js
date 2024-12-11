import React from 'react';
import { cleanup } from '@testing-library/react';
import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { renderComponent } from '../utils/renderComponent';

import Grade from '../../components/Grade';

const veryGoodGrade = 5.9;
const integerGoodGrade = 4;
const badGrade = 1;
const floatGrade = 2.753;

test("Component contains a container", () =>
{
    renderComponent(<Grade />);

    const gradeContainer = getElementsByTestIds("grade-container");

    expect(gradeContainer).toBeInTheDocument();
    expect(gradeContainer).toHaveRole("paragraph");
});

test("Nothing displays when no grade is provided", () =>
{
    renderComponent(<Grade />);

    const gradeContainer = getElementsByTestIds("grade-container");

    expect(gradeContainer).not.toHaveTextContent();
});

test("Grade displays the correct grade (integer or float)", () =>
{
    const grades = [integerGoodGrade, floatGrade];

    grades.forEach(grade =>
    {
        renderComponent(<Grade grade={grade} />);

        const gradeContainer = getElementsByTestIds("grade-container");

        expect(gradeContainer).toHaveTextContent(grade);

        cleanup();
    });
});

test("Grade color is applied correctly based on value", () =>
{
    const tests =
    [
        { grade: badGrade, shouldBeColored: true },
        { grade: integerGoodGrade, shouldBeColored: false },
        { grade: veryGoodGrade, shouldBeColored: false },
    ];

    tests.forEach(({ grade, shouldBeColored }) =>
    {
        renderComponent(<Grade grade={grade} />);

        const gradeContainer = getElementsByTestIds("grade-container");

        if(shouldBeColored)
            expect(gradeContainer).toHaveClass("text-rose-500");

        else
            expect(gradeContainer).not.toHaveClass("text-rose-500");

        cleanup();
    });
});


test("Grade size is correct based on isLarge prop", () =>
{
    const tests =
    [
        { isLarge: undefined, shouldBeLarge: true },
        { isLarge: true, shouldBeLarge: true },
        { isLarge: false, shouldBeLarge: false },
    ];

    tests.forEach(({ isLarge, shouldBeLarge }) =>
    {
        renderComponent(<Grade isLarge={isLarge} />);

        const gradeContainer = getElementsByTestIds("grade-container");

        if(shouldBeLarge)
            expect(gradeContainer).toHaveClass("note");

        else
            expect(gradeContainer).not.toHaveClass("note");

        cleanup();
    });
});
