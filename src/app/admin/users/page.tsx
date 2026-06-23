'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  App, Badge, Button, Card, Col, Form, Input,
  InputNumber, Modal, Row, Select, Space, Table, Tag, Tooltip,
} from 'antd';
import {
  LockOutlined, MinusOutlined, PlusOutlined,
  SearchOutlined, StopOutlined, UnlockOutlined, UserSwitchOutlined,
} from '@ant-design/icons';

interface AdminUser {
  _id: string;
  username: string;
  balance: number;
  role: 'user' | 'admin';
  isBanned?: boolean;
  createdAt: string;
  referralCode?: string;
}

type ModalType = 'balance' | 'role' | 'password' | null;

export default function AdminUsersPage() {
  const { message } = App.useApp();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json() as { users?: AdminUser[] };
    if (res.ok) setUsers(data.users ?? []);
    setLoading(false);
  };

  useEffect(() => { void fetchUsers(); }, []);

  const filteredUsers = useMemo(
    () => users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  const openModal = (user: AdminUser, type: ModalType) => {
    setSelectedUser(user);
    setModalType(type);
    form.resetFields();
    if (type === 'role') form.setFieldValue('role', user.role);
  };

  const closeModal = () => { setSelectedUser(null); setModalType(null); form.resetFields(); };

  const doAction = async (action: string, extra?: object) => {
    if (!selectedUser) return;
    setSaving(true);
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser._id, action, ...extra }),
    });
    setSaving(false);
    if (res.ok) {
      message.success('সফলভাবে আপডেট হয়েছে!');
      closeModal();
      await fetchUsers();
    } else {
      const d = await res.json();
      message.error(d.error ?? 'Failed');
    }
  };

  const quickAction = async (user: AdminUser, action: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, action }),
    });
    if (res.ok) { message.success('Done!'); await fetchUsers(); }
    else message.error('Failed');
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      render: (name: string, record: AdminUser) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.isBanned && <Tag color="red">Banned</Tag>}
        </Space>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      render: (b: number) => <span style={{ color: '#52c41a', fontWeight: 600 }}>৳{b.toLocaleString()}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: string) => <Tag color={role === 'admin' ? 'gold' : 'blue'}>{role.toUpperCase()}</Tag>,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      render: (d: string) => new Date(d).toLocaleDateString('bn-BD'),
    },
    {
      title: 'Actions',
      align: 'right' as const,
      render: (_: unknown, record: AdminUser) => (
        <Space wrap>
          <Tooltip title="Balance পরিবর্তন">
            <Button size="small" type="primary" onClick={() => openModal(record, 'balance')}>
              ৳ Balance
            </Button>
          </Tooltip>
          <Tooltip title="Role পরিবর্তন">
            <Button size="small" icon={<UserSwitchOutlined />} onClick={() => openModal(record, 'role')}>
              Role
            </Button>
          </Tooltip>
          <Tooltip title="Password Reset">
            <Button size="small" icon={<LockOutlined />} onClick={() => openModal(record, 'password')}>
              Password
            </Button>
          </Tooltip>
          {record.isBanned ? (
            <Tooltip title="Unban করুন">
              <Button size="small" icon={<UnlockOutlined />} onClick={() => void quickAction(record, 'unban')}>
                Unban
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Ban করুন">
              <Button size="small" danger icon={<StopOutlined />} onClick={() => void quickAction(record, 'ban')}>
                Ban
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<Space><span>👥 Users</span><Badge count={users.length} style={{ background: '#1677ff' }} /></Space>}
        extra={
          <Input
            allowClear prefix={<SearchOutlined />}
            placeholder="Username খুঁজুন"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
        }
      >
        <Table
          rowKey="_id" loading={loading} dataSource={filteredUsers}
          pagination={{ pageSize: 15 }} scroll={{ x: 800 }}
          columns={columns}
          rowClassName={(record) => record.isBanned ? 'banned-row' : ''}
        />
      </Card>

      {/* Balance Modal */}
      <Modal
        title={`💰 ${selectedUser?.username} — Balance পরিবর্তন`}
        open={modalType === 'balance'} onCancel={closeModal} footer={null} destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="amount" label="পরিমাণ (টাকা)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} prefix="৳" size="large" />
          </Form.Item>
          <Row gutter={8}>
            <Col span={8}>
              <Button block type="primary" icon={<PlusOutlined />} loading={saving}
                onClick={async () => { const v = await form.validateFields(); await doAction('add', { amount: v.amount }); }}>
                যোগ করুন
              </Button>
            </Col>
            <Col span={8}>
              <Button block danger icon={<MinusOutlined />} loading={saving}
                onClick={async () => { const v = await form.validateFields(); await doAction('subtract', { amount: v.amount }); }}>
                কাটুন
              </Button>
            </Col>
            <Col span={8}>
              <Button block loading={saving}
                onClick={async () => { const v = await form.validateFields(); await doAction('setBalance', { amount: v.amount }); }}>
                সেট করুন
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Role Modal */}
      <Modal
        title={`🔑 ${selectedUser?.username} — Role পরিবর্তন`}
        open={modalType === 'role'} onCancel={closeModal} footer={null} destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="role" label="Role সিলেক্ট করুন" rules={[{ required: true }]}>
            <Select size="large" options={[{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }]} />
          </Form.Item>
          <Button type="primary" block loading={saving}
            onClick={async () => { const v = await form.validateFields(); await doAction('setRole', { role: v.role }); }}>
            Save
          </Button>
        </Form>
      </Modal>

      {/* Password Modal */}
      <Modal
        title={`🔒 ${selectedUser?.username} — নতুন Password`}
        open={modalType === 'password'} onCancel={closeModal} footer={null} destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="newPassword" label="নতুন Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" block danger loading={saving}
            onClick={async () => { const v = await form.validateFields(); await doAction('resetPassword', { newPassword: v.newPassword }); }}>
            Password Reset করুন
          </Button>
        </Form>
      </Modal>

      <style>{`.banned-row { background: #fff1f0; }`}</style>
    </>
  );
}
