"use client";

import React, { useState } from 'react';
import { LogOut, User, Wallet, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 bg-background/40 backdrop-blur-3xl z-50 h-20 border-b border-yellow-500/10 px-4 md:px-12 flex items-center justify-between shadow-[0_10px_50px_rgba(250,204,21,0.05)]">
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-accent-gold rounded-[14px] flex items-center justify-center rotate-12 transition-all group-hover:rotate-0 shadow-[0_0_20px_rgba(250,204,21,0.4)] group-hover:scale-110">
                <ShieldCheck className="w-6 h-6 text-[#01040d]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter cursor-pointer italic">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">SHI</span>
              <span className="text-accent-gold drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">999</span>
              <span className="bg-accent-gold/20 text-accent-gold text-[9px] px-3 py-1 rounded-full ml-3 align-middle font-black tracking-[0.3em] border border-accent-gold/20 shadow-inner">ULTRA</span>
            </h1>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <div className="flex items-center gap-2 text-accent-gold">
                    <Wallet className="w-4 h-4 text-accent-gold" />
                    <span className="font-black text-lg">৳{user.balance.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{user.username}</span>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 pl-4 rounded-2xl border border-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center shadow-inner">
                      <User className="w-5 h-5 text-accent-gold" />
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 ${isMenuOpen ? 'rotate-180 text-accent-gold' : ''}`} />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-sidebar border border-white/10 rounded-3xl shadow-2xl p-3 z-[60] backdrop-blur-2xl animate-in fade-in zoom-in-95">
                      <div className="p-4 border-b border-white/5 mb-2 md:hidden">
                         <div className="flex items-center gap-2 text-accent-gold mb-1">
                            <Wallet className="w-4 h-4" />
                            <span className="font-black text-xl">৳{user.balance.toLocaleString()}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{user.username}</span>
                      </div>

                      {user.role === 'admin' && (
                        <Link href="/admin/dashboard" className="flex items-center gap-3 w-full p-4 hover:bg-accent-gold/10 rounded-2xl transition-all text-accent-gold group">
                          <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-black uppercase text-xs tracking-widest">অ্যাডমিন ড্যাশবোর্ড</span>
                        </Link>
                      )}
                      
                      <Link href="/wallet/deposit" className="flex items-center gap-3 w-full p-4 hover:bg-white/5 rounded-2xl transition-all group">
                        <Wallet className="w-5 h-5 text-slate-400 group-hover:text-accent-gold" />
                        <span className="font-bold text-sm">ডিপোজিট</span>
                      </Link>

                      <button 
                        onClick={logout}
                        className="flex items-center gap-3 w-full p-4 hover:bg-red-500/10 text-red-400 rounded-2xl transition-all mt-2 group"
                      >
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">লগআউট</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <button className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-2xl font-bold transition-all text-sm">
                    লগইন
                  </button>
                </Link>
                <Link href="/register">
                  <button className="gold-button px-10 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-accent-gold/20">
                    নিবন্ধন
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
