"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Smartphone, ShieldCheck } from 'lucide-react';

interface PaymentNumber {
  _id: string;
  method: string;
  number: string;
  type: string;
}

interface NewPaymentNumber {
  method: 'bikash' | 'nagad' | 'rocket';
  number: string;
  type: 'Personal' | 'Agent' | 'Merchant';
}

export default function AdminPaymentsPage() {
  const [numbers, setNumbers] = useState<PaymentNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNumber, setNewNumber] = useState<NewPaymentNumber>({
    method: 'bikash',
    number: '',
    type: 'Personal',
  });

  const fetchNumbers = async () => {
    const res = await fetch('/api/admin/payments');
    const data = await res.json() as { numbers?: PaymentNumber[] };
    if (res.ok) {
      setNumbers(data.numbers ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      await fetchNumbers();
      if (!ignore) {
        setLoading(false);
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.number) return;

    const res = await fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNumber),
    });

    if (res.ok) {
      setNewNumber((current) => ({ ...current, number: '' }));
      await fetchNumbers();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch('/api/admin/payments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      await fetchNumbers();
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-black flex items-center gap-6 uppercase tracking-tighter italic text-white">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/5">
                <Smartphone className="w-10 h-10 text-yellow-500" />
            </div>
            পেমেন্ট <span className="text-yellow-500">GATEWAY</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 bg-sidebar/40 border border-yellow-500/20 p-10 rounded-[48px] shadow-2xl backdrop-blur-2xl">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter text-white italic">
            <Plus className="w-6 h-6 text-yellow-500" />
            ADD CHANNEL
          </h2>
          <form onSubmit={handleAdd} className="space-y-8">
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] block mb-4 ml-1">NETWORK METHOD</label>
              <select
                value={newNumber.method}
                onChange={(e) => setNewNumber((current) => ({
                  ...current,
                  method: e.target.value as NewPaymentNumber['method']
                }))}
                className="w-full bg-background border border-white/10 p-5 rounded-2xl outline-none focus:border-yellow-500 transition-all font-black text-white text-sm"
              >
                <option value="bikash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] block mb-4 ml-1">ACCOUNT TYPE</label>
              <select
                value={newNumber.type}
                onChange={(e) => setNewNumber((current) => ({
                  ...current,
                  type: e.target.value as NewPaymentNumber['type']
                }))}
                className="w-full bg-background border border-white/10 p-5 rounded-2xl outline-none focus:border-yellow-500 transition-all font-black text-white text-sm"
              >
                <option value="Personal">Personal</option>
                <option value="Agent">Agent</option>
                <option value="Merchant">Merchant</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] block mb-4 ml-1">MOBILE NUMBER</label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                value={newNumber.number}
                onChange={(e) => setNewNumber((current) => ({ ...current, number: e.target.value }))}
                className="w-full bg-background border border-white/10 p-5 rounded-2xl outline-none focus:border-yellow-500 transition-all font-black tracking-[0.2em] text-white"
                required
              />
            </div>
            <button type="submit" className="w-full py-5 rounded-[24px] font-black bg-yellow-500 text-black shadow-2xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs">DEPLOY CHANNEL</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter text-white italic">
            <ShieldCheck className="w-6 h-6 text-yellow-500" />
            ACTIVE CHANNELS
          </h2>
          
          <div className="grid gap-6">
            {numbers.map((n) => (
              <div key={n._id} className="bg-sidebar/20 border border-white/5 p-8 rounded-[40px] flex items-center justify-between group hover:border-yellow-500/40 transition-all shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-8 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-[10px] uppercase shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${
                        n.method === 'bikash' ? 'bg-[#D12053]' : n.method === 'nagad' ? 'bg-[#F7941D]' : 'bg-[#8B3191]'
                    }`}>
                        {n.method}
                    </div>
                    <div>
                        <p className="text-3xl font-black tracking-widest text-white italic">{n.number}</p>
                        <span className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em]">{n.type} ACCOUNT</span>
                    </div>
                </div>
                <button 
                    onClick={() => handleDelete(n._id)}
                    className="p-4 bg-red-500/10 text-red-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xl relative z-20"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {numbers.length === 0 && !loading && (
                <div className="text-center py-24 text-slate-600 font-black uppercase tracking-[0.2em] text-xs bg-sidebar/20 rounded-[60px] border border-dashed border-white/5 shadow-inner">
                    কোনো নম্বর পাওয়া যায়নি। বাম পাশের ফর্ম থেকে নম্বর যোগ করুন।
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
