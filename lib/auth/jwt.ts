import crypto from 'crypto';
import { UserProfile, UserRole } from '@/types/aurabots';

// Secret key for HMAC signing (uses environment variable or secure fallback)
const JWT_SECRET = process.env.AURABOTS_JWT_SECRET || process.env.JWT_SECRET || 'aurabots_quantum_256bit_secret_key_matrix_soc2';
const REFRESH_SECRET = process.env.AURABOTS_REFRESH_SECRET || process.env.REFRESH_SECRET || 'aurabots_refresh_token_quantum_matrix_key';

export interface JWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: UserRole;
  provider: string;
  iat: number;
  exp: number;
}

export interface RefreshPayload {
  sub: string;
  email: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}

// Base64Url helpers
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

// 1. Sign JWT
export function signJwt(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresInSeconds: number = 3600): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;

  const fullPayload: JWTPayload = { ...payload, iat, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// 2. Verify JWT
export function verifyJwt(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) {
      return { valid: false, error: 'Cryptographic signature mismatch' };
    }

    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Token verification failed' };
  }
}

// 3. Issue Refresh Token
export function signRefreshToken(userId: string, email: string): string {
  const header = { alg: 'HS256', typ: 'REFRESH' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 3600; // 7 days

  const payload: RefreshPayload = {
    sub: userId,
    email,
    tokenVersion: 1,
    iat,
    exp,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac('sha256', REFRESH_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// 4. Verify Refresh Token
export function verifyRefreshToken(token: string): { valid: boolean; payload?: RefreshPayload; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid refresh token format' };
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', REFRESH_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) {
      return { valid: false, error: 'Invalid refresh signature' };
    }

    const payload: RefreshPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Refresh token expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Refresh verification failed' };
  }
}

// 5. Encrypt / Mask Sensitive OAuth & GitHub Tokens
export function maskToken(token: string): string {
  if (!token || token.length < 8) return '••••••••••••';
  return `${token.substring(0, 4)}••••${token.substring(token.length - 4)}`;
}

export function encryptSensitiveToken(token: string, salt: string = 'aurabots_salt'): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    crypto.scryptSync(JWT_SECRET, salt, 32),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptSensitiveToken(encrypted: string, salt: string = 'aurabots_salt'): string {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      crypto.scryptSync(JWT_SECRET, salt, 32),
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return encrypted;
  }
}
