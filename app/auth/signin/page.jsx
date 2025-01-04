"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [intendedDestination, setIntendedDestination] = useState("/dashboard");
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: "",
  });

  const errorMessages = {
    CredentialsSignin: "Invalid email or password",
    Default: "An error occurred during sign in",
  };

  const validateForm = (credentials) => {
    if (!credentials.name) {
      setError("Name is required");
      return false;
    }
    if (!credentials.email) {
      setError("Email is required");
      return false;
    }
    if (!credentials.password) {
      setError("Password is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState({ isLoading: true, message: "Signing in..." });
    setError("");
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    if (!validateForm(credentials)) {
      setLoadingState({ isLoading: false, message: "" });
      return;
    }
    try {
      const response = await fetch("/api/register/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorMessages[errorData.code] || errorMessages.Default;
        setError(errorMessage);
        return;
      }
      const data = await response.json();
      console.log("User registered successfully:", data);
      setLoadingState({ isLoading: false, message: "Redirecting..." });
      e.target.reset();
      router.push(intendedDestination);
    }
    catch (error) {
      console.error("Error during registration:", error);
      setError(errorMessages.Default);
    }
    finally {
      setLoadingState({ isLoading: false, message: "" });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              type="name"
              name="name"
              id="name"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loadingState.isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingState.isLoading ? loadingState.message : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
