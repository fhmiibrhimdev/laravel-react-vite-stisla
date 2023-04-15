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
export default function Router() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <AuthLayout>
                        <Login />
                    </AuthLayout>
                }
                exact
            />
            <Route
                path="/register"
                element={
                    <AuthLayout>
                        <Register />
                    </AuthLayout>
                }
                exact
            />
            <Route
                path="/dashboard"
                element={
                    <MainLayout>
                        <Dashboard />
                    </MainLayout>
                }
                exact
            />
            <Route
                path="/general-feature"
                element={
                    <MainLayout>
                        <GeneralFeature />
                    </MainLayout>
                }
                exact
            />
            <Route
                path="/advanced-feature"
                element={
                    <MainLayout>
                        <AdvancedFeature />
                    </MainLayout>
                }
                exact
            />
            <Route
                path="/products"
                element={
                    <MainLayout>
                        <Product />
                    </MainLayout>
                }
                exact
            />
        </Routes>
    );
}
