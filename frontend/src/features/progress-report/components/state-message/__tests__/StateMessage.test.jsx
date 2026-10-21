import React from "react";
import { render, screen } from "@testing-library/react";
import StateMessage from "../StateMessage";

// --- Tests ---
describe("StateMessage", () => {
  // Verifies that the message and its test id are rendered.
  describe("Initial render", () => {
    beforeEach(() => {
      render(
        <StateMessage
          message="Aucune compétence n'est encore définie pour cette formation."
          testId="state-message"
        />,
      );
    });

    it("displays the message", () => {
      expect(
        screen.getByText(
          "Aucune compétence n'est encore définie pour cette formation.",
        ),
      ).toBeInTheDocument();
    });

    it("applies the given test id to the wrapper", () => {
      expect(screen.getByTestId("state-message")).toHaveTextContent(
        "Aucune compétence n'est encore définie pour cette formation.",
      );
    });
  });

  // Verifies that the component handles missing props gracefully.
  describe("Default props (empty values)", () => {
    it("renders an empty message without crashing when no props are provided", () => {
      const { container } = render(<StateMessage />);
      expect(container.querySelector("strong")).toBeEmptyDOMElement();
    });
  });
});
