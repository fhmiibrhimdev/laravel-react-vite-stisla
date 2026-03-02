import { Navigate, Outlet } from "react-router-dom";
import { getTokenWithExpiration } from "@/utils/session";

/**
 * Route guard for guest-only pages (Login, Register).
 * If user already has a valid token, redirect to /dashboard instantly.
 */
export default function GuestRoute() {
    const token = getTokenWithExpiration("token");

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
