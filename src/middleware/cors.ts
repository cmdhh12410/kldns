import { Context, Next } from 'hono';

export function corsMiddleware() {
  return async (c: Context, next: Next) => {
    await next();
    
    c.res.headers.set('Access-Control-Allow-Origin', '*');
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    c.res.headers.set('Access-Control-Max-Age', '86400');
  };
}
