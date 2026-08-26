import { NextRequest, NextResponse } from 'next/server';
import { ProjectsRepo } from '@/lib/storage/documentStore';
import { verifyProjectAccess } from '@/lib/security/accessControl';
import { extractTokenFromRequest } from '@/lib/auth/sessionGuard';
import { verifyJwt } from '@/lib/auth/jwt';
import { AppProject } from '@/types/aurabots';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');
    const authorEmail = searchParams.get('authorEmail');

    if (projectId) {
      const proj = ProjectsRepo.get(projectId);
      if (!proj) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, project: proj });
    }

    if (authorEmail) {
      const list = ProjectsRepo.getByAuthor(authorEmail);
      return NextResponse.json({ success: true, projects: list });
    }

    const all = ProjectsRepo.getAll();
    return NextResponse.json({ success: true, projects: all });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const project: AppProject = await req.json();

    if (!project || !project.id || !project.name) {
      return NextResponse.json({ success: false, error: 'Invalid project document payload' }, { status: 400 });
    }

    // Authenticate and check record access
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

    const check = verifyProjectAccess(userEmail, userRole, project, 'write');
    if (!check.allowed) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
    }

    const saved = ProjectsRepo.upsert(project);

    return NextResponse.json({
      success: true,
      project: saved,
      message: 'Project document persisted to structured storage.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }

    const project = ProjectsRepo.get(projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
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

    const check = verifyProjectAccess(userEmail, userRole, project, 'delete');
    if (!check.allowed) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
    }

    const deleted = ProjectsRepo.delete(projectId);
    return NextResponse.json({ success: deleted, message: 'Project removed from persistent storage.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
