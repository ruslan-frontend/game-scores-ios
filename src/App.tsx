import { useEffect, useState, useMemo } from 'react';
import { ConfigProvider, theme, Spin, Alert, Button } from 'antd';
import type { ThemeConfig } from 'antd';
import { Capacitor } from '@capacitor/core';
import { Layout } from './shared/ui';
import { MainPage } from './pages/main';
import {
  initTelegramWebApp,
  getTelegramColorScheme,
  getTelegramThemeParams,
  applyNativeThemeVars,
} from './app/telegram';
import { AuthService } from './shared/lib/auth';
import { isCapacitorNative } from './shared/lib/native-identity';
import 'antd/dist/reset.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(() => getTelegramColorScheme());

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        setError(null);

        initTelegramWebApp(() => setColorScheme(getTelegramColorScheme()));
        setColorScheme(getTelegramColorScheme());
        if (isCapacitorNative()) {
          applyNativeThemeVars();
        }

        // Проверяем настройки Supabase
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Supabase не настроен. Проверьте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.');
        }

        // Аутентифицируем пользователя для работы с Supabase
        await AuthService.getCurrentUser();
      } catch (error) {
        console.error('App initialization failed:', error);
        setError(error instanceof Error ? error.message : 'Ошибка инициализации приложения');
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    applyNativeThemeVars();
  }, [colorScheme]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      setColorScheme(getTelegramColorScheme());
      applyNativeThemeVars();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const themeConfig: ThemeConfig = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const params = getTelegramThemeParams();
    return {
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: params.buttonColor,
        borderRadius: 8,
        colorBgContainer: params.bgColor,
        colorBgElevated: params.bgColor,
        colorText: params.textColor,
        colorTextSecondary: params.hintColor,
      },
    };
  }, [colorScheme]);

  const configProvider = (
    <ConfigProvider theme={themeConfig}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <Spin size="large" />
          <div>Загрузка приложения...</div>
        </div>
      ) : error ? (
        <div
          style={{
            padding: 24,
            maxWidth: 600,
            margin: '50px auto',
          }}
        >
          <Alert
            message="Ошибка загрузки"
            description={
              <div>
                <p>{error}</p>
                <p>Возможные причины:</p>
                <ul>
                  <li>Не настроены переменные окружения Supabase</li>
                  <li>Проблемы с подключением к базе данных</li>
                </ul>
              </div>
            }
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={handleRetry}>
                Попробовать снова
              </Button>
            }
          />
        </div>
      ) : (
        <Layout>
          <MainPage />
        </Layout>
      )}
    </ConfigProvider>
  );

  return configProvider;
}

export default App;
