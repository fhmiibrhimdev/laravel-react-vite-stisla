import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";

export default function Sidebar() {
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownClick = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutsideDropdown = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutsideDropdown
            );
        };
    }, []);

    return (
        <nav className="navbar navbar-secondary navbar-expand-lg">
            <div className="container">
                <ul className="navbar-nav">
                    <li
                        className={`nav-item ${
                            location.pathname === "/dashboard" ? "active" : ""
                        }`}
                    >
                        <NavLink href="/dashboard">
                            <i className="far fa-home"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li
                        className={`nav-item dropdown ${
                            location.pathname === "/general-feature" ||
                            location.pathname === "/advanced-feature" ||
                            location.pathname === "/products"
                                ? "active"
                                : ""
                        }`}
                        ref={dropdownRef}
                    >
                        <a
                            href="#"
                            onClick={handleDropdownClick}
                            className={`nav-link has-dropdown ${
                                dropdownOpen ? "show" : ""
                            }`}
                        >
                            <i className="fas fa-fire"></i>
                            <span>Module 1</span>
                        </a>
                        <ul
                            className={`dropdown-menu ${
                                dropdownOpen ? "show" : ""
                            }`}
                        >
                            <li
                                className={`nav-item ${
                                    location.pathname === "/general-feature"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <NavLink href="/general-feature">
                                    General Feature
                                </NavLink>
                            </li>
                            <li
                                className={`nav-item ${
                                    location.pathname === "/advanced-feature"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <NavLink href="/advanced-feature">
                                    Advanced Feature
                                </NavLink>
                            </li>
                            <li
                                className={`nav-item ${
                                    location.pathname === "/products"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <NavLink href="/products">Products</NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
