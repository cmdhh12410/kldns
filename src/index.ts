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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      await ensureMigrations(env);
      return await app.fetch(request, env, ctx);
    } catch (error) {
      console.error('Unhandled error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
