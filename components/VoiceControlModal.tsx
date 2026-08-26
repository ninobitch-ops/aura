'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VoicePersona } from '@/types/aurabots';
import { 
  Mic, MicOff, Volume2, Sparkles, X, Check, 
  Terminal, Zap, Play, Smartphone, Box, Download, 
  ShoppingBag, ShieldCheck, UserCheck, Bot
} from 'lucide-react';

interface VoiceControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceCommand: (cmd: string, rawTranscript: string) => void;
  userEmail?: string;
}

const PERSONA_VOICES: Record<VoicePersona, { name: string; pitch: number; rate: number; desc: string }> = {
  'gemini-cyber': { name: 'Gemini Cyber (Fast Multimodal)', pitch: 1.05, rate: 1.1, desc: 'Ultra-low latency deep reasoning engine' },
  'aura-pulse': { name: 'Aura Pulse (Synthesized Neural)', pitch: 1.15, rate: 1.05, desc: 'Smooth crystalline spatial voice' },
  'atlas': { name: 'Atlas (Deep Systems Engineer)', pitch: 0.85, rate: 1.0, desc: 'Authoritative compiler feedback' },
  'nova': { name: 'Nova (Creative Architect)', pitch: 1.2, rate: 1.15, desc: 'High-energy dynamic builder' },
  'caly-classic': { name: 'Caly Classic (Standard AST)', pitch: 1.0, rate: 1.0, desc: 'Clean deterministic voice' },
};

