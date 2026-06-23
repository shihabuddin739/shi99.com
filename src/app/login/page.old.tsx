"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, User, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-gold/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-teal/5 blur-[120px] rounded-full" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-accent-gold transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>ফিরে যান</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2">লগইন করুন</h1>
          <p className="text-gray-400">আপনার SHI999 অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 ml-1">ইউজারনাম</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-sidebar/50 border border-white/10 rounded-2xl focus:border-accent-gold outline-none transition-all"
                placeholder="Username লিখুন"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 ml-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-sidebar/50 border border-white/10 rounded-2xl focus:border-accent-gold outline-none transition-all"
                placeholder="Password লিখুন"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-button py-4 rounded-2xl text-lg font-black mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : (
              <>
                <LogIn className="w-5 h-5" />
                লগইন
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400">
          অ্যাকাউন্ট নেই? <Link href="/register" className="text-accent-gold font-bold hover:underline">নিবন্ধন করুন</Link>
        </p>
      </div>
    </div>
  );
}
