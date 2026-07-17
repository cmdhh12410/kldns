export interface Settings {
  key: string;
  value: string;
  created_at: number;
  updated_at: number;
}

export interface UserSettings {
  reg: string;
  email: string;
  point: string;
  review_mode?: string;
}

export interface WebSettings {
  name: string;
  title: string;
  keywords: string;
  description: string;
}

export interface DnsSettings {
  unlimited_subdomain_records: string;
}

export interface TurnstileSettings {
  site_key: string;
  secret_key?: string;
  register_enabled: string;
  login_enabled: string;
}
