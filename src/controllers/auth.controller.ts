import { Context } from 'hono';
import { Database, AuthRepository } from '../repositories';
import { hashPassword, checkPassword } from '../utils/passwords';
import { newAPIToken, hashBearerToken, tokenHint } from '../utils/tokens';
import { getUserSettings } from '../config/settings';

export class AuthController {
  constructor(private db: Database) {}

  async register(c: Context) {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;

      if (!username || !email || !password) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      if (password.length < 8) {
        return c.json({ code: 'INVALID_INPUT', message: 'Password must be at least 8 characters' }, 400);
      }

      const settings = await getUserSettings(this.db.getD1());
      if (settings.reg !== '1') {
        return c.json({ code: 'REGISTRATION_CLOSED', message: 'Registration is closed' }, 403);
      }

      const authRepo = new AuthRepository(this.db);
      
      const existingUser = await authRepo.findLoginUser(username);
      if (existingUser) {
        return c.json({ code: 'USER_EXISTS', message: 'Username already exists' }, 409);
      }

      const passwordHash = await hashPassword(password);
      const initialPoints = parseInt(settings.point || '100', 10);

      const userId = await authRepo.createUser({
        username,
        email,
        group_id: 100,
        status: 1,
        points: initialPoints,
      }, passwordHash, '');

      return c.json({
        code: 'OK',
        message: 'Registration successful',
        data: { id: userId, username, email, points: initialPoints }
      }, 201);
    } catch (error) {
      console.error('Register error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Registration failed' }, 500);
    }
  }

  async login(c: Context) {
    try {
      const body = await c.req.json();
      const { username, password } = body;

      if (!username || !password) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing username or password' }, 400);
      }

      const authRepo = new AuthRepository(this.db);
      const user = await authRepo.findLoginUser(username);

      if (!user) {
        return c.json({ code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' }, 401);
      }

      const valid = await checkPassword(password, user.user.password_hash);
      if (!valid) {
        return c.json({ code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' }, 401);
      }

      if (user.user.status === 0) {
        return c.json({ code: 'ACCOUNT_DISABLED', message: 'Account is disabled' }, 403);
      }

      const tokenResult = newAPIToken();
      const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      const apiRepo = new (await import('../repositories')).APIRepository(this.db);
      const sessionId = await apiRepo.createSession(
        user.user.id,
        tokenResult.hash,
        tokenResult.hint,
        expiresAt
      );

      return c.json({
        code: 'OK',
        message: 'Login successful',
        data: {
          session_id: sessionId,
          token: tokenResult.plain,
          user: {
            id: user.user.id,
            username: user.user.username,
            email: user.user.email,
            group_id: user.user.group_id,
            status: user.user.status,
            points: user.user.points,
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Login failed' }, 500);
    }
  }

  async me(c: Context) {
    try {
      const auth = c.get('auth');
      if (!auth || !auth.user) {
        return c.json({ code: 'UNAUTHORIZED', message: 'Not authenticated' }, 401);
      }

      return c.json({
        code: 'OK',
        message: 'Success',
        data: auth.user
      });
    } catch (error) {
      console.error('Me error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get user info' }, 500);
    }
  }

  async changePassword(c: Context) {
    try {
      const auth = c.get('auth');
      if (!auth || !auth.user) {
        return c.json({ code: 'UNAUTHORIZED', message: 'Not authenticated' }, 401);
      }

      const body = await c.req.json();
      const { old_password, new_password } = body;

      if (!old_password || !new_password) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing old or new password' }, 400);
      }

      if (new_password.length < 8) {
        return c.json({ code: 'INVALID_INPUT', message: 'New password must be at least 8 characters' }, 400);
      }

      const authRepo = new AuthRepository(this.db);
      const user = await authRepo.findLoginUser(auth.user.username);

      if (!user) {
        return c.json({ code: 'USER_NOT_FOUND', message: 'User not found' }, 404);
      }

      const valid = await checkPassword(old_password, user.user.password_hash);
      if (!valid) {
        return c.json({ code: 'INVALID_PASSWORD', message: 'Old password is incorrect' }, 400);
      }

      const newPasswordHash = await hashPassword(new_password);
      await authRepo.updatePassword(user.user.id, newPasswordHash, '');

      return c.json({
        code: 'OK',
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to change password' }, 500);
    }
  }
}
