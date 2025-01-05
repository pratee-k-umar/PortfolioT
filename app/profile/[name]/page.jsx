"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const userData = session?.user;
  const [activeButton, setActiveButton] = useState("Dashboard");
  const [userDetail, setUserDetail] = useState({});
  const initials = (name) => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    return nameParts[0][0] + nameParts[nameParts.length - 1][0];
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${userData?.id}`);
      const data = await res.json();
      setUserDetail(data);
    }
    fetchUser();
  }, [session])
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
      <div className="flex items-center">
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
        <div className="ml-auto">
          <h1 className="text-3xl font-bold text-white leading-tight">Total Portfolio Value:</h1>
          <p className="text-3xl font-bold text-white mb-6 leading-tight">5271.34</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-white">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
        since {formatDate(userDetail.createdAt)}
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
      <div class="settings"></div>
    </div>
  );
}
