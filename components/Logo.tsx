'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animate?: boolean;
}

export function Logo({ size = 'md', showText = true, animate = true }: LogoProps) {
  const sizeMap = {
    sm: { box: 28, text: 'text-sm' },
    md: { box: 36, text: 'text-lg' },
    lg: { box: 48, text: 'text-2xl' },
    xl: { box: 64, text: 'text-3xl' },
  };

  const { box, text } = sizeMap[size];

  return (
    <div id="aurabots-brand-logo" className="flex items-center space-x-2.5 select-none group cursor-pointer">
      {/* 3D Glassmorphic "A" with glowing neon infinity loop mark */}
      <div 
        style={{ width: box, height: box }}
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0F172A] via-[#151F38] to-[#0A1020] border border-cyan-400/40 shadow-lg shadow-cyan-500/10 overflow-visible transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-300"
      >
        <svg 
          viewBox="0 0 100 100" 
          className={`w-full h-full p-1.5 ${animate ? 'neon-logo-pulse' : ''}`}
        >
          <defs>
            {/* Dark Titanium Beam Gradient */}
            <linearGradient id="titanium-beam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Glowing Electric Cyan to Purple Infinity Loop Gradient */}
            <linearGradient id="infinity-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* Cyan Glow Filter */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Titanium Leg */}
          <path
            d="M 50 15 L 20 85 L 32 85 L 50 38 Z"
            fill="url(#titanium-beam)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Right Titanium Leg */}
          <path
            d="M 50 15 L 80 85 L 68 85 L 50 38 Z"
            fill="url(#titanium-beam)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Apex Crystal Node */}
          <polygon
            points="50,12 55,20 50,26 45,20"
            fill="#00F0FF"
            filter="url(#neon-glow)"
          />

          {/* Intertwined Glowing Infinity Loop (Crossbar) */}
          <path
            d="M 50 55 C 38 42, 22 45, 22 55 C 22 65, 38 68, 50 55 C 62 42, 78 45, 78 55 C 78 65, 62 68, 50 55 Z"
            fill="none"
            stroke="url(#infinity-glow)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon-glow)"
          />

          {/* Core Quantum Spark */}
          <circle cx="50" cy="55" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className={`font-black tracking-widest text-white uppercase ${text} font-mono flex items-center`}>
              AURA<span className="text-cyan-400 text-glow-cyan">BOTS</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono font-bold tracking-tighter">
              v2.5
            </span>
          </div>
          <span className="text-[10px] text-slate-400 tracking-wider font-medium">
            NATIVE SYNTHESIS ENGINE
          </span>
        </div>
      )}
    </div>
  );
}
