import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signJwt, signRefreshToken } from '@/lib/auth/jwt';
import { UsersRepo } from '@/lib/storage/documentStore';
import { sanitizeUserForClient } from '@/lib/security/accessControl';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Missing refresh token' },
        { status: 400 }
      );
    }

    const { valid, payload, error } = verifyRefreshToken(refreshToken);

    if (!valid || !payload) {
      return NextResponse.json(
        { success: false, error: error || 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    const user = UsersRepo.get(payload.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account no longer exists' },
        { status: 401 }
      );
    }

    // Issue refreshed token pair (Token Rotation)
    const newAccessToken = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.authProvider,
    }, 3600);

    const newRefreshToken = signRefreshToken(user.id, user.email);

    const response = NextResponse.json({
      success: true,
      user: sanitizeUserForClient(user),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
    });

    response.cookies.set('aurabots_access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Token refresh failed' },
      { status: 500 }
    );
  }
}
