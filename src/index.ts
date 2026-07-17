import { createRouter } from './routes/router';
import { serveStatic } from './static';
import type { Env } from './types';

export type { Env };

const app = createRouter();

// 处理 API 请求
app.all('/api/*', async (c) => {
  return c.json({ code: 'NOT_FOUND', message: 'API endpoint not found' }, 404);
});

// 处理前端静态资源
app.get('*', async (c) => {
  return serveStatic(c);
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await app.fetch(request, env, ctx);
    } catch (error) {
      console.error('Unhandled error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
