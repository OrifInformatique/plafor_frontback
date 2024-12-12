import React from 'react';
import { getElementsByTestIds } from "../utils/getElementsByTestIds";
import { renderComponent } from '../utils/renderComponent';

import frTexts from "../../../public/locales/fr/texts.json";

import Loading from "../../components/Loading";

test("Component contains 5 elements", () =>
{
    renderComponent(<Loading />);

    const elements = getElementsByTestIds(
    [
        "loading-container", "loading-text", "loading-animation",
        "loading-animation-ball", "loading-animation-ground"
    ]);

    Object.values(elements).forEach(element =>
    {
        expect(element).toBeInTheDocument();
    });
});

test("Elements structure is correct", () =>
{
    renderComponent(<Loading />);

    const elements = getElementsByTestIds(
    [
        "loading-container", "loading-text", "loading-animation",
        "loading-animation-ball", "loading-animation-ground"
    ]);

    expect(elements["loading-container"]).toContainElement(elements["loading-text"]);
    expect(elements["loading-container"]).toContainElement(elements["loading-animation"]);

    expect(elements["loading-animation"]).toContainElement(elements["loading-animation-ball"]);
    expect(elements["loading-animation"]).toContainElement(elements["loading-animation-ground"]);
    expect(elements["loading-animation"]).not.toContainElement(elements["loading-text"]);
});

test("Text contains the correct loading text", () =>
{
    renderComponent(<Loading />);

    const loadingText = getElementsByTestIds("loading-text");

    expect(loadingText).toHaveTextContent(frTexts.data_currently_loading);
});

test("Ball has a bouncing animation", () =>
{
    renderComponent(<Loading />);

    const loadingAnimationBall = getElementsByTestIds("loading-animation-ball");

    expect(loadingAnimationBall).toHaveClass("animate-bounce-on-surface")
});