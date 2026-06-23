"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import GameModal from '@/components/GameModal';
import { useAuth } from '@/context/AuthContext';

const providers = [
  { id: 'evolution', name: 'Evolution', image: '/images/evolution.png', active: true },
  { id: 'pp', name: 'PP', image: '/images/pp.png' },
  { id: 'sexy', name: 'SEXY CASINO', image: '/images/sexy.png' },
  { id: 'ezugi', name: 'Ezugi', image: '/images/ezugi.png' },
  { id: 'microgaming', name: 'Micro Gaming', image: '/images/microgaming.png' },
  { id: 'playtech', name: 'Playtech', image: '/images/playtech.png' },
  { id: 'gpi', name: 'GPI', image: '/images/gpi.png' },
  { id: 'sa', name: 'SA', image: '/images/sa.png' },
  { id: 'via', name: 'VIA CASINO', image: '/images/via.png' },
];

const games = [
  { title: 'Super Ace', image: '/images/jili_super_ace.png', game_uid: '1' },
  { title: 'Boxing King', image: '/images/jili_boxing_king.png', game_uid: '2' },
  { title: 'Roulette Live', image: '/images/jili_roulette.png', game_uid: '3' },
  { title: 'Classic Slots', image: '/images/slots.png', game_uid: '4' },
  { title: 'Texas Holdem', image: '/images/poker.png', game_uid: '5' },
  { title: 'Ludo King', image: '/images/ludo.png', game_uid: '6' },
  { title: 'Aviator', image: '/images/aviator.png', game_uid: '7' },
  { title: 'Ali Baba', image: '/images/alibaba.png', game_uid: '8' },
  { title: 'Crazy Time', image: '/images/banner.png', game_uid: '9' },
  { title: 'Monopoly Live', image: '/images/slots.png', game_uid: '10' },
  { title: 'Dragon Tiger', image: '/images/poker.png', game_uid: '11' },
  { title: 'Mega Wheel', image: '/images/jili_roulette.png', game_uid: '12' },
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openGame = (game: any, isDemo = false) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedGame({ ...game, isDemo });
    setIsModalOpen(true);
  };

  return (
    <main className="site-shell" style={{ background: '#1c1c1c' }}>
      <Header />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        {/* Providers Menu */}
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          padding: '24px 0', 
          gap: 16,
          scrollbarWidth: 'none', 
          borderBottom: '1px solid #333'
        }}>
          {providers.map(p => (
            <div key={p.id} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 8,
              minWidth: 100,
              cursor: 'pointer'
            }}>
              <div style={{
                background: p.active ? '#fcd535' : 'transparent',
                color: p.active ? '#000' : '#fff',
                padding: '8px 16px',
                borderRadius: 4,
                fontWeight: p.active ? 'bold' : 'normal',
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 80
              }}>
                <div style={{ fontSize: 24, marginBottom: 4, fontWeight: 'bold' }}>{p.name.substring(0,2)}</div>
                <div style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{p.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
          padding: '24px 0 64px'
        }}>
          {games.map(game => (
            <div 
              key={game.game_uid} 
              onClick={() => openGame(game)}
              style={{
                background: '#333',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* EG4 Tag */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                background: '#fcd535',
                color: '#000',
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 'bold',
                borderBottomRightRadius: 8,
                zIndex: 2
              }}>
                EG4
              </div>

              {/* Game Image */}
              <div style={{
                height: 140,
                backgroundImage: `url(${game.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />

              {/* Game Title */}
              <div style={{
                padding: '12px 8px',
                textAlign: 'center',
                color: '#fff',
                fontSize: 14,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {game.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <GameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} game={selectedGame} />
    </main>
  );
}