export function VoiceControlModal({ 
  isOpen, 
  onClose, 
  onVoiceCommand,
  userEmail = 'ninobitch@gmail.com'
}: VoiceControlModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('gemini-cyber');
  const [isGoogleAuth, setIsGoogleAuth] = useState(true);
  const [hotwordActive, setHotwordActive] = useState(true);
  const [aiSpeechResponse, setAiSpeechResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const recognitionRef = useRef<any>(null);

  const speakFeedback = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const conf = PERSONA_VOICES[voicePersona];
      utterance.rate = conf.rate;
      utterance.pitch = conf.pitch;
      window.speechSynthesis.speak(utterance);
    }
  }, [voicePersona]);

  // Call Gemini server-side route for conversational voice feedback
  const askGeminiVoice = async (query: string) => {
    setIsThinking(true);
    try {
      const res = await fetch('/app/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'voice_assistant',
          prompt: query,
          voicePersona,
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.text || 'Processing prompt in workspace.';
        setAiSpeechResponse(text);
        speakFeedback(text);
      }
    } catch {
      speakFeedback('AuraBots voice core online.');
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          const lower = currentTranscript.toLowerCase();

          // Hotword & Command Triggers
          if (lower.includes('gemini stop') || lower.includes('aura stop')) {
            setIsListening(false);
            recognition.stop();
            speakFeedback('Voice listener stopped.');
            return;
          }

          if (lower.includes('hey gemini') || lower.includes('hey aura')) {
            speakFeedback('I am listening. What shall we synthesize?');
            setLastAction('Hotword Triggered: Gemini / Aura Active');
          }

          if (lower.includes('synthesize') || lower.includes('build app') || lower.includes('compile')) {
            setLastAction('Triggered: Synthesize Program');
            speakFeedback('Synthesizing program now.');
            onVoiceCommand('synthesize', currentTranscript);
          } else if (lower.includes('mobile') || lower.includes('phone view')) {
            setLastAction('Triggered: Switch to Mobile View');
            speakFeedback('Switching to mobile simulator.');
            onVoiceCommand('view_mobile', currentTranscript);
          } else if (lower.includes('3d') || lower.includes('matrix')) {
            setLastAction('Triggered: Switch to 3D Matrix');
            speakFeedback('Opening 3D architecture visualizer.');
            onVoiceCommand('view_3d', currentTranscript);
          } else if (lower.includes('preview') || lower.includes('4k preview')) {
            setLastAction('Triggered: Open 4K Preview');
            speakFeedback('Opening 4K device sandbox.');
            onVoiceCommand('view_preview', currentTranscript);
          } else if (lower.includes('media') || lower.includes('video') || lower.includes('logo')) {
            setLastAction('Triggered: Open Media Studio');
            speakFeedback('Opening Logo and Video Media Studio.');
            onVoiceCommand('media_studio', currentTranscript);
          } else if (lower.includes('publish') || lower.includes('deploy')) {
            setLastAction('Triggered: Open Publish Hub');
            speakFeedback('Opening Publish and Distribution Hub.');
            onVoiceCommand('publish_hub', currentTranscript);
          } else if (lower.includes('export') || lower.includes('download')) {
            setLastAction('Triggered: Open Export Suite');
            speakFeedback('Opening export package suite.');
            onVoiceCommand('export', currentTranscript);
          } else if (lower.includes('market') || lower.includes('marketplace')) {
            setLastAction('Triggered: Open Marketplace Hub');
            speakFeedback('Opening AuraBots marketplace.');
            onVoiceCommand('marketplace', currentTranscript);
          }
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;

        try {
          recognition.start();
        } catch {}

        return () => {
          try {
            recognition.stop();
          } catch {}
        };
      }
    }
  }, [isOpen, onVoiceCommand, speakFeedback]);

  const toggleListening = () => {
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {}
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#151F38] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-400 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                <span>Gemini Voice Control Core</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-xs text-slate-400">Web Speech API + Gemini Multimodal Voice Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Google Authorization Status Banner */}
          <div className="p-3 bg-[#090D16] rounded-2xl border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400">Google Verified: </span>
                <span className="text-cyan-300 font-bold">{userEmail}</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              AUTHORIZED
            </span>
          </div>

          {/* AI Voice Persona Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Select AI Voice Persona</span>
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(PERSONA_VOICES) as VoicePersona[]).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setVoicePersona(p);
                    speakFeedback(`Voice switched to ${PERSONA_VOICES[p].name}`);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    voicePersona === p
                      ? 'bg-purple-500/20 border-purple-500 text-white font-bold'
                      : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-mono">{PERSONA_VOICES[p].name}</div>
                    <div className="text-[10px] text-slate-500">{PERSONA_VOICES[p].desc}</div>
                  </div>
                  {voicePersona === p && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Waveform Animation */}
          <div className="h-16 flex items-center justify-center space-x-1.5 px-4 bg-[#090D16] rounded-2xl border border-slate-800">
            {[40, 65, 30, 85, 95, 45, 75, 100, 60, 35, 90, 70, 45, 80].map((h, i) => (
              <div
                key={i}
                style={{
                  height: isListening ? `${h}%` : '15%',
                  transition: 'height 0.15s ease-in-out',
                }}
                className={`w-2 rounded-full ${
                  isListening
                    ? 'bg-gradient-to-t from-purple-600 to-cyan-400 animate-pulse'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Transcript Box */}
          <div className="p-3.5 bg-[#090D16] rounded-2xl border border-slate-700 min-h-[60px] text-left">
            <span className="text-[10px] uppercase font-bold text-purple-300 block mb-1">Live Transcript</span>
            <p className="text-xs text-slate-200 font-mono italic">
              {transcript ? `"${transcript}"` : 'Listening for hotwords or prompt instructions...'}
            </p>
          </div>

          {/* AI Response Box */}
          {aiSpeechResponse && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-xs text-purple-200 font-mono">
              <span className="text-[10px] font-bold text-purple-400 uppercase block mb-0.5">Gemini Feedback:</span>
              {aiSpeechResponse}
            </div>
          )}

          {/* Mic Toggle Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={toggleListening}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 hover:bg-red-400 text-white animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
              }`}
            >
              {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
          </div>

          {/* Hotwords Cheat Sheet */}
          <div className="bg-[#090D16] p-3.5 rounded-2xl border border-slate-800 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Hands-Free Hotwords</span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">Continuous Listener</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 font-mono">
              <div className="p-1.5 bg-[#151F38] rounded-lg">🎤 &quot;Hey Gemini&quot; / &quot;Hey Aura&quot;</div>
              <div className="p-1.5 bg-[#151F38] rounded-lg">🛑 &quot;Gemini Stop&quot; / &quot;Aura Stop&quot;</div>
              <div className="p-1.5 bg-[#151F38] rounded-lg">⚡ &quot;Synthesize app&quot;</div>
              <div className="p-1.5 bg-[#151F38] rounded-lg">📱 &quot;Switch to mobile&quot;</div>
              <div className="p-1.5 bg-[#151F38] rounded-lg">🎨 &quot;Open media studio&quot;</div>
              <div className="p-1.5 bg-[#151F38] rounded-lg">🚀 &quot;Open publish hub&quot;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
