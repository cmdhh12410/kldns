export interface Record {
  id: number;
  uid: number;
  did: number;
  subdomain_id: number;
  record_id: string;
  name: string;
  type: string;
  value: string;
  line_id: string;
  line: string;
  created_at?: number;
  updated_at?: number;
}
