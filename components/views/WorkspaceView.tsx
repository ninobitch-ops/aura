'use client';

import React from 'react';
import { AppProject, PlatformType, ThemePreset, CompilationStage } from '@/types/aurabots';
import { PromptStudio } from '@/components/PromptStudio';
import { LivePreview } from '@/components/LivePreview';
import { CodeEditor } from '@/components/CodeEditor';
import { Visualizer3DCanvas } from '@/components/Visualizer3DCanvas';
import { CompilerConsole } from '@/components/CompilerConsole';
import { ConversationalUiTweaker } from '@/components/ConversationalUiTweaker';
import { 
  ArrowRight, Sparkles, Monitor, Smartphone, 
  Columns, Tablet, Code, Box, Layers, Play
} from 'lucide-react';

interface WorkspaceViewProps {
  project: AppProject;
  prompt: string;
  onPromptChange: (p: string) => void;
  onSynthesize: (options?: { platform?: PlatformType; theme?: ThemePreset }) => void;
  isCompiling: boolean;
  platform: PlatformType;
  onPlatformChange: (p: PlatformType) => void;
  theme: ThemePreset;
  onThemeChange: (t: ThemePreset) => void;
  activeView: 'preview' | 'code' | '3d' | 'console';
  onViewChange: (v: 'preview' | 'code' | '3d' | 'console') => void;
  compilationStages: CompilationStage[];
  compilationLogs: string[];
  onUpdateFile: (path: string, content: string) => void;
  onOpenVoice: () => void;
  onNextToMediaStudio: () => void;
}

export function WorkspaceView({
  project,
  prompt,
  onPromptChange,
  onSynthesize,
  isCompiling,
  platform,
  onPlatformChange,
  theme,
  onThemeChange,
  activeView,
  onViewChange,
  compilationStages,
  compilationLogs,
  onUpdateFile,
  onOpenVoice,
  onNextToMediaStudio,
}: WorkspaceViewProps) {
  return (
    <div id="aurabots-workspace-view" className="flex-1 flex flex-col min-h-0 relative">
      {/* Top Prompt Terminal Studio */}
      <PromptStudio
        prompt={prompt}
        onPromptChange={onPromptChange}
        onSynthesize={onSynthesize}
        isCompiling={isCompiling}
        platform={platform}
        onPlatformChange={onPlatformChange}
        theme={theme}
        onThemeChange={onThemeChange}
        onOpenVoice={onOpenVoice}
      />

      {/* Main Dual-Pane / Multi-View Center Canvas */}
      <div className="flex-1 p-3 lg:p-4 flex flex-col min-h-0 overflow-hidden max-w-[1600px] w-full mx-auto">
        {activeView === 'preview' && (
          <div className="flex-1 h-full min-h-[480px]">
            <LivePreview
              project={project}
              platform={platform}
              onPlatformChange={onPlatformChange}
            />
          </div>
        )}

        {activeView === 'code' && (
          <div className="flex-1 h-full min-h-[480px]">
            <CodeEditor
              project={project}
              onUpdateFile={onUpdateFile}
              onRecompile={onSynthesize}
            />
          </div>
        )}

        {activeView === '3d' && (
          <div className="flex-1 h-full min-h-[480px]">
            <Visualizer3DCanvas project={project} />
          </div>
        )}

        {activeView === 'console' && (
          <div className="flex-1 h-full min-h-[480px]">
            <CompilerConsole
              project={project}
              stages={compilationStages}
              logs={compilationLogs}
              isCompiling={isCompiling}
              onRunCompilation={onSynthesize}
            />
          </div>
        )}
      </div>

      {/* Conversational UI Tweaker Floating Assistant */}
      <ConversationalUiTweaker
        project={project}
        onUpdateTheme={onThemeChange}
        onUpdateFileContent={onUpdateFile}
      />

      {/* Persistent Bottom Action Navigation Bar */}
      <div className="sticky bottom-0 z-30 bg-[#0B0F19]/90 backdrop-blur-2xl border-t border-[#00F0FF33] px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3 text-xs text-[#94A3B8] font-mono">
          <div className="flex items-center space-x-1.5 text-[#00F0FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-bold">Step 1 of 4:</span>
          </div>
          <span className="hidden sm:inline text-white font-medium">Workspace & AST Synthesis Ready</span>
        </div>

        {/* Action Button */}
        <button
          id="btn-workspace-next-step"
          onClick={onNextToMediaStudio}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] via-blue-600 to-[#00F0FF] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-[1.02] cursor-pointer"
        >
          <span>Next: Logo & Intro Video Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
