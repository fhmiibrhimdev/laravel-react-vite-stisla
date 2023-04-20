import React, { useState, useEffect } from "react";
import Case from "../../components/Case";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import appConfig from "../../config/appConfig";

export default function Profile() {
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refetch, setRefetch] = useState(Math.random());

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        document.title = "My Profile";

        axios
            .get(`${appConfig.baseurlAPI}/profile`)
            .then((data) => {
                setUser(data.data.data);
                setFormProfile({
                    name: data.data.data.name,
                    email: data.data.data.email,
                });
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    navigate("/403");
                } else {
                    console.log(error);
                }
                setIsLoading(false);
            });
    }, [refetch]);

    /**
     * Initial form, reset input fields, handle input change and validate the form profile
     */

    const [formProfile, setFormProfile] = useState({
        name: "",
        email: "",
    });

    const [formErrorsProfile, setFormErrorsProfile] = useState({
        name: "",
        email: "",
    });

    const validateFormProfile = () => {
        let errors = {};
        let formIsValid = true;

        if (!formProfile.name) {
            formIsValid = false;
            errors.name = "Name is required";
        }

        if (!formProfile.email) {
            formIsValid = false;
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formProfile.email)) {
            formIsValid = false;
            errors.email = "Invalid email address";
        }

        setFormErrorsProfile(errors);
        return formIsValid;
    };

    const handleInputChangeProfile = (event) => {
        const { name, value } = event.target;
        setFormProfile({ ...formProfile, [name]: value });
    };

    /**
     * Initial form, reset input fields, handle input change and validate the form password
     */

    const [formPassword, setFormPassword] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const initialFormPassword = {
        current_password: "",
        password: "",
        password_confirmation: "",
    };

    const [formErrorsPassword, setFormErrorsPassword] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const validateFormPassword = () => {
        let errors = {};
        let formIsValid = true;

        if (!formPassword.current_password) {
            formIsValid = false;
            errors.current_password = "Current password is required";
        }

        if (!formPassword.password) {
            formIsValid = false;
            errors.password = "Password is required";
        } else if (formPassword.password.length < 6) {
            formIsValid = false;
            errors.password = "Password must be at least 6 characters long";
        }

        if (!formPassword.password_confirmation) {
            formIsValid = false;
            errors.password_confirmation = "Confirmation password is required";
        } else if (formPassword.password_confirmation.length < 6) {
            formIsValid = false;
            errors.password_confirmation =
                "Confirmation password must be at least 6 characters long";
        }

        if (formPassword.password !== formPassword.password_confirmation) {
            formIsValid = false;
            errors.password = "Password and confirmation password do not match";
            errors.password_confirmation =
                "Password and confirmation password do not match";
        }

        setFormErrorsPassword(errors);
        return formIsValid;
    };

    const handleInputChangePassword = (event) => {
        const { name, value } = event.target;
        setFormPassword({ ...formPassword, [name]: value });
    };

    /**
     * Handle submit
     */

    const handleSubmitProfile = (event) => {
        event.preventDefault();

        if (validateFormProfile()) {
            axios
                .put(`${appConfig.baseurlAPI}/profile`, formProfile, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Success!",
                            text: "Data updated successfully",
                            icon: "success",
                            timer: 1500,
                        }).then(() => {
                            setRefetch(Math.random());
                        });
                    } else {
                        throw new Error("Network response was not ok");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    MySwal.fire({
                        title: "Oops...",
                        html: "Something went wrong.",
                        icon: "error",
                        timer: 2000,
                    });
                });
        }
    };

    const handleSubmitPassword = (event) => {
        event.preventDefault();

        if (validateFormPassword()) {
            axios
                .put(`${appConfig.baseurlAPI}/update-password`, formPassword, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Success!",
                            text: "Data updated successfully",
                            icon: "success",
                            timer: 1500,
                        }).then(() => {
                            setFormPassword(initialFormPassword);
                            setRefetch(Math.random());
                        });
                    } else {
                        throw new Error("Network response was not ok");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    MySwal.fire({
                        title: "Oops...",
                        html: error.response.data.message,
                        icon: "error",
                        timer: 3000,
                    });
                });
        }
    };

    if (isLoading) {
        return (
            <Case>
                <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                    <h1 className="mb-1 tw-text-lg">Loading...</h1>
                </div>
            </Case>
        );
    }

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">Profile Information</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-4">
                        <p className="tw-text-gray-500">
                            Update your account's profile information and email
                            address.
                        </p>
                        <form onSubmit={handleSubmitProfile}>
                            <div className="form-group tw-mt-3">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className={`form-control tw-w-1/2 ${
                                        formErrorsProfile.name
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formProfile.name || ""}
                                    onChange={handleInputChangeProfile}
                                />
                                {formErrorsProfile.name && (
                                    <div className="invalid-feedback">
                                        {formErrorsProfile.name}
                                    </div>
                                )}
                            </div>
                            <div className="form-group tw-mt-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className={`form-control tw-w-1/2 ${
                                        formErrorsProfile.email
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formProfile.email || ""}
                                    onChange={handleInputChangeProfile}
                                />
                                {formErrorsProfile.email && (
                                    <div className="invalid-feedback">
                                        {formErrorsProfile.email}
                                    </div>
                                )}
                            </div>
                            <button className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body px-4">
                        <h4 className="tw-text-base tw-text-black ">
                            Update Password
                        </h4>
                        <p className="tw-text-gray-500">
                            Ensure your account is using a long, random password
                            to stay secure.
                        </p>
                        <form onSubmit={handleSubmitPassword}>
                            <div className="form-group tw-mt-5">
                                <label htmlFor="current_password">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="current_password"
                                    id="current_password"
                                    className={`form-control tw-w-1/2 ${
                                        formErrorsPassword.current_password
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formPassword.current_password || ""}
                                    onChange={handleInputChangePassword}
                                />
                                {formErrorsPassword.current_password && (
                                    <div className="invalid-feedback">
                                        {formErrorsPassword.current_password}
                                    </div>
                                )}
                            </div>
                            <div className="form-group tw-mt-3">
                                <label htmlFor="password">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className={`form-control tw-w-1/2 ${
                                        formErrorsPassword.password
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formPassword.password || ""}
                                    onChange={handleInputChangePassword}
                                />
                                {formErrorsPassword.password && (
                                    <div className="invalid-feedback">
                                        {formErrorsPassword.password}
                                    </div>
                                )}
                            </div>
                            <div className="form-group tw-mt-3">
                                <label htmlFor="password_confirmation">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    className={`form-control tw-w-1/2 ${
                                        formErrorsPassword.password_confirmation
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={
                                        formPassword.password_confirmation || ""
                                    }
                                    onChange={handleInputChangePassword}
                                />
                                {formErrorsPassword.password_confirmation && (
                                    <div className="invalid-feedback">
                                        {
                                            formErrorsPassword.password_confirmation
                                        }
                                    </div>
                                )}
                            </div>
                            <button className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </Case>
    );
}
