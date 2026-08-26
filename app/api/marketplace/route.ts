import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceRepo } from '@/lib/storage/documentStore';
import { MarketplaceItem } from '@/types/aurabots';

export async function GET(_req: NextRequest) {
  try {
    const items = MarketplaceRepo.getAll();
    return NextResponse.json({ success: true, marketplace: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const item: MarketplaceItem = await req.json();

    if (!item || !item.name || !item.priceUsd) {
      return NextResponse.json({ success: false, error: 'Invalid marketplace item fields' }, { status: 400 });
    }

    if (!item.id) {
      item.id = `mkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }
    item.status = item.status || 'active';
    item.createdAt = item.createdAt || new Date().toISOString();

    const saved = MarketplaceRepo.upsert(item);
    return NextResponse.json({
      success: true,
      item: saved,
      message: 'Project published to live Marketplace catalog.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
