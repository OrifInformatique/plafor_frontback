import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from './authStore';


const RequireRole = ({ role, children }) => {
  const { t } = useTranslation('auth');
  const user = useAuthStore((s) => s.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If a role does not match the specified role, redirect to the home page and put a snackbar message

    if (role && user.mainRole !== role) {
        return (
            <Navigate to="/" replace state={{ 
                snackbar: {
                    message: t("access_denied"),
                    type: "error",
                    autoHideDuration: 3000,
                } 
            }}
        />);
    }

    return children || <Outlet />;
};

export default RequireRole;