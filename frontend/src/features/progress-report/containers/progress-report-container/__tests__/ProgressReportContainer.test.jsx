import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgressReportContainer from "../ProgressReportContainer";
import {
  getCoursePlans,
  getCoursePlanSections,
} from "../../../../../services/api/course-plans";

// ProgressReportContainer owns the data flow: it fetches the course plans and
// their sections, then feeds the controlled <ProgressReport /> view. The
// service is mocked so each test drives the API responses, and the view mock
// surfaces the props it receives, so we can assert what the container computes
// without depending on the view's rendering. Loading is mocked like in the view
// tests; StateMessage is kept real, as it is plain markup.

// t() returns the key itself: assertions do not depend on the French copy.
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("../../../../../services/api/course-plans", () => ({
  getCoursePlans: jest.fn(),
  getCoursePlanSections: jest.fn(),
}));

jest.mock("../../../views/progress-report/ProgressReport", () => ({
  __esModule: true,
  default: ({
    coursePlans,
    selectedCoursePlan,
    onCoursePlanChange,
    sections,
    isSectionsLoading,
    hasSectionsError,
  }) => (
    <div data-testid="mock-progress-report">
      <span data-testid="pr-course-plan-ids">
        {coursePlans.map((cp) => cp.id).join(",")}
      </span>
      <span data-testid="pr-course-plan-id-types">
        {coursePlans.map((cp) => typeof cp.id).join(",")}
      </span>
      <span data-testid="pr-selected">{selectedCoursePlan?.id ?? "none"}</span>
      <span data-testid="pr-selected-label">{selectedCoursePlan?.label}</span>
      <span data-testid="pr-section-ids">
        {sections.map((section) => section.id).join(",")}
      </span>
      <span data-testid="pr-sections-loading">{String(isSectionsLoading)}</span>
      <span data-testid="pr-sections-error">{String(hasSectionsError)}</span>
      {/* Simulates the user picking the second formation in the selector */}
      <button data-testid="pr-change" onClick={() => onCoursePlanChange("2")}>
        change
      </button>
    </div>
  ),
}));

jest.mock("../../../../../components/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-loading" />,
}));

// Ids are numbers on purpose: the container must normalize them to strings.
const apiCoursePlans = [
  { id: 1, label: "Formation 1", startDate: "01.08.2025", status: "En cours" },
  { id: 2, label: "Formation 2", startDate: "01.08.2020", status: "Abandonnée" },
];
const sectionsOfPlan1 = [
  { id: "A", label: "A", doughnutChartData: [], reportLines: [] },
  { id: "B", label: "B", doughnutChartData: [], reportLines: [] },
];
const sectionsOfPlan2 = [
  { id: "H", label: "H", doughnutChartData: [], reportLines: [] },
];

// A promise the test settles by hand, to control when (and in which order)
// the API answers.
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

// Renders the container and waits until the view is shown (initial load done).
const renderLoaded = async () => {
  render(<ProgressReportContainer />);
  return screen.findByTestId("mock-progress-report");
};

// The view mock is rendered before the sections settle: findByTestId would
// resolve as soon as the element exists, so wait for its content instead.
const waitForText = (testId, text) =>
  waitFor(() => expect(screen.getByTestId(testId)).toHaveTextContent(text));

