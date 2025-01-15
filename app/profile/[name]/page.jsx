"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { validate } from "@/utils/validator";

export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();
  const userData = session?.user;
  const [activeButton, setActiveButton] = useState("Dashboard");
  const [userDetail, setUserDetail] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  let portfolioValue = 0;
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: "",
  });
  const errorMessages = {
    CredentialsSignin: "Invalid email or password",
    Default: "An error occurred during sign in",
  };
  const initials = (name) => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0][0];
    }
    return nameParts[0][0] + nameParts[nameParts.length - 1][0];
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${userData?.id}`);
      const data = await res.json();
      setUserDetail(data);
    };
    fetchUser();
  }, [session]);
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingState({ isLoading: true, message: "Updating..." });
    setError("");
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    if (!validate(credentials)) {
      setLoadingState({ isLoading: false, message: "" });
      return;
    }
    try {
      const response = await fetch(`/api/user/${userData?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorMessages[errorData.code] || errorMessages.Default;
        setError(errorMessage);
        return;
      }
      alert("User Updated...");
      setLoadingState({ isLoading: false, message: "" });
    } catch (error) {
      console.error("Error during registration:", error);
      setError(errorMessages.Default);
    } finally {
      setLoadingState({ isLoading: false, message: "" });
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/user/${userData?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error deleting user");
        setDeleteLoading(false);
        return;
      }
      const message = await response.json();
      alert(message.message || "User deleted");
      router.push("/");
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("An error occurred while deleting the user.");
      setDeleteLoading(false);
    } finally {
      setLoadingState({ isLoading: false, message: "" });
      setDeleteLoading(false);
    }
  };
  useEffect(() => {
    const response = async () => {
      const res = await fetch(`api/market/portfolio/value/${session?.user?.id}`)
      const data = res.json()
      portfolioValue = data
    }
    response()
  }, [session])
  // console.log(portfolioValue)
  if (!session) redirect("/auth/signup");
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-2xl font-bold">
                {initials(userData?.name?.toString())}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-medium">{userData?.name}</h1>
                </div>
                <div className="text-sm mt-1">{userData?.email}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-white">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              since {formatDate(userDetail.createdAt)}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Total Portfolio Value:
            </h1>
            <p className="text-3xl text-center font-bold text-white">5271.34</p>
          </div>
        </div>
        <div className="mt-8 flex justify-around gap-6 border-t border-gray-800 pt-4 w-full text-xl font-bold">
          <button
            className={`relative transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100 ${
              activeButton === "Dashboard" ? "after:scale-x-100" : ""
            }`}
            onClick={() => setActiveButton("Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`relative transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100 ${
              activeButton === "Watchlist" ? "after:scale-x-100" : ""
            }`}
            onClick={() => setActiveButton("Watchlist")}
          >
            Wishlist
          </button>
          <button
            className={`relative transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100 ${
              activeButton === "Summary" ? "after:scale-x-100" : ""
            }`}
            onClick={() => setActiveButton("Summary")}
          >
            Summary
          </button>
          <button
            className={`relative transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100 ${
              activeButton === "Settings" ? "after:scale-x-100" : ""
            }`}
            onClick={() => setActiveButton("Settings")}
          >
            Settings
          </button>
        </div>
      </div>
      <div>
        {activeButton === "Dashboard" && (
          <div className="mt-8">
            <h1 className="text-3xl font-bold leading-tight">Dashboard</h1>
            <p className="text-xl font-bold mb-6 leading-tight">
              Coming soon...
            </p>
          </div>
        )}
        {activeButton === "Watchlist" && (
          <div className="mt-8">
            <h1 className="text-3xl font-bold  leading-tight">Watchlist</h1>
            <p className="text-xl font-bold mb-6 leading-tight">
              Coming soon...
            </p>
          </div>
        )}
        {activeButton === "Summary" && (
          <div className="mt-8">
            <h1 className="text-3xl font-bold leading-tight">Summary</h1>
            <p className="text-xl font-bold mb-6 leading-tight">
              Coming soon...
            </p>
          </div>
        )}
        {activeButton === "Settings" && (
          <div className="mt-8">
            <h1 className="text-3xl text-center font-bold leading-tight">
              Settings
            </h1>
            <form
              onSubmit={handleUpdate}
              className="space-y-4 w-1/3 mx-auto mt-5"
            >
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name
                </label>
                <input
                  defaultValue={userData?.name || ""}
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
                  defaultValue={userData?.email || ""}
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                {loadingState.isLoading ? loadingState.message : "Update"}
              </button>
            </form>
            <div className="w-1/3 mx-auto mt-5">
              <button
                onClick={handleDelete}
                type="submit"
                disabled={loadingState.isLoading}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
