import { NextRequest, NextResponse } from 'next/server';
import { executeMarketplaceEscrowTransaction } from '@/lib/security/accessControl';
import { EscrowRepo } from '@/lib/storage/documentStore';

export async function GET(_req: NextRequest) {
  try {
    const transactions = EscrowRepo.getAll();
    return NextResponse.json({ success: true, transactions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { itemId, buyerEmail, buyerName } = await req.json();

    if (!itemId || !buyerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: itemId and buyerEmail' },
        { status: 400 }
      );
    }

    const result = await executeMarketplaceEscrowTransaction({
      itemId,
      buyerEmail,
      buyerName,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, code: result.code },
        { status: result.code === 'INSUFFICIENT_FUNDS' ? 402 : result.code === 'NOT_FOUND' ? 404 : 403 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
      purchasedProject: result.purchasedProject,
      buyerBalanceRemaining: result.buyerBalanceRemaining,
      sellerEarnedBalance: result.sellerEarnedBalance,
      message: 'Escrow successfully released. Project ownership transferred and listing purged from marketplace grid.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
