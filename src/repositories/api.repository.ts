import { Database } from './database';
import { User } from '../models/user';
import { Domain } from '../models/domain';
import { Record } from '../models/record';
import { Subdomain } from '../models/subdomain';

export interface TokenWithUser {
  id: number;
  uid: number;
  name: string;
  token_hint: string;
  expires_at: number;
  user: User;
}

export class APIRepository {
  constructor(private db: Database) {}

  async authenticateSession(tokenHash: string): Promise<TokenWithUser | null> {
    const result = await this.db.queryOne<any>(
      `SELECT s.id, s.uid, 'session' as name, s.token_hint, s.expires_at,
              u.id as user_id, u.group_id, u.status, u.username, COALESCE(u.email, '') as email, u.points
       FROM sessions s
       JOIN users u ON u.id = s.uid
       WHERE s.token_hash = ? AND u.status != 0`,
      [tokenHash]
    );
    if (!result) return null;
    if (result.expires_at > 0 && result.expires_at < Math.floor(Date.now() / 1000)) return null;
    
    await this.touchLastUsedAt('sessions', result.id);
    
    return {
      id: result.id,
      uid: result.uid,
      name: result.name,
      token_hint: result.token_hint,
      expires_at: result.expires_at,
      user: {
        id: result.user_id,
        group_id: result.group_id,
        status: result.status,
        username: result.username,
        email: result.email,
        points: result.points,
      },
    };
  }

  async authenticateToken(tokenHash: string): Promise<TokenWithUser | null> {
    const result = await this.db.queryOne<any>(
      `SELECT t.id, t.uid, t.name, t.token_hint, t.expires_at,
              u.id as user_id, u.group_id, u.status, u.username, COALESCE(u.email, '') as email, u.points
       FROM api_tokens t
       JOIN users u ON u.id = t.uid
       WHERE t.token_hash = ? AND u.status != 0`,
      [tokenHash]
    );
    if (!result) return null;
    if (result.expires_at > 0 && result.expires_at < Math.floor(Date.now() / 1000)) return null;
    
    await this.touchLastUsedAt('api_tokens', result.id);
    
    return {
      id: result.id,
      uid: result.uid,
      name: result.name,
      token_hint: result.token_hint,
      expires_at: result.expires_at,
      user: {
        id: result.user_id,
        group_id: result.group_id,
        status: result.status,
        username: result.username,
        email: result.email,
        points: result.points,
      },
    };
  }

  private async touchLastUsedAt(table: string, id: number): Promise<void> {
    await this.db.execute(
      `UPDATE ${table} SET last_used_at = strftime('%s','now')
       WHERE id = ? AND last_used_at < strftime('%s','now') - 300`,
      [id]
    );
  }

