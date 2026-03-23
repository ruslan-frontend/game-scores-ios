import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import type { TelegramContext } from '../types';

const KEYS = {
  TELEGRAM_ID: 'native_synthetic_telegram_id',
  CONTEXT_ID: 'native_context_id',
} as const;

let ready = false;
let cachedTelegramId: number | null = null;
let cachedContextId: string | null = null;

export function isCapacitorNative(): boolean {
  return Capacitor.isNativePlatform();
}

function randomNegativeSafeInteger(): number {
  const buf = new Uint8Array(8);
  crypto.getRandomValues(buf);
  let n = 0n;
  for (let i = 0; i < 8; i++) {
    n = (n << 8n) | BigInt(buf[i]);
  }
  const mod = BigInt(Number.MAX_SAFE_INTEGER - 1);
  const neg = -(Number((n % mod) + 1n));
  return neg;
}

export async function initNativeAppIdentity(): Promise<void> {
  if (!isCapacitorNative()) return;
  if (ready) return;

  let ctx = (await Preferences.get({ key: KEYS.CONTEXT_ID })).value;
  if (!ctx) {
    ctx = crypto.randomUUID();
    await Preferences.set({ key: KEYS.CONTEXT_ID, value: ctx });
  }
  cachedContextId = ctx;

  let tid = (await Preferences.get({ key: KEYS.TELEGRAM_ID })).value;
  if (!tid) {
    const synthetic = randomNegativeSafeInteger();
    tid = String(synthetic);
    await Preferences.set({ key: KEYS.TELEGRAM_ID, value: tid });
  }
  cachedTelegramId = Number(tid);

  ready = true;
}

export function isNativeIdentityReady(): boolean {
  return ready;
}

export function getNativeTelegramContext(): TelegramContext {
  if (!ready || cachedContextId === null || cachedTelegramId === null) {
    throw new Error('Native identity is not initialized');
  }
  const id = cachedTelegramId;
  return {
    contextId: cachedContextId,
    contextType: 'private',
    user: {
      id,
      first_name: 'Игрок',
      username: 'ios_app',
    },
    chat: null,
  };
}
