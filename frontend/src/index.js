import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Initialize translations before rendering the app
import './i18n';

// Layouts
import MainLayout from './features/layouts/MainLayout';

// Modules
import Home from './features/home';
import Login from './template/auth/ui/login';
import AzureCallback from './template/auth/ui/login/AzureCallback';
import ChangePassword from './template/auth/ui/change-password';
import ResetPassword from './template/auth/ui/reset-password';
import Admin from './features/admin';
import UserList from './template/users';

// Styles
import '@orif-informatique/react-components-library/styles.css';
import './index.pcss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Suspense fallback={null}>
        <BrowserRouter basename={process.env.APP_ROOT}>
            <Routes>
                {/* 
                Routes nested to the Main layout.
                For each route, the React module specified in "element" is rendered at the place of the
                <Outlet /> tag in the MainLayout.
                */}
                <Route
                    path="/"
                    element={<MainLayout />}
                >
                    <Route
                        index
                        element={<Home />}
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/admin"
                        element={<Admin />}
                    >
                        <Route path="users" element={<UserList />} />
                        // You can add more admin routes here for other admin pages
                    </Route>

                    <Route
                        path="/azure"
                        element={<AzureCallback />}
                    />

                    <Route
                        path="/change-password"
                        element={<ChangePassword />}
                    />

                    <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    </Suspense>
);
