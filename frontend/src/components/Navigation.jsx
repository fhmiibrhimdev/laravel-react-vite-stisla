import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NavLink from "./NavLink";

export default function Navigation() {
    const location = useLocation();
    const { user, logout, requireAuth } = useAuth();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        requireAuth();
    }, [requireAuth]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (...paths) => paths.includes(location.pathname);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className="navbar navbar-expand-lg main-navbar">
                <Link to="/" className="navbar-brand sidebar-gone-hide">
                    REACT VITE
                </Link>
                <div className="navbar-nav">
                    <a href="#" className="nav-link sidebar-gone-show" data-toggle="sidebar">
                        <i className="fas fa-bars"></i>
                    </a>
                </div>
                <form className="form-inline ml-auto"></form>
                <ul className="navbar-nav navbar-right">
                    <li className="dropdown">
                        <a href="#" data-toggle="dropdown" className="nav-link dropdown-toggle nav-link-lg nav-link-user">
                            <div className="d-sm-none d-lg-inline-block">Hi, {user?.name}</div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <div className="dropdown-title">ROLE: {user?.role}</div>
                            <Link to="/profile" className="dropdown-item has-icon">
                                <i className="far fa-user"></i> Profile
                            </Link>
                            <div className="dropdown-divider"></div>
                            <a href="#" onClick={handleLogout} className="dropdown-item has-icon text-danger">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>

            {/* Secondary Sidebar Navbar */}
            <nav className="navbar navbar-secondary navbar-expand-lg">
                <div className="container">
                    <ul className="navbar-nav tw-mt-1">
                        <NavItem path="/dashboard" active={isActive("/dashboard")}>
                            <i className="far fa-home"></i>
                            <span>Dashboard</span>
                        </NavItem>

                        <li className={`nav-item dropdown ${isActive("/general-feature", "/advanced-feature", "/products", "/gallery", "/multiple-insert") ? "active" : ""}`} ref={dropdownRef}>
                            <a href="#" onClick={() => setDropdownOpen(!dropdownOpen)} className={`nav-link has-dropdown ${dropdownOpen ? "show" : ""}`}>
                                <i className="fas fa-fire"></i>
                                <span>Module 1</span>
                            </a>
                            <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                                <NavItem path="/general-feature" active={isActive("/general-feature")}>
                                    General Feature
                                </NavItem>
                                <NavItem path="/advanced-feature" active={isActive("/advanced-feature")}>
                                    Advanced Feature
                                </NavItem>
                                {user?.role === "admin" && (
                                    <>
                                        <NavItem path="/products" active={isActive("/products")}>
                                            Products
                                        </NavItem>
                                        <NavItem path="/gallery" active={isActive("/gallery")}>
                                            Gallery
                                        </NavItem>
                                        <NavItem path="/multiple-insert" active={isActive("/multiple-insert")}>
                                            Multiple Insert
                                        </NavItem>
                                    </>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}

/** Small helper for sidebar nav items */
function NavItem({ path, active, children }) {
    return (
        <li className={`nav-item ${active ? "active" : ""}`}>
            <NavLink href={path}>{children}</NavLink>
        </li>
    );
}
