import React, { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { ParticipantAdapter } from '../../shared/lib/data-adapter';

interface AddParticipantProps {
  onSuccess?: () => void;
}

export const AddParticipant: React.FC<AddParticipantProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { name: string }) => {
    if (!values.name?.trim()) {
      message.error('Введите имя участника');
      return;
    }

    setLoading(true);
    try {
      await ParticipantAdapter.create(values.name);
      message.success('Участник добавлен');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('Ошибка при добавлении участника');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ width: '100%' }}
    >
      <Form.Item
        name="name"
        style={{ marginBottom: 12 }}
        rules={[{ required: true, message: 'Введите имя участника' }]}
      >
        <Input
          placeholder="Имя участника"
          maxLength={50}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<UserAddOutlined />}
          block
        >
          Добавить участника
        </Button>
      </Form.Item>
    </Form>
  );
};