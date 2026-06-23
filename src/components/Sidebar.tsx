"use client";

import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import {
  GiftOutlined,
  CustomerServiceOutlined,
  HistoryOutlined,
  HomeOutlined,
  TeamOutlined,
  TrophyOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';

const navItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link href="/">Home</Link> },
  { key: '/wallet/deposit', icon: <WalletOutlined />, label: <Link href="/wallet/deposit">Deposit</Link> },
  { key: '/wallet/withdraw', icon: <WalletOutlined />, label: <Link href="/wallet/withdraw">Withdraw</Link> },
  { key: '/history', icon: <HistoryOutlined />, label: <Link href="/history">History</Link> },
  { key: 'refer', icon: <TeamOutlined />, label: 'Refer' },
  { key: 'offers', icon: <GiftOutlined />, label: 'Offers' },
  { key: 'rewards', icon: <TrophyOutlined />, label: 'Rewards' },
  { key: 'support', icon: <CustomerServiceOutlined />, label: 'Support' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="desktop-only" style={{ width: 236, flex: '0 0 236px' }}>
        <div
          style={{
            position: 'sticky',
            top: 88,
            background: '#fff',
            border: '1px solid #e6edf7',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={navItems}
            style={{ borderInlineEnd: 0 }}
          />
        </div>
      </aside>

      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 4).map((item) => (
          <Link key={item.key} href={item.key}>
            {item.icon}
            <span>{typeof item.label === 'string' ? item.label : item.key === '/' ? 'Home' : item.key.split('/').pop()}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
