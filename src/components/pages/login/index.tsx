import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const shapeImages = [
  {
    className: "left-0 top-0 hidden w-32 lg:block xl:w-auto",
    light: "/images/shape1.svg",
    dark: "/images/dark_shape.svg",
  },
  {
    className: "right-5 top-0 hidden w-72 lg:block xl:w-auto",
    light: "/images/shape2.svg",
    dark: "/images/dark_shape1.svg",
  },
  {
    className: "bottom-0 right-0 hidden w-80 lg:block xl:right-[327px] xl:w-auto",
    light: "/images/shape3.svg",
    dark: "/images/dark_shape2.svg",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section
      className="relative overflow-hidden bg-[#F0F2F5] px-4 py-12 sm:px-6 lg:min-h-screen lg:px-8 lg:py-[100px]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {shapeImages.map((shape) => (
        <div
          key={shape.light}
          className={`pointer-events-none absolute -z-10 ${shape.className}`}
        >
          <img src={shape.light} alt="" className="block" />
          <img src={shape.dark} alt="" className="mt-2 block opacity-80" />
        </div>
      ))}

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_432px] xl:gap-16">
          <div className="hidden lg:flex lg:justify-center">
            <img
              src="/images/login.png"
              alt="Login illustration"
              className="w-full max-w-[633px]"
            />
          </div>

          <div className="rounded-md bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-10 xl:p-12">
            <div className="mb-7 flex justify-center">
              <img
                src="/images/logo.svg"
                alt="Buddy Script"
                className="w-full max-w-[161px]"
              />
            </div>

            <p className="mb-2 text-center text-base font-normal leading-6 text-[#2D3748]">
              Welcome back
            </p>
            <h1 className="mb-10 text-center text-[28px] font-semibold leading-tight text-[#312000]">
              Login to your account
            </h1>

            <button
              type="button"
              className="mb-10 flex w-full items-center justify-center rounded-md border border-[#F0F2F5] bg-white px-4 py-3 text-base font-medium leading-6 text-[#312000] transition hover:shadow-sm"
            >
              <img
                src="/images/google.svg"
                alt=""
                className="mr-2 h-5 w-5 shrink-0"
              />
              <span>Or sign-in with google</span>
            </button>

            <div className="mb-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#DFDFDF]" />
              <span className="text-sm font-normal leading-5 text-[#C4C4C4]">
                Or
              </span>
              <div className="h-px flex-1 bg-[#DFDFDF]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-[14px]">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-base font-medium leading-6 text-[#4A5568]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-md border border-[#F5F5F5] bg-white px-4 text-[13px] leading-5 text-[#2D3748] transition outline-none placeholder:text-[#2D3748] focus:border-[#1890FF]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-base font-medium leading-6 text-[#4A5568]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-md border border-[#F5F5F5] bg-white px-4 text-[13px] leading-5 text-[#2D3748] transition outline-none placeholder:text-[#2D3748] focus:border-[#1890FF]"
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm font-normal leading-5 text-[#2D3748]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-[#D1D5DB] accent-[#1890FF]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-left text-sm font-normal leading-5 text-[#1890FF] transition hover:opacity-80 sm:text-right"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-[#1890FF] px-6 py-3 text-base font-medium text-white transition hover:shadow-[0_8px_24px_rgba(24,144,255,0.24)]"
              >
                Login now
              </button>
            </form>

            <p className="mt-8 text-center text-sm leading-5 text-[#2D3748]">
              Dont have an account?{" "}
              <Link
                to="/createaccount"
                className="font-medium text-[#1890FF] transition hover:opacity-80"
              >
                Create New Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
