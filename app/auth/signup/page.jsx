"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: "",
  });
  const errorMessages = {
    CredentialsSignin: "Invalid email or password",
    Default: "An error occurred during sign in",
  };
  useEffect(() => {
    if (session) {
      router.push(`/profile/${session?.user?.name}`);
    }
  }, [session, router]);
  const validateForm = (credentials) => {
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
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState({ isLoading: true, message: "Logging in..." });
    setError("");
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    if (!validateForm(credentials)) {
      setLoadingState({ isLoading: false, message: "" });
      return;
    }
    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false
      });
      if (result?.error) {
        setError(errorMessages[result.error] || errorMessages.Default);
      } else if (result?.ok) {
        router.push(result.url || "/");
      } else {
        throw new Error("Unexpected error");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.log(error);
    } finally {
      setLoadingState({ isLoading: false, message: "" });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loadingState.isLoading ? loadingState.message : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
