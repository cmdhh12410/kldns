import { createHash, randomBytes } from 'crypto';

export interface TokenResult {
  plain: string;
  hash: string;
  hint: string;
}

export function newAPIToken(): TokenResult {
  const raw = randomBytes(32);
  const plain = 'kldns_' + raw.toString('hex');
  const hash = hashBearerToken(plain);
  const hint = tokenHint(plain);
  return { plain, hash, hint };
}

export function hashBearerToken(plain: string): string {
  return createHash('sha256').update(plain.trim()).digest('hex');
}

export function tokenHint(plain: string): string {
  plain = plain.trim();
  if (plain.length <= 36) {
    return plain;
  }
  return plain.substring(0, 18) + '...' + plain.substring(plain.length - 12);
}
