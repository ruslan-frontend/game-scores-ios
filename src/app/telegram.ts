import {
  getNativeTelegramContext,
  isCapacitorNative,
  isNativeIdentityReady,
} from '../shared/lib/native-identity';

export type TelegramColorScheme = 'light' | 'dark';

export const applyNativeThemeVars = () => {
  if (!isCapacitorNative() || typeof document === 'undefined') return;
  const p = getTelegramThemeParams();
  document.documentElement.style.setProperty('--tg-theme-bg-color', p.bgColor);
  document.documentElement.style.setProperty('--tg-theme-text-color', p.textColor);
  document.documentElement.style.setProperty('--tg-theme-hint-color', p.hintColor);
  document.documentElement.style.setProperty('--tg-theme-link-color', p.linkColor);
  document.documentElement.style.setProperty('--tg-theme-button-color', p.buttonColor);
  document.documentElement.style.setProperty('--tg-theme-button-text-color', p.buttonTextColor);
};

// Сохраняем API функции, чтобы не ломать импорты в приложении.
export const initTelegramWebApp = (onThemeChange?: () => void) => {
  if (isCapacitorNative()) {
    onThemeChange?.();
    return { platform: 'capacitor-ios' };
  }
  onThemeChange?.();
  return null;
};

export const getTelegramColorScheme = (): TelegramColorScheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const getTelegramThemeParams = () => {
  const dark = getTelegramColorScheme() === 'dark';
  return dark
    ? {
        bgColor: '#141414',
        textColor: '#f5f5f5',
        hintColor: '#a3a3a3',
        linkColor: '#60a5fa',
        buttonColor: '#2563eb',
        buttonTextColor: '#ffffff',
      }
    : {
        bgColor: '#ffffff',
        textColor: '#171717',
        hintColor: '#737373',
        linkColor: '#2563eb',
        buttonColor: '#2563eb',
        buttonTextColor: '#ffffff',
      };
};

export const getTelegramContext = () => {
  if (isCapacitorNative() && isNativeIdentityReady()) {
    return getNativeTelegramContext();
  }

  return {
    contextId: 'default',
    contextType: 'private' as const,
    user: null,
    chat: null,
  };
};