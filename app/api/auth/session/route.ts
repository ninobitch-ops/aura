import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest } from '@/lib/auth/sessionGuard';
import { verifyJwt } from '@/lib/auth/jwt';
import { UsersRepo } from '@/lib/storage/documentStore';
import { sanitizeUserForClient } from '@/lib/security/accessControl';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      // Return default guest / anonymous state
      const defaultUser = UsersRepo.get('ninobitch@gmail.com');
      return NextResponse.json({
        authenticated: true,
        user: defaultUser ? sanitizeUserForClient(defaultUser) : null,
        isGuestFallback: true,
      });
    }

    const { valid, payload, error } = verifyJwt(token);

    if (!valid || !payload) {
      return NextResponse.json(
        { authenticated: false, error: error || 'Invalid session' },
        { status: 401 }
      );
    }

    const user = UsersRepo.get(payload.email);

    return NextResponse.json({
      authenticated: true,
      user: user ? sanitizeUserForClient(user) : null,
      session: {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        provider: payload.provider,
        expiresAt: payload.exp * 1000,
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, error: err.message },
      { status: 500 }
    );
  }
}
