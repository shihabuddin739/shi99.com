'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, Card, Col, Row, Statistic, Typography } from 'antd';
import {
  ArrowDownOutlined, ArrowUpOutlined,
  DollarOutlined, SettingOutlined,
  SwapOutlined, TeamOutlined, WalletOutlined,
} from '@ant-design/icons';

interface DashboardStats {
  totalUsers: number;
  bannedUsers: number;
  pendingDeposits: number;
  pendingWithdraws: number;
  totalBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalTransactions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, bannedUsers: 0,
    pendingDeposits: 0, pendingWithdraws: 0,
    totalBalance: 0, totalDeposited: 0,
    totalWithdrawn: 0, totalTransactions: 0,
  });

  useEffect(() => {
    let ignore = false;
    const fetchStats = async () => {
      const [usersRes, transRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/transactions'),
      ]);
      const usersData = await usersRes.json();
      const transData = await transRes.json();
      if (!ignore && usersRes.ok && transRes.ok) {
        const users = (usersData.users ?? []) as Array<{ balance: number; isBanned?: boolean }>;
        const transactions = (transData.transactions ?? []) as Array<{ status: string; type: string; amount: number }>;
        setStats({
          totalUsers: users.length,
          bannedUsers: users.filter((u) => u.isBanned).length,
          pendingDeposits: transactions.filter((t) => t.status === 'pending' && t.type === 'deposit').length,
          pendingWithdraws: transactions.filter((t) => t.status === 'pending' && t.type === 'withdraw').length,
          totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
          totalDeposited: transactions.filter((t) => t.status === 'approved' && t.type === 'deposit').reduce((s, t) => s + t.amount, 0),
          totalWithdrawn: transactions.filter((t) => t.status === 'approved' && t.type === 'withdraw').reduce((s, t) => s + t.amount, 0),
          totalTransactions: transactions.length,
        });
      }
    };
    void fetchStats();
    return () => { ignore = true; };
  }, []);

  const statCards = [
    { title: 'মোট Users', value: stats.totalUsers, icon: <TeamOutlined />, color: '#1677ff', suffix: `(${stats.bannedUsers} banned)` },
    { title: 'Pending Deposit', value: stats.pendingDeposits, icon: <ArrowDownOutlined />, color: '#52c41a' },
    { title: 'Pending Withdraw', value: stats.pendingWithdraws, icon: <ArrowUpOutlined />, color: '#ff4d4f' },
    { title: 'Users এর মোট Balance', value: stats.totalBalance, prefix: '৳', icon: <WalletOutlined />, color: '#722ed1' },
    { title: 'মোট Deposited', value: stats.totalDeposited, prefix: '৳', icon: <DollarOutlined />, color: '#13c2c2' },
    { title: 'মোট Withdrawn', value: stats.totalWithdrawn, prefix: '৳', icon: <DollarOutlined />, color: '#fa8c16' },
    { title: 'মোট Transactions', value: stats.totalTransactions, icon: <SwapOutlined />, color: '#eb2f96' },
  ];

  const modules = [
    {
      title: 'Payment Numbers',
      href: '/admin/payments',
      icon: <WalletOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
      text: 'bKash, Nagad ও Rocket নম্বর manage করুন।',
      badge: 0,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: <TeamOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
      text: 'Balance, role, ban ও password manage করুন।',
      badge: 0,
    },
    {
      title: 'Transactions',
      href: '/admin/transactions',
      icon: <SwapOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
      text: 'Deposit ও Withdraw approve/reject করুন।',
      badge: stats.pendingDeposits + stats.pendingWithdraws,
    },
    {
      title: 'Site Controls',
      href: '/admin/settings',
      icon: <SettingOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
      text: 'Popup modal, offer, referral ও site settings।',
      badge: 0,
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
        {statCards.map((s, i) => (
          <Col xs={12} sm={12} md={8} lg={6} key={i}>
            <Card
              style={{ borderTop: `3px solid ${s.color}`, borderRadius: 10 }}
              bodyStyle={{ padding: '16px 20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Statistic
                  title={<span style={{ fontSize: 13, color: '#666' }}>{s.title}</span>}
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix ? <span style={{ fontSize: 11, color: '#999' }}>{s.suffix}</span> : undefined}
                  valueStyle={{ color: s.color, fontSize: 22, fontWeight: 700 }}
                />
                <span style={{ fontSize: 22, color: s.color, opacity: 0.3, marginTop: 4 }}>{s.icon}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Typography.Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
        🎛️ Control Modules
      </Typography.Title>

      <Row gutter={[16, 16]}>
        {modules.map((m) => (
          <Col xs={24} sm={12} xl={6} key={m.href}>
            <Link href={m.href}>
              <Badge count={m.badge} offset={[-8, 8]}>
                <Card
                  hoverable
                  style={{ borderRadius: 12, transition: 'all 0.25s', height: '100%' }}
                  styles={{ body: { padding: '20px 24px' } }}
                >
                  <div style={{ marginBottom: 12 }}>{m.icon}</div>
                  <Typography.Title level={5} style={{ marginBottom: 4 }}>{m.title}</Typography.Title>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>{m.text}</Typography.Text>
                </Card>
              </Badge>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}
