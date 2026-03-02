import { Navigate, Outlet } from "react-router-dom";
import { getTokenWithExpiration } from "@/utils/session";

/**
 * Route guard for protected pages.
 * If user has no valid token, redirect to / (login) instantly.
 */
export default function ProtectedRoute() {
    const token = getTokenWithExpiration("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
