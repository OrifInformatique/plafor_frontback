import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressReport from "../ProgressReport";
import fixture from "../__fixtures__/progress-report-data.json";

// Avoid rendering real children in this unit test — only the orchestration
// (wiring of props) is under test here.
jest.mock(
  "../../../components/course-plan-selector/CoursePlanSelector",
  () => ({
    __esModule: true,
    default: ({ coursePlans }) => (
      <div data-testid="mock-course-plan-selector">{coursePlans.length}</div>
    ),
  }),
);

jest.mock("../../../components/report-section/ReportSection", () => ({
  __esModule: true,
  default: ({ label }) => <div data-testid="mock-report-section">{label}</div>,
}));

// --- Tests ---
describe("ProgressReport", () => {
  describe("Initial render", () => {
    beforeEach(() => {
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={fixture.sections}
        />,
      );
    });

    it("renders the CoursePlanSelector", () => {
      expect(
        screen.getByTestId("mock-course-plan-selector"),
      ).toBeInTheDocument();
    });

    it("renders as many ReportSections as there are in the data", () => {
      const sections = screen.getAllByTestId("mock-report-section");
      expect(sections).toHaveLength(fixture.sections.length);
    });

    it("renders each ReportSection with the correct label", () => {
      const sections = screen.getAllByTestId("mock-report-section");
      sections.forEach((section, index) => {
        expect(section).toHaveTextContent(fixture.sections[index].label);
      });
    });
  });

  describe("Default props (empty values)", () => {
    it("renders without crashing when no props are provided", () => {
      render(<ProgressReport />);
      expect(
        screen.getByTestId("mock-course-plan-selector"),
      ).toBeInTheDocument();
    });

    it("renders no ReportSections when sections is empty", () => {
      render(<ProgressReport />);
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
    });
  });
});
