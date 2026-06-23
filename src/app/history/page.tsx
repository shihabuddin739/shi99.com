"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { History, ArrowDownLeft, ArrowUpRight, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface TransactionItem {
  _id: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'game_play';
  method: string;
  number: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        const data = await res.json() as { transactions?: TransactionItem[] };
        if (res.ok) {
          setTransactions(data.transactions ?? []);
        }
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHistory();
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-accent-gold transition-all mb-10 font-black uppercase text-xs tracking-[0.2em] group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>ফিরে যান</span>
        </Link>

        <div className="flex items-center gap-6 mb-12">
          <div className="p-4 bg-yellow-500/10 rounded-[28px] border border-yellow-500/20">
            <History className="w-10 h-10 text-accent-gold" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">লেনদেনের ইতিহাস</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">আপনার সকল ডিপোজিট এবং উইথড্র স্ট্যাটাস এখানে দেখুন</p>
          </div>
        </div>

        <div className="space-y-6">
          {transactions.map((t) => (
            <div key={t._id} className="bg-sidebar/60 border border-white/5 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-yellow-500/20 transition-all group shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/0 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center gap-6 relative z-10">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${
                      t.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                      {t.type === 'deposit' ? <ArrowDownLeft className="w-10 h-10" /> : <ArrowUpRight className="w-10 h-10" />}
                  </div>
                  <div>
                      <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-black text-white italic">৳{t.amount}</span>
                          <span className={`text-[10px] uppercase font-black px-4 py-1 rounded-full border ${
                              t.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                              {t.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                          </span>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{t.method} <span className="mx-2 text-white/10">|</span> {t.number}</p>
                  </div>
               </div>

               <div className="flex flex-col md:items-end gap-3 text-center md:text-right relative z-10 w-full md:w-auto">
                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border ${
                        t.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        t.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                        {t.status}
                    </div>
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(t.createdAt).toLocaleString()}
                    </span>
               </div>
            </div>
          ))}

          {transactions.length === 0 && !loading && (
             <div className="text-center py-24 bg-sidebar/20 rounded-[60px] border border-dashed border-white/5 shadow-inner">
                <History className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">এখনো কোনো লেনদেন করা হয়নি</p>
                <Link href="/wallet/deposit" className="text-yellow-500 text-xs font-black uppercase tracking-widest mt-6 inline-block hover:text-white transition-all underline decoration-yellow-500/30 underline-offset-8">প্রথম ডিপোজিট করুন</Link>
             </div>
          )}

          {loading && (
             <div className="text-center py-20 text-slate-600 font-black uppercase tracking-widest text-xs animate-pulse">লোডিং হচ্ছে...</div>
          )}
        </div>
      </div>
    </div>
  );
}
