"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from 'react';
import { Plane, Menu, HelpCircle, Volume2, Minus, Plus, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const COLORS = {
  greenBet: '#2ac300',
  redCancel: '#8f1020',
  amberCashout: '#d79a10',
};

const historySeed = [1.06, 10.24, 50.06, 1.16, 7.21, 4.0, 10.4, 2.02, 7.94, 1.0, 1.83, 1.11, 2.88, 4.36, 22.45, 1.09, 1.48, 1.73];

const mockBets = Array.from({ length: 18 }, (_, i) => ({
  name: `${['B', 'G', 'a', 'M', 'D', 'A', 'S'][i % 7]}***${(i * 4) % 10}`,
  amount: (84.83 + i * 17.22).toFixed(2),
  mult: (1.19 + (i % 7) * 0.47).toFixed(2),
  win: (201.91 + i * 29.35).toFixed(2),
  avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=aviator${i}`,
}));

type BetPanelProps = {
  bet: number;
  setBet: React.Dispatch<React.SetStateAction<number>>;
  isPlaced: boolean;
  cashout: number | null;
  isFlying: boolean;
  isCrashed: boolean;
  onBet: () => void;
  onCashout: () => void;
  onCancel: () => void;
  multiplier: number;
};

const getCrashPoint = () => {
  const isShortRound = Math.random() < 0.88;
  return isShortRound ? 1 + Math.random() * 1.4 : 2.5 + Math.random() * 30;
};

const getTimestamp = () => performance.now();

const historyChipClass = (value: number) => {
  if (value >= 10) return 'bg-fuchsia-700/70 text-fuchsia-100';
  if (value >= 2) return 'bg-violet-700/70 text-violet-100';
  return 'bg-sky-700/70 text-sky-100';
};

export default function AviatorEngine() {
  const [multiplier, setMultiplier] = useState(1);
  const [isFlying, setIsFlying] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [balance, setBalance] = useState(0.16);
  const [history, setHistory] = useState(historySeed);
  const [bet1, setBet1] = useState(1);
  const [bet2, setBet2] = useState(1);
  const [cashout1, setCashout1] = useState<number | null>(null);
  const [cashout2, setCashout2] = useState<number | null>(null);
  const [isPlaced1, setIsPlaced1] = useState(false);
  const [isPlaced2, setIsPlaced2] = useState(false);
  const [planeTilt, setPlaneTilt] = useState(0);

  const requestRef = useRef<number>(null!);
  const startTimeRef = useRef<number>(null!);
  const crashPointRef = useRef(1);

  const startNewRound = () => {
    if (isFlying) return;

    crashPointRef.current = getCrashPoint();
    setMultiplier(1);
    setIsFlying(true);
    setIsCrashed(false);
    setCashout1(null);
    setCashout2(null);
    setPlaneTilt(0);
    startTimeRef.current = getTimestamp();
    requestRef.current = requestAnimationFrame(animate);
  };

  const animate = () => {
    const elapsed = (getTimestamp() - startTimeRef.current) / 1000;
    const nextMultiplier = 1 + Math.pow(elapsed, 1.5) * 0.05;

    if (nextMultiplier >= crashPointRef.current) {
      cancelAnimationFrame(requestRef.current);
      setMultiplier(crashPointRef.current);
      setIsCrashed(true);
      setIsFlying(false);
      setIsPlaced1(false);
      setIsPlaced2(false);
      setPlaneTilt(0);
      setHistory((prev) => [parseFloat(crashPointRef.current.toFixed(2)), ...prev].slice(0, 18));
      return;
    }

    setMultiplier(nextMultiplier);
    setPlaneTilt(Math.sin(getTimestamp() / 90) * 2.6);
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleCashout = (betNum: 1 | 2, betAmount: number) => {
    if (!isFlying || isCrashed) return;

    const winAmount = betAmount * multiplier;
    setBalance((prev) => prev + winAmount);
    if (betNum === 1) {
      setCashout1(multiplier);
      setIsPlaced1(false);
    } else {
      setCashout2(multiplier);
      setIsPlaced2(false);
    }
  };

  const handlePlaceBet = (betNum: 1 | 2, amount: number) => {
    if (isFlying) return;
    setBalance((prev) => Math.max(prev - amount, 0));

    if (betNum === 1) setIsPlaced1(true);
    else setIsPlaced2(true);

    startNewRound();
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-[18px] bg-[#111214] text-white">
      <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,#1a1c20_0%,#101114_42%,#0b0c0e_100%)]">
        <div className="flex h-11 items-center justify-between border-b border-white/8 bg-[#17181b] px-3">
          <div className="text-[22px] font-black italic tracking-tight text-[#ff214f]">Aviator</div>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-[#f0a300] px-3 py-1 text-xs font-bold text-black">
              <span className="inline-flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> How to play?</span>
            </button>
            <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm font-black text-white/85">{balance.toFixed(2)}</div>
            <button className="rounded-full border border-white/10 bg-white/5 p-2 text-white/75"><Menu className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-hidden border-b border-white/6 bg-[#141518] px-3 py-2">
          {history.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className={cn('rounded-full px-3 py-1 text-[11px] font-black', historyChipClass(value))}
            >
              {value.toFixed(2)}x
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-white/65">
            <Volume2 className="h-3.5 w-3.5" /> Live
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-3 p-3">
          <aside className="hidden w-[285px] shrink-0 rounded-[18px] border border-white/8 bg-[#151619] lg:flex lg:flex-col">
            <div className="grid grid-cols-3 gap-1 border-b border-white/6 p-2 text-xs font-black text-white/60">
              <div className="rounded-full bg-white/10 py-1 text-center text-white">All Bets</div>
              <div className="rounded-full py-1 text-center">My Bets</div>
              <div className="rounded-full py-1 text-center">Top</div>
            </div>

            <div className="border-b border-white/6 px-4 py-3">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-white">TOTAL BETS: <span className="text-lime-400">448</span></span>
                <span className="inline-flex items-center gap-1 text-white/60"><HelpCircle className="h-3.5 w-3.5" /> Previous hand</span>
              </div>
              <div className="mt-3 grid grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr] text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                <span>User</span>
                <span>Bet</span>
                <span>Coef.</span>
                <span>Win</span>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2 no-scrollbar">
              {mockBets.map((bet, index) => {
                const highlighted = index === 5;
                return (
                  <div
                    key={`${bet.name}-${index}`}
                    className={cn(
                      'grid grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr] items-center gap-2 rounded-[16px] border px-2 py-1.5 text-sm',
                      highlighted
                        ? 'border-lime-500/60 bg-lime-600/20'
                        : 'border-white/8 bg-[#101114]',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <img src={bet.avatar} alt="" className="h-8 w-8 rounded-full border border-white/10" />
                      <span className="truncate font-bold text-white/90">{bet.name}</span>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-center font-bold">{bet.amount}</span>
                    <span className="text-center font-bold text-sky-300">{highlighted ? `${bet.mult}x` : '-'}</span>
                    <span className="text-center font-bold text-white/90">{highlighted ? bet.win : '-'}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/6 px-3 py-2 text-xs font-bold text-white/45">
              <span className="inline-flex items-center gap-1 text-lime-400"><ShieldCheck className="h-3.5 w-3.5" /> Provably Fair</span>
              <span>Powered by SPRIBE</span>
            </div>
          </aside>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] border border-white/8 bg-[#0b0b0d]">
              <div className="absolute inset-0 bg-[repeating-conic-gradient(from_270deg_at_0%_100%,rgba(255,255,255,0.06)_0deg,rgba(255,255,255,0.06)_9deg,transparent_9deg,transparent_18deg)] opacity-70" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.25))]" />

              <div className="absolute inset-x-0 bottom-6 left-6 right-6 z-10 h-[2px] bg-[#5e1b27]">
                <div className="absolute inset-y-0 left-0 w-[40%] bg-[#ff214f]" />
              </div>

              <svg className="absolute inset-0 z-10 h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="aviatorPath" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff214f" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#ff214f" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                {isFlying && (
                  <>
                    <path
                      d={`M 22 ${350} Q ${190} ${320} ${160 + (multiplier - 1) * 155} ${335 - (multiplier - 1) * 115} L ${160 + (multiplier - 1) * 155} 350 Z`}
                      fill="url(#aviatorPath)"
                    />
                    <path
                      d={`M 22 ${350} Q ${190} ${320} ${160 + (multiplier - 1) * 155} ${335 - (multiplier - 1) * 115}`}
                      stroke="#ff214f"
                      strokeWidth="4"
                      fill="none"
                    />
                  </>
                )}
              </svg>

              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  {isCrashed ? (
                    <motion.div
                      key="crash"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="text-5xl font-black text-[#ff214f] md:text-7xl">FLEW AWAY!</div>
                      <div className="mt-2 text-4xl font-black text-white md:text-6xl">{multiplier.toFixed(2)}x</div>
                    </motion.div>
                  ) : (
                    <motion.div key={multiplier} animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 0.12 }}>
                      <div className="text-5xl font-black text-white md:text-[96px]">{multiplier.toFixed(2)}x</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isFlying && !isCrashed && (
                <motion.div
                  animate={{
                    x: 120 + (multiplier - 1) * 150,
                    y: 255 - (multiplier - 1) * 90,
                    rotate: -12 + planeTilt,
                  }}
                  transition={{ duration: 0.08, ease: 'linear' }}
                  className="absolute left-8 top-1/2 z-30"
                >
                  <Plane className="h-16 w-16 fill-[#ff214f] text-[#ff214f] drop-shadow-[0_0_12px_rgba(255,33,79,0.55)] md:h-24 md:w-24" />
                </motion.div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AviatorBetPanel
                bet={bet1}
                setBet={setBet1}
                isPlaced={isPlaced1}
                cashout={cashout1}
                isFlying={isFlying}
                isCrashed={isCrashed}
                onBet={() => handlePlaceBet(1, bet1)}
                onCashout={() => handleCashout(1, bet1)}
                onCancel={() => {
                  setIsPlaced1(false);
                  setBalance((prev) => prev + bet1);
                }}
                multiplier={multiplier}
              />
              <AviatorBetPanel
                bet={bet2}
                setBet={setBet2}
                isPlaced={isPlaced2}
                cashout={cashout2}
                isFlying={isFlying}
                isCrashed={isCrashed}
                onBet={() => handlePlaceBet(2, bet2)}
                onCashout={() => handleCashout(2, bet2)}
                onCancel={() => {
                  setIsPlaced2(false);
                  setBalance((prev) => prev + bet2);
                }}
                multiplier={multiplier}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AviatorBetPanel({
  bet,
  setBet,
  isPlaced,
  cashout,
  isFlying,
  isCrashed,
  onBet,
  onCashout,
  onCancel,
  multiplier,
}: BetPanelProps) {
  let buttonColor = COLORS.greenBet;
  let buttonText = 'BET';
  let buttonAction = onBet;

  if (isPlaced && !isFlying) {
    buttonColor = COLORS.redCancel;
    buttonText = 'CANCEL';
    buttonAction = onCancel;
  } else if (isPlaced && isFlying && !cashout) {
    buttonColor = COLORS.amberCashout;
    buttonText = 'CASH OUT';
    buttonAction = onCashout;
  } else if (cashout) {
    buttonColor = '#2b2d32';
    buttonText = 'CASHED';
  }

  return (
    <div className="rounded-[18px] border border-white/8 bg-[#1a1b1f] p-4">
      <div className="mx-auto flex w-[170px] rounded-full border border-white/8 bg-black/25 p-1 text-xs font-bold">
        <div className="flex-1 rounded-full bg-white/10 py-1 text-center text-white">Bet</div>
        <div className="flex-1 py-1 text-center text-white/45">Auto</div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center rounded-full border border-white/10 bg-black/35 px-3 py-2">
            <div className="flex min-w-0 flex-1 items-center justify-center gap-3 text-white">
              <button onClick={() => setBet((prev) => Math.max(1, prev - 1))} className="text-white/45 hover:text-white">
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-[18px] font-black">{bet.toFixed(2)}</span>
              <button onClick={() => setBet((prev) => prev + 1)} className="text-white/45 hover:text-white">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {[5, 10, 20, 100].map((value) => (
              <button
                key={value}
                onClick={() => setBet(value)}
                className="rounded-full border border-white/8 bg-white/5 py-1 text-xs font-bold text-white/65 hover:text-white"
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={buttonText === 'CASHED' || (isCrashed && isPlaced)}
          onClick={buttonAction}
          className={cn(
            'h-20 w-[45%] rounded-[20px] text-center text-2xl font-black tracking-[0.08em] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.15),0_10px_24px_rgba(0,0,0,0.28)] transition-transform active:scale-[0.98]',
            buttonText === 'CASHED' && 'text-white/60',
          )}
          style={{ backgroundColor: buttonColor }}
        >
          <div>{buttonText}</div>
          <div className={cn('mt-1 text-[11px] font-bold tracking-[0.18em]', buttonText === 'CASH OUT' ? 'text-black/65' : 'text-white/70')}>
            {buttonText === 'CASH OUT' ? (bet * multiplier).toFixed(2) : bet.toFixed(2)}
          </div>
        </button>
      </div>
    </div>
  );
}
