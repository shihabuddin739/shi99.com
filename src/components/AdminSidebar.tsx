"use client";

import React from 'react';
import Link from 'next/link';
import { Avatar, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  SwapOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';

const items = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link href="/admin/dashboard">Dashboard</Link> },
  { key: '/admin/payments', icon: <WalletOutlined />, label: <Link href="/admin/payments">Payment numbers</Link> },
  { key: '/admin/users', icon: <TeamOutlined />, label: <Link href="/admin/users">Users</Link> },
  { key: '/admin/transactions', icon: <SwapOutlined />, label: <Link href="/admin/transactions">Transactions</Link> },
  { key: '/admin/settings', icon: <SettingOutlined />, label: <Link href="/admin/settings">Site controls</Link> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Link href="/admin/dashboard" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar shape="square" style={{ background: '#1677ff', fontWeight: 800 }}>
          A
        </Avatar>
        <div>
          <Typography.Text strong>Shi99 Admin</Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>Control center</Typography.Text>
        </div>
      </Link>
      <Menu mode="inline" selectedKeys={[pathname]} items={items} style={{ borderInlineEnd: 0, flex: 1 }} />
      <div style={{ padding: 16 }}>
        <Link href="/">
          <Typography.Text type="secondary">Back to site</Typography.Text>
        </Link>
      </div>
    </div>
  );
}
