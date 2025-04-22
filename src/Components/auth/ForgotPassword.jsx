// ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo1.png";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { authService } from "../../services/auth";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FiArrowLeft } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await authService.forgotPassword(email); // API CALL
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:mx-3 lg:mx-auto sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-5/12 sm:max-w-md px-8 pt-4 pb-8 rounded-xl bg-orange-600 text-white">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-100">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HiOutlineExclamationCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Password reset email sent! Please check your inbox and
                    follow the instructions to reset your password.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <FaEnvelope
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900"
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FaPaperPlane className="me-2" />
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1">
                <FiArrowLeft className="h-5 w-5 font-medium text-gray-500" />
                <Link
                  to="/login"
                  className="font-medium text-orange-600 hover:text-orange-800"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
