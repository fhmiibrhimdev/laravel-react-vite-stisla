import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import appConfig from "../../config/appConfig";
import { setTokenWithExpiration, getTokenWithExpiration } from "./Session";
import InputValidation from "../Layout/Components/InputValidation";

export default function Login() {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        document.title = "Login";
        if (getTokenWithExpiration("token")) {
            //redirect page dashboard
            window.location.href = "/dashboard";
        }
    }, []);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const initialFormData = {
        email: "",
        password: "",
    };

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
    });

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

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

        setFormErrors(errors);
        return formIsValid;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const loginHandler = (e) => {
        e.preventDefault();

        if (validateForm()) {
            axios
                .post(`${appConfig.baseurlAPI}/login`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        setTokenWithExpiration("token", response.data.token);
                        MySwal.fire({
                            title: "Success!",
                            text: "Login successfully",
                            icon: "success",
                            timer: 1500,
                        }).then(() => {
                            window.location.href = "/dashboard";
                        });
                    } else {
                        throw new Error("Network response was not ok");
                    }
                })
                .catch((error) => {
                    MySwal.fire({
                        title: "Failed!",
                        text: error.response.data.message,
                        icon: "error",
                    });
                });
        }
    };

    return (
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 tw-mt-10">
                <div className="card">
                    <div className="card-header">
                        <h4>Login</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={loginHandler}>
                            <InputValidation
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={formErrors.email}
                            />
                            <InputValidation
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={formErrors.password}
                            />
                            <div className="form-group">
                                <button className="btn btn-lg btn-block btn-primary tw-text-white">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-5 text-muted text-center">
                    Don't have an account?{" "}
                    <Link to="/register">Create One</Link>
                </div>
                <div className="simple-footer">
                    Copyright &copy; Stisla 2023
                </div>
            </div>
        </div>
    );
}
