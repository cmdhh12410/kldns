import { Database } from './database';
import { User } from '../models/user';
import { Domain } from '../models/domain';
import { Record } from '../models/record';
import { Subdomain, SubdomainStatus } from '../models/subdomain';
import { OperationLog, DNSWriteJob } from '../models';

export class RecordRepository {
  constructor(private db: Database) {}

  async getUser(id: number): Promise<User | null> {
    return await this.db.queryOne<User>(
      `SELECT id, group_id, status, username, COALESCE(email, '') as email, points FROM users WHERE id = ?`,
      [id]
    );
  }

  async getDomainForGroup(did: number, gid: number): Promise<Domain | null> {
    const result = await this.db.queryOne<any>(
      `SELECT id, provider_key, COALESCE(provider_config_ciphertext, '') as provider_config_ciphertext, remote_zone_id, domain,
              group_policy, record_types, beian, points_cost, require_review, COALESCE(description, '') as description
       FROM domains
       WHERE id = ? AND (group_policy = '0' OR instr(',' || group_policy || ',', ',' || ? || ',') > 0)`,
      [did, gid]
    );
    if (!result) return null;
    return {
      ...result,
      record_types: result.record_types.split(',').map((t: string) => t.trim().toUpperCase()).filter((t: string) => t),
    };
  }

  async getSubdomainForUser(id: number, uid: number): Promise<{ subdomain: Subdomain; domain: Domain } | null> {
    const result = await this.db.queryOne<any>(
      `SELECT s.id, s.uid, s.did, s.name, s.full_domain, s.status, COALESCE(s.purpose, '') as purpose,
              COALESCE(s.reject_reason, '') as reject_reason, COALESCE(s.reviewed_by, 0) as reviewed_by,
              COALESCE(s.reviewed_at, 0) as reviewed_at, s.created_at, s.updated_at,
              d.id as domain_id, d.provider_key, d.provider_config_ciphertext, d.remote_zone_id, d.domain,
              d.group_policy, d.record_types, d.beian, d.points_cost, d.require_review, d.description
       FROM subdomains s
       JOIN domains d ON d.id = s.did
       WHERE s.id = ? AND s.uid = ?`,
      [id, uid]
    );
    if (!result) return null;
    
    return {
      subdomain: {
        id: result.id,
        uid: result.uid,
        did: result.did,
        name: result.name,
        full_domain: result.full_domain,
        status: result.status,
        purpose: result.purpose,
        reject_reason: result.reject_reason,
        reviewed_by: result.reviewed_by,
        reviewed_at: result.reviewed_at,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
      domain: {
        id: result.domain_id,
        provider_key: result.provider_key,
        provider_config_ciphertext: result.provider_config_ciphertext,
        remote_zone_id: result.remote_zone_id,
        domain: result.domain,
        group_policy: result.group_policy,
        record_types: result.record_types.split(',').map((t: string) => t.trim().toUpperCase()).filter((t: string) => t),
        beian: result.beian,
        points_cost: result.points_cost,
        require_review: result.require_review,
        description: result.description,
      },
    };
  }

  async getRecordForUser(id: number, uid: number): Promise<Record | null> {
    return await this.db.queryOne<Record>(
      `SELECT id, uid, did, COALESCE(subdomain_id, 0) as subdomain_id, record_id, name, type, value, line_id, COALESCE(line, '') as line
       FROM records WHERE id = ? AND uid = ?`,
      [id, uid]
    );
  }

  async recordNameExists(did: number, name: string, recordType: string, ignoreId: number): Promise<boolean> {
    let query = `SELECT COUNT(1) as count FROM records WHERE did = ? AND name = ? AND (type = ? OR type = 'CNAME' OR ? = 'CNAME')`;
    const params: any[] = [did, name, recordType, recordType];
    
    if (ignoreId > 0) {
      query += ` AND id != ?`;
      params.push(ignoreId);
    }
    
    const result = await this.db.queryOne<{ count: number }>(query, params);
    return (result?.count || 0) > 0;
  }

  async allowUnlimitedSubdomainRecords(): Promise<boolean> {
    const result = await this.db.queryOne<{ value: string }>(
      `SELECT value FROM settings WHERE key = ?`,
      ['array_dns']
    );
    if (!result) return true;
    const settings = JSON.parse(result.value);
    return settings.unlimited_subdomain_records === '1';
  }

  async applyCreatedRecord(user: User, domain: Domain, record: Record, log: OperationLog): Promise<void> {
    await this.db.transaction(async (db) => {
      await db.execute(
        `INSERT INTO records (uid, did, subdomain_id, record_id, name, type, value, line_id, line)
         VALUES (?, ?, NULLIF(?, 0), ?, ?, ?, ?, ?, ?)`,
        [user.id, domain.id, record.subdomain_id, record.record_id, record.name, record.type, record.value, record.line_id, record.line]
      );
      await this.insertOperationLog(db, log);
    });
  }

  async applyUpdatedRecord(recordId: number, record: Record, log: OperationLog): Promise<void> {
    await this.db.transaction(async (db) => {
      const result = await db.execute(
        `UPDATE records
         SET subdomain_id = NULLIF(?, 0), record_id = ?, name = ?, type = ?, value = ?, line_id = ?, line = ?, updated_at = strftime('%s','now')
         WHERE id = ? AND uid = ?`,
        [record.subdomain_id, record.record_id, record.name, record.type, record.value, record.line_id, record.line, record.id, record.uid]
      );
      if (result.meta.changes !== 1) throw new Error('Record not found or no changes');
      await this.insertOperationLog(db, log);
    });
  }

  async applyDeletedRecord(recordId: number, log: OperationLog): Promise<void> {
    await this.db.transaction(async (db) => {
      const result = await db.execute(`DELETE FROM records WHERE id = ?`, [recordId]);
      if (result.meta.changes !== 1) throw new Error('Record not found');
      await this.insertOperationLog(db, log);
    });
  }

  async enqueueDNSWriteJob(job: DNSWriteJob): Promise<void> {
    if (!job.status) job.status = 'pending';
    await this.db.execute(
      `INSERT INTO dns_write_jobs (uid, source, provider_key, domain, record_name, record_type, value_digest, remote_record_id, operation, status, last_error, payload)
       VALUES (NULLIF(?, 0), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [job.uid, job.source, job.provider_key, job.domain, job.record_name, job.record_type, job.value_digest, job.remote_record_id, job.operation, job.status, job.last_error, job.payload]
    );
  }

  private async insertOperationLog(db: Database, log: OperationLog): Promise<void> {
    await db.execute(
      `INSERT INTO operation_logs (uid, admin_uid, source, target_type, target_id, ip, action, message, extra)
       VALUES (NULLIF(?, 0), NULLIF(?, 0), ?, ?, ?, ?, ?, ?, ?)`,
      [log.uid, log.admin_uid, log.source, log.target_type, log.target_id, log.ip, log.action, log.message, log.extra]
    );
  }
}
