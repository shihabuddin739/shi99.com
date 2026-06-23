"use client";

import React, { useState, useEffect } from 'react';
import {
  Users,
  Wallet,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';

interface UserSummary {
  balance: number;
}

interface TransactionSummary {
  status: string;
  type: string;
}

interface DashboardStats {
  totalUsers: number;
  pendingDeposits: number;
  totalBalance: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingDeposits: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    let ignore = false;

    const fetchStats = async () => {
      try {
        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json() as { users?: UserSummary[] };

        const transRes = await fetch('/api/admin/transactions');
        const transData = await transRes.json() as { transactions?: TransactionSummary[] };

        if (!ignore && usersRes.ok && transRes.ok) {
          const users = usersData.users ?? [];
          const transactions = transData.transactions ?? [];
          const totalUsers = users.length;
          const pending = transactions.filter(
            (t) => t.status === 'pending' && t.type === 'deposit'
          ).length;
          const balance = users.reduce((acc, user) => acc + user.balance, 0);

          setStats({ totalUsers, pendingDeposits: pending, totalBalance: balance });
        }
      } catch {
        if (!ignore) {
          console.error('Failed to load admin dashboard stats');
        }
      }
    };

    void fetchStats();

    return () => {
      ignore = true;
    };
  }, []);

  const adminModules = [
    { 
      title: 'পেমেন্ট নম্বর', 
      desc: 'বিকাশ, নগদ এবং রকেট নম্বর সেট করুন', 
      icon: Smartphone, 
      link: '/admin/payments', 
      color: 'bg-yellow-600/20 text-yellow-500' 
    },
    { 
      title: 'ইউজার লিস্ট', 
      desc: 'ইউজার ম্যানেজ করুন এবং ব্যালেন্স যোগ করুন', 
      icon: Users, 
      link: '/admin/users', 
      color: 'bg-emerald-600/20 text-emerald-400' 
    },
    { 
      title: 'ট্রানজ্যাকশন', 
      desc: 'ডিপোজিট এবং উইথড্র রিকোয়েস্ট এপ্রুভ করুন', 
      icon: History, 
      link: '/admin/transactions', 
      color: 'bg-yellow-600/20 text-yellow-500' 
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-[28px] flex items-center justify-center border border-yellow-500/20 shadow-2xl shadow-yellow-500/5">
                <ShieldCheck className="w-10 h-10 text-yellow-500" />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white">
                COMMAND <span className="text-yellow-500">CENTER</span>
            </h1>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] ml-20 flex items-center gap-3 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            SYSTEM OPERATIONAL - ALL SYSTEMS GOLD
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-sidebar/40 border border-white/5 p-12 rounded-[48px] relative overflow-hidden group shadow-2xl backdrop-blur-xl">
            <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700 text-white">
                <Users className="w-48 h-48" />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] mb-6">Total Population</p>
                <h3 className="text-6xl font-black text-white flex items-baseline gap-3 italic">
                    {stats.totalUsers} 
                    <span className="text-sm font-black text-slate-700 tracking-widest uppercase">USERS</span>
                </h3>
            </div>
        </div>
        <div className="bg-sidebar/60 border border-yellow-500/20 p-12 rounded-[48px] relative overflow-hidden group shadow-2xl shadow-yellow-500/5 backdrop-blur-xl">
            <div className="absolute -right-8 -bottom-8 opacity-10 transform group-hover:scale-110 transition-transform duration-700 text-yellow-500">
                <ArrowDownLeft className="w-48 h-48" />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-yellow-500 tracking-[0.3em] mb-6">Incoming Requests</p>
                <h3 className="text-6xl font-black text-yellow-500 flex items-baseline gap-3 italic">
                    {stats.pendingDeposits}
                    <span className="text-sm font-black text-yellow-500/40 tracking-widest uppercase">PENDING</span>
                </h3>
            </div>
        </div>
        <div className="bg-sidebar/40 border border-white/5 p-12 rounded-[48px] relative overflow-hidden group shadow-2xl backdrop-blur-xl">
            <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700 text-white">
                <Wallet className="w-48 h-48" />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] mb-6">Economy Volume</p>
                <h3 className="text-6xl font-black text-white flex items-baseline gap-3 italic">
                    <span className="text-3xl text-slate-700">৳</span>{stats.totalBalance.toLocaleString()}
                </h3>
            </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
        {adminModules.map((module, i) => (
            <Link key={i} href={module.link} className="block group">
                <div className="bg-sidebar/40 border border-white/5 p-12 rounded-[54px] h-full flex flex-col items-center text-center hover:border-yellow-500/40 transition-all duration-700 hover:shadow-2xl hover:shadow-yellow-500/10 relative overflow-hidden group/card shadow-xl backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                    <div className={`w-28 h-28 rounded-[40px] ${module.color} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10 shadow-2xl`}>
                        <module.icon className="w-14 h-14" />
                    </div>
                    <h4 className="text-2xl font-black mb-4 relative z-10 uppercase tracking-tighter text-white italic">{module.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed relative z-10 font-bold uppercase tracking-widest">{module.desc}</p>
                    
                    <div className="mt-12 flex items-center gap-3 text-yellow-400 font-black text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 relative z-10">
                        LAUNCH MODULE <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </Link>
        ))}
      </div>
    </div>
  );
}
