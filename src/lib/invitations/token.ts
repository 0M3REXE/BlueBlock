import crypto from 'crypto';

// Generates a secure random token and its sha256 hash for storage.
export function generateInvitationToken() {
  const raw = crypto.randomBytes(32).toString('base64url');
  const hash = hashToken(raw);
  return { raw, hash };
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function isExpired(expires_at: string | Date) {
  const exp = typeof expires_at === 'string' ? new Date(expires_at) : expires_at;
  return Date.now() > exp.getTime();
}
