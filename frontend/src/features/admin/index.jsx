import React from 'react';
import { useTranslation } from 'react-i18next';
import RequireRole from '../../template/auth/requireRole';
import { NavBar, Title } from '@orif-informatique/react-components-library';
import { Outlet } from 'react-router-dom';

const Admin = () => {
    const { t } = useTranslation("admin", "common");

    return (
        <RequireRole role="ADMIN">
                <Title>{t("admin_title")}</Title>
                <NavBar
                    links={[
                        { label: t("users"), to: "/admin/users" },
                        // You can add more links here for other admin pages, add them in the routes inside index.js in the admin route
                    ]}
                    activeLinkClassName="border-b-2 border-primary text-primary"
                    linksAlign="start"
                    className="w-full"
                    listClassName="mb-4"
                    burgerPosition="left"
                />
                <Outlet />
        </RequireRole>
    );
}

export default Admin;