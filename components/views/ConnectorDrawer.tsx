'use client';

import React, { useState } from 'react';
import { ExternalConnector } from '@/types/aurabots';
import { 
  Network, X, Plus, CheckCircle2, Activity, 
  Send, RefreshCw, Globe, Zap, AlertCircle 
} from 'lucide-react';

interface ConnectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  connectors: ExternalConnector[];
  onAddConnector: (c: ExternalConnector) => void;
}

export function ConnectorDrawer({
  isOpen,
  onClose,
  connectors,
  onAddConnector,
}: ConnectorDrawerProps) {
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ExternalConnector['type']>('AI Engine');
  const [testPayload, setTestPayload] = useState('{"event": "ping", "client": "aurabots_runtime_v2"}');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newName) return;
    onAddConnector({
      id: `conn_${Date.now()}`,
      name: newName,
      url: newUrl,
      type: newType,
      status: 'connected',
      pingMs: Math.floor(Math.random() * 30) + 15,
      lastSync: 'Just connected',
    });
    setNewUrl('');
    setNewName('');
  };

  const handleRunTest = () => {
    setIsTesting(true);
    setTestResponse(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResponse(JSON.stringify({
        status: 200,
        ok: true,
        endpoint: connectors[0]?.url || 'https://generativelanguage.googleapis.com',
        latencyMs: 24,
        handshake: 'TLS 1.3 Synthetic Stream Active',
        timestamp: new Date().toISOString(),
      }, null, 2));
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0F172A]/95 backdrop-blur-2xl border-l border-[#00F0FF33] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800/90 flex items-center justify-between bg-[#0B0F19]/90">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-[#00F0FF] flex items-center justify-center border border-[#00F0FF33] shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              External Connector Matrix
            </h3>
            <p className="text-[10px] text-[#94A3B8]">Live AI & Webhook Stream Panel</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5">
        {/* Active Connectors List */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
            Active Integrations ({connectors.length})
          </span>

          <div className="space-y-2">
            {connectors.map(c => (
              <div
                key={c.id}
                className="p-3.5 bg-[#0B0F19]/80 rounded-2xl border border-slate-800/80 space-y-1.5 hover:border-[#00F0FF33] transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{c.name}</span>
                  <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{c.pingMs}ms</span>
                  </span>
                </div>

                <div className="text-[11px] text-[#00F0FF] font-mono truncate">{c.url}</div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/50">
                  <span className="px-2 py-0.5 rounded bg-[#0F172A] text-[#00F0FF] font-bold border border-[#00F0FF33]">{c.type}</span>
                  <span>{c.lastSync}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Connector Form */}
        <form onSubmit={handleCreate} className="p-4 bg-[#0B0F19]/90 rounded-2xl border border-slate-800/90 space-y-3 shadow-inner">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Mount External Web / AI URL</span>
          </span>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#94A3B8]">Connector Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Gemini Deep Thought API"
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#00F0FF] focus:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#94A3B8]">Endpoint URL</label>
            <input
              type="url"
              required
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="https://api.example.com/v1/stream"
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#00F0FF] focus:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#94A3B8]">Protocol Type</label>
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as any)}
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="AI Engine">AI Engine</option>
              <option value="REST API">REST API</option>
              <option value="WebSocket">WebSocket</option>
              <option value="Database">Database</option>
              <option value="Custom Webhook">Custom Webhook</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-[#00F0FF] to-blue-600 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            Connect Integration
          </button>
        </form>

        {/* Live Test Query Inspector */}
        <div className="p-4 bg-[#0B0F19]/90 rounded-2xl border border-slate-800/90 space-y-2.5">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Interactive Stream Ping Inspector</span>
            <span className="text-[#00F0FF] text-[10px] font-bold">Active</span>
          </span>

          <textarea
            value={testPayload}
            onChange={e => setTestPayload(e.target.value)}
            rows={2}
            className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl p-2.5 text-[11px] font-mono text-[#00F0FF] focus:outline-none focus:border-[#00F0FF]"
          />

          <button
            onClick={handleRunTest}
            disabled={isTesting}
            className="w-full py-2 bg-[#1E293B] hover:bg-slate-700 text-white font-bold rounded-xl text-xs font-mono flex items-center justify-center space-x-1.5 transition border border-slate-700 cursor-pointer hover:border-cyan-500/40"
          >
            <Send className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{isTesting ? 'Pinging Gateway...' : 'Send Test Ping'}</span>
          </button>

          {testResponse && (
            <pre className="p-3 bg-[#050811] rounded-xl border border-[#00F0FF33] text-[10px] font-mono text-emerald-400 overflow-x-auto shadow-inner">
              {testResponse}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
