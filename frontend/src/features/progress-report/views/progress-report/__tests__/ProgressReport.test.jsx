import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgressReport from "../ProgressReport";
import fixture from "../__fixtures__/progress-report-data.json";
import badData from "../__fixtures__/bad-data.json";

// ProgressReport is a controlled, presentational orchestrator: its only job is
// to forward props to its children. We therefore mock both children and have
// the mocks surface the props they receive, so we can assert the wiring without
// depending on the children's real implementation.

jest.mock(
  "../../../components/course-plan-selector/CoursePlanSelector",
  () => ({
    __esModule: true,
    default: ({ coursePlans, selectedCoursePlan, onCoursePlanChange }) => (
      <div data-testid="mock-course-plan-selector">
        <span data-testid="cps-count">{coursePlans.length}</span>
        <span data-testid="cps-selected">
          {selectedCoursePlan?.id ?? "none"}
        </span>
        {/* Lets us assert the callback is forwarded and invoked by the child */}
        <button
          data-testid="cps-change"
          onClick={() => onCoursePlanChange("2")}
        >
          change
        </button>
      </div>
    ),
  }),
);

jest.mock("../../../components/report-section/ReportSection", () => ({
  __esModule: true,
  default: ({ label, doughnutChartData, reportLines }) => (
    <div
      data-testid="mock-report-section"
      data-doughnut-count={doughnutChartData?.length ?? 0}
      data-lines-count={reportLines?.length ?? 0}
    >
      {label}
    </div>
  ),
}));

jest.mock("../../../../../components/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-loading" />,
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

    it("forwards the full course plan list to the CoursePlanSelector", () => {
      expect(screen.getByTestId("cps-count")).toHaveTextContent(
        String(fixture.coursePlans.length),
      );
    });

    it("forwards the selected course plan to the CoursePlanSelector", () => {
      expect(screen.getByTestId("cps-selected")).toHaveTextContent(
        fixture.selectedCoursePlan.id,
      );
    });

    it("renders the section title heading", () => {
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("renders as many ReportSections as there are in the data", () => {
      const sections = screen.getAllByTestId("mock-report-section");
      expect(sections).toHaveLength(fixture.sections.length);
    });

    it("renders the ReportSections in the same order as the data", () => {
      const sections = screen.getAllByTestId("mock-report-section");
      sections.forEach((section, index) => {
        expect(section).toHaveTextContent(fixture.sections[index].label);
      });
    });

    it("forwards doughnutChartData and reportLines to each ReportSection", () => {
      const sections = screen.getAllByTestId("mock-report-section");
      sections.forEach((section, index) => {
        const data = fixture.sections[index];
        expect(section).toHaveAttribute(
          "data-doughnut-count",
          String(data.doughnutChartData.length),
        );
        expect(section).toHaveAttribute(
          "data-lines-count",
          String(data.reportLines.length),
        );
      });
    });
  });

  describe("Interaction", () => {
    it("calls onCoursePlanChange when the selector reports a change", async () => {
      const onCoursePlanChange = jest.fn();
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          onCoursePlanChange={onCoursePlanChange}
          sections={fixture.sections}
        />,
      );

      await userEvent.click(screen.getByTestId("cps-change"));

      expect(onCoursePlanChange).toHaveBeenCalledTimes(1);
      expect(onCoursePlanChange).toHaveBeenCalledWith("2");
    });
  });

  describe("Sections loading state", () => {
    beforeEach(() => {
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={fixture.sections}
          isSectionsLoading
        />,
      );
    });

    it("shows the loading indicator", () => {
      expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
    });

    it("does not render the ReportSections while loading", () => {
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
    });

    it("keeps the CoursePlanSelector rendered while loading", () => {
      expect(
        screen.getByTestId("mock-course-plan-selector"),
      ).toBeInTheDocument();
    });
  });

  describe("Default props (empty values)", () => {
    it("renders without crashing when no props are provided", () => {
      render(<ProgressReport />);
      expect(
        screen.getByTestId("mock-course-plan-selector"),
      ).toBeInTheDocument();
    });

    it("forwards an empty course plan list and no selection by default", () => {
      render(<ProgressReport />);
      expect(screen.getByTestId("cps-count")).toHaveTextContent("0");
      expect(screen.getByTestId("cps-selected")).toHaveTextContent("none");
    });

    it("renders no ReportSections when sections is empty", () => {
      render(<ProgressReport />);
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
    });

    it("shows neither the loading indicator, the error nor the empty state by default", () => {
      render(<ProgressReport />);
      expect(screen.queryByTestId("mock-loading")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-error"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("renders a single section", () => {
      render(<ProgressReport sections={badData.singleSection} />);
      expect(screen.getAllByTestId("mock-report-section")).toHaveLength(1);
    });

    it("renders sections that omit optional fields without crashing", () => {
      render(<ProgressReport sections={badData.sectionsWithMissingFields} />);
      expect(screen.getAllByTestId("mock-report-section")).toHaveLength(
        badData.sectionsWithMissingFields.length,
      );
    });

    it("renders a section whose id is numeric (valid React key)", () => {
      render(<ProgressReport sections={badData.sectionWithNumericId} />);
      expect(screen.getByTestId("mock-report-section")).toHaveTextContent(
        badData.sectionWithNumericId[0].label,
      );
    });

    it("gives priority to the loading state over the error state", () => {
      render(<ProgressReport isSectionsLoading hasSectionsError />);
      expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-error"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Sections error state", () => {
    beforeEach(() => {
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={fixture.sections}
          hasSectionsError
        />,
      );
    });

    it("shows the sections error message", () => {
      expect(
        screen.getByTestId("progress-report-sections-error"),
      ).toHaveTextContent("sections_error");
    });

    it("does not render the ReportSections on error", () => {
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
    });

    it("keeps the CoursePlanSelector rendered on error", () => {
      expect(
        screen.getByTestId("mock-course-plan-selector"),
      ).toBeInTheDocument();
    });
  });

  describe("Sections empty state", () => {
    it("shows the empty state message when the selected formation has no sections", () => {
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={[]}
        />,
      );
      expect(
        screen.getByTestId("progress-report-sections-empty"),
      ).toHaveTextContent("sections_empty");
    });

    it("renders no ReportSections in the empty state", () => {
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={[]}
        />,
      );
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
    });

    it("does not show the empty state when no formation is selected", () => {
      render(<ProgressReport coursePlans={fixture.coursePlans} sections={[]} />);
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });

    // Sections are also [] while (re)loading: the empty state must not flash.
    it("gives priority to the loading state over the empty state", () => {
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={[]}
          isSectionsLoading
        />,
      );
      expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });

    // Sections are also [] after a failed load: the error must win.
    it("gives priority to the error state over the empty state", () => {
      render(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={[]}
          hasSectionsError
        />,
      );
      expect(
        screen.getByTestId("progress-report-sections-error"),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });
  });
});
