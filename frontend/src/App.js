import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";

import PageNotFound from "./pages/PageNotFound";
import SchoolReportDetails from "./pages/SchoolReportDetails";
import SchoolReportList from "./pages/SchoolReportList";

import Loading from "./components/Loading";


/**
 * Defines routes and is the app base.
 *
 * @returns {JSX.Element}
 *
 */
const App = () =>
{
    return (
        <Suspense fallback={<Loading />}>
            <BrowserRouter basename={process.env.APP_ROOT}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<SchoolReportList />}/>
                        <Route path="/list" element={<SchoolReportList />}/>

                        <Route path="/details/:apprentice_id" element={<SchoolReportDetails />}/>
                    </Route>

                    <Route path="*" element={<PageNotFound />}/>
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
}

export default App;
