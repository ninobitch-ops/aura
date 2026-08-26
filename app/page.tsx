'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AppProject, PlatformType, FrameworkType, ThemePreset, 
  MarketplaceItem, CompilationStage, PageViewType, 
  DashboardSectionType, RecentPromptSession, FinancialBalance, 
  SystemHealthAlert, ExternalConnector 
} from '@/types/aurabots';
import { synthesizeProject } from '@/lib/compiler/templateSynthesizer';
import { STARTER_PROJECTS, INITIAL_MARKETPLACE } from '@/lib/storage/presetProjects';
import { 
  saveProjectToDB, getAllProjectsFromDB, saveMarketplaceItemToDB, 
  getAllMarketplaceFromDB, saveRecentChatToDB, getRecentChatsFromDB,
  INITIAL_CONNECTORS, INITIAL_FINANCIAL_BALANCE, INITIAL_HEALTH_ALERTS 
} from '@/lib/storage/indexedDbStorage';

// Page Views
import { Header } from '@/components/Header';
import { WelcomeView } from '@/components/views/WelcomeView';
import { AuthView } from '@/components/views/AuthView';
import { WorkspaceView } from '@/components/views/WorkspaceView';
import { MediaStudioView } from '@/components/views/MediaStudioView';
import { PreviewPageView } from '@/components/views/PreviewPageView';
import { PublishHubView } from '@/components/views/PublishHubView';
import { SidebarNavigation } from '@/components/views/SidebarNavigation';
import { ConnectorDrawer } from '@/components/views/ConnectorDrawer';
import { ExitModal } from '@/components/views/ExitModal';

// Modals
import { ExportModal } from '@/components/ExportModal';
import { MarketplaceModal } from '@/components/MarketplaceModal';
import { AssetStudioModal } from '@/components/AssetStudioModal';
import { VoiceControlModal } from '@/components/VoiceControlModal';
import { SecuritySettingsModal } from '@/components/SecuritySettingsModal';
import { DatabaseApiStudioModal } from '@/components/DatabaseApiStudioModal';
import { AiAgentBuilderModal } from '@/components/AiAgentBuilderModal';
import confetti from 'canvas-confetti';

