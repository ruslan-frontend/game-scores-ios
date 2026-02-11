import React, { useState, useEffect } from 'react';
import { List, Button, Typography, Card, Popconfirm, Tag, Avatar } from 'antd';
import { DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import { GameAdapter, ParticipantAdapter } from '../../shared/lib/data-adapter';
import { ParticipantAvatar } from '../../shared/ui';
import type { Game } from '../../shared/types';
import { formatDate } from '../../shared/lib';

const { Text } = Typography;

interface GamesListProps {
  refreshTrigger?: number;
}

export const GamesList: React.FC<GamesListProps> = ({ refreshTrigger }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [participants, setParticipants] = useState<Map<string, any>>(new Map());

  const loadData = async () => {
    const [gamesData, participantsData] = await Promise.all([
      GameAdapter.getAll(),
      ParticipantAdapter.getAll()
    ]);
    
    setGames(gamesData.sort((a, b) => b.date.getTime() - a.date.getTime()));
    
    const participantsMap = new Map();
    participantsData.forEach(p => participantsMap.set(p.id, p));
    setParticipants(participantsMap);
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    await GameAdapter.delete(id);
    loadData();
  };

  const getParticipant = (id: string) => {
    return participants.get(id);
  };

  const getParticipantName = (id: string) => {
    const participant = getParticipant(id);
    return participant?.name || 'Неизвестный';
  };

  return (
    <Card title="История игр" style={{ marginBottom: 0 }}>
      {games.length === 0 ? (
        <Text type="secondary" style={{ display: 'block', padding: '16px 0' }}>
          Игры не добавлены
        </Text>
      ) : (
        <List
          dataSource={games}
          renderItem={(game) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="delete"
                  title="Удалить игру?"
                  description="Это действие нельзя отменить"
                  onConfirm={() => handleDelete(game.id)}
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
                    aria-label="Удалить игру"
                  />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <span style={{ fontSize: 24, color: 'var(--tg-theme-button-color, #2481cc)' }}>
                    <TrophyOutlined />
                  </span>
                }
                title={
                  <div style={{ marginBottom: 4 }}>
                    {game.name}
                  </div>
                }
                description={
                  <div>
                    <Tag color="gold" style={{ marginBottom: 4 }}>
                      🏆 {getParticipantName(game.winnerId)}
                    </Tag>
                    <div style={{ marginTop: 4 }}>
                      <Avatar.Group size="small" max={{ count: 4 }}>
                        {game.participants.map((participantId) => {
                          const participant = getParticipant(participantId);
                          return participant ? (
                            <ParticipantAvatar
                              key={participantId}
                              name={participant.name}
                              color={participant.color}
                              size={24}
                            />
                          ) : null;
                        })}
                      </Avatar.Group>
                      <span style={{ marginLeft: 8, color: 'var(--tg-theme-hint-color)' }}>
                        {formatDate(game.date)}
                      </span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};