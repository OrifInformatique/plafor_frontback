import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Header,
         Footer,
         ScrollToTopButton
       } from "@orif-informatique/react-components-library";
import useLayoutAuth from "../hooks/useLayoutAuth";

const MainLayout = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { effectiveUser, remountKey, handleLogout } = useLayoutAuth();


  return (
    <>
      <Header
        key={`header-${remountKey}`}
        title={t("app_title")}
        logoPath="/images/logo.svg"
        onLogin={() => navigate('/login')}
        onLogout={handleLogout}
        user={effectiveUser ? { name: effectiveUser?.firstName || "", role: effectiveUser?.mainRole || "user" } : null}
      />
      <main className="p-5 sm:p-10 bg-background">
        <Outlet key={`outlet-${remountKey}`} />
      </main>
      <ScrollToTopButton onClick={() => {}} />
      <Footer />
    </>
  );
}

export default MainLayout;
