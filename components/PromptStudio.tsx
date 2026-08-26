'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PlatformType, FrameworkType, ThemePreset } from '@/types/aurabots';
import { 
  Sparkles, Mic, MicOff, Send, Cpu, Sliders, 
  Layers, Palette, Smartphone, Monitor, Columns, Zap,
  Compass, Flame, Shield, Play
} from 'lucide-react';

interface PromptStudioProps {
  prompt: string;
  onPromptChange: (p: string) => void;
  onSynthesize: (options?: { platform?: PlatformType; theme?: ThemePreset }) => void;
  isCompiling: boolean;
  platform: PlatformType;
  onPlatformChange: (p: PlatformType) => void;
  theme: ThemePreset;
  onThemeChange: (t: ThemePreset) => void;
  onOpenVoice: () => void;
}

export function PromptStudio({
  prompt,
  onPromptChange,
  onSynthesize,
  isCompiling,
  platform,
  onPlatformChange,
  theme,
  onThemeChange,
  onOpenVoice,
}: PromptStudioProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    }
    return false;
  });
  const recognitionRef = useRef<any>(null);

  const presets = [
    {
      label: 'DeFi Crypto Vault',
      icon: '✦',
      prompt: 'Build a decentralized DeFi portfolio & crypto wallet terminal with live candlestick charts, token swap engine, staking yield multiplier, and electric cyan glow.',
      platform: 'hybrid' as PlatformType,
      theme: 'electric-cyan' as ThemePreset,
    },
    {
      label: 'PulseFit Pro Biometrics',
      icon: '🔥',
      prompt: 'Create a mobile-first fitness tracker with HIIT interval timer, heart-rate zones, workout logbook with set tracking, hydration counter, and calorie progress rings.',
      platform: 'mobile' as PlatformType,
      theme: 'neon-purple' as ThemePreset,
    },
    {
      label: 'Smart Home IoT Grid',
      icon: '⚡',
      prompt: 'Synthesize a futuristic smart home dashboard with interactive room lighting controls, radial climate thermostat dial, live solar & power usage graphs, smart security locks, and scene automations.',
      platform: 'web' as PlatformType,
      theme: 'emerald-matrix' as ThemePreset,
    },
    {
      label: 'CyberSprint Agile Kanban',
      icon: '📋',
      prompt: 'Build an agile project management app with interactive kanban columns (Backlog, In Progress, Code Review, Done), task creation modal with priority flags, and sprint velocity stats.',
      platform: 'hybrid' as PlatformType,
      theme: 'cobalt-blue' as ThemePreset,
    },
    {
      label: 'Apex HypeDrop Sneaker Vault',
      icon: '👟',
      prompt: 'Create a high-fashion streetwear e-commerce app with live drop countdown, interactive sneaker card gallery, size selector with stock indicators, sliding cart drawer, and instant checkout.',
      platform: 'mobile' as PlatformType,
      theme: 'sunset-amber' as ThemePreset,
    },
    {
      label: 'OmniChat Voice Nexus',
      icon: '💬',
      prompt: 'Build a modern encrypted messaging app with direct messages and server channels, interactive voice message recorder with audio waveforms, emoji reactions, and typing indicators.',
      platform: 'hybrid' as PlatformType,
      theme: 'electric-cyan' as ThemePreset,
    },
    {
      label: 'NeonWave Beat Synth',
      icon: '🎹',
      prompt: 'Synthesize a Web Audio polyphonic synthesizer and 16-step beat drum sequencer with interactive piano keys, waveform selector, filter dials, and tempo controls.',
      platform: 'web' as PlatformType,
      theme: 'electric-cyan' as ThemePreset,
    },
  ];

  const promptRef = useRef(prompt);
  promptRef.current = prompt;
  const onPromptChangeRef = useRef(onPromptChange);
  onPromptChangeRef.current = onPromptChange;

  // Initialize Speech Recognition for prompt dictation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            const currentPrompt = promptRef.current;
            onPromptChangeRef.current(currentPrompt ? `${currentPrompt} ${finalTranscript}` : finalTranscript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
          try {
            recognition.stop();
          } catch {}
        };
      }
    }
  }, []);

  const toggleMic = () => {
    if (!speechSupported) {
      onOpenVoice();
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleApplyPreset = (p: typeof presets[0]) => {
    onPromptChange(p.prompt);
    onPlatformChange(p.platform);
    onThemeChange(p.theme);
  };

  return (
    <div id="aurabots-prompt-studio" className="bg-[#090D16] border-b border-slate-800 p-4 lg:p-6 space-y-4">
      {/* Studio Banner & Preset Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Prompt-Driven Program Compilation Engine
          </span>
        </div>

        {/* Preset Archetype Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-[#0F172A] hover:bg-[#151F38] border border-slate-800 hover:border-cyan-500/40 text-[11px] font-medium text-slate-300 transition flex items-center space-x-1.5 whitespace-nowrap"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Composer Box */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#121B30] to-[#0A0F1E] border border-cyan-500/30 p-3 shadow-2xl focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
        <textarea
          id="prompt-input-area"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe your desired web or native mobile application in plain natural language (e.g. 'Build a high-performance crypto wallet terminal with live candlestick charts and token swap engine')..."
          rows={3}
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-sans leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSynthesize();
            }
          }}
        />

        {/* Bottom Bar inside Composer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            {/* Voice Dictation Button */}
            <button
              id="btn-dictation-toggle"
              onClick={toggleMic}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                isListening
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {isListening ? <Mic className="w-3.5 h-3.5 text-red-400" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Listening...' : 'Voice Prompt'}</span>
            </button>

            {/* Platform Selector */}
            <div className="flex bg-[#090D16] p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => onPlatformChange('web')}
                className={`px-2 py-1 rounded-md transition ${platform === 'web' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                Web
              </button>
              <button
                onClick={() => onPlatformChange('mobile')}
                className={`px-2 py-1 rounded-md transition ${platform === 'mobile' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-400'}`}
              >
                Mobile
              </button>
              <button
                onClick={() => onPlatformChange('hybrid')}
                className={`px-2 py-1 rounded-md transition ${platform === 'hybrid' ? 'bg-blue-500/20 text-blue-300 font-bold' : 'text-slate-400'}`}
              >
                Hybrid
              </button>
            </div>

            {/* Theme Preset Selector */}
            <div className="hidden sm:flex items-center space-x-1 pl-2">
              {[
                { id: 'electric-cyan', color: 'bg-cyan-400', label: 'Cyan' },
                { id: 'neon-purple', color: 'bg-purple-500', label: 'Purple' },
                { id: 'emerald-matrix', color: 'bg-emerald-400', label: 'Emerald' },
                { id: 'sunset-amber', color: 'bg-amber-400', label: 'Amber' },
                { id: 'cobalt-blue', color: 'bg-blue-500', label: 'Cobalt' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t.id as ThemePreset)}
                  title={`Theme: ${t.label}`}
                  className={`w-5 h-5 rounded-full ${t.color} transition-all ${
                    theme === t.id ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Synthesize Button */}
          <button
            id="btn-synthesize-app"
            disabled={isCompiling || !prompt.trim()}
            onClick={() => onSynthesize()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-xl shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isCompiling ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                <span>Synthesizing Program...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Synthesize App</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
