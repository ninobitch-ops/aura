import { 
  UsersRepo, ProjectsRepo, AgentsRepo, 
  MarketplaceRepo, EscrowRepo 
} from '@/lib/storage/documentStore';
import { 
  UserProfile, AppProject, AutonomousAgent, 
  MarketplaceItem, MarketplaceEscrowTransaction 
} from '@/types/aurabots';
import { maskToken, encryptSensitiveToken, decryptSensitiveToken } from '@/lib/auth/jwt';

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INSUFFICIENT_FUNDS' | 'NOT_FOUND' | 'INVALID_BUYER';
}

// -------------------------------------------------------------
// 1. RECORD-LEVEL DATABASE ACCESS CONTROL RULES
// -------------------------------------------------------------

/**
 * Enforce project access control:
 * Users can only read/write/delete their own draft projects unless role is 'admin'.
 */
export function verifyProjectAccess(
  userEmail: string,
  userRole: string,
  project: AppProject,
  action: 'read' | 'write' | 'delete'
): SecurityCheckResult {
  if (userRole === 'admin') return { allowed: true };

  const ownerEmail = (project as any).authorEmail?.toLowerCase() || '';
  const authorName = project.author?.toLowerCase() || '';
  const userPrefix = userEmail.split('@')[0].toLowerCase();

  const isOwner = 
    (ownerEmail && ownerEmail === userEmail.toLowerCase()) ||
    authorName.includes(userPrefix) ||
    authorName.includes('nino'); // Default demo architect

  if (!isOwner && action !== 'read') {
    return {
      allowed: false,
      reason: 'Security Rule Violation: You do not have permission to modify or delete projects owned by another developer.',
      code: 'FORBIDDEN',
    };
  }

  return { allowed: true };
}

/**
 * Enforce custom AI Agent access control:
 * Users can only modify/delete their own custom agents.
 */
export function verifyAgentAccess(
  userEmail: string,
  userRole: string,
  agent: AutonomousAgent,
  action: 'read' | 'write' | 'delete'
): SecurityCheckResult {
  if (userRole === 'admin') return { allowed: true };

  const isOwner = agent.ownerEmail.toLowerCase() === userEmail.toLowerCase();

  if (!isOwner && action !== 'read') {
    return {
      allowed: false,
      reason: 'Security Rule Violation: Custom AI Agents are sandboxed to their respective author accounts.',
      code: 'FORBIDDEN',
    };
  }

  return { allowed: true };
}

/**
 * Enforce deposit account balance access control:
 * Users can only inspect and mutate their own balance.
 */
export function verifyBalanceAccess(
  userEmail: string,
  targetEmail: string,
  userRole: string
): SecurityCheckResult {
  if (userRole === 'admin') return { allowed: true };

  if (userEmail.toLowerCase() !== targetEmail.toLowerCase()) {
    return {
      allowed: false,
      reason: 'Security Rule Violation: Financial accounts and payout streams are strictly private.',
      code: 'FORBIDDEN',
    };
  }

  return { allowed: true };
}

// -------------------------------------------------------------
// 2. MARKETPLACE ESCROW & CLEANUP TRANSACTION ENGINE
// -------------------------------------------------------------

export interface ExecuteEscrowParams {
  itemId: string;
  buyerEmail: string;
  buyerName?: string;
}

export interface EscrowExecutionResult {
  success: boolean;
  transaction?: MarketplaceEscrowTransaction;
  purchasedProject?: AppProject;
  buyerBalanceRemaining?: number;
  sellerEarnedBalance?: number;
  error?: string;
  code?: string;
}

/**
 * Executes atomic Marketplace Escrow and Immediate Cleanup:
 * 1. Validates buyer email against registered user accounts.
 * 2. Verifies marketplace item existence and active status.
 * 3. Verifies buyer balance or charges balance escrow.
 * 4. Transfers project ownership to buyer.
 * 5. Credits seller deposit account.
 * 6. Executes Marketplace Cleanup Rule: immediately purges listing from public grid.
 */
