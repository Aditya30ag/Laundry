"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LaundryNavbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // If token exists, redirect to main content
      router.push('/main');
    } else {
      // If no token, show the landing page
      setIsLoading(false);
    }
  }, [router]);


  // Show landing page for non-authenticated users
  return (
    <div>
      <LaundryNavbar />
      <div className="relative min-h-screen bg-blue-50 flex flex-col justify-center items-center">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/image.png"
            alt="Login Background"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            className="opacity-30"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mt-2 flex flex-col justify-center items-center">
          <div className="max-w-lg text-center bg-white p-10 rounded-xl shadow-xl border border-blue-100">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/Screenshot 2024-12-02 002240.png"
                alt="College Logo"
                width={300}
                height={200}
                className="rounded-full shadow-md"
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-6 text-blue-800">
              Welcome to Bennet
              <span className="block text-red-600 text-3xl mt-2">
                Laundry Management System
              </span>
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              Streamline your laundry services with our comprehensive management platform
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}