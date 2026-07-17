export interface Domain {
  id: number;
  provider_key: string;
  provider_config_ciphertext: string;
  remote_zone_id: string;
  domain: string;
  group_policy: string;
  record_types: string[];
  beian: number;
  points_cost: number;
  require_review: number;
  description: string;
  created_at?: number;
  updated_at?: number;
}
