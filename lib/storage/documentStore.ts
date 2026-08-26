import { 
  UserProfile, AppProject, AutonomousAgent, 
  MarketplaceItem, ChatHistoryEntry, StorageAssetRecord, 
  MarketplaceEscrowTransaction 
} from '@/types/aurabots';
import { STARTER_PROJECTS, INITIAL_MARKETPLACE } from './presetProjects';
import { INITIAL_FINANCIAL_BALANCE } from './indexedDbStorage';

// In-Memory Global Store (Single source of truth across server lifecycle with persistence sync)
interface GlobalDocumentStore {
  users: Map<string, UserProfile>;
  projects: Map<string, AppProject>;
  agents: Map<string, AutonomousAgent>;
  marketplace: Map<string, MarketplaceItem>;
  chats: Map<string, ChatHistoryEntry>;
  assets: Map<string, StorageAssetRecord>;
  escrow: Map<string, MarketplaceEscrowTransaction>;
  initialized: boolean;
}

// Preserve across Next.js dev reloads
const globalForStore = global as unknown as { __aurabots_doc_store?: GlobalDocumentStore };

export const store: GlobalDocumentStore = globalForStore.__aurabots_doc_store || {
  users: new Map(),
  projects: new Map(),
  agents: new Map(),
  marketplace: new Map(),
  chats: new Map(),
  assets: new Map(),
  escrow: new Map(),
  initialized: false,
};

if (process.env.NODE_ENV !== 'production') {
  globalForStore.__aurabots_doc_store = store;
}

// Initial Seed autonomous agents
const SEED_AGENTS: AutonomousAgent[] = [
  {
    id: 'agent_synth_titanium',
    name: 'Titanium-3.7 Synthesizer Core',
    tagline: 'Autonomous Full-Stack React & Native Compiler',
    description: 'Deconstructs natural language requirements into AST node graphs, CSS variable tokens, and production binaries.',
    category: 'Full-Stack Synthesizer',
    systemPrompt: 'You are the Titanium-3.7 Autonomous Synthesizer. Produce reactive React TypeScript components with strict Tailwind styling.',
    tools: ['AST_Generator', 'Tailwind_Optimizer', 'WebSpeech_Audio', 'Canvas3D_Shader'],
    model: 'gemini-3.7-flash',
    voicePersona: 'gemini-cyber',
    status: 'active',
    ownerEmail: 'ninobitch@gmail.com',
    invocationsCount: 1420,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'agent_ux_architect',
    name: 'NeoGlass 3D Visualizer Agent',
    tagline: 'Glassmorphic 3D Geometry & Logo Generator',
    description: 'Renders 3D procedural geometries, glassmorphic app icon vectors, and high-fidelity video teaser timelines.',
    category: 'UI/UX Visual Architect',
    systemPrompt: 'Generate procedural canvas shaders, 3D geometric matrix visuals, and animated timeline sequences.',
    tools: ['Canvas_Renderer', 'Video_Teaser_Engine', 'Icon_Shader_Matrix'],
    model: 'gemini-3.7-flash',
    voicePersona: 'nova',
    status: 'active',
    ownerEmail: 'ninobitch@gmail.com',
    invocationsCount: 890,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'agent_compliance_guard',
    name: 'Aegis App Store Compliance Sentinel',
    tagline: 'iOS 18.2 & Android API 35 Auto-Patcher',
    description: 'Audits dependency security, injects Apple PrivacyInfo manifests, and formats Android 15 edge-to-edge window insets.',
    category: 'Security & Compliance',
    systemPrompt: 'Inspect application manifests and code structures for store compliance violations and generate deterministic patches.',
    tools: ['Store_Policy_Auditor', 'Privacy_Manifest_Generator', 'Vulnerability_Scanner'],
    model: 'gemini-3.7-flash',
    voicePersona: 'atlas',
    status: 'active',
    ownerEmail: 'ninobitch@gmail.com',
    invocationsCount: 640,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  }
];

