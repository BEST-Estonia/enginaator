"use client"

import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import engikaLogo from '@/assets/engikaLogo.png';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (email === "admin@enginaator.com" && password === "admin123") {
        localStorage.setItem('adminAuth', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-black via-red-500 to-black flex items-center justify-center p-4'>
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <Image 
            src={engikaLogo}
            alt="Enginaator Logo" 
            width={400} 
            height={60} 
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-semibold text-white [font-family:var(--font-poppins)]">Admin Dashboard</h2>
          <p className="text-black mt-2 text-xl [font-family:var(--font-poppins)]">Sign in to manage the platform.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl space-y-6">
          <h1 className='text-black text-2xl mb-4 [font-family:var(--font-poppins)]'>Admin Login</h1>
          <p className='text-gray-600 mb-6'>Please enter your Admin credentials to login</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email input */}
            <div>
              <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-2'>
                Email Address
              </label>
              <input
                id="email"
                type='email'
                required
                placeholder='Enter your email'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password section */}
            <div>
              <label htmlFor="password" className='block text-gray-700 text-sm font-bold mb-2'>
                Password
              </label>
              <input 
                id="password"
                type='password'
                required
                placeholder='Enter your password'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button 
              type="submit"
              disabled={isLoading}
              className='bg-[#ce1f22] hover:bg-[#a01b1e] disabled:bg-gray-300 px-4 py-2 rounded-md w-full text-white font-medium transition-colors duration-200'>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </form>

          {/* Register Link*/}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don&apos;t have an admin account?{' '}
              <Link href="/admin/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Register here
              </Link>
            </p>
          </div>

          {/* Back to Main Site*/}
          <div className="text-center">
            <Link href="/" className="text-black hover:text-gray-600 text-sm transition-colors">
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin;
