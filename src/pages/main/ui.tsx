import React, { useState } from 'react';
import { Space } from 'antd';
import { AddParticipant } from '../../features/add-participant';
import { AddGame } from '../../features/add-game';
import { ParticipantsList } from '../../widgets/participants-list';
import { GamesList } from '../../widgets/games-list';
import { StatisticsDashboard } from '../../widgets/statistics-dashboard';
import { BottomNav, type TabKey } from '../../shared/ui';
import styled from 'styled-components';

const PageContent = styled.div`
  padding-bottom: calc(72px + env(safe-area-inset-bottom, 0));
`;

export const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('participants');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <PageContent>
        {activeTab === 'participants' && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <AddParticipant onSuccess={handleDataUpdate} />
            <ParticipantsList refreshTrigger={refreshTrigger} />
          </Space>
        )}
        {activeTab === 'games' && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <AddGame onSuccess={handleDataUpdate} />
            <GamesList refreshTrigger={refreshTrigger} />
          </Space>
        )}
        {activeTab === 'statistics' && (
          <StatisticsDashboard refreshTrigger={refreshTrigger} />
        )}
      </PageContent>
      <BottomNav activeKey={activeTab} onChange={setActiveTab} />
    </>
  );
};