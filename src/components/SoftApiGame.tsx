"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface SoftApiGameProps {
  gameUid: string;
  isDemo?: boolean;
}

export default function SoftApiGame({ gameUid, isDemo }: SoftApiGameProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGameUrl() {
      try {
        console.log(`[SoftApiGame] Launching Game: ${gameUid}, Demo Mode: ${isDemo}`);
        setLoading(true);
        const response = await fetch('/api/game/launch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            game_uid: gameUid,
            is_demo: isDemo
          }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
          setUrl(data.url);
        } else {
          setError(data.error || 'Failed to launch game');
        }
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (gameUid) {
      fetchGameUrl();
    }
  }, [gameUid, isDemo]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#01040d] text-white">
        <Loader2 className="w-12 h-12 text-accent-gold animate-spin mb-4" />
        <p className="text-accent-gold font-bold uppercase tracking-widest text-sm">Launching Game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#01040d] text-white p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h3 className="text-2xl font-bold mb-2">Launch Failed</h3>
        <p className="text-gray-400 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  if (!url) return null;

  return (
    <iframe 
      src={url} 
      className="w-full h-full border-none"
      allow="fullscreen"
    />
  );
}
