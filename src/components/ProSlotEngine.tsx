"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProCard = {
  id: string;
  rank: string;
  suit: string;
  tone: 'red' | 'black';
  lane: string;
  isScatter?: boolean;
};

const symbols: ProCard[] = [
  { id: '9S', rank: '9', suit: '♠', tone: 'black', lane: 'Stealth' },
  { id: '10D', rank: '10', suit: '♦', tone: 'red', lane: 'Dash' },
  { id: 'JH', rank: 'J', suit: '♥', tone: 'red', lane: 'Blaze' },
  { id: 'QC', rank: 'Q', suit: '♣', tone: 'black', lane: 'Cipher' },
  { id: 'KH', rank: 'K', suit: '♥', tone: 'red', lane: 'Pulse' },
  { id: 'AS', rank: 'A', suit: '♠', tone: 'black', lane: 'Apex' },
];

const proScatter: ProCard = {
  id: 'SC',
  rank: 'SC',
  suit: '✦',
  tone: 'red',
  lane: 'Scatter',
  isScatter: true,
};

const visibleRows = 4;
const reelCount = 5;
const fillerCount = 10;
const reelCellHeight = 84;
const reelGap = 6;
const reelWindowHeight = visibleRows * reelCellHeight + (visibleRows - 1) * reelGap + 8;

const pickProCard = () => symbols[Math.floor(Math.random() * symbols.length)];
const randomProColumn = () => Array.from({ length: visibleRows }, () => pickProCard());
const randomProGrid = () => Array.from({ length: reelCount }, () => randomProColumn());
const buildProStrip = (finalColumn: ProCard[]) => [...Array.from({ length: fillerCount }, () => pickProCard()), ...finalColumn];

function ProCardFace({ card }: { card: ProCard }) {
  if (card.isScatter) {
    return (
      <div className="relative flex h-[76px] w-full flex-col overflow-hidden rounded-[10px] border border-amber-300/70 bg-[linear-gradient(180deg,#261544,#49216a_60%,#180b25)] p-1.5 shadow-[0_6px_16px_rgba(234,179,8,0.24)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,217,102,0.3),transparent_55%)]" />
        <div className="relative z-10 flex items-start justify-between text-[10px] font-black text-amber-100">
          <div className="leading-none">
            <div>SC</div>
            <div>✦</div>
          </div>
          <span className="rounded-full bg-amber-200/15 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.18em]">Bonus</span>
        </div>
        <div className="relative z-10 flex flex-1 items-center justify-center text-lg font-black tracking-[0.16em] text-amber-100">SC</div>
        <div className="relative z-10 ml-auto rotate-180 text-[10px] font-black leading-none text-amber-100">
          <div>SC</div>
          <div>✦</div>
        </div>
      </div>
    );
  }

  const toneClass = card.tone === 'red' ? 'text-rose-600' : 'text-slate-900';

  return (
    <div className="relative flex h-[76px] w-full flex-col overflow-hidden rounded-[10px] border border-[#8aa0b0] bg-[linear-gradient(180deg,#f7fbff,#dce7f2)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
      <div className="absolute inset-x-0 top-0 h-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),transparent)]" />
      <div className={cn('relative z-10 flex items-start justify-between text-[10px] font-black', toneClass)}>
        <div className="leading-none">
          <div>{card.rank}</div>
          <div className="text-[9px]">{card.suit}</div>
        </div>
        <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[6px] uppercase tracking-[0.16em] text-black/50">
          {card.lane}
        </span>
      </div>
      <div className={cn('relative z-10 flex flex-1 items-center justify-center text-[30px] font-black', toneClass)}>
        {card.suit}
      </div>
      <div className={cn('relative z-10 ml-auto rotate-180 text-[10px] font-black leading-none', toneClass)}>
        <div>{card.rank}</div>
        <div className="text-[9px]">{card.suit}</div>
      </div>
    </div>
  );
}

