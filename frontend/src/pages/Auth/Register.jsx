import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appConfig from "../../config/appConfig";
import withReactContent from "sweetalert2-react-content";

export default function Register() {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        document.title = "Register";
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    const initialFormData = {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    };

    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        // Validate input name
        if (!formData.name) {
            formIsValid = false;
            errors.name = "Full name is required";
        }

        // Validate input description
        if (!formData.email) {
            formIsValid = false;
            errors.email = "Email is required";
        }

        // Validate input description
        if (!formData.password) {
            formIsValid = false;
            errors.password = "Password is required";
        }

        // Validate input description
        if (!formData.password_confirmation) {
            formIsValid = false;
            errors.password_confirmation = "Confirmation Password is required";
        }

        // Validate input description
        if (!formData.role) {
            formIsValid = false;
            errors.role = "Role is required";
        }

        setFormErrors(errors);
        return formIsValid;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const registerHandler = (e) => {
        e.preventDefault();

        if (validateForm()) {
            axios
                .post(`${appConfig.baseurlAPI}/register`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.status === 201) {
                        MySwal.fire({
                            title: "Success!",
                            text: "Registered successfully",
                            icon: "success",
                            timer: 1500,
                        }).then(() => {
                            navigate("/");
                        });
                    } else {
                        throw new Error("Network response was not ok");
                    }
                })
                .catch((error) => {
                    var err = error.response.data;
                    if (err.email) {
                        MySwal.fire({
                            title: "Failed!",
                            text: err.email,
                            icon: "error",
                        });
                    } else if (err.password) {
                        MySwal.fire({
                            title: "Failed!",
                            text: err.password,
                            icon: "error",
                        });
                    }
                });
        }
    };

    return (
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 tw-mt-10">
                <div className="card">
                    <div className="card-header">
                        <h4>Register</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={registerHandler}>
                            <div className="form-group">
                                <label htmlFor="name">Full name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className={`form-control ${
                                        formErrors.name ? "is-invalid" : ""
                                    }`}
                                    value={formData.name || ""}
                                    onChange={handleInputChange}
                                />
                                {formErrors.name && (
                                    <div className="invalid-feedback">
                                        {formErrors.name}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className={`form-control ${
                                        formErrors.email ? "is-invalid" : ""
                                    }`}
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                />
                                {formErrors.email && (
                                    <div className="invalid-feedback">
                                        {formErrors.email}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className={`form-control ${
                                        formErrors.password ? "is-invalid" : ""
                                    }`}
                                    value={formData.password || ""}
                                    onChange={handleInputChange}
                                />
                                {formErrors.password && (
                                    <div className="invalid-feedback">
                                        {formErrors.password}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password_confirmation">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    className={`form-control ${
                                        formErrors.password_confirmation
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formData.password_confirmation || ""}
                                    onChange={handleInputChange}
                                />
                                {formErrors.password_confirmation && (
                                    <div className="invalid-feedback">
                                        {formErrors.password_confirmation}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Role user</label>
                                <select
                                    name="role"
                                    id="role"
                                    className={`form-control ${
                                        formErrors.role ? "is-invalid" : ""
                                    }`}
                                    value={formData.role || ""}
                                    onChange={handleInputChange}
                                >
                                    <option selected>
                                        -- Selected Option --
                                    </option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                {formErrors.role && (
                                    <div className="invalid-feedback">
                                        {formErrors.role}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <button className="btn btn-lg btn-block btn-primary tw-text-white">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-5 text-muted text-center">
                    Have an account? <Link to="/">Login here</Link>
                </div>
                <div className="simple-footer">
                    Copyright &copy; Stisla 2023
                </div>
            </div>
        </div>
    );
}
