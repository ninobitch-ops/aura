'use client';

import React from 'react';
import { Logo } from './Logo';
import { PlatformType, PageViewType } from '@/types/aurabots';
import { 
  Monitor, Smartphone, Columns, Box, Code, 
  Download, Mic, ShoppingBag, Palette, Github,
  Sparkles, Play, Layers, CheckCircle2, ShieldCheck, 
  Globe, Video, ArrowRight, User, Wallet, Activity, Zap,
  Database, Bot, Key, Lock
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageViewType;
  onNavigatePage: (page: PageViewType) => void;
  platform: PlatformType;
  onPlatformChange: (p: PlatformType) => void;
  activeView: 'preview' | 'code' | '3d' | 'console';
  onViewChange: (v: 'preview' | 'code' | '3d' | 'console') => void;
  onOpenVoice: () => void;
  onOpenExport: () => void;
  onOpenMarketplace: () => void;
  onOpenGithubSync: () => void;
  onOpenDeposit?: () => void;
  onOpenSecuritySettings?: () => void;
  onOpenDatabaseStudio?: () => void;
  onOpenAgentBuilder?: () => void;
  balanceUsd?: number;
  isCompiling: boolean;
  projectName: string;
  isAutoSaving: boolean;
  userEmail: string;
}

export function Header({
  currentPage,
  onNavigatePage,
  platform,
  onPlatformChange,
  activeView,
  onViewChange,
  onOpenVoice,
  onOpenExport,
  onOpenMarketplace,
  onOpenGithubSync,
  onOpenDeposit,
  onOpenSecuritySettings,
  onOpenDatabaseStudio,
  onOpenAgentBuilder,
  balanceUsd = 12450.00,
  isCompiling,
  projectName,
  isAutoSaving,
  userEmail,
}: HeaderProps) {
  return (
    <header id="aurabots-main-header" className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-[#00F0FF33] px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-2xl shadow-black/60">
      {/* Left: Brand Logo & Page Flow Tabs */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        <button
          onClick={() => onNavigatePage('welcome')}
          className="focus:outline-none cursor-pointer group"
          title="Return to Welcome Landing"
        >
          <Logo size="md" />
        </button>

        {/* Page Pipeline Flow Indicator */}
        <nav className="hidden xl:flex items-center space-x-1 pl-3 border-l border-slate-800/90 text-xs font-mono">
          <button
            onClick={() => onNavigatePage('welcome')}
            className={`px-3 py-1 rounded-xl transition ${
              currentPage === 'welcome'
                ? 'bg-slate-800/90 text-white font-bold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>

          <span className="text-slate-600">/</span>

          <button
            onClick={() => onNavigatePage('workspace')}
            className={`px-3 py-1 rounded-xl transition ${
              currentPage === 'workspace'
                ? 'bg-cyan-500/20 text-[#00F0FF] font-bold border border-[#00F0FF33] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Workspace
          </button>

          <span className="text-slate-600">/</span>

          <button
            onClick={() => onNavigatePage('media-studio')}
            className={`px-3 py-1 rounded-xl transition ${
              currentPage === 'media-studio'
                ? 'bg-purple-500/20 text-[#A855F7] font-bold border border-[#A855F744] shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Media Studio
          </button>

          <span className="text-slate-600">/</span>

          <button
            onClick={() => onNavigatePage('preview')}
            className={`px-3 py-1 rounded-xl transition ${
              currentPage === 'preview'
                ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. 4K Preview
          </button>

          <span className="text-slate-600">/</span>

          <button
            onClick={() => onNavigatePage('publish')}
            className={`px-3 py-1 rounded-xl transition ${
              currentPage === 'publish'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Publish Hub
          </button>
        </nav>
      </div>

      {/* Center: System Telemetry & Workspace Sub-Views */}
      <div className="flex items-center space-x-3">
        {/* Real-time Telemetry Metrics Pill */}
        <div className="hidden 2xl:flex items-center space-x-2.5 px-3 py-1 rounded-xl bg-[#090D16]/90 border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="flex items-center space-x-1 text-[#00F0FF]">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-bold">AST Engine v2.4</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="text-emerald-400 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>24ms Synthesizer</span>
          </span>
        </div>

        {currentPage === 'workspace' ? (
          <div className="flex items-center space-x-2">
            {/* Main View Mode Selector */}
            <div className="flex bg-[#0B0F19]/90 p-1 rounded-2xl border border-slate-800/90 shadow-inner">
              <button
                id="btn-view-preview"
                onClick={() => onViewChange('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeView === 'preview'
                    ? 'bg-cyan-500/20 text-[#00F0FF] border border-[#00F0FF33] shadow-[0_0_12px_rgba(0,240,255,0.35)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                id="btn-view-code"
                onClick={() => onViewChange('code')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeView === 'code'
                    ? 'bg-purple-500/20 text-[#A855F7] border border-[#A855F744] shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Code Tree</span>
              </button>

              <button
                id="btn-view-3d"
                onClick={() => onViewChange('3d')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeView === '3d'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3D Matrix</span>
              </button>

              <button
                id="btn-view-console"
                onClick={() => onViewChange('console')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeView === 'console'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compiler</span>
              </button>
            </div>

            {/* Platform Target Toggle */}
            <div className="hidden lg:flex bg-[#0B0F19]/90 p-1 rounded-2xl border border-slate-800/90">
              <button
                id="btn-platform-web"
                onClick={() => onPlatformChange('web')}
                title="Target: Web Application"
                className={`p-1.5 rounded-xl transition ${
                  platform === 'web'
                    ? 'bg-slate-800 text-[#00F0FF] border border-[#00F0FF33] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>

              <button
                id="btn-platform-mobile"
                onClick={() => onPlatformChange('mobile')}
                title="Target: Native Mobile (iOS / Android)"
                className={`p-1.5 rounded-xl transition ${
                  platform === 'mobile'
                    ? 'bg-slate-800 text-[#A855F7] border border-[#A855F744] shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>

              <button
                id="btn-platform-hybrid"
                onClick={() => onPlatformChange('hybrid')}
                title="Target: Synchronized Hybrid Web + Mobile"
                className={`p-1.5 rounded-xl transition ${
                  platform === 'hybrid'
                    ? 'bg-slate-800 text-blue-400 border border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">Current:</span>
            <span className="text-xs font-bold text-white bg-[#0B0F19] px-3.5 py-1.5 rounded-xl border border-slate-700/80 max-w-[220px] truncate font-mono shadow-sm">
              {projectName}
            </span>
          </div>
        )}
      </div>

      {/* Right: Live Deposit Balance, Voice & Quick Action Suites */}
      <div className="flex items-center space-x-2.5">
        {/* Live Deposit Balance Preview Badge */}
        <button
          onClick={onOpenDeposit}
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#090D16]/90 hover:bg-[#151F38] border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition shadow-sm hover:border-emerald-400 cursor-pointer"
          title="Open Deposit & Financial Balance Dashboard"
        >
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span>${balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </button>

        {/* Auto-Save Reliability Guard Status */}
        <div 
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#090D16]/90 border border-slate-800 text-[11px] font-mono"
          title="Auto-Save Reliability Guard (Continuous 3s IndexedDB sync)"
        >
          <span className={`w-2 h-2 rounded-full ${isAutoSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-slate-400">{isAutoSaving ? 'Saving...' : 'Auto-Saved'}</span>
        </div>

        {/* Database Studio Quick Button */}
        {onOpenDatabaseStudio && (
          <button
            onClick={onOpenDatabaseStudio}
            className="hidden lg:flex items-center space-x-1.5 p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition cursor-pointer"
            title="Open Database & API Integration Studio"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="hidden xl:inline text-xs font-bold font-mono">DB Studio</span>
          </button>
        )}

        {/* AI Agent Builder Quick Button */}
        {onOpenAgentBuilder && (
          <button
            onClick={onOpenAgentBuilder}
            className="hidden lg:flex items-center space-x-1.5 p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition cursor-pointer"
            title="Open Autonomous AI Agent Builder"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="hidden xl:inline text-xs font-bold font-mono">Agents</span>
          </button>
        )}

        {/* Security & API Settings Quick Button */}
        {onOpenSecuritySettings && (
          <button
            onClick={onOpenSecuritySettings}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Open Security & API Settings (JWT Secret & GitHub PAT)"
          >
            <Lock className="w-4 h-4 text-amber-400" />
          </button>
        )}

        {/* Voice AI Prompting */}
        <button
          id="btn-open-voice-modal"
          onClick={onOpenVoice}
          className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-[#A855F7] border border-[#A855F744] hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition flex items-center space-x-1.5 cursor-pointer"
          title="Gemini Voice Control Core (Web Speech API)"
        >
          <Mic className="w-4 h-4 animate-pulse text-[#A855F7]" />
          <span className="hidden xl:inline text-xs font-bold font-mono text-white">Voice</span>
        </button>

        {/* Export ZIP / Package */}
        <button
          id="btn-open-export-modal"
          onClick={onOpenExport}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] via-blue-600 to-[#A855F7] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-950 font-bold" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* User Account / Auth */}
        <button
          onClick={() => onNavigatePage('auth')}
          className="p-2 rounded-xl bg-[#090D16]/90 hover:bg-[#151F38] border border-slate-700/80 text-slate-300 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer hover:border-cyan-500/50"
          title={`Signed in as ${userEmail}`}
        >
          <User className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="hidden 2xl:inline text-[11px] font-mono text-slate-200 truncate max-w-[100px]">{userEmail.split('@')[0]}</span>
        </button>
      </div>
    </header>
  );
}

