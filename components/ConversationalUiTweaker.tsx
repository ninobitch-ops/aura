'use client';

import React, { useState } from 'react';
import { 
  Sliders, Sparkles, Palette, Type, Layout, 
  Check, X, ChevronUp, ChevronDown, Wand2, RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppProject, ThemePreset } from '@/types/aurabots';

interface ConversationalUiTweakerProps {
  project: AppProject;
  onUpdateTheme?: (theme: ThemePreset) => void;
  onApplyCopyOverride?: (headline: string, cta: string) => void;
  onUpdateFileContent?: (path: string, content: string) => void;
}

export function ConversationalUiTweaker({
  project,
  onUpdateTheme,
  onApplyCopyOverride,
  onUpdateFileContent,
}: ConversationalUiTweakerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'copy' | 'layout'>('theme');

  // Copy state
  const [headline, setHeadline] = useState('Next-Gen Autonomous Synthesis Platform');
  const [ctaText, setCtaText] = useState('Launch Engine');
  const [isApplied, setIsApplied] = useState(false);

  // Layout state
  const [borderRadius, setBorderRadius] = useState<'sm' | 'md' | 'lg' | 'full'>('md');
  const [spacingDensity, setSpacingDensity] = useState<'compact' | 'normal' | 'relaxed'>('normal');

  const THEME_OPTIONS: Array<{ id: ThemePreset; name: string; color: string; border: string }> = [
    { id: 'electric-cyan', name: 'Electric Cyan', color: 'from-[#00F0FF] to-blue-600', border: 'border-[#00F0FF]' },
    { id: 'neon-purple', name: 'Neon Purple', color: 'from-[#A855F7] to-indigo-600', border: 'border-[#A855F7]' },
    { id: 'cobalt-blue', name: 'Cobalt Blue', color: 'from-[#2563EB] to-cyan-500', border: 'border-[#2563EB]' },
    { id: 'emerald-matrix', name: 'Emerald Surge', color: 'from-emerald-400 to-teal-600', border: 'border-emerald-400' },
    { id: 'sunset-amber', name: 'Amber Gold', color: 'from-amber-400 to-orange-600', border: 'border-amber-400' },
    { id: 'titanium-stealth', name: 'Titanium Stealth', color: 'from-slate-200 to-slate-500', border: 'border-slate-400' },
  ];

  const handleApplyTheme = (th: ThemePreset) => {
    if (onUpdateTheme) onUpdateTheme(th);
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch {}
  };

  const handleApplyCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (onApplyCopyOverride) {
      onApplyCopyOverride(headline, ctaText);
    }
    // Also inject into index.html if file modifier available
    if (onUpdateFileContent && project.files['index.html']) {
      let currentHtml = project.files['index.html'];
      currentHtml = currentHtml.replace(/<h1[^>]*>.*?<\/h1>/i, `<h1>${headline}</h1>`);
      onUpdateFileContent('index.html', currentHtml);
    }
    setIsApplied(true);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch {}
    setTimeout(() => setIsApplied(false), 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Floating Tweaker Panel */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#0F172A]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#151F38] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Wand2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Conversational UI Tweaker
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex bg-[#090D16] p-1 border-b border-slate-800 text-[11px] font-mono font-bold">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${activeTab === 'theme' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'}`}
            >
              Colors
            </button>
            <button
              onClick={() => setActiveTab('copy')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${activeTab === 'copy' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'}`}
            >
              Live Copy
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${activeTab === 'layout' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'}`}
            >
              Layout
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
            {/* 1. Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                  Primary Chromatic Palette
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleApplyTheme(opt.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition ${
                        project.theme === opt.id
                          ? 'bg-[#151F38] border-cyan-400 text-white font-bold shadow-md shadow-cyan-500/20'
                          : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${opt.color}`} />
                      <span className="text-xs truncate font-mono">{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Copy Tab */}
            {activeTab === 'copy' && (
              <form onSubmit={handleApplyCopy} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400">Headline Override</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400">Main Button CTA</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  {isApplied ? '✔ Copy Injected!' : 'Apply Copy In Real-Time'}
                </button>
              </form>
            )}

            {/* 3. Layout Tab */}
            {activeTab === 'layout' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400">Corner Radius Curvature</label>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
                    {(['sm', 'md', 'lg', 'full'] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => setBorderRadius(r)}
                        className={`py-1.5 rounded-lg border text-center uppercase font-bold transition ${borderRadius === r ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-[#090D16] border-slate-800 text-slate-400'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400">Container Spacing Density</label>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                    {(['compact', 'normal', 'relaxed'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setSpacingDensity(s)}
                        className={`py-1.5 rounded-lg border text-center capitalize font-bold transition ${spacingDensity === s ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-[#090D16] border-slate-800 text-slate-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-2xl bg-[#0F172A]/90 hover:bg-[#151F38] border border-cyan-400/40 text-white font-mono text-xs font-bold flex items-center space-x-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition group cursor-pointer"
        title="Open Conversational UI Tweaker"
      >
        <Wand2 className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">UI Tweaker</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
      </button>
    </div>
  );
}
