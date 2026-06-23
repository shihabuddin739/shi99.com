"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Banner() {
  return (
    <div className="relative w-full aspect-[21/10] md:aspect-[3.2/1] rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5 group">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full h-full"
      >
        <Image 
          src="/images/banner.png" 
          alt="SHI999 Promotion" 
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        
        {/* Advanced Grade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#01040d] via-[#01040d]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-100" />
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/5 opacity-50" />
        
        {/* Banner Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-20">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-accent-gold text-black px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-accent-gold/20">
                LIMITED OFFER
              </span>
              <div className="w-2 h-2 rounded-full bg-accent-gold animate-ping shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              <span className="text-white/60 text-[10px] md:text-sm font-bold uppercase tracking-widest">নতুন মেম্বার গিফট</span>
            </div>
            
            <h2 className="text-4xl md:text-7xl font-black mb-6 leading-[1.05] drop-shadow-2xl">
               <span className="premium-gradient italic">VIP</span> মেম্বারশীপ <br/>
               <span className="text-white uppercase">ডে বোনাস</span>
            </h2>
            
            <p className="text-sm md:text-2xl text-white/70 font-medium max-w-lg leading-relaxed mb-8">
              প্রতি মাসের ৩, ১৩ এবং ২৩ তারিখে <span className="text-yellow-400 font-black underline decoration-yellow-400/30">১০ হাজার কোটি</span> ব্যালেন্স বিতরণ! এখনই জয়েন করুন।
            </p>

            <div className="flex items-center gap-4">
                <button className="bg-yellow-500 text-black px-10 py-5 font-black flex items-center gap-3 shadow-2xl shadow-yellow-500/30 group/btn rounded-full hover:bg-yellow-400 transition-all">
                   <Play className="w-6 h-6 fill-current group-hover/btn:scale-110 transition-transform" />
                   এখনই শুরু করুন
                </button>
                <button className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 hover:border-yellow-500/40 transition-all text-xs uppercase tracking-widest">
                   অফার ডিটেইলস
                </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-20 hidden lg:block opacity-20 hover:opacity-40 transition-opacity">
            <div className="w-64 h-64 border-[32px] border-accent-gold/20 rounded-full" />
        </div>
      </motion.div>

      {/* Pagination dots (Stateless mockup) */}
      <div className="absolute bottom-8 right-12 flex gap-3 z-20">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === 0 ? 'bg-accent-gold w-10' : 'bg-white/20 w-3'}`} />
        ))}
      </div>
    </div>
  );
}
