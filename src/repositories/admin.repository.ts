import { Database } from './database';
import { OperationLog } from '../models';

export class AdminRepository {
  constructor(private db: Database) {}

  async getUsers(limit: number = 100, offset: number = 0): Promise<any[]> {
    return await this.db.query(
      `SELECT u.id, u.username, u.email, u.points, u.status, u.group_id, u.created_at,
              g.name as group_name
       FROM users u
       LEFT JOIN groups g ON g.id = u.group_id
       WHERE u.id != 0
       ORDER BY u.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async getUsersCount(): Promise<number> {
    const result = await this.db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE id != 0'
    );
    return result?.count || 0;
  }

  async getUserById(id: number): Promise<any> {
    return await this.db.queryOne(
      `SELECT u.id, u.username, u.email, u.points, u.status, u.group_id, u.created_at,
              g.name as group_name
       FROM users u
       LEFT JOIN groups g ON g.id = u.group_id
       WHERE u.id = ?`,
      [id]
    );
  }

  async createUser(username: string, email: string, passwordHash: string, groupId: number = 100, status: number = 2, points: number = 0): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO users (username, email, password_hash, group_id, status, points, sid) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, passwordHash, groupId, status, points, '']
    );
    return result.meta.last_row_id;
  }

  async updateUser(id: number, updates: { email?: string; group_id?: number; status?: number; points?: number }): Promise<void> {
    const sets: string[] = [];
    const values: any[] = [];
    
    if (updates.email !== undefined) {
      sets.push('email = ?');
      values.push(updates.email);
    }
    if (updates.group_id !== undefined) {
      sets.push('group_id = ?');
      values.push(updates.group_id);
    }
    if (updates.status !== undefined) {
      sets.push('status = ?');
      values.push(updates.status);
    }
    if (updates.points !== undefined) {
      sets.push('points = ?');
      values.push(updates.points);
    }
    
    if (sets.length > 0) {
      sets.push("updated_at = strftime('%s','now')");
      values.push(id);
      await this.db.execute(
        `UPDATE users SET ${sets.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  async deleteUser(id: number): Promise<void> {
    await this.db.execute('DELETE FROM users WHERE id = ? AND id != 0', [id]);
  }

  async getGroups(): Promise<any[]> {
    return await this.db.query(
      `SELECT id, name, created_at
       FROM groups
       ORDER BY id ASC`
    );
  }

  async createGroup(name: string): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO groups (name) VALUES (?)`,
      [name]
    );
    return result.meta.last_row_id;
  }

  async deleteGroup(id: number): Promise<void> {
    await this.db.execute('DELETE FROM groups WHERE id = ?', [id]);
  }

  async getDomains(limit: number = 100, offset: number = 0): Promise<any[]> {
    return await this.db.query(
      `SELECT d.id, d.domain, d.points_cost, d.record_types, d.beian, d.require_review,
              d.description, d.provider_key, d.remote_zone_id, d.created_at, d.group_policy,
              CASE WHEN d.provider_config_ciphertext IS NOT NULL AND d.provider_config_ciphertext != '' THEN 1 ELSE 0 END as provider_config_stored
       FROM domains d
       ORDER BY d.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async getDomainsCount(): Promise<number> {
    const result = await this.db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM domains'
    );
    return result?.count || 0;
  }

  async createDomain(
    domain: string,
    providerKey: string,
    remoteZoneId: string,
    pointsCost: number = 0,
    recordTypes: string = 'A,CNAME',
    beian: number = 0,
    requireReview: number = 0,
    description: string = '',
    providerConfigCiphertext: string = '',
    groupPolicy: string = '0'
  ): Promise<number> {
    await this.db.execute(
      `INSERT OR IGNORE INTO dns_providers (key, config_ciphertext) VALUES (?, '')`,
      [providerKey]
    );

    const result = await this.db.execute(
      `INSERT INTO domains (domain, provider_key, remote_zone_id, points_cost, record_types, beian, require_review, description, provider_config_ciphertext, group_policy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [domain, providerKey, remoteZoneId, pointsCost, recordTypes, beian, requireReview, description, providerConfigCiphertext, groupPolicy]
    );
    return result.meta.last_row_id;
  }

  async updateDomain(id: number, updates: any): Promise<void> {
    const sets: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        sets.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (sets.length > 0) {
      sets.push("updated_at = strftime('%s','now')");
      values.push(id);
      await this.db.execute(
        `UPDATE domains SET ${sets.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  async deleteDomain(id: number): Promise<void> {
    await this.db.execute('DELETE FROM domains WHERE id = ?', [id]);
  }

  async getProviders(): Promise<any[]> {
    return await this.db.query(
      `SELECT key, config_ciphertext, created_at, updated_at
       FROM dns_providers
       ORDER BY key ASC`
    );
  }

  async createProvider(key: string, configCiphertext: string): Promise<void> {
    await this.db.execute(
      `INSERT INTO dns_providers (key, config_ciphertext) VALUES (?, ?)`,
      [key, configCiphertext]
    );
  }

  async updateProvider(key: string, updates: { config_ciphertext?: string }): Promise<void> {
    const sets: string[] = [];
    const values: any[] = [];
    
    if (updates.config_ciphertext !== undefined) {
      sets.push('config_ciphertext = ?');
      values.push(updates.config_ciphertext);
    }
    
    if (sets.length > 0) {
      sets.push("updated_at = strftime('%s','now')");
      values.push(key);
      await this.db.execute(
        `UPDATE dns_providers SET ${sets.join(', ')} WHERE key = ?`,
        values
      );
    }
  }

  async deleteProvider(key: string): Promise<void> {
    await this.db.execute('DELETE FROM dns_providers WHERE key = ?', [key]);
  }

  async getSubdomains(limit: number = 100, offset: number = 0, status?: number): Promise<any[]> {
    let query = `SELECT s.id, s.uid, s.did, s.name, s.full_domain, s.status, s.purpose,
                        s.created_at, s.updated_at,
                        u.username, d.domain, d.points_cost as registration_cost,
                        COUNT(r.id) as record_count
                 FROM subdomains s
                 LEFT JOIN users u ON u.id = s.uid
                 LEFT JOIN domains d ON d.id = s.did
                 LEFT JOIN records r ON r.subdomain_id = s.id`;
    
    const values: any[] = [];
    
    if (status !== undefined) {
      query += ' WHERE s.status = ?';
      values.push(status);
    }
    
    query += ' GROUP BY s.id, u.id, d.id ORDER BY s.id DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    
    return await this.db.query(query, values);
  }

  async getSubdomainsCount(status?: number): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM subdomains';
    const values: any[] = [];
    
    if (status !== undefined) {
      query += ' WHERE status = ?';
      values.push(status);
    }
    
    const result = await this.db.queryOne<{ count: number }>(query, values);
    return result?.count || 0;
  }

  async getRecords(limit: number = 100, offset: number = 0): Promise<any[]> {
    return await this.db.query(
      `SELECT r.id, r.uid, r.did, r.subdomain_id, r.record_id, r.name, r.type, r.value, r.line_id, r.line, r.created_at,
              u.username, d.domain, s.name as subdomain
       FROM records r
       LEFT JOIN users u ON u.id = r.uid
       LEFT JOIN domains d ON d.id = r.did
       LEFT JOIN subdomains s ON s.id = r.subdomain_id
       ORDER BY r.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async getRecordsCount(): Promise<number> {
    const result = await this.db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM records'
    );
    return result?.count || 0;
  }

  async getDomainById(id: number): Promise<any | null> {
    return await this.db.queryOne<any>(
      `SELECT id, domain, provider_key, COALESCE(provider_config_ciphertext, '') as provider_config_ciphertext,
              remote_zone_id, points_cost, record_types, beian, require_review,
              COALESCE(description, '') as description, group_policy, created_at
       FROM domains WHERE id = ?`,
      [id]
    );
  }

  async getExistingRecordIdsForDomain(did: number): Promise<Set<string>> {
    const rows = await this.db.query<{ record_id: string }>(
      `SELECT record_id FROM records WHERE did = ? AND record_id IS NOT NULL AND record_id != ''`,
      [did]
    );
    return new Set(rows.map(r => r.record_id));
  }

  async insertSyncRecord(did: number, record: any): Promise<void> {
    await this.db.execute(
      `INSERT INTO records (uid, did, subdomain_id, record_id, name, type, value, line_id, line)
       VALUES (0, ?, NULL, ?, ?, ?, ?, ?, ?)`,
      [did, record.remote_id, record.name, record.type, record.value, record.line_id || 'default', record.line || '默认']
    );
  }

  async createRecord(record: { uid: number; did: number; name: string; type: string; value: string; line_id: string; line?: string; subdomain_id?: number | null; record_id?: string | null }): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO records (uid, did, subdomain_id, record_id, name, type, value, line_id, line)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [record.uid, record.did, record.subdomain_id || null, record.record_id || '', record.name, record.type, record.value, record.line_id, record.line || '默认']
    );
    return result.lastInsertRowId || 0;
  }

  async updateRecord(id: number, record: { name?: string; type?: string; value?: string; line_id?: string; line?: string }): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (record.name !== undefined) { fields.push('name = ?'); values.push(record.name); }
    if (record.type !== undefined) { fields.push('type = ?'); values.push(record.type); }
    if (record.value !== undefined) { fields.push('value = ?'); values.push(record.value); }
    if (record.line_id !== undefined) { fields.push('line_id = ?'); values.push(record.line_id); }
    if (record.line !== undefined) { fields.push('line = ?'); values.push(record.line); }
    
    if (fields.length === 0) return;
    
    await this.db.execute(
      `UPDATE records SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
  }

  async deleteRecord(id: number): Promise<void> {
    await this.db.execute('DELETE FROM records WHERE id = ?', [id]);
  }

  async insertOperationLog(log: OperationLog): Promise<void> {
    await this.db.execute(
      `INSERT INTO operation_logs (uid, admin_uid, source, target_type, target_id, ip, action, message, extra)
       VALUES (NULLIF(?, 0), NULLIF(?, 0), ?, ?, ?, ?, ?, ?, ?)`,
      [log.uid || 0, log.admin_uid || 0, log.source, log.target_type, log.target_id, log.ip || '', log.action, log.message, log.extra]
    );
  }

  async getOperationLogs(limit: number = 100, offset: number = 0, filters?: { source?: string; action?: string; keyword?: string }): Promise<any[]> {
    let query = `SELECT l.id, l.uid, l.admin_uid, l.source, l.action, l.target_type, l.target_id, l.message, l.created_at,
                        u.username, a.username as admin_username
                 FROM operation_logs l
                 LEFT JOIN users u ON u.id = l.uid
                 LEFT JOIN users a ON a.id = l.admin_uid`;
    const values: any[] = [];
    const conditions: string[] = [];

    if (filters?.source) {
      conditions.push('l.source = ?');
      values.push(filters.source);
    }
    if (filters?.action) {
      conditions.push('l.action = ?');
      values.push(filters.action);
    }
    if (filters?.keyword) {
      conditions.push('(l.message LIKE ? OR l.target_id LIKE ?)');
      const kw = `%${filters.keyword}%`;
      values.push(kw, kw);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY l.id DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    return await this.db.query(query, values);
  }

  async getOperationLogsCount(filters?: { source?: string; action?: string; keyword?: string }): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM operation_logs l';
    const values: any[] = [];
    const conditions: string[] = [];

    if (filters?.source) {
      conditions.push('l.source = ?');
      values.push(filters.source);
    }
    if (filters?.action) {
      conditions.push('l.action = ?');
      values.push(filters.action);
    }
    if (filters?.keyword) {
      conditions.push('(l.message LIKE ? OR l.target_id LIKE ?)');
      const kw = `%${filters.keyword}%`;
      values.push(kw, kw);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await this.db.queryOne<{ count: number }>(query, values);
    return result?.count || 0;
  }
}
