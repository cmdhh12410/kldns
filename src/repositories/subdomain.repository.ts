import { Database } from './database';
import { User } from '../models/user';
import { Domain } from '../models/domain';
import { Subdomain, SubdomainStatus } from '../models/subdomain';
import { OperationLog } from '../models';

export class SubdomainRepository {
  constructor(private db: Database) {}

  async registerSubdomain(
    user: User,
    domain: Domain,
    name: string,
    purpose: string,
    requireReview: boolean,
    log: OperationLog
  ): Promise<Subdomain> {
    return await this.db.transaction(async (db) => {
      const status = requireReview ? SubdomainStatus.Pending : SubdomainStatus.Active;
      const fullDomain = `${name}.${domain.domain}`;
      
      const result = await db.execute(
        `INSERT INTO subdomains (uid, did, name, full_domain, status, purpose) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, domain.id, name, fullDomain, status, purpose]
      );
      
      const subdomain = await db.queryOne<Subdomain>(
        `SELECT id, uid, did, name, full_domain, status, COALESCE(purpose, '') as purpose,
                COALESCE(reject_reason, '') as reject_reason, COALESCE(reviewed_by, 0) as reviewed_by,
                COALESCE(reviewed_at, 0) as reviewed_at, created_at, updated_at
         FROM subdomains WHERE id = ?`,
        [result.meta.last_row_id]
      );
      
      if (!subdomain) throw new Error('Failed to create subdomain');
      
      if (domain.points_cost > 0 && status === SubdomainStatus.Active) {
        await this.deductPoints(db, user.id, domain.points_cost, `注册二级域名 [${fullDomain}]`);
      }
      
      await this.insertOperationLog(db, log);
      
      return subdomain;
    });
  }

  async deleteSubdomain(subdomain: Subdomain, log: OperationLog): Promise<void> {
    await this.db.transaction(async (db) => {
      const result = await db.execute(`DELETE FROM subdomains WHERE id = ?`, [subdomain.id]);
      if (result.meta.changes !== 1) throw new Error('Subdomain not found');
      await this.insertOperationLog(db, log);
    });
  }

  async cancelPendingSubdomain(
    subdomain: Subdomain,
    domain: Domain,
    pointRemark: string,
    log: OperationLog
  ): Promise<void> {
    await this.db.transaction(async (db) => {
      const result = await db.execute(`DELETE FROM subdomains WHERE id = ? AND status = ?`, [subdomain.id, SubdomainStatus.Pending]);
      if (result.meta.changes !== 1) throw new Error('Pending subdomain not found');
      
      if (domain.points_cost > 0) {
        await this.refundPoints(db, subdomain.uid, domain.points_cost, pointRemark);
      }
      
      await this.insertOperationLog(db, log);
    });
  }

  async approveSubdomain(subdomain: Subdomain, log: OperationLog): Promise<void> {
    await this.db.transaction(async (db) => {
      const result = await db.execute(
        `UPDATE subdomains SET status = ?, reviewed_at = strftime('%s','now'), updated_at = strftime('%s','now') WHERE id = ? AND status = ?`,
        [SubdomainStatus.Active, subdomain.id, SubdomainStatus.Pending]
      );
      if (result.meta.changes !== 1) throw new Error('Pending subdomain not found');
      await this.insertOperationLog(db, log);
    });
  }

  async rejectPendingSubdomain(
    subdomain: Subdomain,
    domain: Domain,
    reason: string,
    pointRemark: string,
    log: OperationLog
  ): Promise<void> {
    await this.db.transaction(async (db) => {
      const result = await db.execute(
        `UPDATE subdomains SET status = ?, reject_reason = ?, reviewed_at = strftime('%s','now'), updated_at = strftime('%s','now') WHERE id = ? AND status = ?`,
        [SubdomainStatus.Rejected, reason, subdomain.id, SubdomainStatus.Pending]
      );
      if (result.meta.changes !== 1) throw new Error('Pending subdomain not found');
      
      if (domain.points_cost > 0) {
        await this.refundPoints(db, subdomain.uid, domain.points_cost, pointRemark);
      }
      
      await this.insertOperationLog(db, log);
    });
  }

  async countRecordsForSubdomain(subdomainId: number, uid: number): Promise<number> {
    const result = await this.db.queryOne<{ count: number }>(
      `SELECT COUNT(1) as count FROM records WHERE subdomain_id = ? AND uid = ?`,
      [subdomainId, uid]
    );
    return result?.count || 0;
  }

  private async deductPoints(db: Database, uid: number, points: number, remark: string): Promise<void> {
    const user = await db.queryOne<{ points: number }>(`SELECT points FROM users WHERE id = ?`, [uid]);
    if (!user || user.points < points) throw new Error('Insufficient points');
    
    const newBalance = user.points - points;
    await db.execute(`UPDATE users SET points = ?, updated_at = strftime('%s','now') WHERE id = ?`, [newBalance, uid]);
    await db.execute(
      `INSERT INTO point_records (uid, action, points, rest, remark) VALUES (?, ?, ?, ?, ?)`,
      [uid, '注册域名扣费', -points, newBalance, remark]
    );
  }

  private async refundPoints(db: Database, uid: number, points: number, remark: string): Promise<void> {
    const user = await db.queryOne<{ points: number }>(`SELECT points FROM users WHERE id = ?`, [uid]);
    if (!user) throw new Error('User not found');
    
    const newBalance = user.points + points;
    await db.execute(`UPDATE users SET points = ?, updated_at = strftime('%s','now') WHERE id = ?`, [newBalance, uid]);
    await db.execute(
      `INSERT INTO point_records (uid, action, points, rest, remark) VALUES (?, ?, ?, ?, ?)`,
      [uid, '域名退款', points, newBalance, remark]
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
