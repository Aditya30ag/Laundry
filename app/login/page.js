// app/login/page.js
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LaundryNavbar from '@/components/Navbar';
import LoginForm from '@/components/Login';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (credentials) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/studentslogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        console.log('Login successful:', data);
        router.push(`/main?userId=${encodeURIComponent(data.userId)}`);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LaundryNavbar />
      <div className="min-h-screen relative flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
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

        <div className="max-w-md w-full space-y-8 bg-white shadow-xl rounded-xl p-8 border border-blue-100 relative z-10">
          {/* College Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/Screenshot 2024-12-02 002240.png"
              alt="College Logo"
              width={200}
              height={200}
              className="rounded-full shadow-md"
            />
          </div>

          <div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>

          <LoginForm
            onSubmit={handleLogin}
            error={error}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;