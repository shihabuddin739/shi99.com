"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { 
  UserCircle, Wallet, History, Users, Copy, Check, 
  ArrowUpRight, ArrowDownLeft, ChevronRight, LogOut 
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  _id: string;
  type: string;
  method: string;
  amount: number;
  status: string;
  createdAt: string;
  trxId?: string;
}

interface Referral {
  _id: string;
  username: string;
  createdAt: string;
}

interface DashboardData {
  user: {
    username: string;
    balance: number;
    role: string;
    referralCode: string;
    referralEarnings: number;
    createdAt: string;
  };
  stats: {
    totalDeposited: number;
    totalWithdrawn: number;
    totalReferrals: number;
  };
  transactions: Transaction[];
  referrals: Referral[];
}

export default function DashboardPage() {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'referral'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/user/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to load dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (authUser) fetchDashboardData();
  }, [authUser]);

  const copyReferralLink = () => {
    if (data?.user?.referralCode) {
      const link = `${window.location.origin}/register?ref=${data.user.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </main>
    );
  }

  if (!data) return null;

  const depositHistory = data.transactions.filter(t => t.type === 'deposit');
  const withdrawHistory = data.transactions.filter(t => t.type === 'withdraw');

  const renderStatus = (status: string) => {
    switch(status) {
      case 'approved': return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">অনুমোদিত</span>;
      case 'pending': return <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">অপেক্ষমান</span>;
      case 'rejected': return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">বাতিল</span>;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans pb-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-500/5 blur-[150px] rounded-[100%] pointer-events-none" />
      
      <Header />
      
      <div className="relative z-10 max-w-6xl mx-auto mt-12 px-4 md:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl mb-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(252,213,53,0.3)]">
                  <UserCircle className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{data.user.username}</h2>
                  <span className="text-xs text-yellow-500/70 font-black uppercase tracking-widest">ইউজার প্যানেল</span>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'ওভারভিউ', icon: <Wallet className="w-5 h-5" /> },
                  { id: 'deposit', label: 'ডিপোজিট হিস্ট্রি', icon: <ArrowDownLeft className="w-5 h-5" /> },
                  { id: 'withdraw', label: 'উইথড্র হিস্ট্রি', icon: <ArrowUpRight className="w-5 h-5" /> },
                  { id: 'referral', label: 'রেফারেল', icon: <Users className="w-5 h-5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-wider ${
                      activeTab === item.id 
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </nav>

              <hr className="border-white/5 my-6" />

              <button 
                onClick={() => void logout()}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all font-black text-sm uppercase tracking-wider border border-transparent"
              >
                <LogOut className="w-5 h-5" />
                লগআউট
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-transparent backdrop-blur-xl border border-yellow-500/30 rounded-[40px] p-8 relative overflow-hidden shadow-[0_0_50px_rgba(252,213,53,0.05)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full pointer-events-none" />
                  <span className="text-xs uppercase font-black tracking-[0.2em] text-yellow-500/80 mb-2 block">বর্তমান ব্যালেন্স</span>
                  <h1 className="text-5xl md:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-yellow-500 mb-8">
                    ৳{data.user.balance.toLocaleString()}
                  </h1>
                  
                  <div className="flex flex-wrap gap-4 relative z-10">
                    <Link href="/wallet/deposit" className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl text-black font-black uppercase tracking-widest text-sm shadow-xl shadow-yellow-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                      <ArrowDownLeft className="w-4 h-4" /> ডিপোজিট
                    </Link>
                    <Link href="/wallet/withdraw" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-colors flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4" /> উইথড্র
                    </Link>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-[32px]">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                      <ArrowDownLeft className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">মোট ডিপোজিট</span>
                    <p className="text-2xl font-black text-white mt-1">৳{data.stats.totalDeposited.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-[32px]">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                      <ArrowUpRight className="w-6 h-6 text-red-500" />
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">মোট উইথড্র</span>
                    <p className="text-2xl font-black text-white mt-1">৳{data.stats.totalWithdrawn.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Deposit History Tab */}
            {activeTab === 'deposit' && (
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
                  <History className="w-6 h-6 text-yellow-500" />
                  ডিপোজিট হিস্ট্রি
                </h3>
                
                {depositHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 font-bold">কোনো ডিপোজিট রেকর্ড নেই</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                          <th className="pb-4 font-black">তারিখ</th>
                          <th className="pb-4 font-black">মাধ্যম</th>
                          <th className="pb-4 font-black">পরিমাণ</th>
                          <th className="pb-4 font-black">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody>
                        {depositHistory.map((t) => (
                          <tr key={t._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-5 text-sm text-gray-300">{new Date(t.createdAt).toLocaleDateString()}</td>
                            <td className="py-5 text-sm font-bold capitalize text-white">{t.method}</td>
                            <td className="py-5 text-sm font-black text-yellow-400">৳{t.amount}</td>
                            <td className="py-5">{renderStatus(t.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Withdraw History Tab */}
            {activeTab === 'withdraw' && (
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
                  <History className="w-6 h-6 text-yellow-500" />
                  উইথড্র হিস্ট্রি
                </h3>
                
                {withdrawHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 font-bold">কোনো উইথড্র রেকর্ড নেই</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                          <th className="pb-4 font-black">তারিখ</th>
                          <th className="pb-4 font-black">মাধ্যম</th>
                          <th className="pb-4 font-black">পরিমাণ</th>
                          <th className="pb-4 font-black">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawHistory.map((t) => (
                          <tr key={t._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-5 text-sm text-gray-300">{new Date(t.createdAt).toLocaleDateString()}</td>
                            <td className="py-5 text-sm font-bold capitalize text-white">{t.method}</td>
                            <td className="py-5 text-sm font-black text-yellow-400">৳{t.amount}</td>
                            <td className="py-5">{renderStatus(t.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Referral Tab */}
            {activeTab === 'referral' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/5 backdrop-blur-xl border border-yellow-500/30 rounded-[40px] p-8 shadow-[inset_0_0_30px_rgba(252,213,53,0.05)]">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 flex items-center gap-3">
                    <Users className="w-6 h-6 text-yellow-500" />
                    রেফারেল প্রোগ্রাম
                  </h3>
                  <p className="text-gray-400 text-sm font-medium mb-8">বন্ধুদের আমন্ত্রণ জানান এবং বোনাস জিতুন!</p>
                  
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="w-full overflow-hidden">
                      <span className="text-[10px] uppercase text-yellow-500/70 font-black tracking-widest block mb-1">আপনার রেফারেল লিংক</span>
                      <p className="text-white font-mono text-sm truncate bg-transparent outline-none w-full">
                        {`${window.location.origin}/register?ref=${data.user.referralCode}`}
                      </p>
                    </div>
                    <button 
                      onClick={copyReferralLink}
                      className="shrink-0 flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'কপি হয়েছে' : 'কপি করুন'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-[32px]">
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">মোট রেফারেল</span>
                    <p className="text-3xl font-black text-white mt-1">{data.stats.totalReferrals}</p>
                  </div>
                  <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-[32px]">
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">রেফারেল আয়</span>
                    <p className="text-3xl font-black text-yellow-400 mt-1">৳{data.user.referralEarnings.toLocaleString()}</p>
                  </div>
                </div>

                {/* Referred Users List */}
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[40px] p-8">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">আমন্ত্রিত বন্ধুরা</h4>
                  {data.referrals.length === 0 ? (
                    <p className="text-gray-500 text-sm font-bold">আপনি এখনও কাউকে ইনভাইট করেননি।</p>
                  ) : (
                    <div className="space-y-4">
                      {data.referrals.map(ref => (
                        <div key={ref._id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                               <UserCircle className="w-5 h-5 text-yellow-500" />
                            </div>
                            <span className="font-bold text-white text-sm">{ref.username}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-bold">{new Date(ref.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