// --- Tests ---
describe("ProgressReportContainer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Verifies the blocking state shown while the course plans are loading.
  describe("Initial loading", () => {
    beforeEach(() => {
      // Never settles: the container stays in its initial loading state.
      getCoursePlans.mockReturnValue(new Promise(() => {}));
      render(<ProgressReportContainer />);
    });

    it("shows the loading indicator inside the status live region", () => {
      expect(screen.getByRole("status")).toContainElement(
        screen.getByTestId("mock-loading"),
      );
    });

    it("does not render the view while loading", () => {
      expect(
        screen.queryByTestId("mock-progress-report"),
      ).not.toBeInTheDocument();
    });

    it("keeps the alert region mounted and empty while loading", () => {
      expect(screen.getByRole("alert")).toBeEmptyDOMElement();
    });

    it("does not fetch any sections before a course plan is selected", () => {
      expect(getCoursePlanSections).not.toHaveBeenCalled();
    });
  });

  // Verifies the blocking error: without course plans, nothing can be shown.
  describe("Initial loading error", () => {
    let consoleErrorSpy;

    beforeEach(() => {
      // The container logs the cause: silence it, and assert it instead.
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("shows the loading error message inside the alert live region", async () => {
      getCoursePlans.mockRejectedValue(new Error("network"));
      render(<ProgressReportContainer />);

      const error = await screen.findByTestId("progress-report-error");
      expect(error).toHaveTextContent("loading_error");
      expect(screen.getByRole("alert")).toContainElement(error);
    });

    it("replaces the loading indicator and does not render the view", async () => {
      getCoursePlans.mockRejectedValue(new Error("network"));
      render(<ProgressReportContainer />);

      await screen.findByTestId("progress-report-error");
      expect(screen.queryByTestId("mock-loading")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("mock-progress-report"),
      ).not.toBeInTheDocument();
    });

    it("logs the cause of the failure", async () => {
      const cause = new Error("network");
      getCoursePlans.mockRejectedValue(cause);
      render(<ProgressReportContainer />);

      await screen.findByTestId("progress-report-error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String), cause);
    });

    it("keeps the same alert region when the loading ends on an error", async () => {
      const coursePlansRequest = deferred();
      getCoursePlans.mockReturnValue(coursePlansRequest.promise);
      render(<ProgressReportContainer />);
      const alertRegion = screen.getByRole("alert");

      await act(async () => {
        coursePlansRequest.reject(new Error("network"));
      });

      expect(screen.getByRole("alert")).toBe(alertRegion);
      expect(alertRegion).toHaveTextContent("loading_error");
    });

    // A malformed payload must be an explicit error, not a crash in .map().
    it.each([
      ["an object", { items: apiCoursePlans }],
      ["null", null],
    ])(
      "treats %s instead of a course plan list as a loading error",
      async (_, payload) => {
        getCoursePlans.mockResolvedValue(payload);
        render(<ProgressReportContainer />);

        await screen.findByTestId("progress-report-error");
        expect(getCoursePlanSections).not.toHaveBeenCalled();
      },
    );
  });

  // Verifies what the container hands to the view once the course plans are loaded.
  describe("Course plans loaded", () => {
    beforeEach(() => {
      getCoursePlans.mockResolvedValue(apiCoursePlans);
      getCoursePlanSections.mockResolvedValue(sectionsOfPlan1);
    });

    it("forwards the course plans with their ids normalized to strings", async () => {
      await renderLoaded();
      expect(screen.getByTestId("pr-course-plan-ids")).toHaveTextContent(
        "1,2",
      );
      expect(screen.getByTestId("pr-course-plan-id-types")).toHaveTextContent(
        "string,string",
      );
    });

    it("preselects the first course plan", async () => {
      await renderLoaded();
      expect(screen.getByTestId("pr-selected")).toHaveTextContent("1");
      expect(screen.getByTestId("pr-selected-label")).toHaveTextContent(
        "Formation 1",
      );
    });

    it("fetches the sections of the preselected course plan with a string id", async () => {
      await renderLoaded();
      expect(getCoursePlanSections).toHaveBeenCalledTimes(1);
      expect(getCoursePlanSections).toHaveBeenCalledWith("1");
    });

    it("forwards the loaded sections and clears the loading flag", async () => {
      await renderLoaded();
      await waitForText("pr-section-ids", "A,B");
      expect(screen.getByTestId("pr-sections-loading")).toHaveTextContent(
        "false",
      );
      expect(screen.getByTestId("pr-sections-error")).toHaveTextContent(
        "false",
      );
    });

    it("removes the blocking live regions once the view is shown", async () => {
      await renderLoaded();
      expect(
        screen.queryByTestId("progress-report-status"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("progress-report-alert"),
      ).not.toBeInTheDocument();
    });
  });

  // Verifies the case of an apprentice who follows no formation at all.
  describe("No course plan", () => {
    beforeEach(() => {
      getCoursePlans.mockResolvedValue([]);
    });

    it("renders the view without any selection", async () => {
      await renderLoaded();
      expect(screen.getByTestId("pr-course-plan-ids")).toBeEmptyDOMElement();
      expect(screen.getByTestId("pr-selected")).toHaveTextContent("none");
    });

    it("does not fetch any sections", async () => {
      await renderLoaded();
      expect(getCoursePlanSections).not.toHaveBeenCalled();
      expect(screen.getByTestId("pr-sections-loading")).toHaveTextContent(
        "false",
      );
    });
  });

  // Verifies the non-blocking error: only the sections failed, the view stays.
  describe("Sections loading error", () => {
    let consoleErrorSpy;

    beforeEach(() => {
      getCoursePlans.mockResolvedValue(apiCoursePlans);
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("flags the sections error and keeps the view rendered", async () => {
      getCoursePlanSections.mockRejectedValue(new Error("network"));
      await renderLoaded();

      await waitForText("pr-sections-error", "true");
      expect(screen.getByTestId("pr-sections-loading")).toHaveTextContent(
        "false",
      );
      expect(screen.getByTestId("pr-section-ids")).toBeEmptyDOMElement();
      expect(
        screen.queryByTestId("progress-report-error"),
      ).not.toBeInTheDocument();
    });

    it("logs the cause of the failure", async () => {
      const cause = new Error("network");
      getCoursePlanSections.mockRejectedValue(cause);
      await renderLoaded();

      await waitForText("pr-sections-error", "true");
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String), cause);
    });

    // Without the check, the view would read it as "no section" and show
    // a misleading empty state.
    it.each([
      ["an object", { sections: sectionsOfPlan1 }],
      ["null", null],
    ])(
      "treats %s instead of a section list as a sections error",
      async (_, payload) => {
        getCoursePlanSections.mockResolvedValue(payload);
        await renderLoaded();

        await waitForText("pr-sections-error", "true");
        expect(screen.getByTestId("pr-section-ids")).toBeEmptyDOMElement();
      },
    );

    it("clears the sections error when another course plan loads successfully", async () => {
      getCoursePlanSections
        .mockRejectedValueOnce(new Error("network"))
        .mockResolvedValueOnce(sectionsOfPlan2);
      await renderLoaded();
      await waitForText("pr-sections-error", "true");

      await userEvent.click(screen.getByTestId("pr-change"));

      await waitForText("pr-section-ids", "H");
      expect(screen.getByTestId("pr-sections-error")).toHaveTextContent(
        "false",
      );
    });
  });

  // Verifies the reload of the sections when the user picks another formation.
  describe("Course plan change", () => {
    beforeEach(() => {
      getCoursePlans.mockResolvedValue(apiCoursePlans);
    });

    it("selects the picked course plan and reloads its sections", async () => {
      getCoursePlanSections
        .mockResolvedValueOnce(sectionsOfPlan1)
        .mockResolvedValueOnce(sectionsOfPlan2);
      await renderLoaded();
      await waitForText("pr-section-ids", "A,B");

      await userEvent.click(screen.getByTestId("pr-change"));

      expect(screen.getByTestId("pr-selected")).toHaveTextContent("2");
      expect(getCoursePlanSections).toHaveBeenLastCalledWith("2");
      await waitForText("pr-section-ids", "H");
    });

    // The previous formation's competencies must never show under the new one.
    it("drops the previous sections and flags the loading while reloading", async () => {
      const plan2Request = deferred();
      getCoursePlanSections
        .mockResolvedValueOnce(sectionsOfPlan1)
        .mockReturnValueOnce(plan2Request.promise);
      await renderLoaded();
      await waitForText("pr-section-ids", "A,B");

      await userEvent.click(screen.getByTestId("pr-change"));

      expect(screen.getByTestId("pr-section-ids")).toBeEmptyDOMElement();
      expect(screen.getByTestId("pr-sections-loading")).toHaveTextContent(
        "true",
      );

      await act(async () => {
        plan2Request.resolve(sectionsOfPlan2);
      });

      expect(screen.getByTestId("pr-section-ids")).toHaveTextContent("H");
      expect(screen.getByTestId("pr-sections-loading")).toHaveTextContent(
        "false",
      );
    });
  });

  // Verifies the `ignore` safeguard: a response for a formation that is no
  // longer selected must be dropped, whatever order the API answers in.
  describe("Out-of-order responses", () => {
    let plan1Request;
    let plan2Request;

    beforeEach(async () => {
      plan1Request = deferred();
      plan2Request = deferred();
      getCoursePlans.mockResolvedValue(apiCoursePlans);
      getCoursePlanSections.mockImplementation((id) =>
        id === "1" ? plan1Request.promise : plan2Request.promise,
      );

      // Plan 1 is still loading when the user switches to plan 2.
      await renderLoaded();
      await userEvent.click(screen.getByTestId("pr-change"));
    });

    it("ignores the sections of the previous course plan answered last", async () => {
      await act(async () => {
        plan2Request.resolve(sectionsOfPlan2);
      });
      await act(async () => {
        plan1Request.resolve(sectionsOfPlan1);
      });

      expect(screen.getByTestId("pr-selected")).toHaveTextContent("2");
      expect(screen.getByTestId("pr-section-ids")).toHaveTextContent("H");
    });

    it("ignores a late failure of the previous course plan", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await act(async () => {
        plan2Request.resolve(sectionsOfPlan2);
      });
      await act(async () => {
        plan1Request.reject(new Error("network"));
      });

      expect(screen.getByTestId("pr-sections-error")).toHaveTextContent(
        "false",
      );
      expect(screen.getByTestId("pr-section-ids")).toHaveTextContent("H");
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
