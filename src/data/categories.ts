import React from 'react';

interface GameCategory {
  slug: string;
  title: string;
  titleBn: string;
  emoji: string;
  color: string;
  games: { title: string; image: string; game_uid: string }[];
}

const categories: Record<string, GameCategory> = {
  casino: {
    slug: 'casino',
    title: 'Casino',
    titleBn: 'ক্যাসিনো',
    emoji: '🎰',
    color: '#eab308',
    games: [
      { title: 'Super Ace', image: '/images/jili_super_ace.png', game_uid: '879' },
      { title: 'Boxing King', image: '/images/jili_boxing_king.png', game_uid: '699' },
      { title: 'Fortune Gems', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/d8f6f5152271413.632c8954a2c4f.jpg', game_uid: '792' },
      { title: 'Ali Baba', image: 'https://allslotsonline.casino/en/images/jili-games/ali-baba/slot/logo-1117974871.webp', game_uid: '931' },
      { title: 'Agent Ace', image: 'https://allslotsonline.casino/en/images/jili-games/agent-ace/slot/logo-3680639207.webp', game_uid: '634' },
      { title: 'Aztec Priestess', image: 'https://allslotsonline.casino/en/images/jili-games/aztec-priestess/slot/logo-3886479669.webp', game_uid: '480' },
      { title: 'Bao Boon Chin', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzBfnm-_viVSAneq4eNUz_3Q5zpxO9tpfduQ&s', game_uid: '641' },
      { title: 'Sparkling Crown', image: 'https://3oaks.com/media/thumbnails/public/3_jewel_crowns/3_jewel_crowns_banner_mvocf_768x432.jpg', game_uid: '10035' },
    ],
  },
  'live-casino': {
    slug: 'live-casino',
    title: 'Live Casino',
    titleBn: 'লাইভ ক্যাসিনো',
    emoji: '📹',
    color: '#fcd535',
    games: [
      { title: 'Andar Bahar', image: 'https://play-lh.googleusercontent.com/gX-BPPghAKglXfCuZBHDkiAnXDdZ34FNMVXFa5if7YyWxx1-nqKlhgz3zISr7nysGqs=w526-h296-rw', game_uid: '505' },
      { title: 'Baccarat', image: 'https://www.evolution.com/wp-content/uploads/2022/01/multi_camera_pid_3.jpg', game_uid: '855' },
      { title: '7 UP-DOWN', image: 'https://7cricinr.com/blog/wp-content/uploads/2023/08/7-Up-7-Down-by-Kingmaker-Logo-PNG.webp', game_uid: '10492' },
      { title: 'JILI Roulette', image: '/images/jili_roulette.png', game_uid: '61' },
    ],
  },
  sports: {
    slug: 'sports',
    title: 'Sports',
    titleBn: 'স্পোর্টস',
    emoji: '⚽',
    color: '#3b82f6',
    games: [
      // More SoftAPI sports games can be added here
    ],
  },
  arcade: {
    slug: 'arcade',
    title: 'Arcade',
    titleBn: 'আর্কেড',
    emoji: '🕹️',
    color: '#a855f7',
    games: [
      { title: 'Aviator', image: '/images/aviator.png', game_uid: 'aviator_1' },
      // Other arcade games...
    ],
  },
  fishing: {
    slug: 'fishing',
    title: 'Fishing',
    titleBn: 'মাছ ধরা',
    emoji: '🐟',
    color: '#06b6d4',
    games: [
      { title: 'All-star Fishing', image: 'https://wbgame.tadagaming.com/All-In-One/production/img/tadaPlusPlayer/games/TaDa_games_introImg_119_en-us.webp', game_uid: '728' },
    ],
  },
  lottery: {
    slug: 'lottery',
    title: 'Lottery',
    titleBn: 'লটারি খেলা',
    emoji: '🎫',
    color: '#ef4444',
    games: [],
  },
  esports: {
    slug: 'esports',
    title: 'E-Sports',
    titleBn: 'ই-স্পোর্টস',
    emoji: '🎮',
    color: '#10b981',
    games: [],
  },
  offers: {
    slug: 'offers',
    title: 'Offers',
    titleBn: 'অফার',
    emoji: '🎁',
    color: '#f59e0b',
    games: [],
  },
  rewards: {
    slug: 'rewards',
    title: 'Rewards',
    titleBn: 'পুরস্কার',
    emoji: '🏆',
    color: '#eab308',
    games: [],
  },
};

export default categories;
