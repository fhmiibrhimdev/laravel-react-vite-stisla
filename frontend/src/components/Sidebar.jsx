import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";

export default function Sidebar() {
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="navbar navbar-secondary navbar-expand-lg">
            <div className="container">
                <ul className="navbar-nav">
                    <li
                        className={`nav-item ${
                            location.pathname === "/" ? "active" : ""
                        }`}
                    >
                        <NavLink href="/">
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
                    >
                        <a
                            href="#"
                            data-toggle="dropdown"
                            className="nav-link has-dropdown"
                            onClick={handleDropdownClick}
                        >
                            <i className="fas fa-fire"></i>
                            <span>Module 1</span>
                        </a>
                        <ul
                            className={`dropdown-menu ${
                                isDropdownOpen ? "show" : ""
                            }`}
                            onClick={closeDropdown}
                        >
                            <li
                                className={`nav-item ${
                                    location.pathname === "/general-feature"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <NavLink
                                    href="/general-feature"
                                    onClick={closeDropdown}
                                >
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
                                <NavLink
                                    href="/advanced-feature"
                                    onClick={closeDropdown}
                                >
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
                                <NavLink
                                    href="/products"
                                    onClick={closeDropdown}
                                >
                                    Products
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
