import { Database } from './database';

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

  async getDomains(limit: number = 100, offset: number = 0): Promise<any[]> {
    return await this.db.query(
      `SELECT d.id, d.domain, d.points_cost, d.record_types, d.beian, d.require_review,
              d.description, d.provider_key, d.remote_zone_id, d.created_at,
              p.label as provider_label
       FROM domains d
       LEFT JOIN dns_providers p ON p.key = d.provider_key
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
    description: string = ''
  ): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO domains (domain, provider_key, remote_zone_id, points_cost, record_types, beian, require_review, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [domain, providerKey, remoteZoneId, pointsCost, recordTypes, beian, requireReview, description]
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
      `SELECT key, label, config_ciphertext, created_at, updated_at
       FROM dns_providers
       ORDER BY key ASC`
    );
  }

  async createProvider(key: string, label: string, configCiphertext: string): Promise<void> {
    await this.db.execute(
      `INSERT INTO dns_providers (key, label, config_ciphertext) VALUES (?, ?, ?)`,
      [key, label, configCiphertext]
    );
  }

  async updateProvider(key: string, updates: { label?: string; config_ciphertext?: string }): Promise<void> {
    const sets: string[] = [];
    const values: any[] = [];
    
    if (updates.label !== undefined) {
      sets.push('label = ?');
      values.push(updates.label);
    }
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
                        s.reject_reason, s.reviewed_by, s.reviewed_at, s.created_at,
                        u.username, d.domain
                 FROM subdomains s
                 LEFT JOIN users u ON u.id = s.uid
                 LEFT JOIN domains d ON d.id = s.did`;
    
    const values: any[] = [];
    
    if (status !== undefined) {
      query += ' WHERE s.status = ?';
      values.push(status);
    }
    
    query += ' ORDER BY s.id DESC LIMIT ? OFFSET ?';
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
      `SELECT r.id, r.uid, r.did, r.subdomain_id, r.name, r.type, r.value, r.line, r.created_at,
              u.username, d.domain, s.name as subdomain_name
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

  async getOperationLogs(limit: number = 100, offset: number = 0): Promise<any[]> {
    return await this.db.query(
      `SELECT l.id, l.uid, l.admin_uid, l.action, l.target_type, l.target_id, l.message, l.created_at,
              u.username as user_name, a.username as admin_name
       FROM operation_logs l
       LEFT JOIN users u ON u.id = l.uid
       LEFT JOIN users a ON a.id = l.admin_uid
       ORDER BY l.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async getOperationLogsCount(): Promise<number> {
    const result = await this.db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM operation_logs'
    );
    return result?.count || 0;
  }
}
