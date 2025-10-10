import React from 'react';

import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { renderComponent } from '../utils/renderComponent';

import Layout from '../../layouts/Layout';

import frTitles from "../../../public/locales/fr/titles.json";
import frTexts from "../../../public/locales/fr/texts.json";

test("Component contains 5 elements", () =>
{
    renderComponent(<Layout />);

    const elements = getElementsByTestIds(
    [
        "layout-header", "layout-header-orif-logo", "layout-header-link",
        "layout-main", "layout-footer", "layout-footer-text"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });
});

test("Elements structure is correct", () =>
{
    renderComponent(<Layout />);

    const elements = getElementsByTestIds(
    [
        "layout-header", "layout-header-orif-logo", "layout-header-link",
        "layout-main", "layout-footer", "layout-footer-text"
    ]);

    expect(elements["layout-header"]).toContainElement(elements["layout-header-link"]);
    expect(elements["layout-header"]).toContainElement(elements["layout-header-orif-logo"]);

    expect(elements["layout-footer"]).toContainElement(elements["layout-footer-text"]);

    expect(elements["layout-header"]).not.toContainElement(elements["layout-main"]);
    expect(elements["layout-header"]).not.toContainElement(elements["layout-footer"]);

    expect(elements["layout-main"]).not.toContainElement(elements["layout-header"]);
    expect(elements["layout-main"]).not.toContainElement(elements["layout-header-orif-logo"]);
    expect(elements["layout-main"]).not.toContainElement(elements["layout-header-link"]);
    expect(elements["layout-main"]).not.toContainElement(elements["layout-footer"]);
    expect(elements["layout-main"]).not.toContainElement(elements["layout-footer-text"]);

    expect(elements["layout-footer"]).not.toContainElement(elements["layout-header"]);
    expect(elements["layout-footer"]).not.toContainElement(elements["layout-main"]);
});

test("Correct texts are shown", () =>
{
    renderComponent(<Layout />);

    const elements = getElementsByTestIds(
    [
        "layout-header-link", "layout-footer-text"
    ]);

    expect(elements["layout-header-link"]).toHaveTextContent(frTitles.course_plans_management);

    expect(elements["layout-footer-text"]).toHaveTextContent(frTexts.app_created_by_the_IT_department_of_ORIF);
});