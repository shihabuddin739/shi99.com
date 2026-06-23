"use client";

import React, { useState, useEffect } from 'react';
import { User, Wallet, Plus, Minus, Search } from 'lucide-react';

interface AdminUser {
  _id: string;
  username: string;
  balance: number;
  role: 'user' | 'admin';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [amount, setAmount] = useState('');

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json() as { users?: AdminUser[] };
    if (res.ok) {
      setUsers(data.users ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      await fetchUsers();
      if (!ignore) {
        setLoading(false);
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleBalanceUpdate = async (action: 'add' | 'subtract') => {
    if (!selectedUser || !amount) return;
    
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser._id, amount, action }),
    });

    if (res.ok) {
      setAmount('');
      setSelectedUser(null);
      await fetchUsers();
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <h1 className="text-5xl font-black flex items-center gap-6 uppercase tracking-tighter italic text-white">
          <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/5">
              <User className="w-10 h-10 text-yellow-500" />
          </div>
          ইউজার <span className="text-yellow-500">PRO</span>
      </h1>

      <div className="relative max-w-md shadow-2xl group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
        <input
            type="text"
            placeholder="ইউজারনাম দিয়ে সার্চ করুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sidebar/40 border border-white/5 py-5 pl-14 pr-6 rounded-[24px] outline-none focus:border-yellow-500/40 transition-all font-black text-white placeholder:text-slate-700 tracking-widest uppercase text-xs"
        />
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-500 font-black uppercase tracking-[0.3em] text-xs">
          লোডিং হচ্ছে...
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
             <div className="bg-sidebar/20 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-black bg-white/5 border-b border-white/5">
                            <th className="py-6 pl-8">IDENTIFIER</th>
                            <th className="py-6">CRYPTO BALANCE</th>
                            <th className="py-6">ACCESS STATUS</th>
                            <th className="py-6 text-right pr-8">OPERATIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-yellow-500/5 transition-all group">
                                <td className="py-6 pl-8 font-black text-white italic tracking-tighter text-lg">{u.username}</td>
                                <td className="py-6 font-black text-yellow-400 italic text-xl tracking-tighter">৳{u.balance.toLocaleString()}</td>
                                <td className="py-6">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                                        u.role === 'admin' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-white/5 text-slate-600 border-white/5'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-6 text-right pr-8">
                                    <button 
                                        onClick={() => setSelectedUser(u)}
                                        className="text-[9px] font-black uppercase tracking-[0.3em] bg-background text-white px-6 py-3 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all border border-white/5 shadow-xl group-hover:scale-105"
                                    >
                                        MODULATE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>

        {selectedUser && (
            <div className="lg:col-span-1 bg-sidebar/40 border border-yellow-500/20 p-12 rounded-[54px] sticky top-32 h-fit animate-in fade-in zoom-in-95 shadow-2xl shadow-yellow-600/10 backdrop-blur-2xl">
                <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter text-white italic">
                    <Wallet className="w-8 h-8 text-yellow-500" />
                    BALANCE <span className="text-yellow-500">OPS</span>
                </h2>
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] block mb-4 ml-1">CREDIT VOLUME (৳)</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500 font-black text-xl">৳</span>
                            <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-background border border-white/10 p-6 pl-12 rounded-3xl outline-none focus:border-yellow-500 font-black text-white text-2xl tracking-tighter"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <button 
                            onClick={() => handleBalanceUpdate('add')}
                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-black transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/5 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> ADD
                        </button>
                        <button 
                            onClick={() => handleBalanceUpdate('subtract')}
                            className="bg-rose-500/10 text-rose-400 border border-rose-500/20 py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-black transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-rose-500/5 group"
                        >
                            <Minus className="w-5 h-5 group-hover:scale-x-150 transition-transform" /> SUB
                        </button>
                    </div>
                    <button 
                        onClick={() => setSelectedUser(null)}
                        className="w-full text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-8 hover:text-white transition-all underline underline-offset-8 decoration-white/10"
                    >
                        CANCEL OPERATION
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
