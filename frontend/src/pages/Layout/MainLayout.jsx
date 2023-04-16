import React from "react";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

export default function MainLayout({ children }) {
    return (
        <>
            <div className="main-wrapper container">
                <div className="navbar-bg"></div>
                <Navigation />
                {children}
                <Footer />
            </div>
        </>
    );
}
