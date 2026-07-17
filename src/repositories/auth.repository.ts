import { Database } from './database';
import { User, UserWithPassword } from '../models/user';
import { hashBearerToken, tokenHint } from '../utils/tokens';

export class AuthRepository {
  constructor(private db: Database) {}

  async getUserSettings(): Promise<{ reg: string; email: string; point: string; review_mode?: string }> {
    const result = await this.db.queryOne<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      ['array_user']
    );
    if (!result) {
      return { reg: '1', email: '1', point: '100' };
    }
    return JSON.parse(result.value);
  }

  async createUser(user: User, passwordHash: string, sid: string): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO users (group_id, status, username, password_hash, sid, email, points)
       VALUES (?, ?, ?, ?, ?, NULLIF(?, ''), ?)`,
      [user.group_id, user.status, user.username, passwordHash, sid, user.email, user.points]
    );
    return result.meta.last_row_id;
  }

  async findLoginUser(login: string): Promise<{ user: UserWithPassword } | null> {
    const result = await this.db.queryOne<UserWithPassword>(
      `SELECT id, group_id, status, username, COALESCE(email, '') as email, points, password_hash, sid, remember_token_hash, created_at, updated_at
       FROM users WHERE username = ? OR email = ?`,
      [login, login.toLowerCase()]
    );
    if (!result) return null;
    return { user: result };
  }

  async updatePassword(uid: number, passwordHash: string, sid: string): Promise<void> {
    await this.db.execute(
      `UPDATE users SET password_hash = ?, sid = ?, updated_at = strftime('%s','now') WHERE id = ?`,
      [passwordHash, sid, uid]
    );
  }
}