// Initialize default data if not already done
export function initStoreIfNeeded() {
  if (store.initialized) return;

  // 1. Seed User
  const defaultUser: UserProfile = {
    id: 'usr_main_master',
    email: 'ninobitch@gmail.com',
    name: 'Nino Bitch (Lead Architect)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face',
    role: 'architect',
    authProvider: 'google',
    depositBalanceUsd: INITIAL_FINANCIAL_BALANCE.currentBalanceUsd,
    pendingBalanceUsd: INITIAL_FINANCIAL_BALANCE.pendingPayoutsUsd,
    totalEarnedUsd: INITIAL_FINANCIAL_BALANCE.totalEarnedUsd,
    githubAccessToken: process.env.GITHUB_ACCESS_TOKEN || 'gho_enterprise_quantum_token_77a942',
    githubUsername: 'ninobitch-dev',
    securityTier: 'Enterprise-AirGapped',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    lastLoginAt: Date.now(),
  };
  store.users.set(defaultUser.email.toLowerCase(), defaultUser);

  // 2. Seed Projects
  for (const proj of STARTER_PROJECTS) {
    store.projects.set(proj.id, {
      ...proj,
      author: defaultUser.name,
      createdAt: proj.createdAt || Date.now(),
      updatedAt: proj.updatedAt || Date.now(),
    });
  }

  // 3. Seed Agents
  for (const ag of SEED_AGENTS) {
    store.agents.set(ag.id, ag);
  }

  // 4. Seed Marketplace
  for (const item of INITIAL_MARKETPLACE) {
    store.marketplace.set(item.id, item);
  }

  // 5. Seed Rolling 24h Chats
  const now = Date.now();
  const seedChats: ChatHistoryEntry[] = [
    {
      id: 'chat_seed_1',
      userEmail: 'ninobitch@gmail.com',
      sessionId: 'sess_1',
      prompt: 'Synthesize a high-frequency algorithmic crypto terminal with live order book and candlestick charts',
      responseSummary: 'Compiled AetherVault DeFi with WebSockets and real-time reactive charting.',
      platform: 'hybrid',
      theme: 'electric-cyan',
      timestamp: now - 2 * 60 * 60 * 1000,
      expiresAt: now + 22 * 60 * 60 * 1000,
    },
    {
      id: 'chat_seed_2',
      userEmail: 'ninobitch@gmail.com',
      sessionId: 'sess_2',
      prompt: 'Create an intelligent AI fitness coach with biometric calorie tracking and rep counter',
      responseSummary: 'Synthesized PulseFit Pro Suite with audio pacing and offline health kit storage.',
      platform: 'mobile',
      theme: 'neon-purple',
      timestamp: now - 5 * 60 * 60 * 1000,
      expiresAt: now + 19 * 60 * 60 * 1000,
    }
  ];

  for (const c of seedChats) {
    store.chats.set(c.id, c);
  }

  store.initialized = true;
}

// -------------------------------------------------------------
// 1. USERS COLLECTION REPOSITORY
// -------------------------------------------------------------
export const UsersRepo = {
  get(email: string): UserProfile | undefined {
    initStoreIfNeeded();
    return store.users.get(email.toLowerCase());
  },
  getById(id: string): UserProfile | undefined {
    initStoreIfNeeded();
    for (const u of store.users.values()) {
      if (u.id === id) return u;
    }
    return undefined;
  },
  upsert(user: UserProfile): UserProfile {
    initStoreIfNeeded();
    store.users.set(user.email.toLowerCase(), { ...user, lastLoginAt: Date.now() });
    return store.users.get(user.email.toLowerCase())!;
  },
  updateBalance(email: string, deltaAmount: number): UserProfile | undefined {
    initStoreIfNeeded();
    const user = store.users.get(email.toLowerCase());
    if (!user) return undefined;
    user.depositBalanceUsd = Math.max(0, user.depositBalanceUsd + deltaAmount);
    if (deltaAmount > 0) {
      user.totalEarnedUsd += deltaAmount;
    }
    store.users.set(email.toLowerCase(), user);
    return user;
  },
  setGithubToken(email: string, token: string, username?: string): UserProfile | undefined {
    initStoreIfNeeded();
    const user = store.users.get(email.toLowerCase());
    if (!user) return undefined;
    user.githubAccessToken = token;
    if (username) user.githubUsername = username;
    store.users.set(email.toLowerCase(), user);
    return user;
  },
  getAll(): UserProfile[] {
    initStoreIfNeeded();
    return Array.from(store.users.values());
  }
};

