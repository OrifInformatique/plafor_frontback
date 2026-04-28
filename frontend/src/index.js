import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from './layouts/MainLayout';

// Modules
import Home from './modules/home';
import Contact from './modules/contact';
import Login from './ui/auth/login';
import Azure from './ui/auth/login/azure';
import ChangePassword from './ui/auth/change-password';
import ResetPassword from './ui/auth/reset-password';
import ApiAuthCall from './modules/api-auth-call';

// Utils
import Redirect from './utils/Redirect'

// Styles
import '@orif-informatique/react-components-library/styles.css';
import './index.pcss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter basename={process.env.APP_ROOT}>
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/azure"
                element={<Azure />}
            />

            <Route
                path="/change-password"
                element={<ChangePassword />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

			<Route
				path="/testAPI"
				element={<ApiAuthCall />}
			/>

            <Route
                path="/"
                element={<MainLayout />}
            >
            <Route
                index
                element={<Home />}
            />

            <Route
                path="contact"
                element={<Contact />}
            />

            <Route
                path="*"
                element={<Redirect to="/" />}
            />
            </Route>
        </Routes>
    </BrowserRouter>
);
