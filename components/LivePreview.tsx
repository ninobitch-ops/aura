'use client';

import React, { useState, useRef } from 'react';
import { AppProject, PlatformType } from '@/types/aurabots';
import { buildSandboxHtml } from '@/lib/compiler/sandboxBundler';
import { 
  Monitor, Smartphone, Columns, RotateCw, RefreshCw, 
  ExternalLink, Maximize2, ShieldCheck, Sparkles, Sliders
} from 'lucide-react';

interface LivePreviewProps {
  project: AppProject;
  platform: PlatformType;
  onPlatformChange: (p: PlatformType) => void;
}

export function LivePreview({ project, platform, onPlatformChange }: LivePreviewProps) {
  const [deviceType, setDeviceType] = useState<'desktop' | 'ios' | 'android' | 'hybrid'>(
    platform === 'mobile' ? 'ios' : platform === 'hybrid' ? 'hybrid' : 'desktop'
  );
  const [isLandscape, setIsLandscape] = useState(false);
  const [key, setKey] = useState(0);

  const sandboxHtml = buildSandboxHtml(project);

  const handleRefresh = () => {
    setKey(k => k + 1);
  };

  return (
    <div id="aurabots-live-preview-container" className="flex flex-col h-full bg-[#090D16] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Device Toolbar */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        {/* Left: Device Switcher */}
        <div className="flex items-center space-x-1 bg-[#090D16] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceType('desktop')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceType === 'desktop'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDeviceType('ios')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceType === 'ios'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iPhone 16</span>
          </button>

          <button
            onClick={() => setDeviceType('android')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceType === 'android'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pixel Pro</span>
          </button>

          <button
            onClick={() => setDeviceType('hybrid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceType === 'hybrid'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hybrid Split</span>
          </button>
        </div>

        {/* Center: Fake Address Bar */}
        <div className="hidden md:flex items-center space-x-2 bg-[#151F38] px-3 py-1 rounded-lg border border-slate-700/60 text-xs text-slate-300 font-mono flex-1 max-w-sm mx-2 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="text-slate-500 select-none">https://</span>
          <span className="text-cyan-300 truncate">{project.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.aurabots.app</span>
        </div>

        {/* Right: Refresh & Orientations */}
        <div className="flex items-center space-x-1.5">
          {(deviceType === 'ios' || deviceType === 'android') && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className={`p-1.5 rounded-lg border transition ${
                isLandscape ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Rotate Device Orientation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            title="Reload Sandbox Runtime"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Stage */}
      <div className="flex-1 bg-[#050811] p-4 flex items-center justify-center overflow-auto relative cyber-grid">
        {/* VIEW 1: DESKTOP VIEW */}
        {deviceType === 'desktop' && (
          <div className="w-full h-full max-w-5xl rounded-xl border border-slate-800 shadow-2xl overflow-hidden bg-[#090D16] flex flex-col">
            <iframe
              key={`desktop-${key}`}
              srcDoc={sandboxHtml}
              title="AuraBots Live Web Preview"
              className="w-full h-full border-none flex-1"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
            />
          </div>
        )}

        {/* VIEW 2: NATIVE MOBILE SIMULATOR (iOS iPhone 16 Pro) */}
        {deviceType === 'ios' && (
          <div 
            style={{
              width: isLandscape ? 680 : 360,
              height: isLandscape ? 360 : 700,
            }}
            className="relative bg-[#020408] rounded-[48px] p-3.5 border-[6px] border-[#1E293B] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-300"
          >
            {/* Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            </div>

            {/* Screen Container */}
            <div className="w-full h-full rounded-[38px] overflow-hidden bg-[#090D16] flex flex-col relative">
              <iframe
                key={`ios-${key}`}
                srcDoc={sandboxHtml}
                title="AuraBots iOS Simulator"
                className="w-full h-full border-none pt-4 flex-1"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
              />
              {/* Home Indicator Bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-500/80 rounded-full z-20 pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* VIEW 3: NATIVE MOBILE SIMULATOR (Android Pixel Pro) */}
        {deviceType === 'android' && (
          <div 
            style={{
              width: isLandscape ? 680 : 360,
              height: isLandscape ? 360 : 700,
            }}
            className="relative bg-[#090D16] rounded-[36px] p-3 border-[5px] border-[#334155] shadow-2xl flex flex-col transition-all duration-300"
          >
            {/* Camera Punch Hole */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-20 border border-slate-800"></div>

            {/* Screen */}
            <div className="w-full h-full rounded-[26px] overflow-hidden bg-[#090D16] flex flex-col">
              <iframe
                key={`android-${key}`}
                srcDoc={sandboxHtml}
                title="AuraBots Android Simulator"
                className="w-full h-full border-none pt-4 flex-1"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
              />
            </div>
          </div>
        )}

        {/* VIEW 4: SYNCHRONIZED HYBRID SPLIT VIEW */}
        {deviceType === 'hybrid' && (
          <div className="w-full h-full flex flex-col lg:flex-row gap-4 items-center justify-center max-w-6xl">
            {/* Web View Card */}
            <div className="flex-1 w-full h-[550px] rounded-2xl border border-slate-800 shadow-xl overflow-hidden bg-[#090D16] flex flex-col">
              <div className="bg-[#0F172A] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center space-x-1">
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Web App View</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">100% Fluid</span>
              </div>
              <iframe
                key={`hybrid-web-${key}`}
                srcDoc={sandboxHtml}
                title="Hybrid Web"
                className="w-full h-full border-none flex-1"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
              />
            </div>

            {/* Mobile View Card */}
            <div className="w-[320px] h-[550px] rounded-[36px] p-2.5 bg-[#020408] border-[4px] border-slate-700 shadow-2xl flex flex-col relative flex-shrink-0">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20"></div>
              <div className="w-full h-full rounded-[28px] overflow-hidden bg-[#090D16] flex flex-col">
                <iframe
                  key={`hybrid-mobile-${key}`}
                  srcDoc={sandboxHtml}
                  title="Hybrid Mobile"
                  className="w-full h-full border-none pt-3 flex-1"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
