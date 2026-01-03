import axios from "axios";
import NavLink from "./NavLink";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getTokenWithExpiration } from "../pages/Auth/Session";
import appConfig from "../config/appConfig";

export default function Navigation() {
    const [user, setUser] = useState({});

    const navigate = useNavigate();
    const token = getTokenWithExpiration("token");

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
        document.title = "Dashboard";
        if (!token) {
            navigate("/");
        }
        fetchData();

        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutsideDropdown
            );
        };
    }, [navigate]);

    const fetchData = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.get(`${appConfig.baseurlAPI}/user`).then((response) => {
            setUser(response.data);
        });
    };

    const logoutHandler = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.post(`${appConfig.baseurlAPI}/logout`).then(() => {
            localStorage.removeItem("token");
            navigate("/");
        });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg main-navbar">
                <Link to="/" className="navbar-brand sidebar-gone-hide">
                    REACT VITE
                </Link>
                <div className="navbar-nav">
                    <a
                        href="#"
                        className="nav-link sidebar-gone-show"
                        data-toggle="sidebar"
                    >
                        <i className="fas fa-bars"></i>
                    </a>
                </div>
                <form className="form-inline ml-auto"></form>
                <ul className="navbar-nav navbar-right">
                    <li className="dropdown">
                        <a
                            href="#"
                            data-toggle="dropdown"
                            className="nav-link dropdown-toggle nav-link-lg nav-link-user"
                        >
                            <div className="d-sm-none d-lg-inline-block">
                                Hi, {user.name}
                            </div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <div className="dropdown-title">
                                ROLE: {user.role}
                            </div>
                            <Link
                                to="/profile"
                                className="dropdown-item has-icon"
                            >
                                <i className="far fa-user"></i> Profile
                            </Link>
                            <div className="dropdown-divider"></div>
                            <a
                                onClick={logoutHandler}
                                href="#"
                                className="dropdown-item has-icon text-danger"
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>
            <nav className="navbar navbar-secondary navbar-expand-lg">
                <div className="container">
                    <ul className="navbar-nav">
                        <li
                            className={`nav-item ${
                                location.pathname === "/dashboard"
                                    ? "active"
                                    : ""
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
                                location.pathname === "/products" ||
                                location.pathname === "/gallery" ||
                                location.pathname === "/multiple-insert"
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
                                        location.pathname ===
                                        "/advanced-feature"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <NavLink href="/advanced-feature">
                                        Advanced Feature
                                    </NavLink>
                                </li>
                                {user.role === "admin" && (
                                    <>
                                        <li
                                            className={`nav-item ${
                                                location.pathname ===
                                                "/products"
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <NavLink href="/products">
                                                Products
                                            </NavLink>
                                        </li>
                                        <li
                                            className={`nav-item ${
                                                location.pathname === "/gallery"
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <NavLink href="/gallery">
                                                Gallery
                                            </NavLink>
                                        </li>
                                        <li
                                            className={`nav-item ${
                                                location.pathname ===
                                                "/multiple-insert"
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <NavLink href="/multiple-insert">
                                                Multiple Insert
                                            </NavLink>
                                        </li>
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