export default function ProSlotEngine() {
  const [balance, setBalance] = useState(12000);
  const [bet] = useState(100);
  const [multiplier, setMultiplier] = useState(1);
  const [grid, setGrid] = useState(randomProGrid);
  const [spinning, setSpinning] = useState(false);
  const [spinCycle, setSpinCycle] = useState(0);
  const [reelStrips, setReelStrips] = useState(() => grid.map(buildProStrip));
  const [paidSpinCount, setPaidSpinCount] = useState(0);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [message, setMessage] = useState('Pro lane ready');
  const [lastWin, setLastWin] = useState(0);

  const spin = async () => {
    const isFreeSpin = freeSpinsRemaining > 0;
    if (spinning || (!isFreeSpin && balance < bet)) return;

    const nextPaidSpin = isFreeSpin ? paidSpinCount : paidSpinCount + 1;
    const scatterTrigger = !isFreeSpin && nextPaidSpin % 50 === 0;

    setSpinning(true);
    setSpinCycle((prev) => prev + 1);
    setMessage('Analyzing lanes...');
    setLastWin(0);

    if (!isFreeSpin) {
      setBalance((prev) => prev - bet);
      setPaidSpinCount(nextPaidSpin);
    }

    const hit = Math.random() < 0.34;
    const boost = Math.random() < 0.2 ? 3 : Math.random() < 0.45 ? 2 : 1;
    const nextGrid = randomProGrid();
    let payout = 0;

    if (scatterTrigger) {
      nextGrid[0][1] = proScatter;
      nextGrid[1][1] = proScatter;
      nextGrid[2][1] = proScatter;
    } else if (hit) {
      const symbol = pickProCard();
      nextGrid[1] = Array.from({ length: visibleRows }, () => symbol);
      payout = bet * boost * 2;
      setMultiplier(boost);
    } else {
      setMultiplier(1);
      setMessage(isFreeSpin ? 'Free spin used' : 'No synced line this round');
    }

    setReelStrips(nextGrid.map(buildProStrip));
    await new Promise((resolve) => setTimeout(resolve, 1550));

    setGrid(nextGrid);
    if (scatterTrigger) {
      setFreeSpinsRemaining((prev) => prev + 8);
      setMessage('3 scatter landed, 8 free spins unlocked');
    } else if (payout > 0) {
      setBalance((prev) => prev + payout);
      setLastWin(payout);
      setMessage(isFreeSpin ? `Free spin win ৳${payout}` : `Pro hit with ${boost}x multiplier`);
    }

    if (isFreeSpin) {
      setFreeSpinsRemaining((prev) => Math.max(prev - 1, 0));
    }

    setSpinning(false);
  };

  return (
    <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_top,#1a0804_0%,#0f0705_45%,#050505_100%)] p-3">
      <div className="mx-auto flex h-full w-full max-w-[356px] flex-col overflow-hidden rounded-[24px] border border-[#693414] bg-[linear-gradient(180deg,#4b1c10,#30100a_18%,#12303a_56%,#08141c_100%)] shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
        <div className="border-b border-black/30 bg-[linear-gradient(180deg,#5b2616,#381108)] px-3 pb-3 pt-4 text-center">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-amber-200/85">
            <span className="flex items-center gap-1"><Rocket className="h-3 w-3" /> Pro</span>
            <span className="rounded-full bg-amber-300/15 px-2 py-0.5">{freeSpinsRemaining > 0 ? `${freeSpinsRemaining} Free` : `${paidSpinCount % 50}/50`}</span>
          </div>
          <h2 className="mt-2 text-[30px] font-black leading-none tracking-tight text-[#ffd56b] [text-shadow:0_2px_0_rgba(0,0,0,0.5)]">SuperAce</h2>
          <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-[18px] bg-[linear-gradient(180deg,#c58d38,#8a591d)] p-1">
            {['x1', 'x2', 'x3', 'x5'].map((pill) => (
              <div key={pill} className="rounded-full bg-[linear-gradient(180deg,#ffdc7d,#d79a27)] py-1 text-center text-sm font-black text-[#5b2903]">
                {pill}
              </div>
            ))}
          </div>
        </div>

        <div className="px-2 pb-2 pt-3">
          <div className="rounded-[18px] border border-[#315e66] bg-[linear-gradient(180deg,#bfd7e0,#86aab5_18%,#416671_100%)] p-1.5">
            <div className="grid grid-cols-5 gap-1.5">
              {reelStrips.map((strip, columnIndex) => {
                const finalOffset = fillerCount * reelCellHeight + fillerCount * reelGap;

                return (
                  <div
                    key={`${spinCycle}-${columnIndex}`}
                    className="relative overflow-hidden rounded-[12px] border border-[#2b5862] bg-[linear-gradient(180deg,#99bbc7,#6e93a1)] p-1"
                    style={{ height: reelWindowHeight }}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-white/30 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 bg-gradient-to-t from-black/15 to-transparent" />
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: -finalOffset }}
                      transition={{ duration: 1.05 + columnIndex * 0.16, ease: [0.16, 0.84, 0.24, 1] }}
                      className="flex flex-col gap-1.5"
                    >
                      {strip.map((card, rowIndex) => (
                        <div
                          key={`${columnIndex}-${rowIndex}-${card.id}`}
                          className="flex items-center justify-center rounded-[10px] border border-[#6f8d9f] bg-[linear-gradient(180deg,#dce8f0,#a8bfcb)] p-1"
                          style={{ height: reelCellHeight }}
                        >
                          <ProCardFace card={card} />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-black/25 bg-[linear-gradient(180deg,#3c160f,#28120d_34%,#1a2231_100%)] px-3 py-3">
          <div className="flex items-center justify-between rounded-full bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-100/80">
            <span>Win</span>
            <span className="text-lg text-amber-300">{lastWin ? lastWin.toFixed(3) : '0.000'}</span>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="space-y-2">
              <div className="rounded-full bg-black/25 px-2 py-2 text-center text-[11px] font-bold text-white/75">Bet {bet.toFixed(1)}</div>
              <div className="rounded-full bg-black/25 px-2 py-2 text-center text-[11px] font-bold text-amber-200/80">
                {freeSpinsRemaining > 0 ? `${freeSpinsRemaining} Free` : `${paidSpinCount % 50}/50 Scatter`}
              </div>
            </div>

            <button
              disabled={spinning || (freeSpinsRemaining === 0 && balance < bet)}
              onClick={spin}
              className={cn(
                'relative h-20 w-20 rounded-full border-[6px] border-[#8f531d] bg-[radial-gradient(circle_at_top,#f4b654,#a04f13_65%,#582605_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.3),0_10px_24px_rgba(0,0,0,0.3)] transition-transform active:scale-95',
                spinning || (freeSpinsRemaining === 0 && balance < bet) ? 'opacity-50 grayscale' : 'hover:scale-[1.03]',
              )}
            >
              <div className="absolute inset-2 rounded-full border border-white/20" />
              <div className="relative flex h-full items-center justify-center text-[34px] font-black text-white">↻</div>
            </button>

            <div className="space-y-2">
              <div className="rounded-full bg-black/25 px-2 py-2 text-center text-[11px] font-bold text-white/75">
                {freeSpinsRemaining > 0 ? `x${multiplier} Free` : 'Hold for Setting'}
              </div>
              <div className="rounded-full bg-black/25 px-2 py-2 text-center text-[11px] font-bold text-emerald-300">
                Balance {balance.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-white/65">
            <span>{message}</span>
            <span className="flex items-center gap-1 text-emerald-300"><Wifi className="h-3.5 w-3.5" /> Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
