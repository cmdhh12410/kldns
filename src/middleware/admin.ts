import { Context, Next } from 'hono';
import { getAuth } from './auth';

export function adminMiddleware() {
  return async (c: Context, next: Next) => {
    const auth = getAuth(c);
    
    if (auth.user.group_id !== 99) {
      return c.json({
        code: 'FORBIDDEN',
        message: 'Admin access required',
      }, 403);
    }

    await next();
  };
}
