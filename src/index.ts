import { createRouter } from './routes/router';
import type { Env } from './types';

export type { Env };

const app = createRouter();

app.all('*', async (c) => {
  return c.json({ code: 'NOT_FOUND', message: 'Not Found' }, 404);
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
