"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const HeroSection = () => {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  return (
    <section className="relative py-32 bg-gradient-to-r from-blue-600 to-blue-400 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-cover opacity-10 transform transition-transform duration-700 hover:scale-105" />
      <div className="container mx-auto px-4 relative z-10 transform transition-transform duration-300 hover:translate-y-[-2px]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight transform transition-all duration-300 hover:scale-[1.02]">
            Track Your Portfolio Like a{" "}
            <span className="text-yellow-300 inline-block transform transition-all duration-300 hover:scale-110 hover:rotate-2">
              Pro
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
            Join over{" "}
            <span className="font-semibold inline-block transform transition-all duration-300 hover:scale-110">
              50,000+
            </span>{" "}
            investors using our simple yet powerful tools to manage their
            investments and grow their wealth
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {session ? (
              <Link
                href="/market"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setIsPressed(false);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                className={`
                group flex items-center justify-center 
                px-8 py-4 rounded-full font-semibold
                transform transition-all duration-300
                ${
                  isPressed
                    ? "scale-95 bg-blue-50 text-blue-700"
                    : isHovered
                    ? "scale-105 bg-white text-blue-600 shadow-lg"
                    : "bg-white text-blue-600"
                }
                hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
                active:scale-95
              `}
                aria-label="Get Started"
              >
                <span className="relative flex items-center">
                  Explore Market
                  <ArrowRight
                    className={`
                    ml-2 w-5 h-5 transform transition-all duration-300
                    ${isHovered ? "translate-x-1" : ""}
                  `}
                  />
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setIsPressed(false);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                className={`group flex items-center justify-center px-8 py-4 rounded-full font-semibold transform transition-all duration-300 ${
                  isPressed
                    ? "scale-95 bg-blue-50 text-blue-700"
                    : isHovered
                    ? "scale-105 bg-white text-blue-600 shadow-lg"
                    : "bg-white text-blue-600"
                }hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:scale-95`}
                aria-label="Get Started"
              >
                <span className="relative flex items-center">
                  Get Started
                  <ArrowRight
                    className={`
                    ml-2 w-5 h-5 transform transition-all duration-300
                    ${isHovered ? "translate-x-1" : ""}
                  `}
                  />
                </span>
              </Link>
            )}
          </div>
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
