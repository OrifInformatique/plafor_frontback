import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgressReport from "../ProgressReport";
import fixture from "../__fixtures__/progress-report-data.json";
import badData from "../__fixtures__/bad-data.json";

// ProgressReport is a controlled view: it forwards props to its children and
// decides what the sections area shows (loading, error, empty state or data).
// CoursePlanSelector, ReportSection and Loading are mocked, and the mocks
// surface the props they receive, so we can assert the wiring without depending
// on the children's real implementation. StateMessage is kept real: it is plain
// markup, and the assertions on the live regions check the text it renders.

// t() returns the key itself: assertions do not depend on the French copy,
// and no i18next instance is needed (no NO_I18NEXT_INSTANCE warning).
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

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

// Renders the view with a complete, valid data set; each test overrides
// only the props it is about.
const renderWithFixture = (props = {}) =>
  render(
    <ProgressReport
      coursePlans={fixture.coursePlans}
      selectedCoursePlan={fixture.selectedCoursePlan}
      sections={fixture.sections}
      {...props}
    />,
  );

// --- Tests ---
describe("ProgressReport", () => {
  // Verifies that the view renders its core structure and forwards the data.
  describe("Initial render", () => {
    beforeEach(() => {
      renderWithFixture();
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

    it("renders the page title heading", () => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "title",
      );
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

  // Verifies that a change reported by the selector reaches the parent callback.
  describe("Interaction", () => {
    it("calls onCoursePlanChange when the selector reports a change", async () => {
      const onCoursePlanChange = jest.fn();
      renderWithFixture({ onCoursePlanChange });

      await userEvent.click(screen.getByTestId("cps-change"));

      expect(onCoursePlanChange).toHaveBeenCalledTimes(1);
      expect(onCoursePlanChange).toHaveBeenCalledWith("2");
    });
  });

  // Verifies the sections area while sections are being (re)loaded.
  describe("Sections loading state", () => {
    beforeEach(() => {
      renderWithFixture({ isSectionsLoading: true });
    });

    it("shows the loading indicator", () => {
      expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
    });

    it("shows the loading indicator inside the status live region", () => {
      expect(screen.getByRole("status")).toContainElement(
        screen.getByTestId("mock-loading"),
      );
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

  // Verifies the non-blocking error shown when sections failed to load.
  describe("Sections error state", () => {
    it("shows the sections error message", () => {
      renderWithFixture({ hasSectionsError: true });
      expect(
        screen.getByTestId("progress-report-sections-error"),
      ).toHaveTextContent("sections_error");
    });

    it("exposes the error message as an alert for assistive technologies", () => {
      renderWithFixture({ hasSectionsError: true });
      expect(screen.getByRole("alert")).toHaveTextContent("sections_error");
    });

    it("does not render the ReportSections on error", () => {
      renderWithFixture({ hasSectionsError: true });
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
    });

    it("keeps the CoursePlanSelector rendered on error", () => {
      renderWithFixture({ hasSectionsError: true });
      expect(
        screen.getByTestId("mock-course-plan-selector"),
      ).toBeInTheDocument();
    });

    // A retry after a failure sets both flags: the loading must win.
    it("gives priority to the loading state over the error state", () => {
      renderWithFixture({ isSectionsLoading: true, hasSectionsError: true });
      expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-error"),
      ).not.toBeInTheDocument();
    });
  });

  // Verifies the message shown when the selected formation has no competency.
  describe("Sections empty state", () => {
    it("shows the empty state message when the selected formation has no sections", () => {
      renderWithFixture({ sections: [] });
      expect(
        screen.getByTestId("progress-report-sections-empty"),
      ).toHaveTextContent("sections_empty");
    });

    it("exposes the empty state message as a status for assistive technologies", () => {
      renderWithFixture({ sections: [] });
      expect(screen.getByRole("status")).toHaveTextContent("sections_empty");
    });

    it("renders no ReportSections in the empty state", () => {
      renderWithFixture({ sections: [] });
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
    });

    it("does not show the empty state when no formation is selected", () => {
      renderWithFixture({ selectedCoursePlan: null, sections: [] });
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });

    // Sections are also [] while (re)loading: the empty state must not flash.
    it("gives priority to the loading state over the empty state", () => {
      renderWithFixture({ sections: [], isSectionsLoading: true });
      expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });

    // Sections are also [] after a failed load: the error must win.
    it("gives priority to the error state over the empty state", () => {
      renderWithFixture({ sections: [], hasSectionsError: true });
      expect(
        screen.getByTestId("progress-report-sections-error"),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });
  });

  // Verifies that the live regions exist before any message is shown:
  // screen readers only reliably announce changes inside an existing region.
  describe("Live regions", () => {
    it("keeps the status and alert regions mounted when there is no message", () => {
      renderWithFixture();
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
      expect(screen.getByRole("alert")).toBeEmptyDOMElement();
    });

    it("keeps the same status region when the loading ends on an empty formation", () => {
      const { rerender } = renderWithFixture({
        sections: [],
        isSectionsLoading: true,
      });
      const statusRegion = screen.getByRole("status");

      rerender(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={[]}
        />,
      );

      expect(screen.getByRole("status")).toBe(statusRegion);
      expect(statusRegion).toHaveTextContent("sections_empty");
    });

    it("keeps the same alert region when the loading ends on an error", () => {
      const { rerender } = renderWithFixture({ isSectionsLoading: true });
      const alertRegion = screen.getByRole("alert");

      rerender(
        <ProgressReport
          coursePlans={fixture.coursePlans}
          selectedCoursePlan={fixture.selectedCoursePlan}
          sections={[]}
          hasSectionsError
        />,
      );

      expect(screen.getByRole("alert")).toBe(alertRegion);
      expect(alertRegion).toHaveTextContent("sections_error");
    });
  });

  // Verifies that the view handles missing or empty props gracefully.
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

  // Verifies that unusual but valid data does not break the view.
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

    // Default values only cover undefined: a null payload from the API must
    // fall back to the empty state instead of crashing.
    it("treats null sections as an empty list", () => {
      renderWithFixture({ sections: null });
      expect(screen.queryAllByTestId("mock-report-section")).toHaveLength(0);
      expect(
        screen.getByTestId("progress-report-sections-empty"),
      ).toBeInTheDocument();
    });

    // An apprentice may follow no formation at all: nothing is selected,
    // so no "no competency for this formation" message either.
    it("renders the selector without any message when there is no course plan", () => {
      render(
        <ProgressReport
          coursePlans={badData.emptyCoursePlans}
          selectedCoursePlan={null}
          sections={[]}
        />,
      );
      expect(screen.getByTestId("cps-count")).toHaveTextContent("0");
      expect(
        screen.queryByTestId("progress-report-sections-empty"),
      ).not.toBeInTheDocument();
    });
  });
});
