import { Route, Routes } from "react-router-dom";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthLayout from "@/pages/Layout/AuthLayout";
import MainLayout from "@/pages/Layout/MainLayout";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Dashboard from "@/pages/Dashboard";
import GeneralFeature from "@/pages/GeneralFeature";
import AdvancedFeature from "@/pages/AdvancedFeature";
import Product from "@/pages/Products/Product";
import Gallery from "@/pages/Gallery/Gallery";
import Profile from "@/pages/Profile/Profile";
import MultipleInsert from "@/pages/MultipleInsert/MultipleInsert";
import Error403 from "@/pages/Error/403";
import Error404 from "@/pages/Error/404";

export default function Router() {
    return (
        <Routes>
            {/* Guest-only routes — redirects to /dashboard if already logged in */}
            <Route element={<GuestRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Route>

            {/* Protected routes — redirects to / if not logged in */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/general-feature"
                        element={<GeneralFeature />}
                    />
                    <Route
                        path="/advanced-feature"
                        element={<AdvancedFeature />}
                    />
                    <Route path="/products" element={<Product />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                        path="/multiple-insert"
                        element={<MultipleInsert />}
                    />
                </Route>
            </Route>

            {/* Error routes */}
            <Route path="/403" element={<Error403 />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}
