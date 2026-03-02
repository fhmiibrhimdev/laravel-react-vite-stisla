import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { validateForm } from "@/utils/validation";
import InputValidation from "@/pages/Layout/Components/InputValidation";

const INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
};

const VALIDATION_RULES = {
  name: { required: "Full name is required" },
  email: { required: "Email is required" },
  password: { required: "Password is required" },
  password_confirmation: { required: "Confirmation password is required" },
  role: { required: "Role is required" },
};

export default function Register() {
  useDocumentTitle("Register");
  const { register, isRegistering } = useAuth();

  const { formData, errors, handleChange, isValid } = useForm(INITIAL_VALUES, (data) =>
    validateForm(data, VALIDATION_RULES),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid()) return;
    register(formData);
  };

  return (
    <div className="row">
      <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 tw-mt-10">
        <div className="card">
          <div className="card-header">
            <h4>Register</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <InputValidation
                label="Full name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
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
              <InputValidation
                label="Confirmation Password"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
              />
              <div className="form-group">
                <label htmlFor="role">Role user</label>
                <select
                  name="role"
                  id="role"
                  className={`form-control ${errors.role ? "is-invalid" : ""}`}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">-- Select Option --</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
              </div>
              <div className="form-group">
                <button
                  className="btn btn-lg btn-block btn-primary tw-text-white"
                  disabled={isRegistering}
                >
                  {isRegistering ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-5 text-muted text-center">
          Have an account? <Link to="/">Login here</Link>
        </div>
        <div className="simple-footer">Copyright &copy; Stisla 2023</div>
      </div>
    </div>
  );
}
