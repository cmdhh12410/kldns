import { Database, PointsRepository } from '../repositories';
import { OperationLog } from '../models';

export class PointsService {
  private pointsRepo: PointsRepository;

  constructor(private db: Database) {
    this.pointsRepo = new PointsRepository(db);
  }

  async adjustPoints(
    userId: number,
    adminId: number,
    delta: number,
    action: string,
    remark: string
  ): Promise<{ newBalance: number }> {
    const log: OperationLog = {
      uid: userId,
      admin_uid: adminId,
      source: 'admin',
      target_type: 'user_points',
      target_id: userId.toString(),
      action: delta > 0 ? 'increase' : 'decrease',
      message: `${delta > 0 ? 'Increase' : 'Decrease'} points by ${Math.abs(delta)}`,
      extra: JSON.stringify({ delta, action, remark }),
    };

    return await this.pointsRepo.adjustUserPoints({
      userId,
      adminId,
      delta,
      action,
      remark,
      log,
    });
  }

  async getPointRecords(userId: number, limit: number = 100, offset: number = 0) {
    return await this.pointsRepo.getPointRecords(userId, limit, offset);
  }

  async getPointRecordsCount(userId: number): Promise<number> {
    return await this.pointsRepo.getPointRecordsCount(userId);
  }
}
