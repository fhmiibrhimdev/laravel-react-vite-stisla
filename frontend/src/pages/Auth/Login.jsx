import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { validateForm } from "@/utils/validation";
import InputValidation from "@/pages/Layout/Components/InputValidation";

const VALIDATION_RULES = {
    email: { required: "Email is required" },
    password: { required: "Password is required" },
};

export default function Login() {
    useDocumentTitle("Login");
    const { login, isLoggingIn } = useAuth();

    const { formData, errors, handleChange, isValid } = useForm(
        { email: "", password: "" },
        (data) => validateForm(data, VALIDATION_RULES)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid()) return;
        login(formData);
    };

    return (
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 tw-mt-10">
                <div className="card">
                    <div className="card-header">
                        <h4>Login</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <InputValidation
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <InputValidation
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            <div className="form-group">
                                <button
                                    className="btn btn-lg btn-block btn-primary tw-text-white"
                                    disabled={isLoggingIn}
                                >
                                    {isLoggingIn ? "Logging in..." : "Login"}
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
