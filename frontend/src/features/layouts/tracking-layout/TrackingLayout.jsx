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
    <div className="bg-primary px-4 pt-4 sm:px-10">
      <NavBar
        links={links}
        ariaLabel={t("nav_label")}
        menuButtonLabel={t("nav_menu")}
        burgerPosition="left"
        linksAlign="center"
        className="mx-auto rounded-xl bg-white px-6 py-2"
        linkClassName="text-sm text-black"
        activeLinkClassName="font-semibold text-primary"
      />
      <div className="mt-6 rounded-t-2xl bg-white p-6 sm:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default TrackingLayout;
