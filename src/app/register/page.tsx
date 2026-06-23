"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: { username: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.username, password: values.password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="site-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <Card style={{ width: 'min(100%, 440px)' }}>
        <Typography.Title level={3} style={{ marginTop: 0 }}>Create account</Typography.Title>
        <Typography.Paragraph type="secondary">Register a new SHI999 user account.</Typography.Paragraph>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
          </Form.Item>
          <Button block type="primary" htmlType="submit" icon={<UserAddOutlined />} loading={loading}>
            Register
          </Button>
        </Form>
        <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0, textAlign: 'center' }}>
          Already registered? <Link href="/login">Login</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  );
}
