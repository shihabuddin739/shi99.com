"use client";

import React from 'react';
import { Flame, Star, Dices, Radio, Activity, Gamepad2, Spade, Fish, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { icon: Flame, label: 'গরম খেলা', active: true },
  { icon: Star, label: 'প্রিয়' },
  { icon: Dices, label: 'স্লট' },
  { icon: Radio, label: 'লাইভ' },
  { icon: Activity, label: 'স্পোর্টস' },
  { icon: Gamepad2, label: 'ই-স্পোর্টস' },
  { icon: Spade, label: 'পোকার' },
  { icon: Fish, label: 'ফিশিং' },
  { icon: Ticket, label: 'লটারি' },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 md:gap-4 my-8">
      {categories.map((cat, index) => (
        <div 
          key={index}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-[28px] cursor-pointer transition-all duration-500 border border-yellow-500/10 group relative overflow-hidden",
            cat.active 
              ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-[0_0_25px_rgba(250,204,21,0.4)] scale-105 z-10" 
              : "bg-[#050814]/60 hover:bg-[#111827] text-slate-400 hover:text-white"
          )}
        >
          <cat.icon className={cn(
            "w-6 h-6 md:w-8 md:h-8 mb-3 transition-transform group-hover:scale-110",
            cat.active ? "text-black" : "text-yellow-500/60"
          )} />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
