'use client';

import React, { useState } from 'react';
import { AppProject } from '@/types/aurabots';
import { buildSandboxHtml } from '@/lib/compiler/sandboxBundler';
import { 
  Monitor, Smartphone, Tablet, RotateCw, RefreshCw, 
  Wifi, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, 
  ExternalLink, Maximize2, Zap, CheckCircle2
} from 'lucide-react';

interface PreviewPageViewProps {
  project: AppProject;
  onBackToMedia: () => void;
  onNextToPublish: () => void;
}

export function PreviewPageView({
  project,
  onBackToMedia,
  onNextToPublish,
}: PreviewPageViewProps) {
  const [deviceFrame, setDeviceFrame] = useState<'desktop-4k' | 'ipad-pro' | 'iphone-16' | 'pixel-9'>('desktop-4k');
  const [isLandscape, setIsLandscape] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<'5g' | '4g' | 'offline'>('5g');
  const [key, setKey] = useState(0);

  const sandboxHtml = buildSandboxHtml(project);

  return (
    <div id="aurabots-preview-page-view" className="flex-1 flex flex-col min-h-0 bg-[#070B14] overflow-hidden">
      {/* Top Preview Control Bar */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <span>Interactive 3D / 4K Preview</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Step 3 of 4
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">High-fidelity multi-device sandbox execution</p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center space-x-1.5 bg-[#090D16] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceFrame('desktop-4k')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceFrame === 'desktop-4k'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">4K Desktop</span>
          </button>

          <button
            onClick={() => setDeviceFrame('ipad-pro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceFrame === 'ipad-pro'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">iPad Pro 12.9&quot;</span>
          </button>

          <button
            onClick={() => setDeviceFrame('iphone-16')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceFrame === 'iphone-16'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">iPhone 16 Pro</span>
          </button>

          <button
            onClick={() => setDeviceFrame('pixel-9')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceFrame === 'pixel-9'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pixel 9 Pro</span>
          </button>
        </div>

        {/* Network & Orientation Controls */}
        <div className="flex items-center space-x-2">
          {/* Network Throttling Simulation */}
          <div className="flex items-center space-x-1 bg-[#090D16] px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={networkSpeed}
              onChange={(e: any) => setNetworkSpeed(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="5g" className="bg-[#090D16]">Ultra 5G</option>
              <option value="4g" className="bg-[#090D16]">Fast 4G</option>
              <option value="offline" className="bg-[#090D16]">Offline PWA</option>
            </select>
          </div>

          {(deviceFrame === 'iphone-16' || deviceFrame === 'pixel-9' || deviceFrame === 'ipad-pro') && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className={`p-1.5 rounded-lg border transition ${
                isLandscape ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Rotate Device"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setKey(k => k + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            title="Reload Sandbox"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Sandbox Stage */}
      <div className="flex-1 bg-[#050811] p-4 sm:p-6 flex items-center justify-center overflow-auto relative">
        {/* FRAME 1: 4K DESKTOP VIEW */}
        {deviceFrame === 'desktop-4k' && (
          <div className="w-full h-full max-w-6xl rounded-2xl border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden bg-[#090D16] flex flex-col animate-in fade-in zoom-in-95">
            {/* Fake Desktop Title Bar */}
            <div className="bg-[#0F172A] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              <div className="flex items-center space-x-2 bg-[#151F38] px-4 py-1 rounded-lg border border-slate-700/60 text-xs font-mono text-cyan-300 max-w-md w-full truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-500 select-none">https://</span>
                <span className="truncate">{project.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.aurabots.app</span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">4K Ultra HD (3840×2160)</div>
            </div>

            <iframe
              key={`desktop-4k-${key}`}
              srcDoc={sandboxHtml}
              title="4K Desktop Sandbox"
              className="w-full h-full border-none flex-1"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
            />
          </div>
        )}

        {/* FRAME 2: IPAD PRO 12.9" */}
        {deviceFrame === 'ipad-pro' && (
          <div 
            style={{
              width: isLandscape ? 820 : 620,
              height: isLandscape ? 600 : 780,
            }}
            className="relative bg-[#020408] rounded-[42px] p-4 border-[8px] border-[#1E293B] shadow-2xl flex flex-col transition-all duration-300 animate-in fade-in"
          >
            <div className="w-full h-full rounded-[30px] overflow-hidden bg-[#090D16] flex flex-col relative">
              <iframe
                key={`ipad-${key}`}
                srcDoc={sandboxHtml}
                title="iPad Pro Preview"
                className="w-full h-full border-none flex-1"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
              />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-40 h-1 bg-slate-500/80 rounded-full z-20 pointer-events-none" />
            </div>
          </div>
        )}

        {/* FRAME 3: IPHONE 16 PRO MAX */}
        {deviceFrame === 'iphone-16' && (
          <div 
            style={{
              width: isLandscape ? 720 : 380,
              height: isLandscape ? 380 : 760,
            }}
            className="relative bg-[#020408] rounded-[52px] p-4 border-[6px] border-[#1E293B] shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col transition-all duration-300 animate-in fade-in"
          >
            {/* Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            <div className="w-full h-full rounded-[42px] overflow-hidden bg-[#090D16] flex flex-col relative">
              <iframe
                key={`iphone-${key}`}
                srcDoc={sandboxHtml}
                title="iPhone 16 Pro Sandbox"
                className="w-full h-full border-none pt-5 flex-1"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
              />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-500/80 rounded-full z-20 pointer-events-none" />
            </div>
          </div>
        )}

        {/* FRAME 4: PIXEL 9 PRO */}
        {deviceFrame === 'pixel-9' && (
          <div 
            style={{
              width: isLandscape ? 720 : 380,
              height: isLandscape ? 380 : 760,
            }}
            className="relative bg-[#090D16] rounded-[40px] p-3.5 border-[6px] border-[#334155] shadow-2xl flex flex-col transition-all duration-300 animate-in fade-in"
          >
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-20 border border-slate-800" />
            <div className="w-full h-full rounded-[28px] overflow-hidden bg-[#090D16] flex flex-col">
              <iframe
                key={`pixel-${key}`}
                srcDoc={sandboxHtml}
                title="Pixel 9 Pro Sandbox"
                className="w-full h-full border-none pt-4 flex-1"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="sticky bottom-0 z-30 bg-[#090D16]/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={onBackToMedia}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Media Studio</span>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>All Device Tests Passed & Verified</span>
        </div>

        <button
          id="btn-preview-next-step"
          onClick={onNextToPublish}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <span>Next: Publish & Distribution Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
