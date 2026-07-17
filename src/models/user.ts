export interface User {
  id: number;
  group_id: number;
  status: number;
  username: string;
  email: string;
  points: number;
}

export interface UserWithPassword extends User {
  password_hash: string;
  sid: string;
  remember_token_hash?: string;
  created_at: number;
  updated_at: number;
}

export const UserStatus = {
  Disabled: 0,
  Pending: 1,
  Active: 2,
} as const;

export const UserGroup = {
  Admin: 99,
  Default: 100,
} as const;
