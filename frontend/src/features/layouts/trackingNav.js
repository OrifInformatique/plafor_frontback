// Tracking roles: the vocabulary of the tracking pages.
export const TRACKING_ROLES = Object.freeze({
  TRAINER: "TRAINER",
  APPRENTICE: "APPRENTICE",
});

// Backend main roles (MainRoleEnum) -> tracking role.
// Agreed mapping: USER = apprentice, MANAGER and ADMIN = trainer.
const MAIN_ROLE_TO_TRACKING_ROLE = Object.freeze({
  USER: TRACKING_ROLES.APPRENTICE,
  MANAGER: TRACKING_ROLES.TRAINER,
  ADMIN: TRACKING_ROLES.TRAINER,
});

/**
 * Single place that turns a backend main role into a tracking role.
 * Unknown or missing role -> null (callers must fall back to the least
 * privileged view, never to the trainer one).
 */
export function getTrackingRole(mainRole) {
  return MAIN_ROLE_TO_TRACKING_ROLE[mainRole] ?? null;
}

/**
 * Links of the tracking NavBar for a given role.
 * Paths are relative: they resolve against the TrackingLayout route,
 * so the shell does not need to know where it is mounted.
 */
export function getTrackingNavItems(role, t) {
  const items = [{ to: "competences", label: t("nav_competences") }];
  // Add role-specific links here, e.g.:
  // if (role === TRACKING_ROLES.TRAINER) items.push({ to: "apprentices", label: t("nav_apprentices") });
  return items;
}
