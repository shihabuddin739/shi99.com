'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App, Badge, Button, Card, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';

interface TransactionRecord {
  _id: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'game_play';
  method: string;
  number: string;
  trxId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user?: { username: string };
}

export default function AdminTransactionsPage() {
  const { message } = App.useApp();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/transactions');
    const data = await res.json() as { transactions?: TransactionRecord[] };
    if (res.ok) setTransactions(data.transactions ?? []);
    setLoading(false);
  };

  useEffect(() => { void fetchTransactions(); }, []);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.user?.username.toLowerCase().includes(search.toLowerCase()) ||
        (t.trxId ?? '').toLowerCase().includes(search.toLowerCase()) ||
        t.number.includes(search);
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const pendingCount = transactions.filter((t) => t.status === 'pending').length;

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: id, status }),
    });
    if (res.ok) {
      message.success(`Transaction ${status}`);
      await fetchTransactions();
    } else {
      const data = await res.json();
      message.error(data.error ?? 'Failed');
    }
  };

  return (
    <Card
      title={
        <Space>
          <span>💳 Transactions</span>
          {pendingCount > 0 && (
            <Badge count={pendingCount} style={{ background: '#ff4d4f' }} title="Pending" />
          )}
        </Space>
      }
      extra={
        <Space wrap>
          <Input
            allowClear prefix={<SearchOutlined />}
            placeholder="Username / TrxID / Number"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <Select
            value={typeFilter} onChange={setTypeFilter} style={{ width: 130 }}
            options={[
              { value: 'all', label: 'সব Type' },
              { value: 'deposit', label: 'Deposit' },
              { value: 'withdraw', label: 'Withdraw' },
              { value: 'game_play', label: 'Game Play' },
            ]}
          />
          <Select
            value={statusFilter} onChange={setStatusFilter} style={{ width: 130 }}
            options={[
              { value: 'all', label: 'সব Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        </Space>
      }
    >
      <Table
        rowKey="_id" loading={loading} dataSource={filtered}
        pagination={{ pageSize: 15 }} scroll={{ x: 1000 }}
        columns={[
          {
            title: 'User',
            render: (_, r) => <span style={{ fontWeight: 600 }}>{r.user?.username ?? 'Unknown'}</span>,
          },
          {
            title: 'Type',
            dataIndex: 'type',
            render: (type: string) => (
              <Tag color={type === 'deposit' ? 'green' : type === 'withdraw' ? 'volcano' : 'purple'}>
                {type.replace('_', ' ').toUpperCase()}
              </Tag>
            ),
          },
          {
            title: 'Amount',
            dataIndex: 'amount',
            render: (amount: number) => (
              <span style={{ fontWeight: 700, color: '#1677ff' }}>৳{amount.toLocaleString()}</span>
            ),
          },
          { title: 'Method', dataIndex: 'method' },
          { title: 'Number', dataIndex: 'number' },
          {
            title: 'TrxID',
            dataIndex: 'trxId',
            render: (trxId?: string) => trxId ? (
              <Typography.Text copyable code>{trxId}</Typography.Text>
            ) : '-',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (status: string) => {
              const color = status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'gold';
              return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
          },
          {
            title: 'Date',
            dataIndex: 'createdAt',
            render: (date: string) => (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {new Date(date).toLocaleString('bn-BD')}
              </Typography.Text>
            ),
          },
          {
            title: 'Action',
            fixed: 'right' as const,
            render: (_, record) =>
              record.status === 'pending' ? (
                <Space>
                  <Button
                    type="primary" size="small" icon={<CheckOutlined />}
                    onClick={() => void handleAction(record._id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    danger size="small" icon={<CloseOutlined />}
                    onClick={() => void handleAction(record._id, 'rejected')}
                  >
                    Reject
                  </Button>
                </Space>
              ) : null,
          },
        ]}
      />
    </Card>
  );
}
