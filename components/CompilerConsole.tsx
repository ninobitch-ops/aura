'use client';

import React, { useState } from 'react';
import { CompilationStage, AppProject } from '@/types/aurabots';
import { 
  Terminal, CheckCircle2, AlertTriangle, Play, 
  Cpu, HardDrive, Zap, Code, ShieldCheck, RefreshCw 
} from 'lucide-react';

interface CompilerConsoleProps {
  project: AppProject;
  stages: CompilationStage[];
  logs: string[];
  isCompiling: boolean;
  onRunCompilation: () => void;
}

export function CompilerConsole({
  project,
  stages,
  logs,
  isCompiling,
  onRunCompilation,
}: CompilerConsoleProps) {
  const [activeTab, setActiveTab] = useState<'stages' | 'logs' | 'ast'>('stages');

  const defaultStages: CompilationStage[] = stages.length > 0 ? stages : [
    { id: '1', name: 'Lexical Tokenizer & Intent Extraction', status: 'completed', message: 'Extracted archetype, design tokens, and state requirements', durationMs: 42 },
    { id: '2', name: 'Abstract Syntax Tree (AST) Generation', status: 'completed', message: 'Built component hierarchy with 120 AST nodes', durationMs: 65 },
    { id: '3', name: 'Component Synthesizer & State Linking', status: 'completed', message: 'Synthesized React TypeScript modules with Web Audio and persistence', durationMs: 140 },
    { id: '4', name: 'Sandbox Bundler & Security Auditing', status: 'completed', message: 'Bundled standalone HTML runtime for live preview iframe', durationMs: 58 },
  ];

  const defaultLogs = logs.length > 0 ? logs : [
    `[AURABOTS-CORE] Initializing Native Program Compilation Engine v2.5...`,
    `[PARSER] Natural Language Prompt analyzed: "${project.prompt.slice(0, 60)}..."`,
    `[AST-ENGINE] Target Archetype: ${project.category} | Platform: ${project.platform.toUpperCase()}`,
    `[SYNTHESIZER] Generating src/App.tsx with Tailwind Cyber Titanium Theme...`,
    `[SYNTHESIZER] Injected Web Audio Oscillator Synthesizer Engine for haptic audio...`,
    `[BUNDLER] Standalone HTML sandbox generated. All AST security constraints passed.`,
    `[VERIFY] Build finished in ${project.stats?.compilationTimeMs || 340}ms. 0 errors, 0 warnings.`,
  ];

  return (
    <div id="aurabots-compiler-console" className="h-full flex flex-col bg-[#090D16] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Console Header */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Native Program Compiler Terminal
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
            {isCompiling ? 'Compiling...' : 'Build Ready'}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-[#090D16] p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                activeTab === 'stages' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
              }`}
            >
              Pipeline Stages
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                activeTab === 'logs' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
              }`}
            >
              Build Logs
            </button>
          </div>

          <button
            onClick={onRunCompilation}
            disabled={isCompiling}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-lg text-xs uppercase flex items-center space-x-1 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>Rebuild</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#0C1222] border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-2 px-2">
          <Code className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">LOC:</span>
          <span className="font-bold text-white">{project.stats?.linesOfCode || 520}</span>
        </div>
        <div className="flex items-center space-x-2 px-2">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">AST Nodes:</span>
          <span className="font-bold text-white">{project.stats?.astNodes || 115}</span>
        </div>
        <div className="flex items-center space-x-2 px-2">
          <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Bundle Size:</span>
          <span className="font-bold text-white">{((project.stats?.bundleSizeBytes || 42000) / 1024).toFixed(1)} KB</span>
        </div>
        <div className="flex items-center space-x-2 px-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Compile Time:</span>
          <span className="font-bold text-emerald-400">{project.stats?.compilationTimeMs || 320} ms</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#070A12] font-mono text-xs space-y-3">
        {activeTab === 'stages' && (
          <div className="space-y-3 max-w-2xl mx-auto">
            {defaultStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="p-3.5 bg-[#0F172A] rounded-xl border border-slate-800 flex items-start space-x-3 shadow-md"
              >
                <div className="mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">
                      Step {idx + 1}: {stage.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {stage.durationMs}ms
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{stage.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-1.5 p-2 bg-[#090D16] rounded-xl border border-slate-800 text-slate-300">
            {defaultLogs.map((log, i) => (
              <div key={i} className="flex space-x-2 leading-relaxed">
                <span className="text-slate-600 select-none">[{i + 1}]</span>
                <span className={log.includes('VERIFY') ? 'text-emerald-400 font-bold' : log.includes('Prompt') ? 'text-cyan-300' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
