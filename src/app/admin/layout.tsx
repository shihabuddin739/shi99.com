"use client";

import React, { useEffect } from 'react';
import { Layout, Spin, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';

const { Content, Sider } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} breakpoint="lg" collapsedWidth={0} style={{ background: '#fff', borderRight: '1px solid #e6edf7' }}>
        <AdminSidebar />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px clamp(16px, 4vw, 40px)' }}>
          <Typography.Title level={2} style={{ marginTop: 0 }}>🎛️ Shi99 Admin</Typography.Title>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
