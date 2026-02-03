import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "./axiosClient";

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const tokenFromUrl = params.get("token") || "";

  const [email, setEmail] = useState("");
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mode = useMemo(
    () => (tokenFromUrl || token ? "reset" : "request"),
    [tokenFromUrl, token]
  );

  const resetMessages = () => {
    setStatusMessage("");
    setErrorMessage("");
  };

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = new URLSearchParams();
      data.append("email", email);
      await api.post("/password-reset/request", data);
      setStatusMessage(
        "If that email exists, a reset link has been sent to the inbox."
      );
      setEmail("");
    } catch (err) {
      setErrorMessage("Unable to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (!token) {
      setErrorMessage("Reset token is required.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = new URLSearchParams();
      data.append("token", token);
      data.append("new_password", newPassword);
      await api.post("/password-reset/confirm", data);
      setStatusMessage("Password updated successfully. You can now sign in.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage("Unable to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-stone-300 bg-white/80 p-8 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-semibold text-gray-800">
          {mode === "request" ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "request"
            ? "Enter your email to receive a password reset link."
            : "Enter your new password below."}
        </p>

        {mode === "request" ? (
          <form className="mt-6 space-y-4" onSubmit={handleRequest}>
            <div>
              <label className="block mb-1 text-gray-600" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            {statusMessage && (
              <p className="text-sm text-green-600">{statusMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleReset}>
            <div>
              <label className="block mb-1 text-gray-600" htmlFor="token">
                Reset Token
              </label>
              <input
                id="token"
                name="token"
                type="text"
                placeholder="Paste reset token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block mb-1 text-gray-600"
                htmlFor="new_password"
              >
                New Password
              </label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block mb-1 text-gray-600"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            {statusMessage && (
              <p className="text-sm text-green-600">{statusMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="hover:text-blue-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
