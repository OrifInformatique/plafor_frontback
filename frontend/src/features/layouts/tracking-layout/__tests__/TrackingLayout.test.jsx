import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TrackingLayout from "../TrackingLayout";
import { TRACKING_ROLES, getTrackingNavItems } from "../trackingNav";
import useAuthStore from "../../../../template/auth/authStore";

// TrackingLayout only wires things together: it reads the main role in the
// auth store, turns it into links through trackingNav, hands them to the
// NavBar and renders the child page in its <Outlet />. The business rules
// themselves are covered by trackingNav.test.js, so here we check the wiring.
// The real auth store is used (driven with setState) to prove the shell
// re-renders when the role changes.

// t() returns the key itself: assertions do not depend on the French copy.
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// NavBar is replaced by plain markup to avoid depending on the external
// library in unit tests. The mock exposes the props it receives.
jest.mock("@orif-informatique/react-components-library", () => ({
  __esModule: true,
  NavBar: ({ links, ariaLabel, menuButtonLabel }) => (
    <nav aria-label={ariaLabel} data-menu-button-label={menuButtonLabel}>
      <ul>
        {links.map((link) => (
          <li key={link.to} data-to={link.to}>
            {link.label}
          </li>
        ))}
      </ul>
    </nav>
  ),
}));

// Keep the real trackingNav, but spy on getTrackingNavItems to see which
// tracking role the shell computed.
jest.mock("../trackingNav", () => {
  const actual = jest.requireActual("../trackingNav");
  return {
    ...actual,
    getTrackingNavItems: jest.fn(actual.getTrackingNavItems),
  };
});

const setMainRole = (mainRole) =>
  useAuthStore.setState({ user: mainRole ? { mainRole } : null });

// Same nesting as in index.js: TrackingLayout is a pathless layout route.
const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={["/competences"]}>
      <Routes>
        <Route element={<TrackingLayout />}>
          <Route
            path="competences"
            element={<div data-testid="child-page" />}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe("TrackingLayout", () => {
  beforeEach(() => {
    getTrackingNavItems.mockClear();
    setMainRole("USER");
  });

  afterAll(() => {
    // The store is persisted: do not leak a user into other test files.
    useAuthStore.setState({ user: null });
    localStorage.clear();
  });

  it("renders the child route in its outlet", () => {
    renderLayout();

    expect(screen.getByTestId("child-page")).toBeInTheDocument();
  });

  it("labels the navigation with translated texts", () => {
    renderLayout();

    const nav = screen.getByRole("navigation", { name: "nav_label" });
    expect(nav).toHaveAttribute("data-menu-button-label", "nav_menu");
  });

  it("passes the links built by trackingNav to the NavBar", () => {
    renderLayout();

    expect(screen.getByText("nav_competences")).toHaveAttribute(
      "data-to",
      "competences",
    );
  });

  it.each([
    ["USER", TRACKING_ROLES.APPRENTICE],
    ["ADMIN", TRACKING_ROLES.TRAINER],
    [null, null],
  ])(
    "builds the links for the main role %p as the tracking role %p",
    (mainRole, expected) => {
      setMainRole(mainRole);

      renderLayout();

      expect(getTrackingNavItems).toHaveBeenLastCalledWith(
        expected,
        expect.any(Function),
      );
    },
  );

  // Guards the store subscription: selecting `hasRole` (a stable function)
  // instead of the role itself would leave the menu stale after a login.
  it("rebuilds the links when the role changes in the store", () => {
    renderLayout();
    expect(getTrackingNavItems).toHaveBeenLastCalledWith(
      TRACKING_ROLES.APPRENTICE,
      expect.any(Function),
    );

    act(() => setMainRole("MANAGER"));

    expect(getTrackingNavItems).toHaveBeenLastCalledWith(
      TRACKING_ROLES.TRAINER,
      expect.any(Function),
    );
  });
});
