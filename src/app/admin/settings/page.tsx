"use client";

import React, { useEffect, useState } from 'react';
import { App, Button, Card, Col, Form, Input, InputNumber, Row, Space, Switch, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';

interface Offer {
  title: string;
  description: string;
  bonusPercent: number;
  minDeposit: number;
  isActive: boolean;
}

interface SupportNumber {
  label: string;
  number: string;
  channel: string;
  isActive: boolean;
}

interface SettingsForm {
  siteName: string;
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  referralEnabled: boolean;
  referralBonus: number;
  referralNote: string;
  minDeposit: number;
  minWithdraw: number;
  offers: Offer[];
  supportNumbers: SupportNumber[];
}

export default function AdminSettingsPage() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<SettingsForm>();

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (!ignore && res.ok) {
        form.setFieldsValue(data.settings);
      }
      setLoading(false);
    };

    void fetchSettings();
    return () => {
      ignore = true;
    };
  }, [form]);

  const handleSave = async (values: SettingsForm) => {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSaving(false);

    if (res.ok) {
      message.success('Site controls saved');
    } else {
      message.error('Failed to save settings');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSave}
      disabled={loading}
      initialValues={{ offers: [], supportNumbers: [], referralEnabled: true }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Homepage controls">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="siteName" label="Site name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="announcement" label="Announcement" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="heroTitle" label="Hero title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="heroImage" label="Hero image URL" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="heroSubtitle" label="Hero subtitle" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Referral and wallet rules">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="referralEnabled" label="Referral enabled" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="referralBonus" label="Referral bonus">
                <InputNumber min={0} prefix="৳" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="minDeposit" label="Minimum deposit">
                <InputNumber min={0} prefix="৳" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="minWithdraw" label="Minimum withdraw">
                <InputNumber min={0} prefix="৳" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="referralNote" label="Referral note">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Offers">
          <Form.List name="offers">
            {(fields, { add, remove }) => (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card size="small" key={field.key}>
                    <Row gutter={16}>
                      <Col xs={24} md={8}><Form.Item {...field} name={[field.name, 'title']} label="Title"><Input /></Form.Item></Col>
                      <Col xs={24} md={8}><Form.Item {...field} name={[field.name, 'bonusPercent']} label="Bonus %"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
                      <Col xs={24} md={8}><Form.Item {...field} name={[field.name, 'minDeposit']} label="Min deposit"><InputNumber min={0} prefix="৳" style={{ width: '100%' }} /></Form.Item></Col>
                      <Col xs={24}><Form.Item {...field} name={[field.name, 'description']} label="Description"><Input /></Form.Item></Col>
                      <Col xs={12}><Form.Item {...field} name={[field.name, 'isActive']} label="Active" valuePropName="checked"><Switch /></Form.Item></Col>
                      <Col xs={12} style={{ textAlign: 'right' }}><Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>Remove</Button></Col>
                    </Row>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ title: '', description: '', bonusPercent: 0, minDeposit: 0, isActive: true })}>
                  Add offer
                </Button>
              </Space>
            )}
          </Form.List>
        </Card>

        <Card title="Support numbers">
          <Form.List name="supportNumbers">
            {(fields, { add, remove }) => (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card size="small" key={field.key}>
                    <Row gutter={16}>
                      <Col xs={24} md={6}><Form.Item {...field} name={[field.name, 'label']} label="Label"><Input /></Form.Item></Col>
                      <Col xs={24} md={6}><Form.Item {...field} name={[field.name, 'channel']} label="Channel"><Input placeholder="WhatsApp" /></Form.Item></Col>
                      <Col xs={24} md={8}><Form.Item {...field} name={[field.name, 'number']} label="Number"><Input /></Form.Item></Col>
                      <Col xs={12} md={2}><Form.Item {...field} name={[field.name, 'isActive']} label="Active" valuePropName="checked"><Switch /></Form.Item></Col>
                      <Col xs={12} md={2} style={{ textAlign: 'right' }}><Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} /></Col>
                    </Row>
                  </Card>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ label: '', number: '', channel: 'WhatsApp', isActive: true })}>
                  Add support number
                </Button>
              </Space>
            )}
          </Form.List>
        </Card>

        <Card title="🎯 Welcome Popup (Modal)">
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item name="popupEnabled" label="Popup চালু করুন" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={18}>
              <Form.Item name="popupTitle" label="Popup Title (শিরোনাম)">
                <Input placeholder="স্বাগতম! Welcome to Shi99" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="popupImage" label="Popup Image URL বা Base64">
                <Input.TextArea
                  rows={3}
                  placeholder="https://example.com/banner.jpg অথবা data:image/png;base64,..."
                />
              </Form.Item>
              <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                💡 Image URL দিন অথবা image টা <a href="https://www.base64-image.de/" target="_blank" rel="noreferrer">base64-image.de</a> থেকে Base64 এ convert করে paste করুন।
              </Typography.Text>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="popupLink" label="Button Link (optional — খালি রাখলে button আসবে না)">
                <Input placeholder="https://t.me/shi999" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Typography.Text type="secondary">Changes update the public homepage and user wallet rules.</Typography.Text>
            <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
              Save all controls
            </Button>
          </Space>
        </Card>
      </Space>
    </Form>
  );
}
