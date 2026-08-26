import { NextRequest, NextResponse } from 'next/server';
import { StorageRepo } from '@/lib/storage/documentStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const assetId = searchParams.get('id');
    const ownerEmail = searchParams.get('owner');

    if (assetId) {
      const asset = StorageRepo.get(assetId);
      if (!asset) {
        return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, asset });
    }

    if (ownerEmail) {
      const list = StorageRepo.getByOwner(ownerEmail);
      return NextResponse.json({ success: true, assets: list });
    }

    return NextResponse.json({ success: false, error: 'Asset ID or Owner Email required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