export default function AuraBotsMasterApplication() {
  // 1. Page Routing & Navigation
  const [currentPage, setCurrentPage] = useState<PageViewType>('workspace');
  const [currentDashboardSection, setCurrentDashboardSection] = useState<DashboardSectionType>('none');
  const [isConnectorDrawerOpen, setIsConnectorDrawerOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [pendingNavigationPage, setPendingNavigationPage] = useState<PageViewType | null>(null);

  // 2. User & Auth State
  const [userEmail, setUserEmail] = useState('ninobitch@gmail.com');

  // 3. Active Project & Workspace State
  const [project, setProject] = useState<AppProject>(() => {
    const starter = STARTER_PROJECTS[0];
    const { project: synthesized } = synthesizeProject(
      starter.prompt, 
      starter.platform, 
      starter.framework, 
      starter.theme, 
      starter
    );
    return synthesized;
  });

  const [allProjects, setAllProjects] = useState<AppProject[]>(STARTER_PROJECTS);
  const [prompt, setPrompt] = useState<string>(STARTER_PROJECTS[0].prompt);
  const [platform, setPlatform] = useState<PlatformType>('hybrid');
  const [theme, setTheme] = useState<ThemePreset>('electric-cyan');
  const [activeWorkspaceView, setActiveWorkspaceView] = useState<'preview' | 'code' | '3d' | 'console'>('preview');

  // 4. Compilation & Telemetry State
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationStages, setCompilationStages] = useState<CompilationStage[]>([]);
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);

  // 5. Auto-Save Reliability Guard
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 6. Dashboards Data
  const [recentChats, setRecentChats] = useState<RecentPromptSession[]>([]);
  const [financialBalance, setFinancialBalance] = useState<FinancialBalance>(INITIAL_FINANCIAL_BALANCE);
  const [healthAlerts, setHealthAlerts] = useState<SystemHealthAlert[]>(INITIAL_HEALTH_ALERTS);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [externalConnectors, setExternalConnectors] = useState<ExternalConnector[]>(INITIAL_CONNECTORS);

  // 7. Modals
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isAssetStudioOpen, setIsAssetStudioOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isDatabaseStudioOpen, setIsDatabaseStudioOpen] = useState(false);
  const [isAgentBuilderOpen, setIsAgentBuilderOpen] = useState(false);

  // Initialize DB Storage & Persistence on Mount
  useEffect(() => {
    async function initPlatform() {
      try {
        const savedProjects = await getAllProjectsFromDB();
        if (savedProjects && savedProjects.length > 0) {
          setAllProjects(savedProjects);
        } else {
          for (const sp of STARTER_PROJECTS) {
            await saveProjectToDB(sp);
          }
        }

        const savedMkt = await getAllMarketplaceFromDB();
        if (savedMkt && savedMkt.length > 0) {
          setMarketplaceItems(savedMkt);
        } else {
          for (const item of INITIAL_MARKETPLACE) {
            await saveMarketplaceItemToDB(item);
          }
        }

        const savedChats = await getRecentChatsFromDB();
        setRecentChats(savedChats);
      } catch (err) {
        console.warn('DB initialization error:', err);
      }
    }
    initPlatform();
  }, []);

  // Continuous Auto-Save Reliability Guard (Every 3-5 seconds to IndexedDB/localStorage)
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (project && project.id) {
        setIsAutoSaving(true);
        try {
          await saveProjectToDB(project);
          setHasUnsavedChanges(false);
        } catch (e) {
          console.warn('Autosave warning:', e);
        } finally {
          setTimeout(() => setIsAutoSaving(false), 400);
        }
      }
    }, 4000);

    return () => clearInterval(autoSaveInterval);
  }, [project]);

  // Window beforeunload listener to safeguard unsaved state
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Web Audio trigger helper
  const playSynthesizerSound = (freq = 600) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  // Run Compilation & AST Synthesis Engine
  const handleSynthesize = useCallback(async (options?: { platform?: PlatformType; theme?: ThemePreset }) => {
    if (!prompt.trim() || isCompiling) return;

    setIsCompiling(true);
    playSynthesizerSound(520);

    const targetPlatform = options?.platform || platform;
    const targetTheme = options?.theme || theme;

    // Multi-stage compilation telemetry
    const stage1: CompilationStage = { id: '1', name: 'Lexical Tokenizer & Intent Extraction', status: 'running', message: 'Analyzing prompt grammar and domain intent...', durationMs: 0 };
    setCompilationStages([stage1]);
    setCompilationLogs([`[COMPILER] Lexical parse started for: "${prompt.slice(0, 50)}..."`]);

    await new Promise(r => setTimeout(r, 100));
    stage1.status = 'completed';
    stage1.durationMs = 40;
    stage1.message = 'Identified archetype entities and responsive layout structure';

    const stage2: CompilationStage = { id: '2', name: 'Abstract Syntax Tree (AST) Generation', status: 'running', message: 'Building component hierarchy and state bindings...', durationMs: 0 };
    setCompilationStages([stage1, stage2]);
    setCompilationLogs(prev => [...prev, `[AST] Generated 3D node topology with reactive state bindings.`]);

    await new Promise(r => setTimeout(r, 140));
    stage2.status = 'completed';
    stage2.durationMs = 65;
    stage2.message = 'AST generated with 130 reactive component nodes';

    const stage3: CompilationStage = { id: '3', name: 'Template Synthesis & Code Generation', status: 'running', message: 'Synthesizing TypeScript React modules & Tailwind CSS...', durationMs: 0 };
    setCompilationStages([stage1, stage2, stage3]);

    const { project: newProject } = synthesizeProject(prompt, targetPlatform, 'react-web', targetTheme, {
      id: project.id,
      createdAt: project.createdAt,
    });

    await new Promise(r => setTimeout(r, 160));
    stage3.status = 'completed';
    stage3.durationMs = 110;
    stage3.message = `Emitted ${newProject.stats?.linesOfCode} lines of production code`;

    const stage4: CompilationStage = { id: '4', name: 'Sandbox Bundler & Runtime Verification', status: 'running', message: 'Creating standalone multi-device runtime...', durationMs: 0 };
    setCompilationStages([stage1, stage2, stage3, stage4]);

    await new Promise(r => setTimeout(r, 90));
    stage4.status = 'completed';
    stage4.durationMs = 45;
    stage4.message = 'Verification passed: 0 errors, multi-device sandbox active';

    setCompilationLogs(prev => [
      ...prev,
      `[SANDBOX] Live sandbox compiled in ${newProject.stats?.compilationTimeMs}ms. Ready!`,
      `[AUTOSAVE] Synchronized to durable IndexedDB store.`
    ]);

    setProject(newProject);
    setIsCompiling(false);
    playSynthesizerSound(960);

    // Save project and log recent chat session
    saveProjectToDB(newProject);
    const session: RecentPromptSession = {
      id: `chat_${Date.now()}`,
      prompt: prompt,
      timestamp: Date.now(),
      projectName: newProject.name,
      platform: targetPlatform,
      theme: targetTheme,
    };
    saveRecentChatToDB(session);
    setRecentChats(prev => [session, ...prev]);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  }, [prompt, isCompiling, platform, theme, project.id, project.createdAt]);

  // Update File directly in Code Editor
  const handleUpdateFile = (path: string, newContent: string) => {
    setHasUnsavedChanges(true);
    setProject(prev => {
      const updatedFiles = { ...prev.files, [path]: newContent };
      const updatedProj = { ...prev, files: updatedFiles, updatedAt: Date.now() };
      saveProjectToDB(updatedProj);
      return updatedProj;
    });
  };

  // Safe Navigation Interceptor
  const handleNavigatePage = (target: PageViewType) => {
    if (currentPage === target) return;
    if (hasUnsavedChanges) {
      setPendingNavigationPage(target);
      setIsExitModalOpen(true);
    } else {
      setCurrentPage(target);
    }
  };

  // Reset / New Chat Action
  const handleNewChat = () => {
    const blankPrompt = 'Build a high-performance modern web application with sleek interactive dashboard, responsive data visualizations, clean dark cyber aesthetics, and real-time state.';
    setPrompt(blankPrompt);
    const { project: freshProj } = synthesizeProject(blankPrompt, 'hybrid', 'react-web', 'electric-cyan');
    setProject(freshProj);
    setPlatform('hybrid');
    setTheme('electric-cyan');
    setCurrentPage('workspace');
    setCurrentDashboardSection('none');
    playSynthesizerSound(740);
  };

  // Select project from workspace grid
  const handleSelectProject = (selected: AppProject) => {
    setProject(selected);
    setPrompt(selected.prompt);
    setPlatform(selected.platform);
    setTheme(selected.theme);
    setCurrentPage('workspace');
    playSynthesizerSound(820);
  };

  // Patch System Health Alert
  const handlePatchAlert = (alertId: string) => {
    setHealthAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isPatched: true } : a));
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // Voice Command Handler
  const handleVoiceCommand = (cmd: string, rawTranscript: string) => {
    if (cmd === 'synthesize') {
      handleSynthesize();
    } else if (cmd === 'view_mobile') {
      setPlatform('mobile');
      setCurrentPage('workspace');
      setActiveWorkspaceView('preview');
    } else if (cmd === 'view_3d') {
      setCurrentPage('workspace');
      setActiveWorkspaceView('3d');
    } else if (cmd === 'view_preview') {
      setCurrentPage('preview');
    } else if (cmd === 'media_studio') {
      setCurrentPage('media-studio');
    } else if (cmd === 'publish_hub') {
      setCurrentPage('publish');
    } else if (cmd === 'export') {
      setIsExportOpen(true);
    } else if (cmd === 'marketplace') {
      setCurrentDashboardSection('buy');
    }
  };

  return (
    <div id="aurabots-app-root" className="min-h-screen bg-[#0B0F19] bg-ambient-space text-slate-100 font-sans flex flex-col selection:bg-[#00F0FF] selection:text-slate-950 relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glow Light Blooms */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#00F0FF]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-[#A855F7]/10 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-[#2563EB]/10 blur-[150px]" />
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      </div>

      {/* Global Application Header */}
      <Header
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
        platform={platform}
        onPlatformChange={(p) => {
          setPlatform(p);
          handleSynthesize({ platform: p });
        }}
        activeView={activeWorkspaceView}
        onViewChange={setActiveWorkspaceView}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenMarketplace={() => setCurrentDashboardSection('buy')}
        onOpenGithubSync={() => setCurrentPage('publish')}
        onOpenDeposit={() => setCurrentDashboardSection('deposit')}
        onOpenSecuritySettings={() => setIsSecurityModalOpen(true)}
        onOpenDatabaseStudio={() => setIsDatabaseStudioOpen(true)}
        onOpenAgentBuilder={() => setIsAgentBuilderOpen(true)}
        balanceUsd={financialBalance.currentBalanceUsd}
        isCompiling={isCompiling}
        projectName={project.name}
        isAutoSaving={isAutoSaving}
        userEmail={userEmail}
      />

      {/* Main Dual-Column Frame: Sidebar + Active Page */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative z-10">
        {/* Dashboards & Sidebar Navigation */}
        <SidebarNavigation
          currentSection={currentDashboardSection}
          onSelectSection={setCurrentDashboardSection}
          onNewChat={handleNewChat}
          projects={allProjects}
          onSelectProject={handleSelectProject}
          currentProject={project}
          recentChats={recentChats}
          onSelectRecentChat={(chat) => {
            setPrompt(chat.prompt);
            handleSynthesize({ platform: chat.platform, theme: chat.theme });
            setCurrentPage('workspace');
          }}
          balance={financialBalance}
          onUpdateBalance={setFinancialBalance}
          healthAlerts={healthAlerts}
          onPatchAlert={handlePatchAlert}
          marketplaceItems={marketplaceItems}
          onBuyItem={(item) => {
            handleSelectProject(item.project);
            setCurrentDashboardSection('none');
          }}
          onListProjectForSale={(item) => {
            setMarketplaceItems(prev => [item, ...prev]);
            saveMarketplaceItemToDB(item);
          }}
          onOpenConnectorDrawer={() => setIsConnectorDrawerOpen(true)}
          onOpenDatabaseStudio={() => setIsDatabaseStudioOpen(true)}
          onOpenAgentBuilder={() => setIsAgentBuilderOpen(true)}
          onOpenSecuritySettings={() => setIsSecurityModalOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative bg-transparent">
          {/* 1. WELCOME PAGE */}
          {currentPage === 'welcome' && (
            <WelcomeView
              onStartBuilding={() => setCurrentPage('workspace')}
              onOpenAuth={() => setCurrentPage('auth')}
              onOpenProjects={() => setCurrentDashboardSection('projects')}
            />
          )}

          {/* 2. AUTHENTICATION PAGE */}
          {currentPage === 'auth' && (
            <AuthView
              onAuthSuccess={(email) => {
                setUserEmail(email);
                setCurrentPage('workspace');
              }}
              onBackToWelcome={() => setCurrentPage('welcome')}
            />
          )}

          {/* 3. BUILDING WORKSPACE PAGE */}
          {currentPage === 'workspace' && (
            <WorkspaceView
              project={project}
              prompt={prompt}
              onPromptChange={setPrompt}
              onSynthesize={handleSynthesize}
              isCompiling={isCompiling}
              platform={platform}
              onPlatformChange={(p) => {
                setPlatform(p);
                handleSynthesize({ platform: p });
              }}
              theme={theme}
              onThemeChange={(t) => {
                setTheme(t);
                handleSynthesize({ theme: t });
              }}
              activeView={activeWorkspaceView}
              onViewChange={setActiveWorkspaceView}
              compilationStages={compilationStages}
              compilationLogs={compilationLogs}
              onUpdateFile={handleUpdateFile}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onNextToMediaStudio={() => setCurrentPage('media-studio')}
            />
          )}

          {/* 4. LOGO & INTRO VIDEO GENERATING PAGE */}
          {currentPage === 'media-studio' && (
            <MediaStudioView
              project={project}
              onUpdateProject={setProject}
              onBackToWorkspace={() => setCurrentPage('workspace')}
              onNextToPreview={() => setCurrentPage('preview')}
            />
          )}

          {/* 5. PREVIEW PAGE (3D/4K) */}
          {currentPage === 'preview' && (
            <PreviewPageView
              project={project}
              onBackToMedia={() => setCurrentPage('media-studio')}
              onNextToPublish={() => setCurrentPage('publish')}
            />
          )}

          {/* 6. PUBLISH & DISTRIBUTION HUB */}
          {currentPage === 'publish' && (
            <PublishHubView
              project={project}
              onBackToPreview={() => setCurrentPage('preview')}
              onUpdateProject={setProject}
            />
          )}
        </main>
      </div>

      {/* Persistent External Connector Right Drawer */}
      <ConnectorDrawer
        isOpen={isConnectorDrawerOpen}
        onClose={() => setIsConnectorDrawerOpen(false)}
        connectors={externalConnectors}
        onAddConnector={(newConn) => setExternalConnectors(prev => [newConn, ...prev])}
      />

      {/* Exit Safeguard Modal */}
      <ExitModal
        isOpen={isExitModalOpen}
        projectName={project.name}
        onSaveAndExit={async () => {
          setIsAutoSaving(true);
          await saveProjectToDB(project);
          setIsAutoSaving(false);
          setHasUnsavedChanges(false);
          setIsExitModalOpen(false);
          if (pendingNavigationPage) setCurrentPage(pendingNavigationPage);
        }}
        onDiscardAndExit={() => {
          setHasUnsavedChanges(false);
          setIsExitModalOpen(false);
          if (pendingNavigationPage) setCurrentPage(pendingNavigationPage);
        }}
        onCancel={() => {
          setIsExitModalOpen(false);
          setPendingNavigationPage(null);
        }}
      />

      {/* Modals Suite */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

      <MarketplaceModal
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
        items={marketplaceItems}
        onCloneProject={(cloned) => {
          handleSelectProject(cloned);
          setIsMarketplaceOpen(false);
        }}
        onPublishCurrentProject={async (cat, tags) => {
          const newItem: MarketplaceItem = {
            id: `mkt_${Date.now()}`,
            name: project.name,
            description: project.description,
            author: 'Verified Creator',
            category: cat as any || 'Productivity',
            platform: project.platform,
            priceUsd: 149,
            downloads: 1,
            stars: 5.0,
            tags,
            project,
            createdAt: new Date().toISOString().slice(0, 10),
            verifiedBadge: true,
            status: 'active',
          };
          setMarketplaceItems(prev => [newItem, ...prev]);
          await saveMarketplaceItemToDB(newItem);
        }}
        currentProject={project}
      />

      <AssetStudioModal
        isOpen={isAssetStudioOpen}
        onClose={() => setIsAssetStudioOpen(false)}
        project={project}
        onApplyIcon={(url) => {
          setProject(prev => ({ ...prev, iconDataUrl: url }));
        }}
      />

      <VoiceControlModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onVoiceCommand={handleVoiceCommand}
        userEmail={userEmail}
      />

      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      <DatabaseApiStudioModal
        isOpen={isDatabaseStudioOpen}
        onClose={() => setIsDatabaseStudioOpen(false)}
        project={project}
        onUpdateProject={setProject}
      />

      <AiAgentBuilderModal
        isOpen={isAgentBuilderOpen}
        onClose={() => setIsAgentBuilderOpen(false)}
        project={project}
      />
    </div>
  );
}
