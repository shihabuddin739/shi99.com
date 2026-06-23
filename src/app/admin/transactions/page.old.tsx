"use client";

import React, { useState, useEffect } from 'react';
import { History, Check, X, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface TransactionRecord {
  _id: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  method: string;
  number: string;
  trxId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user?: {
    username: string;
  };
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    const res = await fetch('/api/admin/transactions');
    const data = await res.json() as { transactions?: TransactionRecord[] };
    if (res.ok) {
      setTransactions(data.transactions ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      await fetchTransactions();
      if (!ignore) {
        setLoading(false);
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: id, status }),
    });

    if (res.ok) {
      await fetchTransactions();
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <h1 className="text-5xl font-black flex items-center gap-6 uppercase tracking-tighter italic text-white">
          <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/5">
              <History className="w-10 h-10 text-yellow-500" />
          </div>
          ট্রানজ্যাকশন <span className="text-yellow-500">OPERATIONS</span>
      </h1>

      <div className="grid gap-8">
        {transactions.map((t) => (
          <div key={t._id} className="bg-sidebar/20 border border-white/5 p-10 rounded-[48px] flex flex-col lg:flex-row lg:items-center justify-between gap-10 hover:border-yellow-500/40 transition-all shadow-2xl group relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex items-center gap-8 relative z-10">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 ${
                    t.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                    {t.type === 'deposit' ? <ArrowDownLeft className="w-10 h-10" /> : <ArrowUpRight className="w-10 h-10" />}
                </div>
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-4xl font-black text-white italic tracking-tighter">৳{t.amount.toLocaleString()}</span>
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${
                            t.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                            {t.type}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        OPERATOR: <span className="text-white">{t.user?.username}</span> 
                        <span className="text-slate-800">|</span>
                        PORT: <span className="text-yellow-400 font-black">{t.method}</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:items-end gap-3 relative z-10">
                {t.trxId && (
                    <div className="text-[10px] font-black font-mono text-slate-400 bg-background px-5 py-2 rounded-xl border border-white/5 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        TRX_ID: {t.trxId}
                    </div>
                )}
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">GATEWAY ADDR: <span className="text-white italic">{t.number}</span></p>
                <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(t.createdAt).toLocaleString()}
                </p>
            </div>

            <div className="flex items-center gap-4 relative z-10">
                {t.status === 'pending' ? (
                    <>
                        <button 
                            onClick={() => handleAction(t._id, 'approved')}
                            className="bg-yellow-500 text-black px-12 py-5 rounded-[24px] font-black flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-yellow-500/20 uppercase tracking-widest text-[10px]"
                        >
                            <Check className="w-5 h-5" /> AUTHORIZE
                        </button>
                        <button 
                            onClick={() => handleAction(t._id, 'rejected')}
                            className="bg-white/5 text-rose-400 px-8 py-5 rounded-[24px] font-black border border-white/5 hover:bg-rose-500 hover:text-black transition-all uppercase tracking-widest text-[10px]"
                        >
                            <X className="w-5 h-5" /> REJECT
                        </button>
                    </>
                ) : (
                    <div className={`px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3 border shadow-2xl ${
                        t.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                        {t.status === 'approved' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        {t.status}
                    </div>
                )}
            </div>
          </div>
        ))}

        {transactions.length === 0 && !loading && (
            <div className="text-center py-32 bg-sidebar/20 rounded-[60px] border border-dashed border-white/5 shadow-inner">
                <Clock className="w-16 h-16 mx-auto mb-6 text-slate-700 animate-pulse" />
                <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">NO ACTIVE REQUESTS IN BUFFER</p>
            </div>
        )}
      </div>
    </div>
  );
}
