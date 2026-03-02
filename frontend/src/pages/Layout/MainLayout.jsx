import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function MainLayout() {
    return (
        <div className="main-wrapper container">
            <div className="navbar-bg"></div>
            <Navigation />
            <Outlet />
            <Footer />
        </div>
    );
}
