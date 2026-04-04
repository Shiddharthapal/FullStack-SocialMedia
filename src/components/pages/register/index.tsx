import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      setForm(initialForm);
      navigate("/login");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src="/images/shape1.svg" alt="" className="_shape_img" />
        <img src="/images/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/images/shape2.svg" alt="" className="_shape_img" />
        <img
          src="/images/dark_shape1.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_shape_three">
        <img src="/images/shape3.svg" alt="" className="_shape_img" />
        <img
          src="/images/dark_shape2.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/images/registration.png" alt="Registration" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/images/registration1.png" alt="Registration" />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img
                    src="/images/logo.svg"
                    alt="Buddy Script"
                    className="_right_logo"
                  />
                </div>

                <p className="_social_registration_content_para _mar_b8">
                  Get Started Now
                </p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">
                  Registration
                </h4>

                <button
                  type="button"
                  className="_social_registration_content_btn _mar_b40"
                >
                  <img
                    src="/images/google.svg"
                    alt=""
                    className="_google_img"
                  />{" "}
                  <span>Register with Google</span>
                </button>

                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : null}

                <form className="_social_registration_form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          className="_social_registration_label _mar_b8"
                          htmlFor="firstName"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={form.firstName}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          autoComplete="given-name"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          className="_social_registration_label _mar_b8"
                          htmlFor="lastName"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={form.lastName}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          autoComplete="family-name"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          className="_social_registration_label _mar_b8"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="form-control _social_registration_input"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          className="_social_registration_label _mar_b8"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="_social_registration_password_wrap">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            className="form-control _social_registration_input _social_registration_input_password"
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="_social_registration_password_toggle"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                          >
                            {showPassword ? (
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3 3l18 18"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M10.58 10.58a2 2 0 102.83 2.83"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.88 5.09A10.94 10.94 0 0112 4.91c5.05 0 8.27 3.11 9.5 7.09a.79.79 0 010 .5 12.57 12.57 0 01-2.79 4.45"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6.61 6.62A12.76 12.76 0 002.5 12a.79.79 0 000 .5c1.23 3.98 4.45 7.09 9.5 7.09a11.3 11.3 0 004.11-.74"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.5 12a.79.79 0 000 .5c1.23 3.98 4.45 7.09 9.5 7.09s8.27-3.11 9.5-7.09a.79.79 0 000-.5c-1.23-3.98-4.45-7.09-9.5-7.09S3.73 8.02 2.5 12z"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          className="_social_registration_label _mar_b8"
                          htmlFor="confirmPassword"
                        >
                          Repeat Password
                        </label>
                        <div className="_social_registration_password_wrap">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="form-control _social_registration_input _social_registration_input_password"
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="_social_registration_password_toggle"
                            onClick={() => setShowConfirmPassword((value) => !value)}
                            aria-label={
                              showConfirmPassword
                                ? "Hide repeat password"
                                : "Show repeat password"
                            }
                            aria-pressed={showConfirmPassword}
                          >
                            {showConfirmPassword ? (
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3 3l18 18"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M10.58 10.58a2 2 0 102.83 2.83"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.88 5.09A10.94 10.94 0 0112 4.91c5.05 0 8.27 3.11 9.5 7.09a.79.79 0 010 .5 12.57 12.57 0 01-2.79 4.45"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6.61 6.62A12.76 12.76 0 002.5 12a.79.79 0 000 .5c1.23 3.98 4.45 7.09 9.5 7.09a11.3 11.3 0 004.11-.74"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.5 12a.79.79 0 000 .5c1.23 3.98 4.45 7.09 9.5 7.09s8.27-3.11 9.5-7.09a.79.79 0 000-.5c-1.23-3.98-4.45-7.09-9.5-7.09S3.73 8.02 2.5 12z"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="checkbox"
                          id="agreeToTerms"
                          checked={agreedToTerms}
                          onChange={(event) => setAgreedToTerms(event.target.checked)}
                        />
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="agreeToTerms"
                        >
                          I agree to terms & conditions
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1"
                          disabled={loading}
                        >
                          {loading ? "Registering..." : "Create account"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account? <Link to="/login">Login now</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
