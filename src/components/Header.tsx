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
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="app-header">
      <div className="site-container header-inner">
        {/* Top Row */}
        <div className="header-top">
          {/* Logo */}
          <Link href="/" className="header-brand">
            <div className="header-brand-icon">
              🦁
            </div>
            <span className="header-brand-text">
              Shi99<span className="header-brand-sub">.com</span>
            </span>
          </Link>

          <button
            type="button"
            className="header-hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* Auth & Lang */}
          {!loading && (
            <div className="header-auth-row">
              {user ? (
                <Space size="middle">
                  <div className="header-user-info">
                    <div className="header-balance">৳{(user.balance || 0).toLocaleString()}</div>
                    <div className="header-username">{user.username}</div>
                  </div>
                  <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                    <Button type="primary" className="header-account-button">
                      Account
                    </Button>
                  </Dropdown>
                </Space>
              ) : (
                <form onSubmit={handleLogin} className="header-login-form">
                  <Input
                    placeholder="ব্যবহারকারীর নাম"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="header-input"
                  />
                  <Input.Password
                    placeholder="পাসওয়ার্ড"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="header-input"
                  />
                  <Button type="primary" htmlType="submit" className="header-submit-button">
                    লগইন
                  </Button>
                  <Link href="/register">
                    <Button type="primary" className="header-register-button">
                      নিবন্ধন করুন
                    </Button>
                  </Link>
                </form>
              )}
              <div className="header-lang">
                <span className="header-lang-flag">🇧🇩</span>
                <span>বাংলা ▼</span>
              </div>
            </div>
          )}
        </div>

        <nav className={`header-nav ${menuOpen ? 'header-nav-open' : ''}`}>
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
            <Link key={item.label} href={item.link} className="header-nav-link">
              <div className="header-nav-icon">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