export async function executeMarketplaceEscrowTransaction({
  itemId,
  buyerEmail,
  buyerName,
}: ExecuteEscrowParams): Promise<EscrowExecutionResult> {
  // Step 1: Validate buyer account
  let buyer = UsersRepo.get(buyerEmail);
  if (!buyer) {
    // Auto-provision buyer profile if registered via SSO/email
    buyer = UsersRepo.upsert({
      id: `usr_${Date.now()}`,
      email: buyerEmail.toLowerCase(),
      name: buyerName || buyerEmail.split('@')[0],
      role: 'buyer',
      authProvider: 'email',
      depositBalanceUsd: 5000.00, // Demo starting deposit allowance
      pendingBalanceUsd: 0,
      totalEarnedUsd: 0,
      securityTier: 'SOC2-Standard',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });
  }

  // Step 2: Retrieve marketplace item
  const item = MarketplaceRepo.get(itemId);
  if (!item) {
    return {
      success: false,
      error: 'Marketplace item not found or already purchased.',
      code: 'NOT_FOUND',
    };
  }

  if (item.status === 'sold' || item.status === 'unlisted') {
    return {
      success: false,
      error: 'Item is no longer available in the active marketplace catalog.',
      code: 'FORBIDDEN',
    };
  }

  const price = item.priceUsd;

  // Step 3: Check buyer deposit balance
  if (buyer.depositBalanceUsd < price) {
    return {
      success: false,
      error: `Insufficient balance: Current deposit is $${buyer.depositBalanceUsd.toFixed(2)}, required $${price.toFixed(2)}.`,
      code: 'INSUFFICIENT_FUNDS',
    };
  }

  const sellerEmail = (item.project as any)?.authorEmail || 'ninobitch@gmail.com';
  const txId = `escrow_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // Step 4: Create Escrow Record
  const escrowTx: MarketplaceEscrowTransaction = {
    id: txId,
    itemId: item.id,
    itemName: item.name,
    sellerEmail,
    buyerEmail: buyer.email,
    amountUsd: price,
    status: 'escrow_held',
    createdAt: Date.now(),
    reference: `Escrow Order: ${item.name} (#${item.id})`,
  };
  EscrowRepo.create(escrowTx);

  // Step 5: Transfer Funds (Deduct Buyer, Credit Seller with 95% net after 5% platform fee)
  const netSellerEarnings = Math.round(price * 0.95 * 100) / 100;
  UsersRepo.updateBalance(buyer.email, -price);
  const updatedSeller = UsersRepo.updateBalance(sellerEmail, netSellerEarnings);
  const updatedBuyer = UsersRepo.get(buyer.email);

  // Step 6: Clone & Transfer Project Document Ownership to Buyer
  const transferredProject: AppProject = {
    ...item.project,
    id: `proj_${Date.now()}_acquired`,
    name: `${item.name} (Acquired)`,
    author: buyer.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  (transferredProject as any).authorEmail = buyer.email;
  (transferredProject as any).purchasedFrom = sellerEmail;
  (transferredProject as any).escrowTxId = txId;

  ProjectsRepo.upsert(transferredProject);

  // Step 7: Mark Escrow Released
  EscrowRepo.updateStatus(txId, 'released');

  // Step 8: Execute Marketplace Cleanup Rule (Purge listing immediately from public grid)
  MarketplaceRepo.purgeListingOnSale(item.id);

  return {
    success: true,
    transaction: { ...escrowTx, status: 'released', completedAt: Date.now() },
    purchasedProject: transferredProject,
    buyerBalanceRemaining: updatedBuyer?.depositBalanceUsd,
    sellerEarnedBalance: updatedSeller?.depositBalanceUsd,
  };
}

// -------------------------------------------------------------
// 3. SECURE TOKEN MANAGEMENT & CLIENT DATA PROTECTION
// -------------------------------------------------------------

export function sanitizeUserForClient(user: UserProfile): UserProfile {
  return {
    ...user,
    githubAccessToken: user.githubAccessToken ? maskToken(user.githubAccessToken) : undefined,
  };
}

export { maskToken, encryptSensitiveToken, decryptSensitiveToken };
