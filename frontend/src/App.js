import Layout from "./layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SchoolReportList from "./pages/SchoolReportList";
import SchoolReportDetails from "./pages/SchoolReportDetails";
import PageNotFound from "./pages/PageNotFound";

const App = () =>
{
    return (
        <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<SchoolReportList />}/>
                        <Route path="/list" element={<SchoolReportList />}/>

                        <Route path="/details/:apprentice_id" element={<SchoolReportDetails />}/>
                    </Route>

                    <Route path="*" element={<PageNotFound />}/>
                </Routes>
            </BrowserRouter>
    );
}

export default App;
