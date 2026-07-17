export * from './user';
export * from './domain';
export * from './record';
export * from './subdomain';
export * from './settings';

export interface OperationLog {
  uid?: number;
  admin_uid?: number;
  source: string;
  target_type: string;
  target_id: string;
  ip?: string;
  action: string;
  message: string;
  extra: string;
}

export interface DNSWriteJob {
  id?: number;
  uid?: number;
  source: string;
  provider_key: string;
  domain: string;
  record_name: string;
  record_type: string;
  value_digest: string;
  remote_record_id?: string;
  operation: string;
  status: string;
  attempts: number;
  last_error?: string;
  payload: string;
  created_at?: number;
  updated_at?: number;
}

export interface Session {
  id: number;
  uid: number;
  token_hash: string;
  token_hint: string;
  last_used_at: number;
  expires_at: number;
  created_at: number;
  updated_at: number;
}

export interface APIToken {
  id: number;
  uid: number;
  name: string;
  token_hash: string;
  token_hint: string;
  last_used_at: number;
  expires_at: number;
  created_at: number;
  updated_at: number;
}

export interface PointRecord {
  id: number;
  uid: number;
  admin_uid?: number;
  action: string;
  points: number;
  rest: number;
  remark?: string;
  created_at: number;
}

export interface DNSProvider {
  key: string;
  config_ciphertext: string;
  created_at: number;
  updated_at: number;
}
