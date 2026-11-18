import React from "react";
import { render } from "@testing-library/react";
import DoughnutChart from "../DoughnutChart";
import skillsData from "../__fixtures__/skills-data.json";
import badData from "../__fixtures__/bad-data.json";

// We create a jest function(moke function) to spy on the props sent to <Doughnut />
const mockDoughnut = jest.fn(() => null);

// We replace the real react-chartjs-2 component with our mock
jest.mock("react-chartjs-2", () => ({
  Doughnut: (props) => {
    mockDoughnut(props);
    return null;
  },
}));

describe("DoughnutChart", () => {
  beforeEach(() => {
    mockDoughnut.mockClear();
  });

  it("passes normalized labels/values to Doughnut with valid JSON data", () => {
    render(<DoughnutChart data={skillsData} showLegend={true} />);

    // The mock must have been called once
    expect(mockDoughnut).toHaveBeenCalledTimes(1);

    const props = mockDoughnut.mock.calls[0][0];
    const { data, options } = props;

    // Labels = JSON labels
    expect(data.labels).toEqual(skillsData.map((d) => d.label));

    // Values = JSON values
    expect(data.datasets[0].data).toEqual(skillsData.map((d) => d.value));

    // The legend must be enabled when showLegend = true
    expect(options.plugins.legend.display).toBe(true);
  });

  it("uses the 'No data' fallback (single 100% segment) when data is empty", () => {
    render(<DoughnutChart data={[]} showLegend={true} />);

    expect(mockDoughnut).toHaveBeenCalledTimes(1);
    const { data, options } = mockDoughnut.mock.calls[0][0];

    expect(data.labels).toEqual(["No data or incorrect data"]);
    expect(data.datasets[0].data).toEqual([100]);

    // Legend must be hidden when empty (even if showLegend=true)
    expect(options.plugins.legend.display).toBe(false);

    // plugin receives isEmpty=true
    expect(options.plugins.percentagePlugin.isEmpty).toBe(true);
  });

  it("normalizes invalid values: strings -> numbers, non-finite -> 0; labels null -> 'Item X'", () => {
    render(<DoughnutChart data={badData} showLegend={false} />);

    expect(mockDoughnut).toHaveBeenCalledTimes(1);
    const { data, options } = mockDoughnut.mock.calls[0][0];

    // Based on normalizeData:
    // - "40" -> 40
    // - -5 stays -5 (your normalize doesn't clamp negatives)
    // - null -> 0
    // - 0 stays 0
    expect(data.datasets[0].data).toEqual([40, -5, 0, 0]);

    // Labels:
    // - "Autonome" stays
    // - "" stays "" (because only null/undefined fallback to Item X)
    // - null -> "Item 3"
    // - "Expliqué" stays
    expect(data.labels).toEqual(["Autonome", "", "Item 3", "Expliqué"]);

    // Legend must be disabled when showLegend=false
    expect(options.plugins.legend.display).toBe(false);

    // Not empty => plugin isEmpty=false
    expect(options.plugins.percentagePlugin.isEmpty).toBe(false);
  });

  it("keeps chart defaults: cutout and animation duration", () => {
    render(<DoughnutChart data={skillsData} />);

    expect(mockDoughnut).toHaveBeenCalledTimes(1);
    const { data, options } = mockDoughnut.mock.calls[0][0];

    // cutout is stored on dataset in this component
    expect(data.datasets[0].cutout).toBe("70%");

    // animation duration
    expect(options.animation.duration).toBe(800);
  });
});
