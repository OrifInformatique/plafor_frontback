import {
  TRACKING_ROLES,
  getTrackingNavItems,
  getTrackingRole,
} from "../trackingNav";

// trackingNav holds the business rules of the tracking shell as pure
// functions: no React, no store, so they are tested by plain calls.

// t() returns the key itself: assertions do not depend on the French copy.
const t = (key) => key;

describe("getTrackingRole", () => {
  // Agreed mapping: USER = apprentice, MANAGER and ADMIN = trainer.
  // The ADMIN case matters most: an admin must be treated as a trainer.
  it.each([
    ["USER", TRACKING_ROLES.APPRENTICE],
    ["MANAGER", TRACKING_ROLES.TRAINER],
    ["ADMIN", TRACKING_ROLES.TRAINER],
  ])("maps the main role %s to %s", (mainRole, expected) => {
    expect(getTrackingRole(mainRole)).toBe(expected);
  });

  // An unknown or missing role must never be promoted to trainer: it gets
  // null, so callers fall back to the least privileged view.
  it.each([undefined, null, "", "UNKNOWN", "admin"])(
    "returns null for the unknown main role %p",
    (mainRole) => {
      expect(getTrackingRole(mainRole)).toBeNull();
    },
  );
});

describe("getTrackingNavItems", () => {
  it.each([TRACKING_ROLES.APPRENTICE, TRACKING_ROLES.TRAINER, null])(
    "gives the competences link to the role %p",
    (role) => {
      expect(getTrackingNavItems(role, t)).toContainEqual({
        to: "competences",
        label: "nav_competences",
      });
    },
  );

  it("translates the labels through the given t()", () => {
    const translate = jest.fn((key) => `translated:${key}`);

    const items = getTrackingNavItems(TRACKING_ROLES.APPRENTICE, translate);

    expect(translate).toHaveBeenCalledWith("nav_competences");
    items.forEach((item) => expect(item.label).toMatch(/^translated:/));
  });

  // Relative paths keep the shell independent from where it is mounted
  // (e.g. "/competences" today, "/suivi/competences" tomorrow).
  it.each([TRACKING_ROLES.APPRENTICE, TRACKING_ROLES.TRAINER, null])(
    "only uses relative paths for the role %p",
    (role) => {
      getTrackingNavItems(role, t).forEach((item) =>
        expect(item.to).not.toMatch(/^\//),
      );
    },
  );
});
