import { Context, Next } from 'hono';
import { hashBearerToken } from '../utils/tokens';
import { Database, APIRepository } from '../repositories';
import { User } from '../models';

export interface AuthContext {
  user: User;
  source: 'session' | 'token';
}

export function authMiddleware(db: Database) {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
      }, 401);
    }

    const token = authHeader.substring(7);
    const tokenHash = await hashBearerToken(token);

    const apiRepo = new APIRepository(db);

    let authResult = await apiRepo.authenticateSession(tokenHash);
    let source: 'session' | 'token' = 'session';
    
    if (!authResult) {
      authResult = await apiRepo.authenticateToken(tokenHash);
      source = 'token';
    }

    if (!authResult) {
      return c.json({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      }, 401);
    }

    c.set('auth', {
      user: authResult.user,
      source,
    } as AuthContext);

    await next();
  };
}

export function getAuth(c: Context): AuthContext {
  const auth = c.get('auth') as AuthContext;
  if (!auth) {
    throw new Error('Auth context not found');
  }
  return auth;
}
