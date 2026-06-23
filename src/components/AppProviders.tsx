"use client";

import React from 'react';
import { App, ConfigProvider, theme } from 'antd';
import { AuthProvider } from '@/context/AuthContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#fcd535', // Yellow brand color
          borderRadius: 8,
          fontFamily: 'Inter, Segoe UI, Noto Sans Bengali, Arial, sans-serif',
          colorBgBase: '#1c1c1c',
          colorBgContainer: '#2e2e2e',
          colorTextBase: '#ffffff',
        },
        components: {
          Layout: {
            bodyBg: '#1c1c1c',
            headerBg: '#1c1c1c',
            siderBg: '#2e2e2e',
          },
          Card: {
            borderRadiusLG: 8,
          },
          Button: {
            borderRadius: 8,
          },
        },
      }}
    >
      <App>
        <AuthProvider>{children}</AuthProvider>
      </App>
    </ConfigProvider>
  );
}
