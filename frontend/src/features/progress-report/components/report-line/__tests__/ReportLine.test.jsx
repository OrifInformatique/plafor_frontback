import React from "react";
import { render, screen } from "@testing-library/react";
import ReportLine from "../ReportLine";
import fixture from "../__fixtures__/report-line-data.json";

// Avoid rendering real ReportBar internals in this unit test
jest.mock("../../report-bar/ReportBar", () => ({
  __esModule: true,
  default: ({ data }) => <div data-testid="report-bar" data-segments={data.length} />,
}));

describe("ReportLine", () => {
  it("renders the label text", () => {
    render(<ReportLine label={fixture.label} data={fixture.data} />);
    expect(screen.getByText(fixture.label)).toBeInTheDocument();
  });

  it("passes the full label as title attribute for tooltip on truncated text", () => {
    render(<ReportLine label={fixture.label} data={fixture.data} />);
    const label = screen.getByText(fixture.label);
    expect(label).toHaveAttribute("title", fixture.label);
  });

  it("renders the ReportBar child component", () => {
    render(<ReportLine label={fixture.label} data={fixture.data} />);
    expect(screen.getByTestId("report-bar")).toBeInTheDocument();
  });

  it("forwards data to ReportBar", () => {
    render(<ReportLine label={fixture.label} data={fixture.data} />);
    const bar = screen.getByTestId("report-bar");
    expect(bar).toHaveAttribute("data-segments", String(fixture.data.length));
  });

  it("renders with empty data without crashing", () => {
    render(<ReportLine label="Empty" data={[]} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByTestId("report-bar")).toBeInTheDocument();
  });

  it("renders with an empty label without crashing", () => {
    render(<ReportLine label="" data={fixture.data} />);
    expect(screen.getByTestId("report-bar")).toBeInTheDocument();
  });
});
