import React from 'react';

import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { renderComponent } from '../utils/renderComponent';

import PageNotFound from '../../pages/PageNotFound';

import frTitles from "../../../public/locales/fr/titles.json";
import frTexts from "../../../public/locales/fr/texts.json";
import frButtons from "../../../public/locales/fr/buttons.json";

test("Component contains 4 elements", () =>
{
    renderComponent(<PageNotFound />);

    const elements = getElementsByTestIds(
    [
        "page-not-found-container", "page-not-found-title",
        "page-not-found-text", "back-to-home-button"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });
});

test("Elements structure is correct", () =>
{
    renderComponent(<PageNotFound />);

    const elements = getElementsByTestIds(
    [
        "page-not-found-container", "page-not-found-title",
        "page-not-found-text", "back-to-home-button"
    ]);

    expect(elements["page-not-found-container"]).toContainElement(elements["page-not-found-title"]);
    expect(elements["page-not-found-container"]).toContainElement(elements["page-not-found-text"]);
    expect(elements["page-not-found-container"]).toContainElement(elements["back-to-home-button"]);

    expect(elements["page-not-found-title"]).not.toContainElement(elements["page-not-found-text"]);
    expect(elements["page-not-found-title"]).not.toContainElement(elements["back-to-home-button"]);

    expect(elements["page-not-found-text"]).not.toContainElement(elements["page-not-found-title"]);
    expect(elements["page-not-found-text"]).not.toContainElement(elements["back-to-home-button"]);

    expect(elements["back-to-home-button"]).not.toContainElement(elements["page-not-found-title"]);
    expect(elements["back-to-home-button"]).not.toContainElement(elements["page-not-found-text"]);
});

test("Correct texts are shown", () =>
{
    renderComponent(<PageNotFound />);

    const elements = getElementsByTestIds(
    [
        "page-not-found-title", "page-not-found-text", "back-to-home-button"
    ]);

    expect(elements["page-not-found-title"]).toHaveTextContent(frTitles['404_not_found']);
    expect(elements["page-not-found-text"]).toHaveTextContent(frTexts.nothing_to_do_here);
    expect(elements["back-to-home-button"]).toHaveTextContent(frButtons.back_to_home);
});

test("Elements have important classes", () =>
{
    renderComponent(<PageNotFound />);

    const elements = getElementsByTestIds(
    [
        "page-not-found-container", "back-to-home-button"
    ]);

    expect(elements["page-not-found-container"])
        .toHaveClass("h-screen w-screen flex flex-col justify-center content-center text-center");

    expect(elements["back-to-home-button"]).toHaveClass("btn-primary");
});