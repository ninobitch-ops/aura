import { NextRequest, NextResponse } from 'next/server';
import { AgentsRepo } from '@/lib/storage/documentStore';
import { verifyAgentAccess } from '@/lib/security/accessControl';
import { extractTokenFromRequest } from '@/lib/auth/sessionGuard';
import { verifyJwt } from '@/lib/auth/jwt';
import { AutonomousAgent } from '@/types/aurabots';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('id');
    const ownerEmail = searchParams.get('owner');

    if (agentId) {
      const agent = AgentsRepo.get(agentId);
      if (!agent) {
        return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, agent });
    }

    if (ownerEmail) {
      const list = AgentsRepo.getByOwner(ownerEmail);
      return NextResponse.json({ success: true, agents: list });
    }

    const all = AgentsRepo.getAll();
    return NextResponse.json({ success: true, agents: all });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const agent: AutonomousAgent = await req.json();

    if (!agent || !agent.name || !agent.systemPrompt) {
      return NextResponse.json({ success: false, error: 'Missing required agent fields (name, systemPrompt)' }, { status: 400 });
    }

    const token = extractTokenFromRequest(req);
    let userEmail = agent.ownerEmail || 'ninobitch@gmail.com';
    let userRole = 'architect';

    if (token) {
      const { valid, payload } = verifyJwt(token);
      if (valid && payload) {
        userEmail = payload.email;
        userRole = payload.role;
      }
    }

    if (!agent.id) {
      agent.id = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }
    agent.ownerEmail = userEmail;
    agent.createdAt = agent.createdAt || Date.now();
    agent.invocationsCount = agent.invocationsCount || 0;

    const check = verifyAgentAccess(userEmail, userRole, agent, 'write');
    if (!check.allowed) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
    }

    const saved = AgentsRepo.upsert(agent);

    return NextResponse.json({
      success: true,
      agent: saved,
      message: 'Autonomous AI Agent persisted and registered to execution matrix.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Agent ID required' }, { status: 400 });
    }

    const agent = AgentsRepo.get(id);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    const token = extractTokenFromRequest(req);
    let userEmail = 'ninobitch@gmail.com';
    let userRole = 'architect';

    if (token) {
      const { valid, payload } = verifyJwt(token);
      if (valid && payload) {
        userEmail = payload.email;
        userRole = payload.role;
      }
    }

    const check = verifyAgentAccess(userEmail, userRole, agent, 'delete');
    if (!check.allowed) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
    }

    const deleted = AgentsRepo.delete(id);
    return NextResponse.json({ success: deleted, message: 'Agent deleted from database.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
