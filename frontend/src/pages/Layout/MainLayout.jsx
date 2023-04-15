import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

export default function MainLayout({ children }) {
    return (
        <>
            <div className="main-wrapper container">
                <div className="navbar-bg"></div>
                <Navbar />
                <Sidebar />
                {children}
                <Footer />
            </div>
        </>
    );
}
