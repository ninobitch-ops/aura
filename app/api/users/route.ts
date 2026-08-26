import { NextRequest, NextResponse } from 'next/server';
import { UsersRepo } from '@/lib/storage/documentStore';
import { sanitizeUserForClient, verifyBalanceAccess } from '@/lib/security/accessControl';
import { extractTokenFromRequest } from '@/lib/auth/sessionGuard';
import { verifyJwt } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'ninobitch@gmail.com';

    const token = extractTokenFromRequest(req);
    let requesterEmail = email;
    let requesterRole = 'architect';

    if (token) {
      const { valid, payload } = verifyJwt(token);
      if (valid && payload) {
        requesterEmail = payload.email;
        requesterRole = payload.role;
      }
    }

    // Security check
    const check = verifyBalanceAccess(requesterEmail, email, requesterRole);
    if (!check.allowed) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
    }

    const user = UsersRepo.get(email);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUserForClient(user),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, deltaBalance, githubToken, githubUsername } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
    }

    if (deltaBalance !== undefined) {
      const updated = UsersRepo.updateBalance(email, deltaBalance);
      return NextResponse.json({
        success: true,
        user: updated ? sanitizeUserForClient(updated) : null,
      });
    }

    if (githubToken !== undefined) {
      const updated = UsersRepo.setGithubToken(email, githubToken, githubUsername);
      return NextResponse.json({
        success: true,
        user: updated ? sanitizeUserForClient(updated) : null,
        message: 'GitHub credentials updated in encrypted vault.',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid update operation' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
