"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-indigo-500 font-bold animate-pulse flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping" />
            প্রবেশাধিকার যাচাই করা হচ্ছে...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      <AdminSidebar />
      <main className="flex-1 ml-20 md:ml-80 p-6 md:p-12 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto pt-4">
          {children}
        </div>
      </main>
    </div>
  );
}
