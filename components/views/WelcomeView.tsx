'use client';

import React from 'react';
import { Logo } from '@/components/Logo';
import { 
  Sparkles, ArrowRight, Zap, Shield, Cpu, 
  Layers, Terminal, Globe, Smartphone, CheckCircle,
  BarChart3, Activity, PlayCircle, Database
} from 'lucide-react';

interface WelcomeViewProps {
  onStartBuilding: () => void;
  onOpenAuth: () => void;
  onOpenProjects: () => void;
}

export function WelcomeView({
  onStartBuilding,
  onOpenAuth,
  onOpenProjects,
}: WelcomeViewProps) {
  return (
    <div id="aurabots-welcome-view" className="w-full min-h-screen bg-transparent text-slate-100 flex flex-col overflow-y-auto relative">
      {/* Background Cyber Glow Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-20 relative z-10 w-full">
        {/* Top Badges */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0F172A]/80 border border-[#00F0FF33] text-[#00F0FF] text-xs font-mono font-bold tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
            <span>AuraBots 2.5 Engine Active</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#0F172A]/80 border border-[#A855F744] text-[#A855F7] text-xs font-mono font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Gemini 3.7 & Titanium AST Synthesizer</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-mono leading-tight">
            SYNTHESIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-blue-500 to-[#A855F7]">WEB & NATIVE</span> APPS AT LIGHTSPEED
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto font-normal leading-relaxed">
            Transform natural language prompts into production-grade React TypeScript web apps, iOS / Android binaries, 3D matrices, and high-fidelity video teasers.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <button
            id="btn-welcome-start-building"
            onClick={onStartBuilding}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] via-blue-600 to-[#A855F7] hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center space-x-3 transition shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Building Now</span>
            <ArrowRight className="w-4 h-4 text-slate-950 font-bold" />
          </button>

          <button
            id="btn-welcome-open-auth"
            onClick={onOpenAuth}
            className="px-6 py-4 rounded-2xl bg-[#0F172A]/80 hover:bg-[#151F38] border border-slate-700/80 hover:border-[#00F0FF33] text-white font-bold text-sm uppercase tracking-wider flex items-center space-x-2 transition backdrop-blur-md cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#00F0FF]" />
            <span>Enterprise Sign In</span>
          </button>
        </div>

        {/* Live System Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-[#00F0FF33] backdrop-blur-xl shadow-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition">
            <div className="flex items-center space-x-2 text-[#00F0FF] mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Apps Synthesized</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">142,850+</div>
            <p className="text-[11px] text-[#94A3B8] mt-1">Cross-platform production builds</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-emerald-500/30 backdrop-blur-xl shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Engine Reliability</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">99.98%</div>
            <p className="text-[11px] text-[#94A3B8] mt-1">Zero-downtime compiler matrix</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-[#A855F744] backdrop-blur-xl shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition">
            <div className="flex items-center space-x-2 text-[#A855F7] mb-2">
              <Zap className="w-4 h-4 text-[#A855F7]" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider">AST Compile Time</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">0.42s</div>
            <p className="text-[11px] text-[#94A3B8] mt-1">Mean deterministic compilation</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-blue-500/30 backdrop-blur-xl shadow-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <Database className="w-4 h-4" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider">Cloud Nodes</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">480,000+</div>
            <p className="text-[11px] text-[#94A3B8] mt-1">Containerized live runtimes</p>
          </div>
        </div>

        {/* Live Engine Status Grid */}
        <div className="mt-8 p-6 rounded-3xl bg-[#0B0F19]/90 border border-[#00F0FF33] shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Live Engine Real-Time Telemetry
              </h3>
            </div>
            <span className="text-xs text-[#00F0FF] font-mono font-bold">All Systems Operational</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-[#0F172A]/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span className="text-[#94A3B8]">Titanium AST Synthesizer:</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="p-3.5 bg-[#0F172A]/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span className="text-[#94A3B8]">Gemini 3.7 Voice Core:</span>
              <span className="text-[#00F0FF] font-bold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>READY</span>
              </span>
            </div>

            <div className="p-3.5 bg-[#0F172A]/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span className="text-[#94A3B8]">Web Speech Audio Matrix:</span>
              <span className="text-[#A855F7] font-bold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ACTIVE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Onboarding Overview 3-Step Walkthrough */}
        <div className="mt-16 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white font-mono uppercase tracking-wide">
              How AuraBots Works
            </h2>
            <p className="text-xs text-[#94A3B8]">Complete application lifecycle from prompt to store deployment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0F172A]/80 rounded-3xl border border-[#00F0FF33] backdrop-blur-xl relative group hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-[#00F0FF] border border-[#00F0FF33] flex items-center justify-center font-bold mb-4 font-mono shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Prompt & AST Synthesis</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Describe your application idea using voice or text. The compiler parses intent, generates a 3D Abstract Syntax Tree, and writes complete React TypeScript code.
              </p>
            </div>

            <div className="p-6 bg-[#0F172A]/80 rounded-3xl border border-[#A855F744] backdrop-blur-xl relative group hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-[#A855F7] border border-[#A855F744] flex items-center justify-center font-bold mb-4 font-mono shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Media Studio & 3D Preview</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Generate geometric 3D glassmorphic app icons, create 1–3 minute animated intro teaser videos with AI voiceover, and test live in 4K multi-device sandboxes.
              </p>
            </div>

            <div className="p-6 bg-[#0F172A]/80 rounded-3xl border border-blue-500/30 backdrop-blur-xl relative group hover:shadow-[0_0_20px_rgba(37,99,235,0.25)] transition">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold mb-4 font-mono shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Parallel Publish & Monetize</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Deploy to free subdomains, sync with GitHub, export iOS/Android installable packages, or list in the P2P marketplace for instant buyer payouts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
