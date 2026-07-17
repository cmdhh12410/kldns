import { Database } from './database';

const INITIAL_SCHEMA_VERSION = '0001_initial_schema';

export async function runMigrations(db: Database): Promise<void> {
  const alreadyApplied = await isMigrationApplied(db, INITIAL_SCHEMA_VERSION);
  if (alreadyApplied) {
    return;
  }

  const sql = getInitialSchemaSQL();
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    await db.execute(stmt);
  }
}

async function isMigrationApplied(db: Database, version: string): Promise<boolean> {
  try {
    const result = await db.queryOne<{ version: string }>(
      'SELECT version FROM schema_migrations WHERE version = ?',
      [version]
    );
    return result !== null;
  } catch {
    return false;
  }
}

function getInitialSchemaSQL(): string {
  return `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS "groups" (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL DEFAULT 100 REFERENCES "groups"(id) ON UPDATE CASCADE,
  status INTEGER NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2)),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  remember_token_hash TEXT,
  sid TEXT NOT NULL,
  email TEXT UNIQUE,
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS dns_providers (
  key TEXT PRIMARY KEY,
  config_ciphertext TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS domains (
  id INTEGER PRIMARY KEY,
  provider_key TEXT NOT NULL REFERENCES dns_providers(key) ON UPDATE CASCADE ON DELETE RESTRICT,
  provider_config_ciphertext TEXT,
  remote_zone_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  group_policy TEXT NOT NULL DEFAULT '0',
  record_types TEXT NOT NULL DEFAULT 'A,CNAME',
  beian INTEGER NOT NULL DEFAULT 0 CHECK (beian IN (0, 1)),
  points_cost INTEGER NOT NULL DEFAULT 0 CHECK (points_cost >= 0),
  require_review INTEGER NOT NULL DEFAULT 0 CHECK (require_review IN (0, 1)),
  description TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE(provider_key, remote_zone_id),
  UNIQUE(domain)
);

CREATE TABLE IF NOT EXISTS subdomains (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  did INTEGER NOT NULL REFERENCES domains(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_domain TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 1 CHECK (status IN (0, 1, 2, 3)),
  purpose TEXT NOT NULL DEFAULT '',
  reject_reason TEXT NOT NULL DEFAULT '',
  reviewed_by INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  reviewed_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  did INTEGER NOT NULL REFERENCES domains(id) ON UPDATE CASCADE ON DELETE CASCADE,
  subdomain_id INTEGER REFERENCES subdomains(id) ON UPDATE CASCADE ON DELETE SET NULL,
  record_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  line_id TEXT NOT NULL DEFAULT '0',
  line TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE(did, name, type)
);

CREATE TABLE IF NOT EXISTS api_tokens (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_hint TEXT NOT NULL,
  last_used_at INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  token_hint TEXT NOT NULL,
  last_used_at INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS point_records (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  admin_uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  action TEXT NOT NULL,
  points INTEGER NOT NULL,
  rest INTEGER NOT NULL,
  remark TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS operation_logs (
  id INTEGER PRIMARY KEY,
  uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  admin_uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'system',
  target_type TEXT,
  target_id TEXT,
  ip TEXT,
  action TEXT NOT NULL,
  message TEXT NOT NULL,
  extra TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS dns_write_jobs (
  id INTEGER PRIMARY KEY,
  uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  source TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  domain TEXT NOT NULL,
  record_name TEXT NOT NULL,
  record_type TEXT NOT NULL,
  value_digest TEXT NOT NULL,
  remote_record_id TEXT,
  operation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  payload TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

INSERT OR IGNORE INTO "groups"(id, name) VALUES (99, '管理组'), (100, '默认组');

INSERT OR IGNORE INTO users(id, group_id, status, username, password_hash, sid, email, points)
VALUES (0, 100, 0, 'system-sync', 'system-disabled', 'system-sync', NULL, 0);

INSERT OR IGNORE INTO settings(key, value) VALUES
  ('array_user', '{"reg":"1","email":"1","point":"100"}'),
  ('array_web', '{"name":"KLDNS","title":"KLDNS - 二级域名分发与解析管理平台","keywords":"KLDNS,二级域名分发,DNS解析,域名管理平台","description":"KLDNS 用于二级域名分发、DNS 解析管理、用户自助申请与后台统一运维。"}'),
  ('array_dns', '{"unlimited_subdomain_records":"1"}'),
  ('array_turnstile', '{"site_key":"","register_enabled":"0","login_enabled":"0"}'),
  ('html_header', '<div class="alert alert-primary">本站提供二级域名分发与解析服务，请遵守相关法律法规与平台使用规范。</div>'),
  ('html_home', '欢迎使用 KLDNS 用户控制台。添加解析前请确认主机记录、记录类型与记录值填写正确，并遵守平台解析规范。'),
  ('index_urls', '源码下载|https://github.com/klsf/kldns'),
  ('reserve_domain_name', 'www,w,m,3g,4g,qq');

INSERT OR IGNORE INTO schema_migrations(version) VALUES ('0001_initial_schema');
`;
}
