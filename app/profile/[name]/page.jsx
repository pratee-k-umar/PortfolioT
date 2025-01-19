"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeOffIcon, X } from "lucide-react";
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
  const [wishlist, setWishlist] = useState([]);
  const [wishlistModal, setWishlistModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState([]);
  const [selectedStockPrice, setSelectedStockPrice] = useState([]);
  const wishlistEditForm = useRef(null);
  const [wishlistEditLoading, setWishlistEditLoading] = useState(false);
  const [wishlistEditError, setWishlistEditError] = useState("");
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
    if (userData?.id) {
      fetchUser();
    }
  }, [userData]);
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
      const res = await fetch(
        `/api/market/portfolio/wishlist/${session?.user?.id}`
      );
      const data = await res.json();
      setWishlist(data);
    };
    if (session?.user?.id) {
      response();
    }
  }, [session]);
  const closeModal = () => {
    setWishlistModal(false);
    setSelectedStock(null);
    wishlistEditForm.current.reset();
  };
  const handleModal = (data) => {
    setSelectedStock(data);
    setWishlistModal(true);
  };
  const wishlistValidate = () => {
    const { quantity, amount } = wishlistEditForm.current;
    if (!quantity.value || !amount.value) {
      setWishlistEditError("Please fill all fields");
      return false;
    }
    return true;
  };
  const wishlistUpdate = async (e) => {
    e.preventDefault();
    if (wishlistEditForm.current) {
      const formData = new FormData(wishlistEditForm.current);
      formData.append("stockId", selectedStock._id);
      handleWishlistEdit(formData);
    }
  };
  const handleWishlistEdit = async (formData) => {
    setWishlistEditLoading(true);
    const credentials = Object.fromEntries(formData);
    console.log(credentials)
    if (!wishlistValidate(credentials)) {
      setWishlistEditLoading(false);
      setWishlistEditError("Please fill all fields");
      return;
    }
    try {
      const response = await fetch(
        `/api/market/portfolio/wishlist/${session?.user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setWishlistEditLoading(false);
        alert(errorData.message);
        return;
      }
      alert("Wishlist Updated...");
      setWishlistEditLoading(false);
      setWishlistEditError("");
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setWishlistEditLoading(false);
    }
  };
  const handleWishListDelete = async (stockId) => {
    try {
      const response = await fetch(
        `/api/market/portfolio/wishlist/${session?.user?.id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stockId }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }
      alert("Wishlist Deleted...");
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };
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
          <div className="mt-8 mx-10">
            <h1 className="text-3xl font-bold  leading-tight text-center">
              Wishlist
            </h1>
            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Symbol
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Total Value
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Gain/Loss
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {wishlist?.map((data) => (
                      <tr
                        key={data._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {data.symbol}
                            </span>
                            <span className="text-xs text-gray-500">
                              {data.companyName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {data.quantity}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                          ${data.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                          Current Market Price
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          ${data.quantity * data.amount}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <span className="color-green">Gain</span>/
                          <span className="color-red">Loss</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleModal(data)}
                              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleWishListDelete(data._id)}
                              className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-150"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
      {wishlistModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                  Update Wishlist
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start gap-8">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedStock.symbol}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedStock.companyName}
                        </p>
                        <div className="mt-2 inline-flex items-center rounded-full text-sm font-medium text-blue-700">
                          {selectedStockPrice.c !== undefined
                            ? `$${selectedStockPrice.c.toFixed(2)}`
                            : "—"}
                        </div>
                      </div>
                      <form ref={wishlistEditForm} className="flex-1 space-y-4">
                        <div className="space-y-3">
                          <div>
                            <input
                              defaultValue={selectedStock.quantity || ""}
                              type="number"
                              id="quantity"
                              name="quantity"
                              min="1"
                              placeholder="Quantity"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-colors"
                            />
                          </div>
                          <div>
                            <input
                              defaultValue={selectedStock.amount || ""}
                              type="text"
                              id="amount"
                              name="amount"
                              placeholder="Amount"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-colors"
                            />
                          </div>
                          {wishlistEditError && (
                            <p className="mt-1 text-xs text-red-600">
                              {wishlistEditError}
                            </p>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      wishlistEditLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={wishlistUpdate}
                  >
                    {wishlistEditLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
