import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoursePlanSelector from "../CoursePlanSelector";
import coursePlanData from "../__fixtures__/course-plan-data.json";
import badData from "../__fixtures__/bad-data.json";

// SingleSelect is replaced by a plain <select> to avoid depending on the
// external library in unit tests. The mock exposes the same props so we
// can verify they are wired correctly.
jest.mock("@orif-informatique/react-components-library", () => ({
  __esModule: true,
  SingleSelect: ({ options, selectedValue, onChangeFunction }) => (
    <select
      data-testid="mock-single-select"
      value={selectedValue ?? ""}
      onChange={(e) => onChangeFunction(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

const mockOnChange = jest.fn();

// --- Tests ---
describe("CoursePlanSelector", () => {
  // Reset the mock between tests to avoid call count bleeding across groups.
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Verifies that the component renders its core structure correctly.
  describe("Initial render", () => {
    beforeEach(() => {
      render(
        <CoursePlanSelector
          coursePlans={coursePlanData.coursePlans}
          selectedCoursePlan={coursePlanData.selectedCoursePlan}
          onCoursePlanChange={mockOnChange}
        />,
      );
    });

    it("renders the SingleSelect", () => {
      expect(screen.getByTestId("mock-single-select")).toBeInTheDocument();
    });

    it("renders the correct number of options in the SingleSelect", () => {
      expect(screen.getAllByRole("option")).toHaveLength(
        coursePlanData.coursePlans.length,
      );
    });
  });

  // Verifies that the selected formation's details are displayed.
  describe("Selected course plan", () => {
    beforeEach(() => {
      render(
        <CoursePlanSelector
          coursePlans={coursePlanData.coursePlans}
          selectedCoursePlan={coursePlanData.selectedCoursePlanFilled}
          onCoursePlanChange={mockOnChange}
        />,
      );
    });

    it("displays the start date", () => {
      expect(
        screen.getByText(coursePlanData.selectedCoursePlanFilled.startDate),
      ).toBeInTheDocument();
    });

    it("displays the end date", () => {
      expect(
        screen.getByText(coursePlanData.selectedCoursePlanFilled.endDate),
      ).toBeInTheDocument();
    });

    it("displays the status", () => {
      expect(
        screen.getByText(coursePlanData.selectedCoursePlanFilled.status),
      ).toBeInTheDocument();
    });
  });

  // Verifies that changing the selection calls the parent callback.
  describe("Interaction", () => {
    beforeEach(() => {
      render(
        <CoursePlanSelector
          coursePlans={coursePlanData.coursePlans}
          selectedCoursePlan={coursePlanData.selectedCoursePlanFilled}
          onCoursePlanChange={mockOnChange}
        />,
      );
    });

    it("calls onCoursePlanChange with the selected id", async () => {
      await userEvent.selectOptions(
        screen.getByTestId("mock-single-select"),
        coursePlanData.coursePlans[0].id,
      );
      expect(mockOnChange).toHaveBeenCalledWith(
        coursePlanData.coursePlans[0].id,
      );
    });
  });

  // Verifies that the component handles missing or empty props gracefully.
  describe("Default props", () => {
    it("renders without crashing when no props are provided", () => {
      render(<CoursePlanSelector />);
      expect(screen.getByTestId("mock-single-select")).toBeInTheDocument();
    });

    it("displays no formation info when selectedCoursePlan is null", () => {
      render(
        <CoursePlanSelector
          coursePlans={badData.emptyCoursePlans}
          selectedCoursePlan={null}
          onCoursePlanChange={mockOnChange}
        />,
      );
      expect(screen.queryByText(coursePlanData.selectedCoursePlanFilled.startDate)).not.toBeInTheDocument();
      expect(screen.queryByText(coursePlanData.selectedCoursePlanFilled.endDate)).not.toBeInTheDocument();
      expect(screen.queryByText(coursePlanData.selectedCoursePlanFilled.status)).not.toBeInTheDocument();
    });
  });
});
