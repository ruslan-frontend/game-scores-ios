import { Layout as AntLayout } from 'antd';
import styled from 'styled-components';

const { Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
  min-height: calc(100vh - env(safe-area-inset-top, 0) - env(safe-area-inset-bottom, 0));
  background: var(--tg-theme-bg-color, #ffffff);
`;

const StyledContent = styled(Content)`
  padding: 12px 16px 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0));
  background: var(--tg-theme-bg-color, #ffffff);
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <StyledContent>
        {children}
      </StyledContent>
    </StyledLayout>
  );
};