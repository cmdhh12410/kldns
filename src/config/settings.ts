import type { UserSettings, WebSettings, DnsSettings, TurnstileSettings } from '../models/settings';

export async function getUserSettings(db: D1Database): Promise<UserSettings> {
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('array_user').first<{ value: string }>();
  if (!result) {
    return { reg: '1', email: '1', point: '100' };
  }
  return JSON.parse(result.value);
}

export async function getWebSettings(db: D1Database): Promise<WebSettings> {
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('array_web').first<{ value: string }>();
  if (!result) {
    return {
      name: 'KLDNS',
      title: 'KLDNS - 二级域名分发与解析管理平台',
      keywords: 'KLDNS,二级域名分发,DNS解析,域名管理平台',
      description: 'KLDNS 用于二级域名分发、DNS 解析管理、用户自助申请与后台统一运维。',
    };
  }
  return JSON.parse(result.value);
}

export async function getDnsSettings(db: D1Database): Promise<DnsSettings> {
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('array_dns').first<{ value: string }>();
  if (!result) {
    return { unlimited_subdomain_records: '1' };
  }
  return JSON.parse(result.value);
}

export async function getTurnstileSettings(db: D1Database): Promise<TurnstileSettings> {
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('array_turnstile').first<{ value: string }>();
  if (!result) {
    return { site_key: '', register_enabled: '0', login_enabled: '0' };
  }
  return JSON.parse(result.value);
}

export async function getSetting(db: D1Database, key: string): Promise<string | null> {
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>();
  return result?.value || null;
}

export async function setSetting(db: D1Database, key: string, value: string): Promise<void> {
  await db.prepare(
    'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime(\'%s\',\'now\')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
  ).bind(key, value).run();
}
