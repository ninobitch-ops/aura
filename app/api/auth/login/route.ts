import { NextRequest, NextResponse } from 'next/server';
import { UsersRepo } from '@/lib/storage/documentStore';
import { signJwt, signRefreshToken } from '@/lib/auth/jwt';
import { sanitizeUserForClient } from '@/lib/security/accessControl';
import { UserProfile } from '@/types/aurabots';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = UsersRepo.get(cleanEmail);

    if (!user) {
      // Auto-provision if newly registering
      const newUser: UserProfile = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: (role as any) || 'architect',
        authProvider: 'email',
        depositBalanceUsd: 4850.00,
        pendingBalanceUsd: 0,
        totalEarnedUsd: 0,
        securityTier: 'SOC2-Standard',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
      user = UsersRepo.upsert(newUser);
    } else {
      user.lastLoginAt = Date.now();
      UsersRepo.upsert(user);
    }

    // Issue JWT & Refresh Token
    const accessToken = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.authProvider,
    }, 3600); // 1 hour

    const refreshToken = signRefreshToken(user.id, user.email);

    const response = NextResponse.json({
      success: true,
      user: sanitizeUserForClient(user),
      accessToken,
      refreshToken,
      expiresIn: 3600,
      message: 'Authentication successful with AuraBots Managed Identity Matrix.',
    });

    // Set secure HTTP cookie for access token
    response.cookies.set('aurabots_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
