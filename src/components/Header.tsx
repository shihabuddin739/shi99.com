"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Dropdown, Input, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
  WalletOutlined,
  HomeFilled,
  PlaySquareFilled,
  VideoCameraFilled,
  TrophyFilled,
  AppstoreFilled,
  GiftFilled,
  DollarCircleFilled,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, login, logout, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const items: MenuProps['items'] = [
    user?.role === 'admin'
      ? {
          key: 'admin',
          icon: <DashboardOutlined />,
          label: <Link href="/admin/dashboard">Admin panel</Link>,
        }
      : null,
    {
      key: 'dashboard',
      icon: <UserOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'deposit',
      icon: <WalletOutlined />,
      label: <Link href="/wallet/deposit">Deposit</Link>,
    },
    {
      key: 'withdraw',
      icon: <DollarCircleFilled />,
      label: <Link href="/wallet/withdraw">Withdraw</Link>,
    },
    {
      key: 'logout',
      danger: true,
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => void logout(),
    },
  ].filter(Boolean) as MenuProps['items'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    void login(username, password);
  };

  return (
    <header style={{ background: '#1a1a1a', borderBottom: '2px solid #fcd535' }}>
      <div className="site-container" style={{ padding: '8px 0' }}>
        {/* Top Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, background: '#fcd535', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', color: '#1a1a1a', fontSize: '18px'
            }}>
              🦁
            </div>
            <span style={{ color: '#fcd535', fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>
              Shi99<span style={{ color: '#fff', fontSize: '22px' }}>.com</span>
            </span>
          </Link>

          {/* Auth & Lang */}
          {!loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {user ? (
                <Space size="middle">
                  <div style={{ textAlign: 'right', color: '#fff' }}>
                    <div style={{ fontWeight: 'bold' }}>৳{(user.balance || 0).toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: '#a0a0a0' }}>{user.username}</div>
                  </div>
                  <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                    <Button type="primary" style={{ background: '#fcd535', color: '#000', border: 'none' }}>
                      Account
                    </Button>
                  </Dropdown>
                </Space>
              ) : (
                <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Input 
                    placeholder="ব্যবহারকারীর নাম" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ background: '#333', border: '1px solid #555', color: '#fff', width: 140, borderRadius: 20 }}
                  />
                  <Input.Password 
                    placeholder="পাসওয়ার্ড" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ background: '#333', border: '1px solid #555', color: '#fff', width: 140, borderRadius: 20 }}
                  />
                  <Button type="primary" htmlType="submit" style={{ background: '#666', border: 'none', borderRadius: 20 }}>
                    লগইন
                  </Button>
                  <Link href="/register">
                    <Button type="primary" style={{ background: '#fcd535', color: '#000', border: 'none', borderRadius: 20, fontWeight: 'bold' }}>
                      নিবন্ধন করুন
                    </Button>
                  </Link>
                </form>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff', cursor: 'pointer', marginLeft: 8 }}>
                <span style={{ fontSize: '18px' }}>🇧🇩</span>
                <span>বাংলা ▼</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row - Navigation */}
        <nav style={{ display: 'flex', justifyContent: 'center', gap: 32, paddingBottom: 8 }}>
          {[
            { label: 'হোম', icon: <HomeFilled style={{ color: '#fcd535' }} />, link: '/' },
            { label: 'ক্যাসিনো', icon: <AppstoreFilled style={{ color: '#eab308' }} />, link: '/casino' },
            { label: 'লাইভ ক্যাসিনো', icon: <VideoCameraFilled style={{ color: '#fcd535' }} />, link: '/live-casino' },
            { label: 'স্পোর্টস', icon: <TrophyFilled style={{ color: '#3b82f6' }} />, link: '/sports' },
            { label: 'আর্কেড', icon: <PlaySquareFilled style={{ color: '#a855f7' }} />, link: '/arcade' },
            { label: 'মাছ ধরা', icon: <span style={{ fontSize: 16 }}>🐟</span>, link: '/fishing' },
            { label: 'লটারি খেলা', icon: <DollarCircleFilled style={{ color: '#ef4444' }} />, link: '/lottery' },
            { label: 'ই-স্পোর্টস', icon: <span style={{ fontSize: 16 }}>🎮</span>, link: '/esports' },
            { label: 'অফার', icon: <GiftFilled style={{ color: '#f59e0b' }} />, link: '/offers' },
            { label: 'পুরস্কার', icon: <TrophyFilled style={{ color: '#eab308' }} />, link: '/rewards' },
          ].map((item) => (
            <Link key={item.label} href={item.link} style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, 
              color: item.label === 'হোম' ? '#fcd535' : '#fff', fontSize: 13, textDecoration: 'none' 
            }}>
              <div style={{ fontSize: 24, marginBottom: 2 }}>{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
