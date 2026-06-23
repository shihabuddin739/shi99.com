"use client";

import React from 'react';
import { 
  Home,
  Wallet,
  History,
  Trophy,
  Gift,
  Target,
  Smartphone,
  Headphones,
  Users,
  Flame,
  Bomb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { icon: Home, label: 'হোম', href: '/' },
  { icon: Wallet, label: 'ডিপোজিট', href: '/wallet/deposit' },
  { icon: Bomb, label: 'উইথড্র', href: '/wallet/withdraw' },
  { icon: History, label: 'ইতিহাস', href: '/history' },
  { icon: Flame, label: 'পরম খেলা', group: true },
  { icon: Users, label: 'বন্ধুদের আমন্ত্রণ' },
  { icon: Gift, label: 'অফার' },
  { icon: Trophy, label: 'পুরস্কার কেন্দ্র' },
  { icon: Target, label: 'মিশন' },
  { icon: Smartphone, label: 'এ্যাপ্লিকেশন' },
  { icon: Headphones, label: 'সাপোর্ট' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-24 md:w-72 bg-gradient-to-b from-[#050814] via-[#0a0e1a] to-[#01040d] h-screen fixed left-0 top-0 pt-24 pb-8 flex flex-col items-center overflow-y-auto border-r border-yellow-500/20 no-scrollbar z-40 shadow-[10px_0_40px_rgba(250,204,21,0.1)]">
      <div className="w-full px-3 md:px-6 space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href;
          const content = (
            <div
              className={cn(
                "flex flex-col md:flex-row items-center p-4 rounded-[24px] cursor-pointer transition-all duration-500 group gap-3 md:gap-4 relative overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-yellow-900/40 to-transparent text-accent-gold border border-yellow-500/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
              )}
              <item.icon className={cn(
                "w-6 h-6 transition-transform group-hover:scale-125 duration-500 z-10",
                isActive ? "text-accent-gold" : "group-hover:text-accent-gold"
              )} />
              <span className={cn(
                "text-[10px] md:text-sm font-black uppercase tracking-[0.15em] text-center md:text-left leading-tight z-10",
                isActive ? "text-accent-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" : "group-hover:text-white"
              )}>
                {item.label}
              </span>
            </div>
          );

          if (item.href) {
            return (
              <Link href={item.href} key={index} className="block w-full">
                {content}
              </Link>
            );
          }

          return <div key={index}>{content}</div>;
        })}
      </div>

      <div className="mt-auto px-6 w-full pt-8">
        <div className="bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/30 p-6 rounded-[32px] text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-xs font-black text-white uppercase mb-1">VIP মেম্বারশিপ</p>
            <p className="text-[10px] text-gray-400 mb-4">আরও বেশি সুবিধা পেতে জয়েন করুন</p>
            <button className="w-full bg-yellow-500 text-black text-[10px] font-black py-2 rounded-xl">জয়েন করুন</button>
        </div>
      </div>
    </aside>
  );
}
