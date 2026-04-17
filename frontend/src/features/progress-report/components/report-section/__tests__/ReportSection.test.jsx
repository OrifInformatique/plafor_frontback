import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportSection from "../ReportSection";
import fixture from "../__fixtures__/report-section-data.json";

// Avoid rendering real DoughnutChart and ReportLine internal in this unit test
// mocks of child components
jest.mock("../../doughnut-chart/DoughnutChart", () => ({
  __esModule: true,
  default: ({ data }) => <div data-testid="mock-doughnut" />,
}));

jest.mock("../../report-line/ReportLine", () => ({
  __esModule: true,
  default: ({ label }) => <div data-testid="mock-report-line">{label}</div>,
}));

// --- Tests ---
describe("ReportSection", () => {
  describe("Initial render", () => {
    beforeEach(() => {
      render(
        <ReportSection
          label={fixture.label}
          doughnutChartData={fixture.doughnutChartData}
          reportLines={fixture.reportLines}
        />,
      );
    });

    it("displays the section label", () => {
      expect(screen.getByTitle(fixture.label)).toBeInTheDocument();
    });

    it("renders the DoughnutChart", () => {
      expect(screen.getByTestId("mock-doughnut")).toBeInTheDocument();
    });

    it("renders as many ReportLines as there are in the data", () => {
      const lines = screen.getAllByTestId("mock-report-line");
      expect(lines).toHaveLength(fixture.reportLines.length);
    });

    it("renders each ReportLine with the correct label", () => {
      const lines = screen.getAllByTestId("mock-report-line");
      lines.forEach((line, index) => {
        expect(line).toHaveTextContent(fixture.reportLines[index].label);
      });
    });
  });

  describe("Toggle button", () => {
    beforeEach(() => {
      render(
        <ReportSection
          label={fixture.label}
          doughnutChartData={fixture.doughnutChartData}
          reportLines={fixture.reportLines}
        />,
      );
    });

    it("renders a toggle button", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("has aria-expanded set to false by default", () => {
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("sets aria-expanded to true when clicked", async () => {
      await userEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("sets aria-expanded back to false when clicked a second time", async () => {
      const button = screen.getByRole("button");
      await userEvent.click(button);
      await userEvent.click(button);
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("adds the open modifier class to the lines wrapper when clicked", async () => {
      const wrapper = document.querySelector(".report-section__lines-wrapper");
      expect(wrapper).not.toHaveClass("report-section__lines-wrapper--open");
      await userEvent.click(screen.getByRole("button"));
      expect(wrapper).toHaveClass("report-section__lines-wrapper--open");
    });
  });

  describe("Default props (empty values)", () => {
    it("renders without crashing when no props are provided", () => {
      render(<ReportSection />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders no ReportLines when reportLines is empty", () => {
      render(<ReportSection />);
      expect(screen.queryAllByTestId("mock-report-line")).toHaveLength(0);
    });

    it("renders the DoughnutChart even with no data", () => {
      render(<ReportSection />);
      expect(screen.getByTestId("mock-doughnut")).toBeInTheDocument();
    });
  });
});
