import React from 'react';
import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { renderComponent } from '../utils/renderComponent';

import NoResults from "../../components/NoResults";

import frTexts from "../../../public/locales/fr/texts.json";

test("Component contains 2 elements", () =>
{
    renderComponent(<NoResults />);

    const elements = getElementsByTestIds(
    [
        "no-results-container", "no-results-text"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });
});

test("Text is nested in container and centered", () =>
{
    renderComponent(<NoResults />);

    const elements = getElementsByTestIds(
    [
        "no-results-container", "no-results-text"
    ]);

    expect(elements["no-results-container"]).toContainElement(elements["no-results-text"]);
    expect(elements["no-results-text"]).not.toContainElement(elements["no-results-container"]);

    expect(elements["no-results-container"]).toHaveClass("w-max mx-auto");

});

test("Correct text does show", () =>
{
    renderComponent(<NoResults />);

    const noResultsText = getElementsByTestIds("no-results-text");

    expect(noResultsText).toHaveTextContent(frTexts.no_results);
});