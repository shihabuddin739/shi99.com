"use client";

import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const symbols = ['7️⃣', '🍒', '🍋', '🔔', '💎', '🍇', '⭐'];

export default function SlotEngine({ gameTitle }: { gameTitle: string }) {
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [reels, setReels] = useState(['⭐', '⭐', '⭐']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<null | 'win' | 'lose'>(null);
  const [winAmount, setWinAmount] = useState(0);

  const controlOne = useAnimation();
  const controlTwo = useAnimation();
  const controlThree = useAnimation();
  const controls = [controlOne, controlTwo, controlThree];

  const spin = async () => {
    if (balance < bet) return;
    
    setIsSpinning(true);
    setResult(null);
    setWinAmount(0);
    setBalance(prev => prev - bet);

    // 1:9 Logic (House Edge Script)
    const isWin = Math.random() < 0.1; 
    let finalReels: string[];

    if (isWin) {
      const luckySymbol = symbols[Math.floor(Math.random() * symbols.length)];
      finalReels = [luckySymbol, luckySymbol, luckySymbol];
    } else {
      // Guaranteed lose: make sure at least one is different
      finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        // Force last one to be different
        finalReels[2] = symbols[(symbols.indexOf(finalReels[2]) + 1) % symbols.length];
      }
    }

    // Animation
    await Promise.all(controls.map((ctrl, i) => {
      return ctrl.start({
        y: [0, -100, 0],
        transition: { 
          duration: 1 + i * 0.5,
          repeat: 3,
          ease: "linear"
        }
      });
    }));

    setReels(finalReels);
    setIsSpinning(false);

    if (isWin) {
      const payout = bet * 10;
      setWinAmount(payout);
      setBalance(prev => prev + payout);
      setResult('win');
    } else {
      setResult('lose');
    }
  };

  return (
    <div className="w-full h-full bg-[#111] flex flex-col p-6 rounded-2xl relative overflow-hidden">
      {/* Decorative Lights */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-accent-gold/20 to-transparent animate-pulse" />
      
      {/* Game Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <p className="text-[10px] text-accent-teal font-bold tracking-[0.3em] mb-1">PREMIUM JILI SLOT</p>
           <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">{gameTitle}</h3>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-right">
           <p className="text-[10px] text-white/40 font-bold">CURRENT BALANCE</p>
           <p className="text-xl font-black text-accent-gold tracking-tight">৳{balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Main Reels Area */}
      <div className="flex-1 flex items-center justify-center gap-4 py-8 bg-[#0a0a0a] rounded-3xl border-4 border-white/5 shadow-inner relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10 opacity-60" />
        
        {reels.map((symbol, i) => (
          <div key={i} className="relative w-24 h-32 md:w-32 md:h-44 bg-[#1a1a1a] rounded-2xl border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
            <motion.div animate={controls[i]} className="text-5xl md:text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {symbol}
            </motion.div>
            {/* Reel Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40" />
          </div>
        ))}
        
        {/* Win Overlay */}
        <AnimatePresence>
          {result === 'win' && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Trophy className="w-20 h-20 text-accent-gold mb-2" />
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter animate-bounce">BIG WIN!</h2>
              <p className="text-2xl font-bold text-accent-gold">+ ৳{winAmount}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loss Info */}
        <AnimatePresence>
          {result === 'lose' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-4 z-20 bg-red-500/20 border border-red-500/30 px-6 py-2 rounded-full backdrop-blur-md"
            >
              <p className="text-red-400 font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> আরও একবার চেষ্টা করুন!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex-1 flex items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[10px] text-white/40 font-bold mb-2 uppercase">Amount per spin</span>
              <div className="flex items-center gap-4 bg-black/40 rounded-full px-4 py-2 border border-white/5">
                 {[10, 50, 100, 500].map(val => (
                   <button 
                    key={val} 
                    onClick={() => setBet(val)}
                    className={cn(
                      "w-10 h-10 rounded-full transition-all font-bold text-xs",
                      bet === val ? "bg-accent-teal text-white shadow-lg shadow-accent-teal/30" : "text-white/40 hover:text-white"
                    )}
                   >৳{val}</button>
                 ))}
              </div>
           </div>
        </div>

        <button
          disabled={isSpinning || balance < bet}
          onClick={spin}
          className={cn(
            "relative w-full md:w-64 h-20 rounded-2xl flex flex-col items-center justify-center transition-all shadow-2xl overflow-hidden group",
            isSpinning || balance < bet 
              ? "bg-gray-700 cursor-not-allowed opacity-50" 
              : "bg-gradient-to-r from-[#ffea00] via-[#ffb000] to-[#ff9100] hover:scale-[1.02] active:scale-95"
          )}
        >
          {isSpinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
          ) : (
            <>
              <span className="text-black text-2xl font-black tracking-tighter italic leading-none group-hover:scale-110 transition-transform">SPIN NOW</span>
              <span className="text-black/60 text-[10px] font-bold mt-1">COST: ৳{bet}</span>
            </>
          )}
          
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
