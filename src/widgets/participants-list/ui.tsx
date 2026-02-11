import React, { useState, useEffect } from 'react';
import { List, Button, Typography, Card, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ParticipantAdapter } from '../../shared/lib/data-adapter';
import { EditParticipant } from '../../features/edit-participant';
import { ParticipantAvatar } from '../../shared/ui';
import type { Participant } from '../../shared/types';
import { formatDate } from '../../shared/lib';

const { Text } = Typography;

interface ParticipantsListProps {
  refreshTrigger?: number;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ refreshTrigger }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const loadParticipants = async () => {
    const data = await ParticipantAdapter.getAll();
    setParticipants(data);
  };

  useEffect(() => {
    loadParticipants();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    await ParticipantAdapter.delete(id);
    loadParticipants();
  };

  return (
    <Card title="Участники" style={{ marginBottom: 0 }}>
      {participants.length === 0 ? (
        <Text type="secondary" style={{ display: 'block', padding: '16px 0' }}>
          Участники не добавлены
        </Text>
      ) : (
        <List
          dataSource={participants}
          renderItem={(participant) => (
            <List.Item
              actions={[
                <Space key="actions" size="small">
                  <EditParticipant
                    participant={participant}
                    onSuccess={loadParticipants}
                    trigger={
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        aria-label="Редактировать"
                      />
                    }
                  />
                  <Popconfirm
                    title="Удалить участника?"
                    description="Это действие нельзя отменить"
                    onConfirm={() => handleDelete(participant.id)}
                    okText="Удалить"
                    cancelText="Отмена"
                    okButtonProps={{ size: 'middle' }}
                    cancelButtonProps={{ size: 'middle' }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      aria-label="Удалить"
                    />
                  </Popconfirm>
                </Space>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <ParticipantAvatar
                    name={participant.name}
                    color={participant.color}
                    size={44}
                  />
                }
                title={participant.name}
                description={`Добавлен: ${formatDate(participant.createdAt)}`}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};