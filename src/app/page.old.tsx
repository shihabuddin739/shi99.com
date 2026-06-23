"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import CategoryGrid from '@/components/CategoryGrid';
import GameCard from '@/components/GameCard';
import FloatingButtons from '@/components/FloatingButtons';
import GameModal from '@/components/GameModal';
import { ChevronRight, Megaphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const jiliGames = [
  { title: 'Super Ace', image: '/images/jili_super_ace.png', isJili: true, type: 'softapi' as const, game_uid: '879', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'Boxing King', image: '/images/jili_boxing_king.png', isJili: true, type: 'softapi' as const, game_uid: '699', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'Fortune Gems', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/d8f6f5152271413.632c8954a2c4f.jpg', isJili: true, type: 'softapi' as const, game_uid: '792', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'Ali Baba', image: 'https://allslotsonline.casino/en/images/jili-games/ali-baba/slot/logo-1117974871.webp', isJili: true, type: 'softapi' as const, game_uid: '931', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'Agent Ace', image: 'https://allslotsonline.casino/en/images/jili-games/agent-ace/slot/logo-3680639207.webp', isJili: true, type: 'softapi' as const, game_uid: '634', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'All-star Fishing', image: 'https://wbgame.tadagaming.com/All-In-One/production/img/tadaPlusPlayer/games/TaDa_games_introImg_119_en-us.webp', isJili: true, type: 'softapi' as const, game_uid: '728', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'Andar Bahar', image: 'https://play-lh.googleusercontent.com/gX-BPPghAKglXfCuZBHDkiAnXDdZ34FNMVXFa5if7YyWxx1-nqKlhgz3zISr7nysGqs=w526-h296-rw', isJili: true, type: 'softapi' as const, game_uid: '505', description: 'জিলি প্রিমিয়াম কার্ড গেম' },
  { title: 'Aztec Priestess', image: 'https://allslotsonline.casino/en/images/jili-games/aztec-priestess/slot/logo-3886479669.webp', isJili: true, type: 'softapi' as const, game_uid: '480', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'Baccarat', image: 'https://www.evolution.com/wp-content/uploads/2022/01/multi_camera_pid_3.jpg', isJili: true, type: 'softapi' as const, game_uid: '855', description: 'জিলি প্রিমিয়াম কার্ড গেম' },
  { title: 'Bao Boon Chin', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzBfnm-_viVSAneq4eNUz_3Q5zpxO9tpfduQ&s', isJili: true, type: 'softapi' as const, game_uid: '641', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: '7 UP-DOWN', image: 'https://7cricinr.com/blog/wp-content/uploads/2023/08/7-Up-7-Down-by-Kingmaker-Logo-PNG.webp', isJili: true, type: 'softapi' as const, game_uid: '10492', description: 'জিলি প্রিমিয়াম টেবিল গেম' },
  { title: 'Sparkling Crown', image: 'https://3oaks.com/media/thumbnails/public/3_jewel_crowns/3_jewel_crowns_banner_mvocf_768x432.jpg', isJili: true, type: 'softapi' as const, game_uid: '10035', description: 'জিলি প্রিমিয়াম স্লট' },
  { title: 'JILI Roulette', image: '/images/jili_roulette.png', isJili: true, type: 'softapi' as const, game_uid: '61', description: 'জিলি প্রিমিয়াম টেবিল গেম' },
];

interface GameSelection {
  title: string;
  image: string;
  type?: 'aviator' | 'slot' | 'premium-slot' | 'pro-slot' | 'softapi';
  game_uid?: string;
  isDemo?: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<GameSelection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openGame = (game: GameSelection, isDemo: boolean = false) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedGame({ ...game, isDemo });
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background text-white font-sans selection:bg-accent-gold/30 relative overflow-hidden">
      {/* Vibrant Background Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[160px] -mr-96 -mt-96 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px] -ml-72 -mb-72 animate-pulse" />
      
      <Header />
      <Sidebar />
      
      <div className="pl-24 md:pl-72 pr-4 md:pr-12 pt-28 pb-20 relative z-10">
        {/* Announcement Bar */}
        <div className="bg-gradient-to-r from-yellow-900/40 via-yellow-950/20 to-transparent text-accent-gold border border-yellow-500/30 rounded-3xl px-8 py-5 mb-14 flex items-center gap-6 text-sm relative overflow-hidden group shadow-[0_0_30px_rgba(250,204,21,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 transition-opacity opacity-0 group-hover:opacity-100" />
          <div className="w-12 h-12 bg-accent-gold rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform">
            <Megaphone className="w-6 h-6 text-[#01040d]" />
          </div>
          <div className="whitespace-nowrap animate-marquee font-black tracking-[0.2em] uppercase italic">
            স্বাগতম <span className="text-white underline decoration-yellow-500 decoration-4 underline-offset-8">SHI999 ULTRA</span>-এ! SoftAPI গেমে অংশ নিন এবং জিতে নিন আকর্ষণীয় পুরস্কার।
          </div>
        </div>

        <Banner />
        
        <CategoryGrid />

        {/* Featured JILI Promo */}
        {/* <section className="mt-20 relative rounded-[70px] border border-yellow-500/20 bg-gradient-to-br from-[#0a0e1a] to-[#01040d] p-12 md:p-20 overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.9)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/15 blur-[180px] -mr-72 -mt-72 rounded-full" />
          
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-10 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                <Trophy className="w-4 h-4 text-accent-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">JILI PREMIUM PARTNER</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-[1] uppercase italic tracking-tighter drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                <span className="text-accent-gold">JILI GAMES</span> <br/>
                <span className="text-slate-600">ARE LIVE</span>
              </h2>
              <p className="mt-10 text-lg md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-bold uppercase tracking-tight">
                আমাদের প্ল্যাটফর্মে এখন অফিসিয়াল JILI গেমস এভেইলএবল। হাই পেআউট এবং রিয়েল-টাইম ব্যালেন্স আপডেট সুবিধা উপভোগ করুন।
              </p>
              
              <div className="mt-12 flex gap-5">
                 <button onClick={() => openGame(jiliGames[0])} className="bg-yellow-500 text-black px-12 py-6 rounded-3xl font-black flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(250,204,21,0.25)] hover:scale-105 transition-all uppercase tracking-[0.2em] text-xs">
                    <PlayCircle className="w-6 h-6" />
                    PLAY NOW
                 </button>
              </div>
            </div>

            <div className="grid gap-5 text-sm sm:grid-cols-2 lg:w-1/3">
              {[
                { icon: Trophy, title: 'হাই পেআউট', text: 'প্রতিটি জয়ে বড় বোনাস' },
                { icon: Smartphone, title: 'ফাস্ট লঞ্চ', text: 'এক ক্লিকে গেম স্টার্ট' },
                { icon: Zap, title: 'লাইভ ব্যালেন্স', text: 'সরাসরি ওয়ালেট আপডেট' },
                { icon: ShieldCheck, title: 'সিকিউর এপিআই', text: 'সম্পূর্ণ এনক্রিপ্টেড গেমিং' },
              ].map((item, i) => (
                <div key={i} className="rounded-3xl border border-white/5 bg-white/[0.03] p-7 backdrop-blur-xl hover:border-yellow-500/40 transition-all group shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-yellow-500/20">
                    <item.icon className="h-6 w-6 text-[#01040d]" />
                  </div>
                  <p className="font-black text-white uppercase text-xs tracking-widest">{item.title}</p>
                  <p className="mt-2 text-[11px] text-slate-500 font-bold leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Jili Games Grid */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <h2 className="text-3xl font-bold text-accent-gold italic">গরম খেলা</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-black/40 border border-white/10 px-6 py-2 rounded-xl text-accent-gold text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all">আরও</button>
              <div className="flex gap-2">
                 <button className="w-10 h-10 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-accent-gold hover:border-accent-gold transition-all"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                 <button className="w-10 h-10 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-accent-gold hover:border-accent-gold transition-all"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 px-2">
            {jiliGames.map((game, i) => (
              <GameCard 
                key={i}
                title={game.title}
                image={game.image}
                description={game.description}
                onClick={() => openGame(game, false)}
                onDemoClick={() => openGame(game, true)}
              />
            ))}
          </div>
        </section>
      </div>

      <FloatingButtons />

      <GameModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        game={selectedGame} 
      />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </main>
  );
}
