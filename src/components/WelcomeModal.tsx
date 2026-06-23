'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PopupSettings {
  popupEnabled: boolean;
  popupTitle: string;
  popupImage: string;
  popupLink: string;
}

const FALLBACK_IMAGE = 'https://299bet-play.com/assets/img/banner_games_hero__566dd8.webp';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [popup, setPopup] = useState<PopupSettings | null>(null);

  useEffect(() => {
    const fetchAndShow = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        const s = data.settings as PopupSettings;
        if (s.popupEnabled) {
          if (!s.popupImage) s.popupImage = FALLBACK_IMAGE;
          setPopup(s);
          setVisible(true);
        }
      } catch {
        // ignore
      }
    };
    void fetchAndShow();
  }, []);

  if (!visible || !popup) return null;

  const handleClose = () => setVisible(false);

  const content = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.3s ease',
    }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: '480px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.35s ease',
          background: '#111',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            background: 'rgba(0,0,0,0.6)', border: 'none',
            borderRadius: '50%', width: 36, height: 36,
            color: '#fff', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,50,50,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
        >
          ✕
        </button>

        {/* Title */}
        {popup.popupTitle && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '16px 20px',
            textAlign: 'center',
          }}>
            <h2 style={{
              margin: 0, color: '#f0c040',
              fontSize: '1.15rem', fontWeight: 700,
              letterSpacing: '0.5px',
            }}>
              {popup.popupTitle}
            </h2>
          </div>
        )}

        {/* Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={popup.popupImage}
            alt={popup.popupTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* CTA Button */}
        {popup.popupLink && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '14px 20px', textAlign: 'center',
          }}>
            <a
              href={popup.popupLink}
              style={{
                display: 'inline-block', padding: '10px 32px',
                background: 'linear-gradient(135deg, #f0c040, #e08000)',
                color: '#111', borderRadius: '8px',
                fontWeight: 700, textDecoration: 'none',
                fontSize: '0.95rem', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              দেখুন →
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );

  return content;
}
