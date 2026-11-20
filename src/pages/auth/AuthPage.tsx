import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

import {
  loginUser,
  registerUser,
} from "../../features/auth/services/auth.service";

import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { login } = useAuth();

  const isLogin = location.pathname === "/login";
  const redirectTo = searchParams.get("redirect") || "/";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [fullname, setFullname] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await loginUser({
          identifier,
          password,
        });

        login(result.accessToken, result.refreshToken, result.user);

        navigate(redirectTo, { replace: true });
      } else {
        await registerUser({
          username,
          phone,
          fullname,
          password,
          role: "USER",
        });

        navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`, {
          replace: true,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-unselected-color transition-colors hover:bg-maincolor/5 hover:text-maincolor sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-lg sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-maincolor">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>

          <p className="mt-2 text-sm text-unselected-color">
            {isLogin
              ? "Log in to continue to your account."
              : "Register to start your learning journey."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-maincolor">
                  Full Name
                </label>
                <input
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-card-border bg-surface px-4 py-3 text-maincolor outline-none focus:border-button-color"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-maincolor">
                  Username
                </label>
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full rounded-lg border border-card-border bg-surface px-4 py-3 text-maincolor outline-none focus:border-button-color"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-maincolor">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+959XXXXXXXXX"
                  className="w-full rounded-lg border border-card-border bg-surface px-4 py-3 text-maincolor outline-none focus:border-button-color"
                />
              </div>
            </>
          )}

          {isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium text-maincolor">
                Username or Phone Number
              </label>
              <input
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or phone number"
                className="w-full rounded-lg border border-card-border bg-surface px-4 py-3 text-maincolor outline-none focus:border-button-color"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-maincolor">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-card-border bg-surface px-4 py-3 text-maincolor outline-none focus:border-button-color"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-button-color px-4 py-3 font-semibold text-button-txt transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-unselected-color">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link
                to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-semibold text-selected-color hover:underline"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-semibold text-selected-color hover:underline"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
