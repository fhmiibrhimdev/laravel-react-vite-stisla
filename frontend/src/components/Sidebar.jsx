import React from "react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";

export default function Sidebar() {
    const location = useLocation();
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
                            location.pathname === "/advanced-feature"
                                ? "active"
                                : ""
                        }`}
                    >
                        <a
                            href="#"
                            data-toggle="dropdown"
                            className="nav-link has-dropdown"
                        >
                            <i className="fas fa-fire"></i>
                            <span>Module 1</span>
                        </a>
                        <ul className="dropdown-menu">
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
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
