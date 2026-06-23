"use client";

import React from 'react';
import Image from 'next/image';
import { Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  image: string;
  isHot?: boolean;
  badge?: string;
  description?: string;
  onClick?: () => void;
  onDemoClick?: () => void;
}

export default function GameCard({ title, image, onClick, onDemoClick }: GameCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative aspect-[3/4] bg-[#0a0e1a] rounded-[24px] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500"
    >
      <Image 
        src={image} 
        alt={title} 
        fill 
        className=" transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Dark Overlay on Hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Heart Icon (Top Right) */}
      <div className="absolute top-4 right-4 z-20">
        <div className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
        </div>
      </div>

      {/* JILI Badge (Top Left - if applicable) */}
      <div className="absolute top-3 left-3 z-20">
          <div className="bg-yellow-500/90 text-black text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg italic">
            JILI
          </div>
      </div>

      {/* Hover Buttons */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="w-48 py-3 bg-yellow-500 rounded-xl flex items-center justify-center gap-3 text-black font-black uppercase text-xs shadow-[0_0_30px_rgba(250,204,21,0.6)]"
        >
          <Play fill="currentColor" className="w-5 h-5" />
          Play Now
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          onClick={(e) => { e.stopPropagation(); onDemoClick?.(); }}
          className="w-48 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center gap-3 text-white font-black uppercase text-xs hover:bg-white/20 transition-all"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Demo Play
        </motion.button>
      </div>

      {/* Title on Hover (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
        <p className="text-white text-sm font-bold text-center truncate uppercase tracking-widest">{title}</p>
      </div>
    </motion.div>
  );
}
