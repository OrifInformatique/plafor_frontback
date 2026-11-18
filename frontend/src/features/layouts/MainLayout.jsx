import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Header,
         Footer,
         ScrollToTopButton,
         SnackBar
       } from "@orif-informatique/react-components-library";
import useLayoutAuth from "../../template/auth/useLayoutAuth";

const MainLayout = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const { effectiveUser, remountKey, handleLogout } = useLayoutAuth();
  const snackbar = location.state?.snackbar;


  return (
    <>
      {snackbar && (
        <SnackBar
          message={snackbar.message}
          type={snackbar.type}
          autoHideDuration={snackbar.autoHideDuration}
        />
      )}
      <Header
        key={`header-${remountKey}`}
        title={t("app_title")}
        logoPath="/images/logo.svg"
        onLogin={() => navigate('/login')}
        onLogout={handleLogout}
        administrationPath="/admin/users"
        administrationLabel={t("admin")}
        showAdminMenu={effectiveUser?.mainRole === "ADMIN"}
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
