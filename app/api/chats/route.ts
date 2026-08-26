import { NextRequest, NextResponse } from 'next/server';
import { ChatsRepo } from '@/lib/storage/documentStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email') || 'ninobitch@gmail.com';

    const chats = ChatsRepo.getByUser(userEmail);
    return NextResponse.json({
      success: true,
      chats,
      window: 'Rolling 24-Hour Scoped Session History',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, sessionId, prompt, responseSummary, platform, theme } = body;

    if (!userEmail || !prompt) {
      return NextResponse.json({ success: false, error: 'User email and prompt are required' }, { status: 400 });
    }

    const entry = ChatsRepo.add({
      userEmail,
      sessionId: sessionId || `sess_${Date.now()}`,
      prompt,
      responseSummary: responseSummary || 'Synthesized reactive component pipeline',
      platform: platform || 'hybrid',
      theme: theme || 'electric-cyan',
    });

    return NextResponse.json({
      success: true,
      chat: entry,
      message: 'Chat history logged (24-hour rolling TTL active).',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');

    if (userEmail) {
      ChatsRepo.clearUser(userEmail);
      return NextResponse.json({ success: true, message: 'User chat history cleared.' });
    }

    const prunedCount = ChatsRepo.pruneExpired();
    return NextResponse.json({ success: true, prunedCount, message: `Pruned ${prunedCount} expired 24h chats.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
