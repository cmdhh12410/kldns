export interface TokenResult {
  plain: string;
  hash: string;
  hint: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function newAPIToken(): Promise<TokenResult> {
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const plain = 'kldns_' + bufferToHex(raw);
  const hash = await hashBearerToken(plain);
  const hint = tokenHint(plain);
  return { plain, hash, hint };
}

export async function hashBearerToken(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(plain.trim()));
  return bufferToHex(hashBuffer);
}

export function tokenHint(plain: string): string {
  plain = plain.trim();
  if (plain.length <= 36) {
    return plain;
  }
  return plain.substring(0, 18) + '...' + plain.substring(plain.length - 12);
}
