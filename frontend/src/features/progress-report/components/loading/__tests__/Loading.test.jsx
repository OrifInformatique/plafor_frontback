import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../Loading";

// t() returns the key itself: assertions do not depend on the French copy,
// and no i18next instance is needed (no NO_I18NEXT_INSTANCE warning).
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// --- Tests ---
describe("Loading", () => {
  // Verifies that the translated text and the spinner are rendered.
  describe("Initial render", () => {
    it("displays the translated loading text", () => {
      render(<Loading />);
      expect(screen.getByText("loading")).toBeInTheDocument();
    });

    it("applies the test id to the wrapper", () => {
      render(<Loading />);
      expect(screen.getByTestId("loading")).toHaveTextContent("loading");
    });
  });

  // Verifies the accessibility choices: only the text is announced, and the
  // component never creates a live region of its own (its parents already
  // wrap it in a role="status" region).
  describe("Accessibility", () => {
    it("hides the spinner from assistive technologies", () => {
      const { container } = render(<Loading />);
      const spinner = container.querySelector('[aria-hidden="true"]');

      expect(spinner).toBeInTheDocument();
      // The text must stay outside the hidden element, or nothing is announced.
      expect(spinner).not.toContainElement(screen.getByText("loading"));
    });

    it("does not declare its own live region", () => {
      render(<Loading />);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
