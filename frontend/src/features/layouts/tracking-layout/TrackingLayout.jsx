import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavBar } from "@orif-informatique/react-components-library";

import useAuthStore from "../../../template/auth/authStore";
import { getTrackingNavItems, getTrackingRole } from "./trackingNav";

/**
 * Shell shared by the tracking pages (competences, grades...).
 * Owns navigation and role only; each page's data stays in its container.
 */
const TrackingLayout = () => {
  const { t } = useTranslation("tracking");
  // Select the primitive: the shell re-renders only when the role changes.
  const mainRole = useAuthStore((s) => s.user?.mainRole);
  const links = getTrackingNavItems(getTrackingRole(mainRole), t);

  return (
    <>
      <NavBar
        links={links}
        ariaLabel={t("nav_label")}
        menuButtonLabel={t("nav_menu")}
        linksAlign="start"
      />
      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
};

export default TrackingLayout;
