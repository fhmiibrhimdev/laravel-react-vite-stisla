import Case from "@/components/Case";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useForm } from "@/hooks/useForm";
import { useProfile, useUpdateProfile, useUpdatePassword } from "@/hooks/useProfile";
import { validateForm } from "@/utils/validation";

const PROFILE_RULES = {
  name: { required: "Name is required" },
  email: {
    required: "Email is required",
    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
  },
};

const PASSWORD_RULES = {
  current_password: { required: "Current password is required" },
  password: {
    required: "Password is required",
    minLength: { value: 6, message: "Password must be at least 6 characters long" },
  },
  password_confirmation: {
    required: "Confirmation password is required",
    match: { field: "password", message: "Passwords do not match" },
  },
};

export default function Profile() {
  useDocumentTitle("My Profile");

  const { data: user, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  // ─── Profile Form ────────────────────────────────────────────────────
  const profileForm = useForm(
    { name: user?.name ?? "", email: user?.email ?? "" },
    (data) => validateForm(data, PROFILE_RULES),
  );

  // Sync form when user loads
  if (user && !profileForm.formData.name && !profileForm.formData.email) {
    profileForm.setValues({ name: user.name, email: user.email });
  }

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    if (!profileForm.isValid()) return;
    updateProfileMutation.mutate(profileForm.formData);
  };

  // ─── Password Form ──────────────────────────────────────────────────
  const passwordForm = useForm(
    { current_password: "", password: "", password_confirmation: "" },
    (data) => validateForm(data, PASSWORD_RULES),
  );

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (!passwordForm.isValid()) return;
    updatePasswordMutation.mutate(passwordForm.formData, {
      onSuccess: () => passwordForm.reset(),
    });
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
        {/* Profile Card */}
        <div className="card">
          <div className="card-body px-4">
            <p className="tw-text-gray-500">
              Update your account's profile information and email address.
            </p>
            <form onSubmit={handleSubmitProfile}>
              <FormField
                label="Full Name"
                name="name"
                type="text"
                value={profileForm.formData.name}
                onChange={profileForm.handleChange}
                error={profileForm.errors.name}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={profileForm.formData.email}
                onChange={profileForm.handleChange}
                error={profileForm.errors.email}
              />
              <button
                className="btn btn-primary"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>

        {/* Password Card */}
        <div className="card">
          <div className="card-body px-4">
            <h4 className="tw-text-base tw-text-black">Update Password</h4>
            <p className="tw-text-gray-500">
              Ensure your account is using a long, random password to stay secure.
            </p>
            <form onSubmit={handleSubmitPassword}>
              <FormField
                label="Current Password"
                name="current_password"
                type="password"
                value={passwordForm.formData.current_password}
                onChange={passwordForm.handleChange}
                error={passwordForm.errors.current_password}
              />
              <FormField
                label="New Password"
                name="password"
                type="password"
                value={passwordForm.formData.password}
                onChange={passwordForm.handleChange}
                error={passwordForm.errors.password}
              />
              <FormField
                label="Confirm Password"
                name="password_confirmation"
                type="password"
                value={passwordForm.formData.password_confirmation}
                onChange={passwordForm.handleChange}
                error={passwordForm.errors.password_confirmation}
              />
              <button
                className="btn btn-primary"
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Case>
  );
}

/** Reusable inline form field for profile page */
function FormField({ label, name, type, value, onChange, error }) {
  return (
    <div className="form-group tw-mt-3">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        className={`form-control tw-w-1/2 ${error ? "is-invalid" : ""}`}
        value={value || ""}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
