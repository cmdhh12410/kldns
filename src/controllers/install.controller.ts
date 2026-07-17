import { Context } from 'hono';
import { Database, AuthRepository } from '../repositories';
import { hashPassword } from '../utils/passwords';

export class InstallController {
  constructor(private db: Database) {}

  async createAdmin(c: Context) {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;

      if (!username || !password) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      if (password.length < 8) {
        return c.json({ code: 'INVALID_INPUT', message: 'Password must be at least 8 characters' }, 400);
      }

      const authRepo = new AuthRepository(this.db);
      
      const existingAdmin = await authRepo.findLoginUser(username);
      if (existingAdmin) {
        return c.json({ code: 'USER_EXISTS', message: 'Username already exists' }, 409);
      }

      const passwordHash = await hashPassword(password);
      const adminId = await authRepo.createUser({
        username,
        email: email || '',
        group_id: 99,
        status: 2,
        points: 0,
      }, passwordHash, '');

      return c.json({
        code: 'OK',
        message: 'Admin user created successfully',
        data: { id: adminId, username, email, group_id: 99 }
      }, 201);
    } catch (error) {
      console.error('Create admin error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to create admin' }, 500);
    }
  }
}
