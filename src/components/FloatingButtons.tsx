"use client";

import React from 'react';
import { MessageSquare, Share2, Send, User, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingButtons() {
  const buttons = [
    { icon: MessageSquare, color: 'bg-[#25D366]', label: 'WhatsApp' },
    { icon: Share2, color: 'bg-[#1877F2]', label: 'Facebook' },
    { icon: Send, color: 'bg-[#0088cc]', label: 'Telegram' },
    { icon: User, color: 'bg-accent-teal', label: 'Support' },
  ];

  return (
    <div className="fixed right-6 bottom-32 flex flex-col gap-3 z-40">
      {buttons.map((btn, i) => (
        <motion.div
          key={i}
          whileHover={{ x: -10 }}
          className={`${btn.color} p-3 rounded-full text-white shadow-xl cursor-pointer hover:brightness-110 transition-all group relative`}
        >
          <btn.icon className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {btn.label}
          </span>
        </motion.div>
      ))}
      
      {/* Featured Games Floating Button */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="bg-[#020617] p-4 rounded-3xl text-accent-gold shadow-2xl cursor-pointer mt-6 border border-accent-gold/40 shadow-accent-gold/20 backdrop-blur-xl group"
      >
        <Trophy className="w-6 h-6 mx-auto mb-1 group-hover:scale-125 transition-transform" />
        <span className="text-[9px] font-black leading-tight text-center block uppercase italic tracking-tighter">WIN<br/>REWARDS</span>
      </motion.div>
    </div>
  );
}
