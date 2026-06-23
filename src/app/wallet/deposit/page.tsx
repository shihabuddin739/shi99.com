"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Wallet, ChevronLeft, CheckCircle2, Copy, AlertCircle, Send, Check } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function DepositPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<'bikash' | 'nagad' | 'rocket' | ''>('');
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [adminNumber, setAdminNumber] = useState('');
  const [numberType, setNumberType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchNumber = async (selectedMethod: string) => {
    setError('');
    try {
      const res = await fetch(`/api/transactions/deposit?method=${selectedMethod}`);
      const data = await res.json();
      if (res.ok) {
        setAdminNumber(data.number);
        setNumberType(data.type);
      } else {
        setError(data.error || 'এই মুহূর্তে কোনো নম্বর পাওয়া যায়নি');
        setAdminNumber('');
      }
    } catch {
      setError('নম্বর লোড করতে সমস্যা হয়েছে');
    }
  };

  const handleMethodSelect = (m: 'bikash' | 'nagad' | 'rocket') => {
    setMethod(m);
    fetchNumber(m);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !trxId || !adminNumber) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, amount, number: adminNumber, trxId }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'ডিপোজিট সাবমিট করা যায়নি');
      }
    } catch {
      setError('সার্ভার ত্রুটি, আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#111111] text-white font-sans relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <Header />
        <div className="relative z-10 flex flex-col items-center justify-center p-6 mt-20">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-yellow-500/30 rounded-[40px] p-12 text-center shadow-[0_0_50px_rgba(252,213,53,0.1)]">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 uppercase italic tracking-tighter">SUCCESSFUL!</h1>
            <p className="text-gray-300 mb-10 leading-relaxed font-medium">আপনার ডিপোজিট রিকোয়েস্টটি পেন্ডিং আছে। ৫-১৫ মিনিটের মধ্যে ব্যালেন্স যোগ হবে।</p>
            <Link 
              href="/" 
              className="w-full py-5 inline-block font-black rounded-2xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-black shadow-xl shadow-yellow-500/20 hover:scale-[1.02] transition-transform uppercase tracking-widest"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans pb-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-500/5 blur-[150px] rounded-[100%] pointer-events-none" />
      
      <Header />
      
      <div className="relative z-10 flex justify-center mt-12 px-4 md:px-12">
        <div className="w-full max-w-2xl">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-all mb-10 font-black uppercase text-xs tracking-[0.2em] group w-max">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>ফিরে যান</span>
          </Link>

          {/* Header Title */}
          <div className="flex items-center gap-6 mb-12">
            <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 rounded-3xl border border-yellow-500/30 shadow-[0_0_30px_rgba(252,213,53,0.15)]">
              <Wallet className="w-10 h-10 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase italic tracking-tighter">
                ডিপোজিট <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">করুন</span>
              </h1>
              <p className="text-yellow-500/70 text-[10px] font-black uppercase tracking-[0.3em] mt-2">পছন্দের মাধ্যম সিলেক্ট করুন</p>
            </div>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12">
            {[
              { id: 'bikash', name: 'Bkash', color: 'from-[#e2136e] to-[#b80f58]', shadow: 'shadow-[#e2136e]/20' },
              { id: 'nagad', name: 'Nagad', color: 'from-[#f7941d] to-[#d67b11]', shadow: 'shadow-[#f7941d]/20' },
              { id: 'rocket', name: 'Rocket', color: 'from-[#8c3494] to-[#6c2873]', shadow: 'shadow-[#8c3494]/20' },
            ].map((m) => {
              const isActive = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMethodSelect(m.id as 'bikash' | 'nagad' | 'rocket')}
                  className={`relative p-1 rounded-3xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-[0_0_30px_rgba(252,213,53,0.3)] scale-[1.02]' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`h-full w-full rounded-[22px] flex flex-col items-center gap-4 py-6 px-4 backdrop-blur-md ${
                    isActive ? 'bg-[#1a1a1a]/90' : 'bg-[#1a1a1a]/40'
                  }`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center font-black text-white text-xs shadow-xl ${m.shadow} group-hover:scale-110 transition-transform duration-500`}>
                      {m.name}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white transition-colors'}`}>
                      {m.name}
                    </span>
                    
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-yellow-400 rounded-full p-0.5 shadow-[0_0_10px_rgba(252,213,53,0.8)]">
                        <Check className="w-3 h-3 text-black stroke-[4]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {method && adminNumber && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {/* Instructions & Number Panel */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-10 mb-10 relative overflow-hidden shadow-2xl">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none" />
                
                <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter text-yellow-400">
                  <AlertCircle className="w-6 h-6" />
                  ইনস্ট্রাকশন
                </h2>
                <p className="text-base text-gray-300 leading-relaxed mb-8">
                  নিচের নম্বরে <span className="text-yellow-400 font-black px-2 py-1 bg-yellow-400/10 rounded-md mx-1">CASHOUT</span> করুন। ক্যাশআউট করার পর প্রাপ্ত <span className="text-white font-black underline decoration-yellow-400/50 decoration-2 underline-offset-4">Transaction ID (TrxID)</span> নিচের ফর্ম টিতে দিন।
                </p>
                
                {/* Glowing VIP Number Box */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[inset_0_0_20px_rgba(252,213,53,0.05)]">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500/70 font-black mb-2 block">অফিসিয়াল নম্বর ({numberType})</span>
                        <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 tracking-[0.1em] drop-shadow-sm">{adminNumber}</p>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(adminNumber)}
                        className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-yellow-500/20 uppercase text-xs tracking-widest relative overflow-hidden"
                    >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'কপি হয়েছে' : 'কপি করুন'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Deposit Form Panel */}
              <form onSubmit={handleSubmit} className="relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-sm font-bold flex items-center gap-3 mb-8">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 block">পরিমাণ (Amount)</label>
                  <div className="relative group">
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-center bg-black/30 border border-white/10 rounded-2xl overflow-hidden focus-within:border-yellow-500/50 transition-colors">
                        <div className="pl-6 pr-4 py-5 flex items-center justify-center bg-white/5 border-r border-white/5">
                          <span className="text-yellow-400 font-black text-xl">৳</span>
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-6 py-5 bg-transparent outline-none font-black text-white text-xl placeholder:text-gray-600"
                          placeholder="নূন্যতম ১০০"
                          required
                          min="100"
                        />
                      </div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 block">Transaction ID (TrxID)</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="relative w-full px-8 py-6 bg-black/30 border border-white/10 rounded-2xl focus:border-yellow-500/50 outline-none transition-all font-mono text-white tracking-[0.15em] placeholder:text-gray-600 text-lg"
                      placeholder="আপনার TrxID এখানে দিন"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-3xl group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative py-6 flex items-center justify-center gap-3 text-black font-black text-lg uppercase tracking-widest">
                    {loading ? 'প্রসেসিং হচ্ছে...' : (
                      <>
                        <Send className="w-5 h-5" />
                        রিকোয়েস্ট পাঠান
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          )}

          {method && !adminNumber && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-yellow-500">
                <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mb-4" />
                <span className="font-black uppercase tracking-widest text-xs">লোড হচ্ছে...</span>
            </div>
          )}

          {error && method && !adminNumber && (
               <div className="bg-red-500/5 border border-red-500/10 text-red-500 p-8 rounded-[32px] text-center mt-8 backdrop-blur-sm">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-bold">{error}</p>
                  <button onClick={() => fetchNumber(method)} className="mt-6 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors underline underline-offset-4">আবার চেষ্টা করুন</button>
               </div>
          )}
        </div>
      </div>
    </main>
  );
}
