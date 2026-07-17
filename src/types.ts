export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  APP_NAME: string;
  APP_MODE: string;
  SECRET_KEY: string;
}
