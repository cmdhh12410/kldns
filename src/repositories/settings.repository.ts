import { Database } from './database';

export class SettingsRepository {
  constructor(private db: Database) {}

  async get(key: string): Promise<string | null> {
    const result = await this.db.queryOne<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return result?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.execute(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime('%s','now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      [key, value]
    );
  }

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.db.query<{ key: string; value: string }>('SELECT key, value FROM settings');
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setJSON<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  async allowUnlimitedSubdomainRecords(): Promise<boolean> {
    const dns = await this.getJSON<{ unlimited_subdomain_records: string }>('array_dns');
    return dns?.unlimited_subdomain_records === '1';
  }

  async getReserveDomainNames(): Promise<string[]> {
    const raw = await this.get('reserve_domain_name');
    if (!raw) return [];
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }

  async delete(key: string): Promise<void> {
    await this.db.execute('DELETE FROM settings WHERE key = ?', [key]);
  }
}
