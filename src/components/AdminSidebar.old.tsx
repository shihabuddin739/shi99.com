"use client";

import React from 'react';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Settings,
  Bell,
  LogOut,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'সারসংক্ষেপ', href: '/admin/dashboard' },
  { icon: Smartphone, label: 'পেমেন্ট নম্বর', href: '/admin/payments' },
  { icon: Users, label: 'ইউজার লিস্ট', href: '/admin/users' },
  { icon: ArrowLeftRight, label: 'ট্রানজ্যাকশন', href: '/admin/transactions' },
  { icon: Bell, label: 'নোটিফিকেশন' },
  { icon: Settings, label: 'সেটিংস' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 md:w-80 bg-sidebar h-screen fixed left-0 top-0 flex flex-col border-r border-white/5 z-[60] shadow-[10px_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Admin Branding */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-br from-sidebar to-yellow-950/20">
        <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <span className="hidden md:block">
            <span className="text-white uppercase italic">Admin</span>
            <span className="text-yellow-500 uppercase italic ml-1">Pro</span>
          </span>
        </h1>
      </div>

      <div className="flex-1 px-4 py-10 space-y-3 overflow-y-auto no-scrollbar">
        {adminMenuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={index} href={item.href || '#'} className="block">
              <div className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-2xl shadow-yellow-500/5 font-black uppercase text-xs" 
                  : "text-slate-500 hover:bg-white/5 hover:text-white uppercase text-xs font-bold"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-yellow-400" : "group-hover:text-yellow-400"
                )} />
                <span className={cn(
                  "hidden md:block tracking-widest",
                  isActive ? "text-white" : "group-hover:text-white"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/5">
        <Link href="/" className="flex items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-all group font-black uppercase text-xs tracking-widest">
          <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
          <span className="hidden md:block">এক্সিট ড্যাশবোর্ড</span>
        </Link>
      </div>
    </aside>
  );
}
