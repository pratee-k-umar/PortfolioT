"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const userData = session?.user;
  const [activeButton, setActiveButton] = useState('WatchList');
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-2xl font-bold">
            {userData?.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium">{userData?.name}</h1>
            </div>
            <div className="text-sm mt-1">{userData?.email}</div>
          </div>
        </div>
        <div className="ml-auto">
          <button onClick={() => setActiveButton("Settings")} className="border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-800 hover:bg-gray-800 hover:text-white">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Profile settings
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-white">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
        since Dec 23, 2023
      </div>
      <div className="mt-8 flex justify-around gap-6 border-t border-gray-800 pt-4 w-full text-xl font-bold">
        <button
          className={`relative transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100 ${
            activeButton === "WatchList" ? "after:scale-x-100" : ""
          }`}
          onClick={() => setActiveButton("WatchList")}
        >
          WatchList
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
  );
}
