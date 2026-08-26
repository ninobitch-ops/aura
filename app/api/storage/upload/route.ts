import { NextRequest, NextResponse } from 'next/server';
import { StorageRepo } from '@/lib/storage/documentStore';
import { StorageAssetRecord } from '@/types/aurabots';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, mimeType, dataUrl, ownerEmail, metadata } = body;

    if (!name || !dataUrl) {
      return NextResponse.json({ success: false, error: 'Name and dataUrl are required' }, { status: 400 });
    }

    const sizeBytes = Math.round((dataUrl.length * 3) / 4);
    const id = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const assetRecord: StorageAssetRecord = {
      id,
      name,
      type: type || 'image',
      mimeType: mimeType || 'image/png',
      sizeBytes,
      dataUrl,
      ownerEmail: ownerEmail || 'ninobitch@gmail.com',
      createdAt: Date.now(),
      metadata,
    };

    const saved = StorageRepo.save(assetRecord);

    return NextResponse.json({
      success: true,
      asset: saved,
      url: `/api/storage/assets?id=${saved.id}`,
      message: `Asset '${name}' successfully stored in Cloud Asset Pipeline.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
