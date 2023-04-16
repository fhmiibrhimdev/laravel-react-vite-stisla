import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AdvancedFeature from "../pages/AdvancedFeature";
import GeneralFeature from "../pages/GeneralFeature";
import Product from "../pages/products/Product";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AuthLayout from "../pages/Layout/AuthLayout";
import MainLayout from "../pages/Layout/MainLayout";
import Error403 from "../pages/Error/403";
import Error404 from "../pages/Error/404";

export default function Router() {
    return (
        <Routes>
            <Route path="/403" element={<Error403 />} />
            <Route
                exact
                path="/"
                element={
                    <AuthLayout>
                        <Login />
                    </AuthLayout>
                }
            />
            <Route
                exact
                path="/register"
                element={
                    <AuthLayout>
                        <Register />
                    </AuthLayout>
                }
            />
            <Route
                exact
                path="/dashboard"
                element={
                    <MainLayout>
                        <Dashboard />
                    </MainLayout>
                }
            />
            <Route
                exact
                path="/general-feature"
                element={
                    <MainLayout>
                        <GeneralFeature />
                    </MainLayout>
                }
            />
            <Route
                exact
                path="/advanced-feature"
                element={
                    <MainLayout>
                        <AdvancedFeature />
                    </MainLayout>
                }
            />
            <Route
                exact
                path="/products"
                element={
                    <MainLayout>
                        <Product />
                    </MainLayout>
                }
            />
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}
