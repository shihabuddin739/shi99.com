'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import GameModal from '@/components/GameModal';
import { useAuth } from '@/context/AuthContext';
import categories from '@/data/categories';
import { Typography, Card, Row, Col, Empty } from 'antd';
import { GiftFilled, TrophyFilled } from '@ant-design/icons';

interface Offer {
  title: string;
  description: string;
  bonusPercent: number;
  minDeposit: number;
  isActive: boolean;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const categoryData = categories[categorySlug];
  
  const { user } = useAuth();
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (categorySlug === 'offers') {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings && data.settings.offers) {
            setOffers(data.settings.offers);
          }
        })
        .catch(console.error);
    }
  }, [categorySlug]);

  if (!categoryData) {
    return (
      <main className="site-shell" style={{ background: '#1c1c1c', minHeight: '100vh', color: '#fff' }}>
        <Header />
        <div style={{ padding: '64px 16px', textAlign: 'center' }}>
          <Typography.Title level={2} style={{ color: '#fff' }}>Category Not Found</Typography.Title>
        </div>
      </main>
    );
  }

  const openGame = (game: any, isDemo = false) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedGame({ ...game, isDemo });
    setIsModalOpen(true);
  };

  return (
    <main className="site-shell" style={{ background: '#1c1c1c', minHeight: '100vh' }}>
      <Header />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <span style={{ fontSize: 40 }}>{categoryData.emoji}</span>
          <div>
            <h1 style={{ color: categoryData.color, margin: 0, fontSize: 28, fontWeight: 800 }}>
              {categoryData.titleBn}
            </h1>
            <span style={{ color: '#888', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
              {categoryData.title}
            </span>
          </div>
        </div>

        {categorySlug === 'offers' ? (
          <Row gutter={[16, 16]}>
            {offers.length > 0 ? offers.map((offer, index) => (
              <Col xs={24} md={12} key={index}>
                <Card 
                  style={{ background: '#2a2a2a', border: `1px solid ${categoryData.color}`, borderRadius: 12 }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ fontSize: 36, color: categoryData.color }}><GiftFilled /></div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: 20, margin: '0 0 8px 0' }}>{offer.title}</h3>
                      <p style={{ color: '#bbb', margin: '0 0 16px 0' }}>{offer.description}</p>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ background: '#1a1a1a', padding: '8px 12px', borderRadius: 8, border: '1px solid #444' }}>
                          <div style={{ fontSize: 12, color: '#888' }}>Bonus</div>
                          <div style={{ color: categoryData.color, fontWeight: 'bold', fontSize: 18 }}>{offer.bonusPercent}%</div>
                        </div>
                        <div style={{ background: '#1a1a1a', padding: '8px 12px', borderRadius: 8, border: '1px solid #444' }}>
                          <div style={{ fontSize: 12, color: '#888' }}>Min Deposit</div>
                          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>৳{offer.minDeposit}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            )) : (
              <Col span={24}>
                <Empty description={<span style={{ color: '#888' }}>No offers available right now.</span>} />
              </Col>
            )}
          </Row>
        ) : categorySlug === 'rewards' ? (
           <div style={{ textAlign: 'center', padding: '64px 0', background: '#2a2a2a', borderRadius: 16, border: '1px dashed #444' }}>
              <TrophyFilled style={{ fontSize: 64, color: categoryData.color, marginBottom: 24 }} />
              <h2 style={{ color: '#fff', marginBottom: 8 }}>Rewards Program</h2>
              <p style={{ color: '#bbb', maxWidth: 400, margin: '0 auto' }}>Play games, earn points, and unlock exclusive VIP rewards. Coming soon!</p>
           </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 16,
          }}>
            {categoryData.games.map(game => (
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
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  background: categoryData.color, color: '#000',
                  padding: '2px 8px', fontSize: 12, fontWeight: 'bold',
                  borderBottomRightRadius: 8, zIndex: 2
                }}>
                  Hot
                </div>

                <div style={{
                  height: 140,
                  backgroundImage: `url(${game.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />

                <div style={{
                  padding: '12px 8px', textAlign: 'center', color: '#fff',
                  fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {game.title}
                </div>
              </div>
            ))}
            {categoryData.games.length === 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <Empty description={<span style={{ color: '#888' }}>No games available in this category yet.</span>} />
              </div>
            )}
          </div>
        )}
      </div>

      <GameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} game={selectedGame} />
    </main>
  );
}
