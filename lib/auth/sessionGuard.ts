import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, JWTPayload } from './jwt';
import { UserRole } from '@/types/aurabots';

export interface GuardResult {
  authenticated: boolean;
  user?: JWTPayload;
  error?: string;
  statusCode?: number;
}

// 1. Extract Bearer token from headers or cookies
export function extractTokenFromRequest(req: NextRequest): string | null {
  // Authorization header: Bearer <token>
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Cookie fallback: aurabots_access_token
  const cookie = req.cookies.get('aurabots_access_token');
  if (cookie?.value) {
    return cookie.value;
  }

  return null;
}

// 2. Validate Session Guard
export function validateSessionGuard(
  req: NextRequest,
  allowedRoles?: UserRole[]
): GuardResult {
  const token = extractTokenFromRequest(req);

  if (!token) {
    return {
      authenticated: false,
      error: 'Missing authorization token. Please sign in.',
      statusCode: 401,
    };
  }

  const { valid, payload, error } = verifyJwt(token);

  if (!valid || !payload) {
    return {
      authenticated: false,
      error: error || 'Unauthorized or expired session.',
      statusCode: 401,
    };
  }

  // Role verification check
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(payload.role)) {
      return {
        authenticated: false,
        user: payload,
        error: `Forbidden: role '${payload.role}' does not have permission for this resource.`,
        statusCode: 403,
      };
    }
  }

  return {
    authenticated: true,
    user: payload,
  };
}

// 3. Helper to produce standardized error responses
export function createUnauthorizedResponse(error: string = 'Unauthorized', status: number = 401) {
  return NextResponse.json(
    {
      success: false,
      error,
      code: status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED',
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
