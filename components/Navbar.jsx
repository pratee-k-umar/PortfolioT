"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const initials = (name) => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0][0];
    }
    return nameParts[0][0] + nameParts[nameParts.length - 1][0];
  };
  const signOutRedirection = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };
  const profileRedirection = () => {
    router.push(`/profile/${session.user.name}`);
  };
  const isProfilePage = pathname.startsWith("/profile");
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-6 py-5 text-white">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          aria-label="Home"
        >
          <span className="text-xl font-semibold">Portfolio Tracker</span>
        </Link>
        <div className="flex md:order-2">
          {session ? (
            <div className="flex items-center gap-4">
              {isProfilePage ? (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={signOutRedirection}
                    className="text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ease-in-out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div
                  onClick={profileRedirection}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <span className="text-gray-600 font-medium">
                    {initials(session?.user?.name)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              {pathname === "/auth/signup" ? (
                <Link
                  href="/auth/signin"
                  className="text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ease-in-out"
                >
                  Sign In
                </Link>
              ) : (
                <Link
                  href="/auth/signup"
                  className="text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ease-in-out"
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
