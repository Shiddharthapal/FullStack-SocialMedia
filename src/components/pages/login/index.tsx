import { useAppDispatch } from "@/redux/hooks";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/redux/slices/authSlice";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
};

const initialForm: LoginForm = {
  email: "",
  password: "",
};

// Login is a controlled form that calls the Astro login API and then stores the
// authenticated user in Redux so the protected home route can render.
export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Keep Redux and local UI state in sync while the request is in flight.
      setLoading(true);
      setError("");
      dispatch(loginStart());

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Login failed. Please try again.";
        setError(message);
        dispatch(loginFailure(message));
        return;
      }

      dispatch(
        loginSuccess({
          _id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: "",
          createdAt: data.createdAt
            ? new Date(data.createdAt)
            : new Date(),
          token: data.token,
        }),
      );

      // Clearing the form avoids stale credentials if the user returns here.
      setForm(initialForm);
      navigate("/");
    } catch {
      const message = "Login failed. Please try again.";
      setError(message);
      dispatch(loginFailure(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
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

      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img src="/images/login.png" alt="Login" className="_left_img" />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">
                <div className="_social_login_left_logo _mar_b28">
                  <img
                    src="/images/logo.svg"
                    alt="Buddy Script"
                    className="_left_logo"
                  />
                </div>

                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                <h4 className="_social_login_content_title _titl4 _mar_b50">
                  Login to your account
                </h4>

                <button
                  type="button"
                  className="_social_login_content_btn _mar_b40"
                >
                  <img src="/images/google.svg" alt="" className="_google_img" />{" "}
                  <span>Or sign-in with google</span>
                </button>

                <div className="_social_login_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : null}

                <form className="_social_login_form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label
                          className="_social_login_label _mar_b8"
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
                          className="form-control _social_login_input"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label
                          className="_social_login_label _mar_b8"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="_social_login_password_wrap">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            className="form-control _social_login_input _social_login_input_password"
                            autoComplete="current-password"
                            required
                          />
                          <button
                            type="button"
                            className="_social_login_password_toggle"
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
                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="form-check _social_login_form_check">
                        <input
                          className="form-check-input _social_login_form_check_input"
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                        />
                        <label
                          className="form-check-label _social_login_form_check_label"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="_social_login_form_left">
                        <button
                          type="button"
                          className="_social_login_form_left_para border-0 bg-transparent p-0"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_login_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_login_form_btn_link _btn1"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                      <p className="_social_login_bottom_txt_para">
                        Dont have an account? <Link to="/register">Create New Account</Link>
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
