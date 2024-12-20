"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LaundryNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const removeCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLogin(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    removeCookie("authToken");
    setIsLogin(false);
    router.push("/");
  };

  // New function to handle protected route navigation
  const handleTrackOrderClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (!isLogin) {
      router.push("/login");
    } else {
      router.push("/trackorder");
    }
  };
  const handlegiveClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (!isLogin) {
      router.push("/login");
    } else {
      router.push("/main");
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full bg-blue-600 p-4 shadow-md z-50 rounded-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-bold flex items-center">
          <div className="flex justify-center">
            <Image
              src="/images/Screenshot 2024-12-02 002240.png"
              alt="College Logo"
              width={100}
              height={100}
              className="rounded-full shadow-md"
            />
          </div>
          <span className="ml-4">Laundry System</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`
            ${isMenuOpen ? "block" : "hidden"} 
            md:flex md:items-center md:space-x-6 
            absolute md:relative top-16 md:top-0 left-0 
            w-full md:w-auto bg-blue-600 md:bg-transparent 
            z-20 md:z-0 p-4 md:p-0
          `}
        >
          <Link href="/services" className="block md:inline-block text-white hover:text-red-300 mb-2 md:mb-0">
            Services
          </Link>
          <Link
            href="/main" 
            onClick={handlegiveClick} 
            className="block md:inline-block text-white hover:text-red-300 mb-2 md:mb-0 cursor-pointer"
          >
            Give Laundry
          </Link>
          {/* Modified Track Order link with onClick handler */}
          <a 
            href="#" 
            onClick={handleTrackOrderClick} 
            className="block md:inline-block text-white hover:text-red-300 mb-2 md:mb-0 cursor-pointer"
          >
            Track Order
          </a>
        </div>

        {/* Conditional Auth Buttons */}
        {!isLogin ? (
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-red-50 transition duration-300"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={logout}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-red-50 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Auth Buttons */}
      <div
        className={`
          ${isMenuOpen ? "block" : "hidden"} 
          md:hidden bg-blue-700 p-4 space-y-4
        `}
      >
        {!isLogin ? (
          <Link
            href="/login"
            className="block w-full text-center bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-red-50 transition duration-300"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="block w-full text-center bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-red-50 transition duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default LaundryNavbar;