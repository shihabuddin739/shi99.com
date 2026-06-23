"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, ArrowUpRight, AlertCircle, Send, Check, Phone, Wallet } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function WithdrawPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<'bikash' | 'nagad' | 'rocket' | ''>('');
  const [amount, setAmount] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !number || !method) return;

    if (Number(amount) < 100) {
      setError('নূন্যতম ১০০ টাকা উইথড্র করা যাবে');
      return;
    }

    if (user && user.balance < Number(amount)) {
      setError('অপর্যাপ্ত ব্যালেন্স');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, amount, number }),
      });

      if (res.ok) {
        await refreshUser();
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'উইথড্র সাবমিট করা যায়নি');
      }
    } catch {
      setError('সার্ভার ত্রুটি, আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <Header />
        <div className="relative z-10 flex flex-col items-center justify-center p-6 mt-20">
          <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-yellow-500/20 rounded-[40px] p-12 text-center shadow-[0_0_50px_rgba(252,213,53,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                <CheckCircle2 className="w-12 h-12 text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 uppercase italic tracking-tighter">SUCCESSFUL!</h1>
            <p className="text-gray-300 mb-10 leading-relaxed font-medium">আপনার উইথড্র রিকোয়েস্টটি পেন্ডিং আছে। আমরা দ্রুত প্রক্রিয়াকরণ শুরু করব।</p>
            <Link 
              href="/" 
              className="w-full py-5 inline-block font-black rounded-2xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-black shadow-xl shadow-yellow-500/20 hover:scale-[1.02] transition-transform uppercase tracking-widest relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              BACK TO HOME
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-yellow-500/5 blur-[150px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Header />
      
      <div className="relative z-10 flex justify-center mt-8 md:mt-12 px-4 md:px-12">
        <div className="w-full max-w-2xl">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-all mb-8 font-black uppercase text-xs tracking-[0.2em] group w-max bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-yellow-500/30">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>ফিরে যান</span>
          </Link>

          {/* Premium Balance Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[40px] p-8 md:p-10 mb-12 shadow-2xl border border-white/5 group">
            {/* Animated gold border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-sm pointer-events-none" />
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-600/10 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="relative p-1 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-md" />
                  <div className="relative p-4 bg-[#1a1a1a] rounded-[22px] border border-yellow-500/20">
                    <ArrowUpRight className="w-10 h-10 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 uppercase tracking-tighter drop-shadow-sm">
                    উইথড্র <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600">করুন</span>
                  </h1>
                  <p className="text-yellow-500/70 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    নিরাপদ ও দ্রুত ক্যাশ-আউট
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-auto text-center md:text-right bg-black/40 backdrop-blur-xl px-8 py-5 rounded-[28px] border border-white/5 shadow-inner">
                 <span className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] block mb-2">বর্তমান ব্যালেন্স</span>
                 <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 italic drop-shadow-md">
                   <span className="text-2xl mr-1 font-sans not-italic text-yellow-500/80">৳</span>
                   {(user?.balance || 0).toLocaleString()}
                 </p>
              </div>
            </div>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-5 mb-10">
            {[
              { id: 'bikash', name: 'Bkash', color: 'from-[#e2136e] to-[#b80f58]', shadow: 'shadow-[#e2136e]/20', iconColor: 'text-[#e2136e]' },
              { id: 'nagad', name: 'Nagad', color: 'from-[#f7941d] to-[#d67b11]', shadow: 'shadow-[#f7941d]/20', iconColor: 'text-[#f7941d]' },
              { id: 'rocket', name: 'Rocket', color: 'from-[#8c3494] to-[#6c2873]', shadow: 'shadow-[#8c3494]/20', iconColor: 'text-[#8c3494]' },
            ].map((m) => {
              const isActive = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as 'bikash' | 'nagad' | 'rocket')}
                  className={`relative p-[1.5px] rounded-3xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-[0_0_30px_rgba(252,213,53,0.2)] scale-[1.02] -translate-y-1' 
                      : 'bg-white/5 hover:bg-white/10 hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`h-full w-full rounded-[22px] flex flex-col items-center gap-4 py-6 md:py-8 px-4 backdrop-blur-md transition-colors duration-300 ${
                    isActive ? 'bg-[#151515]' : 'bg-[#1a1a1a]/40'
                  }`}>
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[20px] bg-gradient-to-br ${m.color} flex items-center justify-center font-black text-white text-xs shadow-lg ${m.shadow} group-hover:scale-110 transition-transform duration-500 ring-2 ring-white/10`}>
                      {m.name}
                    </div>
                    <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white transition-colors'}`}>
                      {m.name}
                    </span>
                    
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-yellow-400 rounded-full p-1 shadow-[0_0_15px_rgba(252,213,53,0.8)] animate-in zoom-in duration-300">
                        <Check className="w-3 h-3 text-black stroke-[4]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {method && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Instructions Panel */}
              <div className="bg-[#151515] border border-white/5 rounded-3xl p-6 mb-8 flex gap-4 items-start shadow-xl">
                <div className="p-3 bg-yellow-500/10 rounded-2xl shrink-0">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-yellow-400 font-black uppercase text-xs tracking-widest mb-1">গুরুত্বপূর্ণ তথ্য</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    অনুগ্রহ করে আপনার সঠিক পার্সোনাল নম্বর দিন। উইথড্র রিকোয়েস্ট প্রসেস হতে সাধারণত <strong className="text-white">১০-৩০ মিনিট</strong> সময় লাগতে পারে। 
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none" />
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-sm font-bold flex items-center gap-3 mb-8 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4 mb-8 relative z-10">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-yellow-500" />
                    আপনার নম্বর (পার্সোনাল)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="relative w-full px-8 py-6 bg-[#0f0f0f] border border-white/10 rounded-2xl focus:border-yellow-500/50 outline-none transition-all font-mono text-white tracking-[0.15em] placeholder:text-gray-700 text-lg shadow-inner"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-10 relative z-10">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                    <Wallet className="w-3 h-3 text-yellow-500" />
                    পরিমাণ (Amount)
                  </label>
                  <div className="relative group">
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-center bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden focus-within:border-yellow-500/50 transition-colors shadow-inner">
                        <div className="pl-8 pr-5 py-6 flex items-center justify-center border-r border-white/5 bg-white/[0.02]">
                          <span className="text-yellow-400 font-black text-2xl">৳</span>
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-6 py-6 bg-transparent outline-none font-black text-white text-3xl placeholder:text-gray-800 italic"
                          placeholder="0.00"
                          required
                          min="100"
                        />
                      </div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">নূন্যতম ১০০ টাকা</p>
                    <button 
                      type="button" 
                      onClick={() => setAmount(user?.balance.toString() || '0')}
                      className="text-[10px] text-yellow-500 hover:text-yellow-400 font-black uppercase tracking-widest bg-yellow-500/10 px-3 py-1 rounded-lg transition-colors"
                    >
                      MAX (সব)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-3xl group shadow-[0_10px_40px_rgba(252,213,53,0.15)] hover:shadow-[0_10px_50px_rgba(252,213,53,0.3)] transition-all duration-300 z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  <div className="relative py-6 flex items-center justify-center gap-3 text-black font-black text-lg uppercase tracking-widest">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        প্রসেসিং...
                      </div>
                    ) : (
                      <>
                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        উইথড্র রিকোয়েস্ট পাঠান
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
