import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

export default function Navbar() {
    const [user, setUser] = useState({});
    const baseURL = "http://127.0.0.1:8000/api";

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Dashboard";
        if (!token) {
            navigate("/");
        }
        fetchData();
    }, []);

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.get(`${baseURL}/user`).then((response) => {
            setUser(response.data);
        });
    };

    const logoutHandler = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.post(`${baseURL}/logout`).then(() => {
            localStorage.removeItem("token");
            navigate("/");
        });
    };

    return (
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
                            Logged in 5 min ago
                        </div>
                        <a
                            href="features-profile.html"
                            className="dropdown-item has-icon"
                        >
                            <i className="far fa-user"></i> Profile
                        </a>
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
    );
}
