'use client';

import React, { useState } from 'react';
import { 
  AppProject, DashboardSectionType, RecentPromptSession, 
  FinancialBalance, SystemHealthAlert, MarketplaceItem, ExternalConnector 
} from '@/types/aurabots';
import { 
  MessageSquarePlus, FolderKanban, History, 
  Wallet, RefreshCw, ShoppingCart, Tag, 
  Network, ChevronRight, X, Plus, Search, 
  CheckCircle, ArrowUpRight, DollarSign, AlertTriangle, 
  ShieldCheck, Smartphone, Globe, Layers, Zap, Trash2, Send,
  Database, Bot, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SidebarNavigationProps {
  currentSection: DashboardSectionType;
  onSelectSection: (section: DashboardSectionType) => void;
  onNewChat: () => void;
  projects: AppProject[];
  onSelectProject: (p: AppProject) => void;
  onDeleteProject?: (id: string) => void;
  currentProject: AppProject;
  recentChats: RecentPromptSession[];
  onSelectRecentChat: (chat: RecentPromptSession) => void;
  balance: FinancialBalance;
  onUpdateBalance: (updater: (prev: FinancialBalance) => FinancialBalance) => void;
  healthAlerts: SystemHealthAlert[];
  onPatchAlert: (id: string) => void;
  marketplaceItems: MarketplaceItem[];
  onBuyItem: (item: MarketplaceItem) => void;
  onListProjectForSale: (item: MarketplaceItem) => void;
  onOpenConnectorDrawer: () => void;
  onOpenDatabaseStudio?: () => void;
  onOpenAgentBuilder?: () => void;
  onOpenSecuritySettings?: () => void;
}

export function SidebarNavigation({
  currentSection,
  onSelectSection,
  onNewChat,
  projects,
  onSelectProject,
  onDeleteProject,
  currentProject,
  recentChats,
  onSelectRecentChat,
  balance,
  onUpdateBalance,
  healthAlerts,
  onPatchAlert,
  marketplaceItems,
  onBuyItem,
  onListProjectForSale,
  onOpenConnectorDrawer,
  onOpenDatabaseStudio,
  onOpenAgentBuilder,
  onOpenSecuritySettings,
}: SidebarNavigationProps) {
  // Withdraw State in Deposit Section
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [withdrawMethod, setWithdrawMethod] = useState<'paypal' | 'swift'>('paypal');
  const [withdrawAccount, setWithdrawAccount] = useState('ninobitch@gmail.com');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Sell Section Listing State
  const [sellProjectId, setSellProjectId] = useState<string>(projects[0]?.id || currentProject.id);
  const [sellPrice, setSellPrice] = useState<number>(149);
  const [buyerEmail, setBuyerEmail] = useState('verified.buyer@aurabots.network');
  const [sellSuccessMsg, setSellSuccessMsg] = useState<string | null>(null);

  // Buy Marketplace Search State
  const [buyQuery, setBuyQuery] = useState('');
  const [buyCategory, setBuyCategory] = useState('All');

  // Handle Withdraw
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > balance.currentBalanceUsd) return;

    onUpdateBalance(prev => ({
      ...prev,
      currentBalanceUsd: prev.currentBalanceUsd - amt,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          type: 'withdrawal',
          method: withdrawMethod === 'paypal' ? 'PayPal Payouts' : 'SWIFT/SEPA Wire',
          amountUsd: amt,
          status: 'completed',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reference: withdrawMethod === 'paypal' ? `PayPal: ${withdrawAccount}` : `IBAN: ${withdrawAccount}`,
        },
        ...prev.transactions,
      ]
    }));

    setWithdrawSuccessMsg(`Successfully processed $${amt} withdrawal via ${withdrawMethod.toUpperCase()}!`);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setWithdrawSuccessMsg(null), 3000);
  };

  // Handle Sell Listing
  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === sellProjectId) || currentProject;
    const newItem: MarketplaceItem = {
      id: `mkt_${Date.now()}`,
      name: proj.name,
      description: proj.description,
      author: 'Verified Creator',
      category: proj.category as any || 'Productivity',
      platform: proj.platform,
      priceUsd: sellPrice,
      downloads: 0,
      stars: 5.0,
      tags: proj.tags,
      project: proj,
      createdAt: new Date().toISOString().slice(0, 10),
      verifiedBadge: true,
      status: 'active',
    };
    onListProjectForSale(newItem);
    setSellSuccessMsg(`Listed "${proj.name}" for $${sellPrice} with verified buyer routing!`);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setSellSuccessMsg(null), 3000);
  };

  const filteredMarketplace = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(buyQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(buyQuery.toLowerCase());
    const matchesCat = buyCategory === 'All' || item.category === buyCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MAIN VERTICAL ICON / QUICK DASHBOARD SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="w-16 lg:w-60 bg-[#0B0F19]/90 backdrop-blur-xl border-r border-slate-800/90 flex flex-col flex-shrink-0 z-20">
        <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {/* New Chat Button */}
          <button
            id="btn-sidebar-new-chat"
            onClick={onNewChat}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-blue-600 to-[#A855F7] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center lg:justify-start lg:space-x-2.5 transition shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] cursor-pointer"
            title="New Chat / Reset Workspace"
          >
            <MessageSquarePlus className="w-4 h-4 flex-shrink-0 text-slate-950" />
            <span className="hidden lg:inline text-slate-950 font-black">New Chat</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            {/* Projects Workspace */}
            <button
              onClick={() => onSelectSection(currentSection === 'projects' ? 'none' : 'projects')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition ${
                currentSection === 'projects'
                  ? 'bg-cyan-500/20 text-[#00F0FF] font-bold border border-[#00F0FF33] shadow-[0_0_12px_rgba(0,240,255,0.35)]'
                  : 'text-slate-400 hover:bg-[#0F172A] hover:text-white'
              }`}
              title="Projects Workspace"
            >
              <FolderKanban className="w-4 h-4 flex-shrink-0 text-[#00F0FF]" />
              <span className="hidden lg:inline">Projects Workspace</span>
            </button>

            {/* Recent Chats Drawer */}
            <button
              onClick={() => onSelectSection(currentSection === 'recent-chats' ? 'none' : 'recent-chats')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition ${
                currentSection === 'recent-chats'
                  ? 'bg-cyan-500/20 text-[#00F0FF] font-bold border border-[#00F0FF33] shadow-[0_0_12px_rgba(0,240,255,0.35)]'
                  : 'text-slate-400 hover:bg-[#0F172A] hover:text-white'
              }`}
              title="Recent Chats (Last 24h)"
            >
              <History className="w-4 h-4 flex-shrink-0 text-[#00F0FF]" />
              <span className="hidden lg:inline">Recent Chats</span>
            </button>

            {/* Deposit Section */}
            <button
              onClick={() => onSelectSection(currentSection === 'deposit' ? 'none' : 'deposit')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition ${
                currentSection === 'deposit'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                  : 'text-slate-400 hover:bg-[#0F172A] hover:text-white'
              }`}
              title="Deposit & Financial Dashboard"
            >
              <Wallet className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span className="hidden lg:inline">Deposit & Balance</span>
            </button>

            {/* Update Section */}
            <button
              onClick={() => onSelectSection(currentSection === 'update' ? 'none' : 'update')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition ${
                currentSection === 'update'
                  ? 'bg-purple-500/20 text-[#A855F7] font-bold border border-[#A855F744] shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                  : 'text-slate-400 hover:bg-[#0F172A] hover:text-white'
              }`}
              title="Update & System Health"
            >
              <RefreshCw className="w-4 h-4 flex-shrink-0 text-[#A855F7]" />
              <span className="hidden lg:inline">Update & Health</span>
            </button>

            {/* Sell Section */}
            <button
              onClick={() => onSelectSection(currentSection === 'sell' ? 'none' : 'sell')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition ${
                currentSection === 'sell'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                  : 'text-slate-400 hover:bg-[#0F172A] hover:text-white'
              }`}
              title="Sell / P2P Marketplace"
            >
              <Tag className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span className="hidden lg:inline">Sell App (P2P)</span>
            </button>

            {/* Buy Section */}
            <button
              onClick={() => onSelectSection(currentSection === 'buy' ? 'none' : 'buy')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition ${
                currentSection === 'buy'
                  ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                  : 'text-slate-400 hover:bg-[#0F172A] hover:text-white'
              }`}
              title="Buy Apps"
            >
              <ShoppingCart className="w-4 h-4 flex-shrink-0 text-blue-400" />
              <span className="hidden lg:inline">Buy Apps</span>
            </button>

            {/* Database & API Studio */}
            {onOpenDatabaseStudio && (
              <button
                onClick={onOpenDatabaseStudio}
                className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                title="Database & API Studio"
              >
                <Database className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                <span className="hidden lg:inline">DB & API Studio</span>
              </button>
            )}

            {/* AI Agent Builder */}
            {onOpenAgentBuilder && (
              <button
                onClick={onOpenAgentBuilder}
                className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                title="AI Agent Builder"
              >
                <Bot className="w-4 h-4 flex-shrink-0 text-purple-400" />
                <span className="hidden lg:inline">AI Agent Builder</span>
              </button>
            )}

            {/* Security & API Settings */}
            {onOpenSecuritySettings && (
              <button
                onClick={onOpenSecuritySettings}
                className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-center lg:justify-start lg:space-x-2.5 transition text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                title="Security & API Settings"
              >
                <Lock className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span className="hidden lg:inline">Security & JWT</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom External Connector Drawer Trigger */}
        <div className="p-3 border-t border-slate-800/90">
          <button
            onClick={onOpenConnectorDrawer}
            className="w-full p-2.5 rounded-xl bg-[#0F172A]/90 hover:bg-[#151F38] border border-[#00F0FF33] text-[#00F0FF] text-xs font-bold flex items-center justify-center lg:justify-between transition shadow-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
            title="External Connector Matrix"
          >
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-[#00F0FF]" />
              <span className="hidden lg:inline text-white font-mono">Connector</span>
            </div>
            <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-lg bg-cyan-500/20 text-[#00F0FF] font-mono border border-[#00F0FF33]">
              Live
            </span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. OVERLAY DASHBOARD MODALS / DRAWERS */}
      {/* ========================================================================= */}
      {currentSection !== 'none' && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex justify-start animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0F172A]/95 backdrop-blur-2xl border-r border-[#00F0FF33] h-full flex flex-col shadow-2xl ml-16 lg:ml-60">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#090D16]">
              <div className="flex items-center space-x-2.5">
                <span className="text-sm font-bold text-white uppercase font-mono tracking-wide">
                  {currentSection === 'projects' && 'Projects Workspace'}
                  {currentSection === 'recent-chats' && 'Recent Chats (Last 24 Hours)'}
                  {currentSection === 'deposit' && 'Financial Dashboard & Deposit'}
                  {currentSection === 'update' && 'System Health & Store Updates'}
                  {currentSection === 'sell' && 'Sell Project / P2P Marketplace'}
                  {currentSection === 'buy' && 'AuraBots Verified Marketplace'}
                </span>
              </div>
              <button
                onClick={() => onSelectSection('none')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6">
              {/* SECTION: PROJECTS WORKSPACE */}
              {currentSection === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">All Synthetic Projects ({projects.length})</span>
                    <button
                      onClick={onNewChat}
                      className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-mono font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Blank Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {projects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => { onSelectProject(proj); onSelectSection('none'); }}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                          currentProject.id === proj.id
                            ? 'bg-[#151F38] border-cyan-500 shadow-lg shadow-cyan-500/10'
                            : 'bg-[#090D16] border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{proj.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
                            {proj.platform}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                          <span>v{proj.version}</span>
                          <span className="text-cyan-400 font-bold">Open Workspace →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: RECENT CHATS (LAST 24 HOURS) */}
              {currentSection === 'recent-chats' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Prompts synthesized in the last 24 hours:</p>
                  {recentChats.length === 0 ? (
                    <div className="p-8 text-center bg-[#090D16] rounded-2xl border border-slate-800 text-slate-500 text-xs font-mono">
                      No prompt sessions in the last 24 hours. Start typing in the terminal!
                    </div>
                  ) : (
                    recentChats.map(c => (
                      <div
                        key={c.id}
                        onClick={() => { onSelectRecentChat(c); onSelectSection('none'); }}
                        className="p-3.5 bg-[#090D16] hover:bg-[#151F38] rounded-2xl border border-slate-800 transition cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono truncate">{c.projectName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-cyan-300/90 font-mono line-clamp-2">“{c.prompt}”</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* SECTION: DEPOSIT & FINANCIAL BALANCE */}
              {currentSection === 'deposit' && (
                <div className="space-y-6">
                  {/* Balance Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-[#090D16] rounded-2xl border border-emerald-500/30">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Current Balance</span>
                      <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                        ${balance.currentBalanceUsd.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-[#090D16] rounded-2xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Pending Payouts</span>
                      <div className="text-xl font-black text-amber-400 font-mono mt-1">
                        ${balance.pendingPayoutsUsd.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-[#090D16] rounded-2xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Total Earned</span>
                      <div className="text-xl font-black text-cyan-400 font-mono mt-1">
                        ${balance.totalEarnedUsd.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Withdraw Form */}
                  <form onSubmit={handleWithdrawSubmit} className="p-5 bg-[#090D16] rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Instant Deposit & Withdrawal Route</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWithdrawMethod('paypal')}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                          withdrawMethod === 'paypal'
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                            : 'bg-[#0F172A] border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>PayPal Payouts</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWithdrawMethod('swift')}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                          withdrawMethod === 'swift'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-[#0F172A] border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>SWIFT / SEPA Wire</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400">Withdraw Amount ($ USD)</label>
                      <input
                        type="number"
                        min="10"
                        max={balance.currentBalanceUsd}
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400">
                        {withdrawMethod === 'paypal' ? 'PayPal Email Address' : 'Bank IBAN / Routing #'}
                      </label>
                      <input
                        type="text"
                        value={withdrawAccount}
                        onChange={e => setWithdrawAccount(e.target.value)}
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    {withdrawSuccessMsg && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300">
                        {withdrawSuccessMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Process Payout Transfer
                    </button>
                  </form>

                  {/* Transactions Ledger */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Recent Transactions</span>
                    <div className="space-y-1.5">
                      {balance.transactions.map(tx => (
                        <div key={tx.id} className="p-3 bg-[#090D16] rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                          <div>
                            <div className="font-bold text-white">{tx.method}</div>
                            <div className="text-[10px] text-slate-500">{tx.reference} • {tx.timestamp}</div>
                          </div>
                          <div className={`font-bold ${tx.type === 'earning' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {tx.type === 'earning' ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: UPDATE & HEALTH ALERT CENTER */}
              {currentSection === 'update' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    System health & store compliance telemetry. Alerts proactively notify before platform de-listing deadlines.
                  </p>

                  <div className="space-y-3">
                    {healthAlerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-2xl border space-y-3 ${
                          alert.isPatched
                            ? 'bg-[#090D16] border-emerald-500/30'
                            : alert.severity === 'critical'
                            ? 'bg-[#150F18] border-red-500/40'
                            : 'bg-[#15170F] border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className={`w-4 h-4 ${alert.isPatched ? 'text-emerald-400' : alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`} />
                            <span className="text-xs font-bold text-white font-mono">{alert.title}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                            {alert.platform}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">{alert.description}</p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                          <span>Deadline: <strong className="text-white">{alert.deadline}</strong></span>
                          {alert.isPatched ? (
                            <span className="text-emerald-400 font-bold flex items-center space-x-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Patched & Verified</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => onPatchAlert(alert.id)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold uppercase transition"
                            >
                              Inject Code Patch
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: SELL (P2P LISTING) */}
              {currentSection === 'sell' && (
                <form onSubmit={handleSellSubmit} className="space-y-4">
                  <p className="text-xs text-slate-300">
                    List your synthesized application on the P2P creator marketplace. Buyers verify via secure escrow with instant payout routing.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Select Project to List</label>
                    <select
                      value={sellProjectId}
                      onChange={e => setSellProjectId(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.platform})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Listing Price ($ USD)</label>
                    <input
                      type="number"
                      min="1"
                      value={sellPrice}
                      onChange={e => setSellPrice(Number(e.target.value))}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Buyer Email Escrow Verification</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={e => setBuyerEmail(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  {sellSuccessMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300">
                      {sellSuccessMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    List Application on Marketplace
                  </button>
                </form>
              )}

              {/* SECTION: BUY (MARKETPLACE SEARCH) */}
              {currentSection === 'buy' && (
                <div className="space-y-4">
                  {/* Search and Category Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white">
                      <Search className="w-4 h-4 text-slate-500 mr-2" />
                      <input
                        type="text"
                        value={buyQuery}
                        onChange={e => setBuyQuery(e.target.value)}
                        placeholder="Search verified applications..."
                        className="flex-1 bg-transparent focus:outline-none text-white"
                      />
                    </div>

                    <div className="flex space-x-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
                      {['All', 'Fintech', 'Productivity', 'E-Commerce', 'Social', 'Health & Fitness', 'IoT & Smart Home'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setBuyCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition ${
                            buyCategory === cat
                              ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                              : 'bg-[#090D16] border-slate-800 text-slate-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listings Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {filteredMarketplace.map(item => (
                      <div
                        key={item.id}
                        className="p-4 bg-[#090D16] rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{item.name}</h4>
                            <span className="text-xs font-black text-emerald-400 font-mono">${item.priceUsd || 149}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                          <span>★ {item.stars} ({item.downloads} sales)</span>
                          <button
                            onClick={() => onBuyItem(item)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                          >
                            Acquire App
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
