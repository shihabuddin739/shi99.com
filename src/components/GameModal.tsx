"use client";

import React, { useEffect, useState } from 'react';
import { X, RefreshCw, ChevronLeft, Maximize2, ShieldCheck, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SoftApiGame from './SoftApiGame';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: {
    title: string;
    image: string;
    type?: 'aviator' | 'slot' | 'premium-slot' | 'pro-slot' | 'softapi';
    game_uid?: string;
    isDemo?: boolean;
  } | null;
}

export default function GameModal({ isOpen, onClose, game }: GameModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsFullscreen(false);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!game) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden"
        >
          {/* Top Navbar */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="absolute top-0 left-0 right-0 h-16 bg-[#111111]/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 border-b border-[#fcd535]/20 z-10 shadow-[0_4px_30px_rgba(252,213,53,0.1)]"
          >
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#fcd535] transition-all group"
            >
              <div className="bg-[#222] p-1.5 rounded-lg group-hover:bg-[#fcd535]/20 border border-transparent group-hover:border-[#fcd535]/30 transition-all">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="font-bold hidden sm:block uppercase text-xs tracking-wider">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-[#fcd535] animate-pulse" />
              <h2 className="text-base sm:text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fcd535] to-[#fff] uppercase tracking-wide truncate max-w-[150px] sm:max-w-xs">
                {game.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
               <button 
                onClick={() => window.location.reload()} 
                className="bg-[#222] p-2 rounded-lg text-[#a0a0a0] hover:text-[#fcd535] hover:bg-[#fcd535]/10 border border-transparent hover:border-[#fcd535]/30 transition-all group"
                title="Reload Game"
               >
                 <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-700" />
               </button>
               <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-[#222] p-2 rounded-lg text-[#a0a0a0] hover:text-[#fcd535] hover:bg-[#fcd535]/10 border border-transparent hover:border-[#fcd535]/30 transition-all group hidden sm:block"
                title="Toggle Fullscreen"
               >
                 <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
               </button>
               <button 
                onClick={onClose}
                className="bg-[#dc2626]/10 p-2 rounded-lg text-[#dc2626] hover:bg-[#dc2626] hover:text-white border border-[#dc2626]/30 transition-all group ml-1 sm:ml-2"
               >
                 <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
               </button>
            </div>
          </motion.div>

          {/* Game Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }}
            className={`w-full relative bg-[#0a0a0a] overflow-hidden shadow-[0_0_80px_rgba(252,213,53,0.15)] border border-[#fcd535]/20 flex flex-col mt-12 sm:mt-8
              ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none mt-0' : 'max-w-7xl h-[80vh] min-h-[500px] rounded-2xl sm:rounded-[32px]'}`
            }
          >
            {isFullscreen && (
               <button 
                 onClick={() => setIsFullscreen(false)}
                 className="absolute top-4 right-4 z-[60] bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition-all"
               >
                 <X className="w-6 h-6" />
               </button>
            )}

            <div className="w-full h-full flex-1 relative z-10 bg-[#000]">
               <SoftApiGame gameUid={game.game_uid || ''} isDemo={game.isDemo} />
            </div>
            
            {/* Inner Glow Effects */}
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#fcd535]/50 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#fcd535]/50 to-transparent z-20 pointer-events-none" />
          </motion.div>
          
          {/* Security Badge */}
          {!isFullscreen && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111]/80 border border-[#222] shadow-lg backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
              <div className="w-2 h-2 bg-[#16a34a] rounded-full animate-pulse ml-1" />
              <p className="text-[#a0a0a0] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] ml-1">
                Secure Session <span className="hidden sm:inline">• Premium Engine</span>
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
