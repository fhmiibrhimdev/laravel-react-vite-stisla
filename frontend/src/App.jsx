import React from "react";
import Navbar from "./components/Navbar";
import Router from "./components/Router";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
export default function App() {
    return (
        <>
            <div className="main-wrapper container">
                <div className="navbar-bg"></div>
                <Navbar />
                <Sidebar />
                <main>
                    <Router />
                </main>
                <Footer />
            </div>
        </>
    );
}
