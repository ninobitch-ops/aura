import { 
  AppProject, MarketplaceItem, RecentPromptSession, 
  FinancialBalance, SystemHealthAlert, ExternalConnector 
} from '@/types/aurabots';

const DB_NAME = 'AuraBots_DB_v2';
const DB_VERSION = 2;
const STORE_PROJECTS = 'projects';
const STORE_MARKETPLACE = 'marketplace';
const STORE_RECENT_CHATS = 'recent_chats';
const STORE_FINANCE = 'finance';
const STORE_CONNECTORS = 'connectors';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in current environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_MARKETPLACE)) {
        db.createObjectStore(STORE_MARKETPLACE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_RECENT_CHATS)) {
        db.createObjectStore(STORE_RECENT_CHATS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_FINANCE)) {
        db.createObjectStore(STORE_FINANCE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CONNECTORS)) {
        db.createObjectStore(STORE_CONNECTORS, { keyPath: 'id' });
      }
    };
  });
}

// 1. Projects
export async function saveProjectToDB(project: AppProject): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS], 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.put(project);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`aurabots_proj_${project.id}`, JSON.stringify(project));
      } catch (e) {
        console.warn('LocalStorage fallback warning:', e);
      }
    }
  }
}

export async function getAllProjectsFromDB(): Promise<AppProject[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS], 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      const results: AppProject[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('aurabots_proj_')) {
          try {
            const raw = localStorage.getItem(k);
            if (raw) results.push(JSON.parse(raw));
          } catch {}
        }
      }
      return results;
    }
    return [];
  }
}

export async function deleteProjectFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS], 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`aurabots_proj_${id}`);
    }
  }
}

// 2. Marketplace Items
export async function saveMarketplaceItemToDB(item: MarketplaceItem): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_MARKETPLACE], 'readwrite');
      const store = tx.objectStore(STORE_MARKETPLACE);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`aurabots_mkt_${item.id}`, JSON.stringify(item));
    }
  }
}

export async function getAllMarketplaceFromDB(): Promise<MarketplaceItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_MARKETPLACE], 'readonly');
      const store = tx.objectStore(STORE_MARKETPLACE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

// 3. Recent Chat Sessions (Within last 24h)
export async function saveRecentChatToDB(session: RecentPromptSession): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_RECENT_CHATS], 'readwrite');
      const store = tx.objectStore(STORE_RECENT_CHATS);
      const req = store.put(session);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`aurabots_chat_${session.id}`, JSON.stringify(session));
    }
  }
}

export async function getRecentChatsFromDB(): Promise<RecentPromptSession[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_RECENT_CHATS], 'readonly');
      const store = tx.objectStore(STORE_RECENT_CHATS);
      const req = store.getAll();
      req.onsuccess = () => {
        const items: RecentPromptSession[] = req.result || [];
        // Filter within last 24 hours
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        resolve(items.filter(i => i.timestamp >= oneDayAgo).sort((a, b) => b.timestamp - a.timestamp));
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

// 4. Initial Connectors & Financial State
export const INITIAL_CONNECTORS: ExternalConnector[] = [
  {
    id: 'conn_gemini',
    name: 'Gemini Live Multimodal Socket',
    url: 'https://generativelanguage.googleapis.com/v1beta/live',
    type: 'AI Engine',
    status: 'connected',
    pingMs: 24,
    lastSync: 'Live (Synchronized)',
  },
  {
    id: 'conn_stripe',
    name: 'Stripe Instant Checkout Webhook',
    url: 'https://api.stripe.com/v1/checkout/sessions',
    type: 'REST API',
    status: 'connected',
    pingMs: 48,
    lastSync: '2 mins ago',
  },
  {
    id: 'conn_supabase',
    name: 'Supabase Realtime PostgreSQL Cloud',
    url: 'wss://yrqtmwuvg.supabase.co/realtime/v1',
    type: 'WebSocket',
    status: 'connected',
    pingMs: 32,
    lastSync: 'Live (Stream)',
  },
  {
    id: 'conn_custom_ai',
    name: 'Custom Webhook Pipeline',
    url: 'https://api.aurabots.network/v1/event-relay',
    type: 'Custom Webhook',
    status: 'connected',
    pingMs: 19,
    lastSync: 'Just now',
  }
];

export const INITIAL_FINANCIAL_BALANCE: FinancialBalance = {
  currentBalanceUsd: 4850.00,
  pendingPayoutsUsd: 620.00,
  totalEarnedUsd: 18450.00,
  transactions: [
    {
      id: 'tx_9841',
      type: 'earning',
      method: 'Marketplace Sale',
      amountUsd: 149.00,
      status: 'completed',
      timestamp: '2026-08-26 09:15',
      reference: 'Purchased: AetherVault DeFi #8821',
    },
    {
      id: 'tx_9840',
      type: 'earning',
      method: 'Marketplace Sale',
      amountUsd: 299.00,
      status: 'completed',
      timestamp: '2026-08-25 18:40',
      reference: 'Purchased: PulseFit Pro Suite',
    },
    {
      id: 'tx_9839',
      type: 'withdrawal',
      method: 'PayPal Payouts',
      amountUsd: 1200.00,
      status: 'completed',
      timestamp: '2026-08-24 14:00',
      reference: 'PayPal ID: P-883921049 - ninobitch@gmail.com',
    },
    {
      id: 'tx_9838',
      type: 'withdrawal',
      method: 'SWIFT/SEPA Wire',
      amountUsd: 2500.00,
      status: 'completed',
      timestamp: '2026-08-21 11:20',
      reference: 'IBAN: GB29BARC20201598372019 - Direct Wire',
    }
  ]
};

export const INITIAL_HEALTH_ALERTS: SystemHealthAlert[] = [
  {
    id: 'alert_apple_sdk18',
    platform: 'Apple App Store',
    severity: 'warning',
    title: 'iOS 18.2 SDK & Privacy Manifest Requirement',
    description: 'Apple App Store requires PrivacyInfo.xcprivacy with API category declarations before Q4 deployment.',
    deadline: '2026-11-01',
    codePatchPrompt: 'Inject Apple PrivacyInfo.xcprivacy declaration and biometric privacy keys to app.json configuration.',
    isPatched: false,
  },
  {
    id: 'alert_google_api35',
    platform: 'Google Play Store',
    severity: 'critical',
    title: 'Target API 35 (Android 15) Edge-to-Edge Compliance',
    description: 'Google Play now enforces targetSdkVersion 35 and default edge-to-edge window insets.',
    deadline: '2026-10-15',
    codePatchPrompt: 'Update Android compileSdkVersion & targetSdkVersion to 35 with react-native-safe-area-context edge-to-edge insets.',
    isPatched: false,
  },
  {
    id: 'alert_pwa_install',
    platform: 'Web Standard',
    severity: 'info',
    title: 'PWA Web App Manifest Icons & Id',
    description: 'Ensure id property and 512x512 maskable icons are registered for automatic Chrome 128+ WebAPK generation.',
    deadline: 'Continuous',
    codePatchPrompt: 'Generate high-res 512x512 maskable icon and update manifest.json id attribute.',
    isPatched: true,
  }
];
