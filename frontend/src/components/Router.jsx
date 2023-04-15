import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AdvancedFeature from "../pages/AdvancedFeature";
import GeneralFeature from "../pages/GeneralFeature";
import Product from "../pages/products/Product";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Login />} exact />
            <Route path="/register" element={<Register />} exact />
            <Route path="/dashboard" element={<Dashboard />} exact />
            <Route path="/general-feature" element={<GeneralFeature />} exact />
            <Route
                path="/advanced-feature"
                element={<AdvancedFeature />}
                exact
            />
            <Route path="/products" element={<Product />} exact />
        </Routes>
    );
}