  async createSession(uid: number, tokenHash: string, tokenHint: string, expiresAt: number): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO sessions (uid, token_hash, token_hint, expires_at) VALUES (?, ?, ?, ?)`,
      [uid, tokenHash, tokenHint, expiresAt]
    );
    return result.meta.last_row_id;
  }

  async listAvailableDomains(gid: number, keyword?: string): Promise<any[]> {
    let query = `SELECT id, domain, points_cost, COALESCE(description, '') as description, record_types, beian, require_review,
                        provider_key, COALESCE(provider_config_ciphertext, '') as provider_config_ciphertext, remote_zone_id
                 FROM domains
                 WHERE (group_policy = '0' OR instr(',' || group_policy || ',', ',' || ? || ',') > 0)`;
    const params: any[] = [gid];
    
    if (keyword) {
      query += ` AND lower(domain) LIKE ?`;
      params.push(`%${keyword.toLowerCase()}%`);
    }
    
    query += ` ORDER BY id DESC`;
    
    return await this.db.query(query, params);
  }

  async listPublicDomains(): Promise<any[]> {
    const results = await this.db.query<any>(
      `SELECT id, domain, points_cost, COALESCE(description, '') as description, record_types, beian, require_review, group_policy
       FROM domains
       ORDER BY id DESC`
    );
    
    return results.filter(r => {
      const groups = r.group_policy.split(',').map((g: string) => g.trim());
      return !(groups.length > 0 && groups.every((g: string) => g === '99'));
    });
  }

  async listSubdomains(uid: number, status?: number, keyword?: string): Promise<any[]> {
    let query = `SELECT s.id, s.uid, s.did, s.name, s.full_domain, s.status, COALESCE(s.purpose, '') as purpose,
                        COALESCE(s.reject_reason, '') as reject_reason, COALESCE(s.reviewed_by, 0) as reviewed_by,
                        COALESCE(s.reviewed_at, 0) as reviewed_at, s.created_at,
                        d.domain, d.points_cost, d.record_types, COUNT(r.id) as record_count
                 FROM subdomains s
                 JOIN domains d ON d.id = s.did
                 LEFT JOIN records r ON r.subdomain_id = s.id
                 WHERE s.uid = ?`;
    const params: any[] = [uid];
    
    if (status !== undefined) {
      query += ` AND s.status = ?`;
      params.push(status);
    }
    
    if (keyword) {
      query += ` AND (lower(s.name) LIKE ? OR lower(s.full_domain) LIKE ? OR lower(d.domain) LIKE ? OR
                     lower(COALESCE(s.purpose, '')) LIKE ? OR lower(COALESCE(s.reject_reason, '')) LIKE ?)`;
      const kw = `%${keyword.toLowerCase()}%`;
      params.push(kw, kw, kw, kw, kw);
    }
    
    query += ` GROUP BY s.id, d.id ORDER BY s.id DESC`;
    
    const results = await this.db.query(query, params);
    
    return results.map(r => ({
      ...r,
      record_types: r.record_types ? r.record_types.split(',').map((t: string) => t.trim()) : [],
    }));
  }

  async listRecords(uid: number, did?: number, subdomainId?: number, type?: string, keyword?: string): Promise<any[]> {
    let query = `SELECT r.id, r.did, COALESCE(r.subdomain_id, 0) as subdomain_id, r.name, r.type, r.value, r.line_id, COALESCE(r.line, '') as line,
                        COALESCE(d.domain, '') as domain, COALESCE(s.name, '') as subdomain_name, COALESCE(s.full_domain, '') as subdomain
                 FROM records r
                 LEFT JOIN domains d ON d.id = r.did
                 LEFT JOIN subdomains s ON s.id = r.subdomain_id
                 WHERE r.uid = ?`;
    const params: any[] = [uid];
    
    if (did) {
      query += ` AND r.did = ?`;
      params.push(did);
    }
    if (subdomainId) {
      query += ` AND r.subdomain_id = ?`;
      params.push(subdomainId);
    }
    if (type) {
      query += ` AND r.type = ?`;
      params.push(type.toUpperCase());
    }
    if (keyword) {
      query += ` AND (lower(COALESCE(s.full_domain, '')) LIKE ? OR lower(r.name) LIKE ? OR lower(r.type) LIKE ? OR
                     lower(r.value) LIKE ? OR lower(COALESCE(r.line, '')) LIKE ?)`;
      const kw = `%${keyword.toLowerCase()}%`;
      params.push(kw, kw, kw, kw, kw);
    }
    
    query += ` ORDER BY r.id DESC`;
    
    return await this.db.query(query, params);
  }

  async listTokens(uid: number): Promise<any[]> {
    return await this.db.query(
      `SELECT id, name, token_hint, last_used_at, expires_at, created_at
       FROM api_tokens WHERE uid = ? AND name != 'login' ORDER BY id DESC`,
      [uid]
    );
  }

  async pointsOverview(uid: number, action?: string, keyword?: string, since?: number): Promise<any> {
    const user = await this.db.queryOne<{ points: number }>('SELECT points FROM users WHERE id = ?', [uid]);
    if (!user) throw new Error('User not found');
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartUnix = Math.floor(monthStart.getTime() / 1000);
    
    const spent = await this.db.queryOne<any>(
      `SELECT COALESCE(SUM(CASE WHEN points < 0 THEN -points ELSE 0 END), 0) as total_spent,
              COALESCE(SUM(CASE WHEN points < 0 AND created_at >= ? THEN -points ELSE 0 END), 0) as month_spent
       FROM point_records WHERE uid = ?`,
      [monthStartUnix, uid]
    );
    
    const actions = await this.db.query<{ action: string }>(
      `SELECT action FROM point_records WHERE uid = ? AND COALESCE(action, '') != '' GROUP BY action ORDER BY action ASC`,
      [uid]
    );
    
    let query = `SELECT id, action, points, rest, COALESCE(remark, '') as remark, created_at FROM point_records WHERE uid = ?`;
    const params: any[] = [uid];
    
    if (action) {
      query += ` AND action = ?`;
      params.push(action);
    }
    if (since) {
      query += ` AND created_at >= ?`;
      params.push(since);
    }
    if (keyword) {
      query += ` AND (lower(action) LIKE ? OR lower(COALESCE(remark, '')) LIKE ?)`;
      const kw = `%${keyword.toLowerCase()}%`;
      params.push(kw, kw);
    }
    
    query += ` ORDER BY id DESC LIMIT 100`;
    
    const recentRecords = await this.db.query(query, params);
    
    return {
      balance: user.points,
      total_spent: spent?.total_spent || 0,
      month_spent: spent?.month_spent || 0,
      actions: actions.map(a => a.action),
      recent_records: recentRecords,
    };
  }

  async createToken(uid: number, name: string, tokenHash: string, tokenHint: string, expiresAt: number): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO api_tokens (uid, name, token_hash, token_hint, expires_at) VALUES (?, ?, ?, ?, ?)`,
      [uid, name, tokenHash, tokenHint, expiresAt]
    );
    return result.meta.last_row_id;
  }

  async deleteToken(uid: number, id: number): Promise<boolean> {
    const result = await this.db.execute(
      `DELETE FROM api_tokens WHERE uid = ? AND id = ?`,
      [uid, id]
    );
    return result.meta.changes > 0;
  }
}
