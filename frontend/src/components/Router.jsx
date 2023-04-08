import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AdvancedFeature from "../pages/AdvancedFeature";
import GeneralFeature from "../pages/GeneralFeature";
export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} exact />
            <Route path="/general-feature" element={<GeneralFeature />} exact />
            <Route
                path="/advanced-feature"
                element={<AdvancedFeature />}
                exact
            />
        </Routes>
    );
}
