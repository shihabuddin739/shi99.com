"use client";

import React, { useEffect, useState } from 'react';
import { App, Button, Card, Form, Input, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface PaymentNumber {
  _id: string;
  method: 'bikash' | 'nagad' | 'rocket';
  number: string;
  type: 'Personal' | 'Agent' | 'Merchant';
}

export default function AdminPaymentsPage() {
  const { message } = App.useApp();
  const [numbers, setNumbers] = useState<PaymentNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const fetchNumbers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/payments');
    const data = await res.json() as { numbers?: PaymentNumber[] };
    if (res.ok) setNumbers(data.numbers ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchNumbers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleAdd = async (values: Omit<PaymentNumber, '_id'>) => {
    const res = await fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      form.resetFields(['number']);
      message.success('Payment number added');
      await fetchNumbers();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/admin/payments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      message.success('Payment number deleted');
      await fetchNumbers();
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Add payment number">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{ method: 'bikash', type: 'Personal' }}
        >
          <Form.Item name="method" label="Method" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'bikash', label: 'bKash' },
                { value: 'nagad', label: 'Nagad' },
                { value: 'rocket', label: 'Rocket' },
              ]}
            />
          </Form.Item>
          <Form.Item name="type" label="Account type" rules={[{ required: true }]}>
            <Select options={['Personal', 'Agent', 'Merchant'].map((value) => ({ value, label: value }))} />
          </Form.Item>
          <Form.Item name="number" label="Mobile number" rules={[{ required: true }]}>
            <Input placeholder="017XXXXXXXX" />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add number
          </Button>
        </Form>
      </Card>

      <Card title="Active payment numbers">
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={numbers}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 640 }}
          columns={[
            {
              title: 'Method',
              dataIndex: 'method',
              render: (method: string) => <Tag color="blue">{method.toUpperCase()}</Tag>,
            },
            { title: 'Number', dataIndex: 'number' },
            { title: 'Type', dataIndex: 'type' },
            {
              title: 'Action',
              align: 'right',
              render: (_, record) => (
                <Popconfirm title="Delete this number?" onConfirm={() => handleDelete(record._id)}>
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ),
            },
          ]}
        />
        {!loading && numbers.length === 0 && <Typography.Text type="secondary">No payment number added yet.</Typography.Text>}
      </Card>
    </Space>
  );
}