// -------------------------------------------------------------
// 2. PROJECTS COLLECTION REPOSITORY
// -------------------------------------------------------------
export const ProjectsRepo = {
  get(id: string): AppProject | undefined {
    initStoreIfNeeded();
    return store.projects.get(id);
  },
  getAll(): AppProject[] {
    initStoreIfNeeded();
    return Array.from(store.projects.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  },
  getByAuthor(authorEmail: string): AppProject[] {
    initStoreIfNeeded();
    return Array.from(store.projects.values())
      .filter(p => (p as any).authorEmail?.toLowerCase() === authorEmail.toLowerCase() || p.author.toLowerCase().includes(authorEmail.split('@')[0].toLowerCase()))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
  upsert(project: AppProject): AppProject {
    initStoreIfNeeded();
    const existing = store.projects.get(project.id);
    const updated: AppProject = {
      ...project,
      updatedAt: Date.now(),
      createdAt: existing?.createdAt || project.createdAt || Date.now(),
    };
    store.projects.set(project.id, updated);
    return updated;
  },
  delete(id: string): boolean {
    initStoreIfNeeded();
    return store.projects.delete(id);
  }
};

// -------------------------------------------------------------
// 3. AGENTS COLLECTION REPOSITORY
// -------------------------------------------------------------
export const AgentsRepo = {
  get(id: string): AutonomousAgent | undefined {
    initStoreIfNeeded();
    return store.agents.get(id);
  },
  getAll(): AutonomousAgent[] {
    initStoreIfNeeded();
    return Array.from(store.agents.values()).sort((a, b) => b.invocationsCount - a.invocationsCount);
  },
  getByOwner(ownerEmail: string): AutonomousAgent[] {
    initStoreIfNeeded();
    return Array.from(store.agents.values())
      .filter(a => a.ownerEmail.toLowerCase() === ownerEmail.toLowerCase());
  },
  upsert(agent: AutonomousAgent): AutonomousAgent {
    initStoreIfNeeded();
    store.agents.set(agent.id, agent);
    return agent;
  },
  delete(id: string): boolean {
    initStoreIfNeeded();
    return store.agents.delete(id);
  },
  incrementInvocations(id: string): void {
    initStoreIfNeeded();
    const ag = store.agents.get(id);
    if (ag) {
      ag.invocationsCount += 1;
      store.agents.set(id, ag);
    }
  }
};

// -------------------------------------------------------------
// 4. MARKETPLACE COLLECTION REPOSITORY
// -------------------------------------------------------------
export const MarketplaceRepo = {
  get(id: string): MarketplaceItem | undefined {
    initStoreIfNeeded();
    return store.marketplace.get(id);
  },
  getAll(): MarketplaceItem[] {
    initStoreIfNeeded();
    return Array.from(store.marketplace.values())
      .filter(m => m.status !== 'sold' && m.status !== 'unlisted')
      .sort((a, b) => b.downloads - a.downloads);
  },
  getAllRaw(): MarketplaceItem[] {
    initStoreIfNeeded();
    return Array.from(store.marketplace.values());
  },
  upsert(item: MarketplaceItem): MarketplaceItem {
    initStoreIfNeeded();
    store.marketplace.set(item.id, item);
    return item;
  },
  delete(id: string): boolean {
    initStoreIfNeeded();
    return store.marketplace.delete(id);
  },
  // Auto-purging cleanup rule upon successful purchase/escrow
  purgeListingOnSale(id: string): boolean {
    initStoreIfNeeded();
    const item = store.marketplace.get(id);
    if (item) {
      item.status = 'sold';
      store.marketplace.delete(id); // Immediately remove from public marketplace grid
      return true;
    }
    return false;
  }
};

// -------------------------------------------------------------
// 5. CHATS COLLECTION REPOSITORY (Rolling 24-Hour TTL Scoped)
// -------------------------------------------------------------
export const ChatsRepo = {
  add(entry: Omit<ChatHistoryEntry, 'id' | 'timestamp' | 'expiresAt'>): ChatHistoryEntry {
    initStoreIfNeeded();
    const now = Date.now();
    const id = `chat_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const fullEntry: ChatHistoryEntry = {
      ...entry,
      id,
      timestamp: now,
      expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours rolling expiration
    };
    store.chats.set(id, fullEntry);
    this.pruneExpired();
    return fullEntry;
  },
  getByUser(userEmail: string): ChatHistoryEntry[] {
    initStoreIfNeeded();
    this.pruneExpired();
    return Array.from(store.chats.values())
      .filter(c => c.userEmail.toLowerCase() === userEmail.toLowerCase())
      .sort((a, b) => b.timestamp - a.timestamp);
  },
  pruneExpired(): number {
    const now = Date.now();
    let count = 0;
    for (const [id, entry] of store.chats.entries()) {
      if (entry.expiresAt < now) {
        store.chats.delete(id);
        count++;
      }
    }
    return count;
  },
  clearUser(userEmail: string): void {
    initStoreIfNeeded();
    for (const [id, entry] of store.chats.entries()) {
      if (entry.userEmail.toLowerCase() === userEmail.toLowerCase()) {
        store.chats.delete(id);
      }
    }
  }
};

// -------------------------------------------------------------
// 6. ASSET & BINARY STORAGE REPOSITORY
// -------------------------------------------------------------
export const StorageRepo = {
  save(asset: StorageAssetRecord): StorageAssetRecord {
    initStoreIfNeeded();
    store.assets.set(asset.id, asset);
    return asset;
  },
  get(id: string): StorageAssetRecord | undefined {
    initStoreIfNeeded();
    return store.assets.get(id);
  },
  getByOwner(ownerEmail: string): StorageAssetRecord[] {
    initStoreIfNeeded();
    return Array.from(store.assets.values())
      .filter(a => a.ownerEmail.toLowerCase() === ownerEmail.toLowerCase())
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  delete(id: string): boolean {
    initStoreIfNeeded();
    return store.assets.delete(id);
  }
};

// -------------------------------------------------------------
// 7. MARKETPLACE ESCROW REPOSITORY
// -------------------------------------------------------------
export const EscrowRepo = {
  create(tx: MarketplaceEscrowTransaction): MarketplaceEscrowTransaction {
    initStoreIfNeeded();
    store.escrow.set(tx.id, tx);
    return tx;
  },
  get(id: string): MarketplaceEscrowTransaction | undefined {
    initStoreIfNeeded();
    return store.escrow.get(id);
  },
  getAll(): MarketplaceEscrowTransaction[] {
    initStoreIfNeeded();
    return Array.from(store.escrow.values()).sort((a, b) => b.createdAt - a.createdAt);
  },
  updateStatus(id: string, status: MarketplaceEscrowTransaction['status']): MarketplaceEscrowTransaction | undefined {
    initStoreIfNeeded();
    const tx = store.escrow.get(id);
    if (tx) {
      tx.status = status;
      if (status === 'released') {
        tx.completedAt = Date.now();
      }
      store.escrow.set(id, tx);
      return tx;
    }
    return undefined;
  }
};
