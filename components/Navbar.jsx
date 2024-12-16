"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LaundryNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md mt-2 rounded-full z-10">
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
            <span className="ml-4">Laundry system</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`
          ${isMenuOpen ? 'block' : 'hidden'} 
          md:flex md:items-center md:space-x-6 
          absolute md:relative top-16 md:top-0 left-0 
          w-full md:w-auto bg-blue-600 md:bg-transparent 
          z-20 md:z-0 p-4 md:p-0
        `}>
          <Link href="/services" className="block md:inline-block text-white hover:text-red-300 mb-2 md:mb-0">
            Services
          </Link>
          <Link href="/pricing" className="block md:inline-block text-white hover:text-red-300 mb-2 md:mb-0">
            Pricing
          </Link>
          <Link href="/track-order" className="block md:inline-block text-white hover:text-red-300 mb-2 md:mb-0">
            Track Order
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/login" 
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-red-50 transition duration-300"
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Auth Buttons */}
      <div className={`
        ${isMenuOpen ? 'block' : 'hidden'} 
        md:hidden bg-blue-700 p-4 space-y-4
      `}>
        <Link 
          href="/login" 
          className="block w-full text-center bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-red-50 transition duration-300"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="block w-full text-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default LaundryNavbar;