export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  __STATIC_CONTENT?: KVNamespace;
  APP_NAME: string;
  APP_MODE: string;
  SECRET_KEY: string;
}
