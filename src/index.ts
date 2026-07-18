import { createRouter } from './routes/router';
import type { Env } from './types';
import { Database, runMigrations } from './repositories';

import './dns';

export type { Env };

const app = createRouter();
let migrationsRun = false;

async function ensureMigrations(env: Env): Promise<void> {
  if (migrationsRun) return;
  if (!env.DB) return;
  try {
    const db = new Database(env.DB);
    await runMigrations(db);
    migrationsRun = true;
  } catch (error) {
    console.error('Migration error:', error);
  }
}

async function serveSPA(request: Request, env: Env): Promise<Response> {
  if (env.ASSETS) {
    const indexUrl = new URL('/index.html', request.url);
    const indexRequest = new Request(indexUrl, request);
    const response = await env.ASSETS.fetch(indexRequest);
    if (response.status === 200) return response;
  }

  if (env.__STATIC_CONTENT) {
    const indexHtml = await env.__STATIC_CONTENT.get('index.html');
    if (indexHtml) {
      return new Response(indexHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      await ensureMigrations(env);
      const response = await app.fetch(request, env, ctx);
      if (response.status === 404) {
        const accept = request.headers.get('Accept') || '';
        const url = new URL(request.url);
        if (request.method === 'GET' && accept.includes('text/html') && !url.pathname.startsWith('/api/')) {
          return await serveSPA(request, env);
        }
      }
      return response;
    } catch (error) {
      console.error('Unhandled error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
