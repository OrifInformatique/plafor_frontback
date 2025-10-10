import React from 'react';
import { screen, cleanup } from '@testing-library/react';

import { getElementsByTestIds, queryElementsByTestIds } from "../utils/getElementsByTestIds";
import {
    getSubject,
    getSubjectsWithoutGrades,
    getSubjectsWithTooManyGrades,
    getSchoolModule,
    getSchoolAndNonSchoolModules
} from '../utils/getTeachingDomainsData';
import { renderComponent } from '../utils/renderComponent';

import TeachingDomainTable from '../../components/TeachingDomainTable';

import frTeachingDomain from "../../../public/locales/fr/teachingDomain.json";

test("Component is empty if invalid props are provided", () =>
{
    // Removes console errors noramllay thrown by the component
    // from the terminal in the cases covered by this test.
    console.error = jest.fn();

    const tests =
    [
        { subjects: undefined, modules: undefined },
        { subjects: null, modules: null },
        { subjects: getSubjectsWithTooManyGrades(), modules: getSchoolModule() },
        { subjects: getSubject(), modules: getSchoolModule() },
    ]

    tests.forEach(({ subjects, modules }) =>
    {
        renderComponent(<TeachingDomainTable subjects={subjects} modules={modules} />);

        const teachingDomainTable = queryElementsByTestIds("teaching-domain-table");

        expect(teachingDomainTable).not.toBeInTheDocument();

        cleanup();
    });

});

test("Component contains the correct elements according to props values", () =>
{
    const tests =
    [
        { subjects: null, shouldDisplaySubjects: false },
        { subjects: undefined, shouldDisplaySubjects: false },
        { subjects: getSubject(), shouldDisplaySubjects: true }
    ];

    tests.forEach(({ subjects, shouldDisplaySubjects}) =>
    {
        renderComponent(<TeachingDomainTable subjects={subjects} modules={!subjects && getSchoolModule()}/>);

        const tableElements = getElementsByTestIds(
        [
            "teaching-domain-table", "teaching-domain-table-head",
            "teaching-domain-table-head-row", "teaching-domain-table-body"
        ]);

        Object.values(tableElements).forEach(tableElement =>
        {
            expect(tableElement).toBeInTheDocument();
        });

        expect(tableElements["teaching-domain-table-head-row"]).not.toBeEmptyDOMElement();

        const subjectElements = queryElementsByTestIds(
        [
            "teaching-domain-table-subject-row", "teaching-domain-table-subject-name",
            "teaching-domain-table-subject-average"
        ]);

        Object.values(subjectElements).forEach(subjectElement =>
        {
            if(shouldDisplaySubjects)
                expect(subjectElement).toBeInTheDocument();

            else
                expect(subjectElement).not.toBeInTheDocument();
        });

        cleanup();
    });
});

test("Elements structure is correct", () =>
{
    renderComponent(<TeachingDomainTable subjects={getSubject()} />);

    const tableElements = queryElementsByTestIds(
    [
        "teaching-domain-table", "teaching-domain-table-head",
        "teaching-domain-table-head-row", "teaching-domain-table-body"
    ])

    expect(tableElements["teaching-domain-table"]).toContainElement(tableElements["teaching-domain-table-head"]);
    expect(tableElements["teaching-domain-table"]).toContainElement(tableElements["teaching-domain-table-body"]);

    expect(tableElements["teaching-domain-table-head"]).toContainElement(tableElements["teaching-domain-table-head-row"]);

    const tableHeadCells = screen.queryAllByTestId("teaching-domain-table-head-cell")

    Object.values(tableHeadCells).forEach(tableHeadCell =>
    {
        expect(tableElements["teaching-domain-table-head"]).toContainElement(tableHeadCell);
    });

    const subjectElements = queryElementsByTestIds(
    [
        "teaching-domain-table-subject-row", "teaching-domain-table-subject-name",
        "teaching-domain-table-subject-average"
    ]);

    expect(tableElements["teaching-domain-table-body"]).toContainElement(subjectElements["teaching-domain-table-subject-row"]);

    expect(subjectElements["teaching-domain-table-subject-row"]).toContainElement(subjectElements["teaching-domain-table-subject-name"]);
    expect(subjectElements["teaching-domain-table-subject-row"]).toContainElement(subjectElements["teaching-domain-table-subject-average"]);

    const tableSubjectGrades = screen.queryAllByTestId("teaching-domain-table-subject-grade");

    Object.values(tableSubjectGrades).forEach(tableSubjectGrade =>
    {
        expect(subjectElements["teaching-domain-table-subject-row"]).toContainElement(tableSubjectGrade);
    });
});

test("Table headers are correctly created accoridng to props values and their traductions are correctly shown", () =>
{
    const tests =
    [
        { subjects: getSubject(), modules: null },
        { subjects: null, modules: getSchoolAndNonSchoolModules() }
    ];

    tests.forEach(({ subjects, modules }) =>
    {
        renderComponent(<TeachingDomainTable subjects={subjects} modules={modules} />);

        const headCells = screen.queryAllByTestId("teaching-domain-table-head-cell");

        if(subjects)
        {
            for(let i = 0; i <= 9; i++)
            {
                if(i === 0)
                    expect(headCells[i]).toHaveTextContent(frTeachingDomain.subject);

                else if(i === 9)
                    expect(headCells[i]).toHaveTextContent(frTeachingDomain.average);

                else
                    expect(headCells[i]).toHaveTextContent(frTeachingDomain.semester_prefix + " " + i);

            }
        }

        else
        {
            for(let i = 0; i <= 2; i++)
            {
                switch(i)
                {
                    case 0:
                        expect(headCells[i]).toHaveTextContent(frTeachingDomain.module_number);
                        break;

                    case 1:
                        expect(headCells[i]).toHaveTextContent(frTeachingDomain.title);
                        break;

                    case 2:
                        expect(headCells[i]).toHaveTextContent(frTeachingDomain.grade);
                        break;
                }
            }
        }

        cleanup();
    });


    expect()
});

test("Subject grades are autofilled with empty values if ther aren't 8 grades", () =>
{
    renderComponent(<TeachingDomainTable subjects={getSubjectsWithoutGrades()} />);

    const grades = screen.queryAllByTestId("teaching-domain-table-subject-grade");

    Object.values(grades).forEach(grade =>
    {
        expect(grade).toBeEmptyDOMElement();
    })
});