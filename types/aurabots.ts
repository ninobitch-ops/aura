export type PlatformType = 'web' | 'mobile' | 'hybrid';

export type FrameworkType = 'react-web' | 'react-native' | 'hybrid-expo' | 'nextjs' | 'vue-pwa';

export type ThemePreset = 'electric-cyan' | 'neon-purple' | 'titanium-stealth' | 'cobalt-blue' | 'emerald-matrix' | 'sunset-amber';

export type PageViewType = 'welcome' | 'auth' | 'workspace' | 'media-studio' | 'preview' | 'publish';

export type DashboardSectionType = 'none' | 'projects' | 'recent-chats' | 'deposit' | 'update' | 'sell' | 'buy' | 'connector';

export type VoicePersona = 'gemini-cyber' | 'aura-pulse' | 'atlas' | 'nova' | 'caly-classic';

export interface VirtualFile {
  name: string;
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'html' | 'css' | 'json' | 'markdown';
  size?: number;
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  platform: PlatformType;
  framework: FrameworkType;
  theme: ThemePreset;
  version: string;
  files: Record<string, string>; // path -> content
  activeFilePath: string;
  createdAt: number;
  updatedAt: number;
  starred?: boolean;
  category: string;
  tags: string[];
  author: string;
  previewHtml?: string;
  iconDataUrl?: string;
  introVideo?: {
    scene: string;
    duration: number;
    soundtrack: string;
    hasVoiceover: boolean;
    title: string;
    renderedAt?: number;
  };
  customDomain?: string;
  subdomain?: string;
  githubRepo?: string;
  stats?: {
    componentsCount: number;
    linesOfCode: number;
    astNodes: number;
    bundleSizeBytes: number;
    compilationTimeMs: number;
  };
}

export interface CompilerNode3D {
  id: string;
  name: string;
  type: 'root' | 'component' | 'state' | 'hook' | 'api' | 'style' | 'asset';
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  radius: number;
  color: string;
  connections: string[];
  complexity: number;
  lines: number;
  details: string;
}

export interface CompilationStage {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  message: string;
  durationMs: number;
  details?: string[];
}

export interface CompilationResult {
  success: boolean;
  stages: CompilationStage[];
  logs: string[];
  errors: string[];
  warnings: string[];
  compiledHtml: string;
  nodes3D: CompilerNode3D[];
  metrics: {
    totalFiles: number;
    linesOfCode: number;
    astNodesCount: number;
    bundleSizeBytes: number;
    compilationDurationMs: number;
  };
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  author: string;
  authorAvatar?: string;
  category: 'Fintech' | 'Productivity' | 'E-Commerce' | 'Social' | 'Health & Fitness' | 'IoT & Smart Home' | 'AI & Media' | 'Gaming & Fun';
  platform: PlatformType;
  priceUsd: number;
  downloads: number;
  stars: number;
  userStarred?: boolean;
  tags: string[];
  project: AppProject;
  createdAt: string;
  verifiedBadge?: boolean;
  status?: 'active' | 'sold' | 'unlisted';
}

export interface RecentPromptSession {
  id: string;
  prompt: string;
  timestamp: number;
  projectName: string;
  platform: PlatformType;
  theme: ThemePreset;
}

export interface FinancialBalance {
  currentBalanceUsd: number;
  pendingPayoutsUsd: number;
  totalEarnedUsd: number;
  transactions: {
    id: string;
    type: 'earning' | 'withdrawal';
    method: 'Marketplace Sale' | 'PayPal Payouts' | 'SWIFT/SEPA Wire';
    amountUsd: number;
    status: 'completed' | 'processing' | 'pending';
    timestamp: string;
    reference: string;
  }[];
}

export interface SystemHealthAlert {
  id: string;
  platform: 'Apple App Store' | 'Google Play Store' | 'Web Standard';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  deadline: string;
  codePatchPrompt: string;
  isPatched: boolean;
}

export interface ExternalConnector {
  id: string;
  name: string;
  url: string;
  type: 'AI Engine' | 'REST API' | 'WebSocket' | 'Database' | 'Custom Webhook';
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  pingMs: number;
  lastSync: string;
}

export interface VoiceState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  lastCommand?: string;
  speaking: boolean;
  voicePersona: VoicePersona;
  isGoogleAuthorized: boolean;
  hotwordEnabled: boolean;
}

// -------------------------------------------------------------
// BACKEND & INFRASTRUCTURE SCHEMAS
// -------------------------------------------------------------

export type UserRole = 'admin' | 'architect' | 'developer' | 'buyer' | 'seller';

export type AuthProviderType = 'email' | 'google' | 'apple' | 'github' | 'microsoft' | 'facebook';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  authProvider: AuthProviderType;
  depositBalanceUsd: number;
  pendingBalanceUsd: number;
  totalEarnedUsd: number;
  githubAccessToken?: string;
  githubUsername?: string;
  securityTier: 'SOC2-Standard' | 'Enterprise-AirGapped' | 'Developer-Tier';
  createdAt: number;
  lastLoginAt: number;
}

export interface AutonomousAgent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Full-Stack Synthesizer' | 'UI/UX Visual Architect' | 'Security & Compliance' | 'Database Engineer' | 'DevOps & CI/CD';
  systemPrompt: string;
  tools: string[];
  model: string;
  voicePersona: VoicePersona;
  status: 'active' | 'training' | 'idle';
  ownerEmail: string;
  invocationsCount: number;
  createdAt: number;
}

export interface ChatHistoryEntry {
  id: string;
  userEmail: string;
  sessionId: string;
  prompt: string;
  responseSummary?: string;
  platform: PlatformType;
  theme: ThemePreset;
  timestamp: number;
  expiresAt: number; // Rolling 24-hour TTL
}

export interface StorageAssetRecord {
  id: string;
  name: string;
  type: 'vector-svg' | 'image' | 'video-mp4' | 'zip-package' | 'binary';
  mimeType: string;
  sizeBytes: number;
  dataUrl: string;
  ownerEmail: string;
  createdAt: number;
  metadata?: Record<string, any>;
}

export interface MarketplaceEscrowTransaction {
  id: string;
  itemId: string;
  itemName: string;
  sellerEmail: string;
  buyerEmail: string;
  amountUsd: number;
  status: 'escrow_held' | 'verified' | 'released' | 'failed' | 'refunded';
  createdAt: number;
  completedAt?: number;
  reference: string;
}

export interface GithubPushResult {
  success: boolean;
  repoUrl?: string;
  commitSha?: string;
  branch: string;
  filesCount: number;
  logs: string[];
  error?: string;
}

export interface AuthSessionState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number;
  isAuthenticated: boolean;
}

