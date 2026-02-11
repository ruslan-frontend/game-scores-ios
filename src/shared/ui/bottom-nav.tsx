import React from 'react';
import styled from 'styled-components';
import { UserOutlined, ControlOutlined, BarChartOutlined } from '@ant-design/icons';

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(56px + env(safe-area-inset-bottom, 0));
  padding-bottom: env(safe-area-inset-bottom, 0);
  background: var(--tg-theme-bg-color, #ffffff);
  border-top: 1px solid var(--tg-theme-hint-color, rgba(0, 0, 0, 0.06));
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  z-index: 100;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 56px;
  padding: 8px 4px;
  border: none;
  background: none;
  color: ${(p) =>
    p.$active
      ? 'var(--tg-theme-button-color, #2481cc)'
      : 'var(--tg-theme-hint-color, rgba(0, 0, 0, 0.45))'};
  font-size: 11px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }
`;

const NavIcon = styled.span`
  font-size: 22px;
  line-height: 1;
`;

export type TabKey = 'participants' | 'games' | 'statistics';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'participants', label: 'Участники', icon: <UserOutlined /> },
  { key: 'games', label: 'Игры', icon: <ControlOutlined /> },
  { key: 'statistics', label: 'Статистика', icon: <BarChartOutlined /> },
];

interface BottomNavProps {
  activeKey: TabKey;
  onChange: (key: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeKey, onChange }) => {
  return (
    <Nav role="tablist">
      {TABS.map(({ key, label, icon }) => (
        <NavItem
          key={key}
          type="button"
          role="tab"
          aria-selected={activeKey === key}
          $active={activeKey === key}
          onClick={() => onChange(key)}
        >
          <NavIcon>{icon}</NavIcon>
          <span>{label}</span>
        </NavItem>
      ))}
    </Nav>
  );
};
