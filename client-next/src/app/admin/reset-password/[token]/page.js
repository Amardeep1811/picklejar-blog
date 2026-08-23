"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import Image from 'next/image';
import axios from "@/api/axios";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a special character');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)] font-ui">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--bg-2)] border-r border-[var(--line)] flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          <Image src="https://via.placeholder.com/800x600.png?text=WalletPickle+Brand+Image" alt="WalletPickle Brand" width={800} height={600} className="w-full h-auto object-contain rounded-lg shadow-sm" />
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center lg:hidden mb-8">
            <Image src="https://via.placeholder.com/400x200.png?text=Brand" alt="WalletPickle" width={400} height={200} className="mx-auto h-16 w-auto object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 font-heading text-[var(--ink)]">
            Reset Password
          </h1>
          
          {message && (
            <div className="bg-[var(--green)]/10 border border-[var(--green)] text-[var(--green-dark)] px-4 py-3 rounded mb-6 text-center text-sm font-bold">
              {message}
              <div className="text-xs mt-2 font-medium">Redirecting to login...</div>
            </div>
          )}

          {error && (
            <div className="bg-[var(--bg-2)] border border-[var(--red)] text-[var(--red)] px-4 py-3 rounded mb-6 text-center text-sm font-medium">
              {error}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-sm border border-[var(--line)]">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[var(--ink-2)]">New Password</label>
                <p className="text-[11px] text-[var(--gray)] mb-2 font-medium">At least 8 chars, 1 uppercase, 1 lowercase, 1 special char</p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    minLength="8"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[var(--line)] rounded-lg px-4 py-2.5 pr-10 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--gray-2)] hover:text-[var(--ink)] transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[var(--ink-2)]">Confirm New Password</label>
                <p className="text-[11px] text-[var(--gray)] mb-2 font-medium">At least 8 chars, 1 uppercase, 1 lowercase, 1 special char</p>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    minLength="8"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-[var(--line)] rounded-lg px-4 py-2.5 pr-10 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--gray-2)] hover:text-[var(--ink)] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] hover:shadow-md ${
                  loading ? 'bg-[var(--gray-2)] cursor-not-allowed' : 'bg-[var(--green)] hover:bg-[var(--green-dark)]'
                }`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
