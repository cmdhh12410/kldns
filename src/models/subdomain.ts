export interface Subdomain {
  id: number;
  uid: number;
  did: number;
  name: string;
  full_domain: string;
  status: number;
  purpose: string;
  reject_reason: string;
  reviewed_by: number;
  reviewed_at: number;
  created_at: number;
  updated_at: number;
}

export const SubdomainStatus = {
  Active: 1,
  Disabled: 0,
  Pending: 2,
  Rejected: 3,
} as const;
