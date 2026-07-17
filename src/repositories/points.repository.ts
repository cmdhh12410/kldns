import { Database } from './database';

export interface PointAdjustment {
  userId: number;
  adminId: number;
  delta: number;
  action: string;
  remark: string;
  log: any;
}

export interface PointAdjustmentResult {
  newBalance: number;
}

export class PointsRepository {
  constructor(private db: Database) {}

  async adjustUserPoints(adjustment: PointAdjustment): Promise<PointAdjustmentResult> {
    return await this.db.transaction(async (db) => {
      const user = await db.queryOne<{ points: number }>(
        'SELECT points FROM users WHERE id = ?',
        [adjustment.userId]
      );
      
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }
      
      const newBalance = user.points + adjustment.delta;
      
      if (newBalance < 0) {
        throw new Error('INSUFFICIENT_POINTS');
      }
      
      await db.execute(
        'UPDATE users SET points = ?, updated_at = strftime(\'%s\',\'now\') WHERE id = ?',
        [newBalance, adjustment.userId]
      );
      
      await db.execute(
        `INSERT INTO point_records (uid, admin_uid, action, points, rest, remark) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [adjustment.userId, adjustment.adminId, adjustment.action, adjustment.delta, newBalance, adjustment.remark]
      );
      
      await db.execute(
        `INSERT INTO operation_logs (uid, admin_uid, source, target_type, target_id, action, message, extra)
         VALUES (?, ?, 'admin', 'user_points', ?, ?, ?, ?)`,
        [adjustment.userId, adjustment.adminId, adjustment.userId, adjustment.log.action, adjustment.log.message, adjustment.log.extra]
      );
      
      return { newBalance };
    });
  }

  async getPointRecords(userId: number, limit: number = 100, offset: number = 0): Promise<any[]> {
    return await this.db.query(
      `SELECT id, uid, admin_uid, action, points, rest, remark, created_at 
       FROM point_records 
       WHERE uid = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
  }

  async getPointRecordsCount(userId: number): Promise<number> {
    const result = await this.db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM point_records WHERE uid = ?',
      [userId]
    );
    return result?.count || 0;
  }
}
