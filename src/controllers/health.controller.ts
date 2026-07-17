import { Context } from 'hono';
import { Database } from '../repositories';

export class HealthController {
  constructor(private db: Database) {}

  async check(c: Context) {
    try {
      const result = await this.db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users');
      
      return c.json({
        code: 'OK',
        message: 'Service is healthy',
        data: {
          status: 'healthy',
          database: 'connected',
          users_count: result?.count || 0,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Health check error:', error);
      return c.json({
        code: 'UNHEALTHY',
        message: 'Service is unhealthy',
        data: {
          status: 'unhealthy',
          database: 'disconnected',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }, 503);
    }
  }
}
