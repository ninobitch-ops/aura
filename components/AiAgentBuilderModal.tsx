'use client';

import React, { useState } from 'react';
import { AppProject } from '@/types/aurabots';
import { 
  Bot, Sparkles, Cpu, Terminal, Play, Check, 
  Copy, Plus, Trash2, Zap, Settings, ShieldCheck, 
  X, RefreshCw, Layers, Code, Globe, MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiAgentBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: AppProject;
  onDeployAgentToProject?: (agent: AgentDefinition) => void;
}

export interface AgentToolBinding {
  id: string;
  name: string;
  category: string;
  description: string;
  isEnabled: boolean;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  tools: AgentToolBinding[];
  status: 'active' | 'draft';
}

const DEFAULT_TOOLS: AgentToolBinding[] = [
  { id: 'tool_web_search', name: 'Google Search Grounding', category: 'Information', description: 'Live web scraping & verified citations via Google Grounding API', isEnabled: true },
  { id: 'tool_code_exec', name: 'Sandboxed Code Interpreter', category: 'Execution', description: 'Runs Python / TypeScript in isolated secure container', isEnabled: true },
  { id: 'tool_sql_engine', name: 'Database Query Engine', category: 'Data', description: 'Executes parameterized queries against PostgreSQL / MongoDB', isEnabled: true },
  { id: 'tool_github', name: 'GitHub Git Synchronizer', category: 'DevOps', description: 'Creates branches, writes commits, and opens Pull Requests', isEnabled: false },
  { id: 'tool_stripe', name: 'Stripe Payment Processor', category: 'Fintech', description: 'Creates checkout links and queries customer invoices', isEnabled: false },
  { id: 'tool_sms', name: 'Twilio SMS Notification Relay', category: 'Messaging', description: 'Dispatches emergency SMS alerts and OTP codes', isEnabled: false },
];

export function AiAgentBuilderModal({
  isOpen,
  onClose,
  onDeployAgentToProject
}: AiAgentBuilderModalProps) {
  const [agents, setAgents] = useState<AgentDefinition[]>([
    {
      id: 'agent_architect_01',
      name: 'Aura-Architect',
      role: 'Autonomous Full-Stack Software Engineer',
      model: 'gemini-2.5-flash',
      systemPrompt: 'You are Aura-Architect, an autonomous principal engineer. Analyze requirements, design scalable TypeScript architectures, generate clean modular code with Tailwind CSS, and execute verification tests before deployment.',
      temperature: 0.2,
      maxTokens: 4096,
      tools: [...DEFAULT_TOOLS],
      status: 'active',
    },
    {
      id: 'agent_sec_audit',
      name: 'Quantum-Guard',
      role: 'SOC2 & JWT Security Auditor',
      model: 'gemini-2.5-pro',
      systemPrompt: 'Inspect codebases for OWASP Top 10 vulnerabilities, enforce JWT session expiry, validate SQL parameterization, and verify RLS access controls.',
      temperature: 0.1,
      maxTokens: 2048,
      tools: DEFAULT_TOOLS.map(t => ({ ...t, isEnabled: t.id === 'tool_code_exec' || t.id === 'tool_sql_engine' })),
      status: 'active',
    }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent_architect_01');
  const [activeTab, setActiveTab] = useState<'configure' | 'tools' | 'test'>('configure');

  // Test Sandbox State
  const [testPrompt, setTestPrompt] = useState('Audit our database schema for missing foreign key indexes and suggest a high-performance optimization.');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testTrace, setTestTrace] = useState<Array<{ step: string; type: 'thought' | 'tool' | 'output'; content: string }>>([]);

  if (!isOpen) return null;

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleUpdateCurrent = (updater: Partial<AgentDefinition>) => {
    setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, ...updater } : a));
  };

  const handleToggleTool = (toolId: string) => {
    const updatedTools = currentAgent.tools.map(t => t.id === toolId ? { ...t, isEnabled: !t.isEnabled } : t);
    handleUpdateCurrent({ tools: updatedTools });
  };

  const handleCreateNewAgent = () => {
    const newId = `agent_${Date.now()}`;
    const newAgent: AgentDefinition = {
      id: newId,
      name: `Custom-Agent-${agents.length + 1}`,
      role: 'Domain Specialist Agent',
      model: 'gemini-2.5-flash',
      systemPrompt: 'You are an autonomous AI specialist dedicated to optimizing system operations and responding with high accuracy.',
      temperature: 0.4,
      maxTokens: 2048,
      tools: [...DEFAULT_TOOLS],
      status: 'draft',
    };
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newId);
  };

  // Run Interactive Agent Execution Simulation
  const handleExecuteAgentTest = async () => {
    if (!testPrompt.trim() || isRunningTest) return;
    setIsRunningTest(true);
    setTestTrace([]);

    const traces: Array<{ step: string; type: 'thought' | 'tool' | 'output'; content: string }> = [];

    traces.push({
      step: '1. Reasoning & Context Ingestion',
      type: 'thought',
      content: `Ingested prompt: "${testPrompt}". Loading system instructions for ${currentAgent.name} using ${currentAgent.model}.`,
    });
    setTestTrace([...traces]);

    await new Promise(r => setTimeout(r, 600));

    const activeTools = currentAgent.tools.filter(t => t.isEnabled);
    if (activeTools.length > 0) {
      traces.push({
        step: `2. Autonomous Tool Invocation: [${activeTools[0].name}]`,
        type: 'tool',
        content: `Executing ${activeTools[0].name} with query: "SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY';"`,
      });
      setTestTrace([...traces]);
      await new Promise(r => setTimeout(r, 700));
    }

    traces.push({
      step: '3. Synthesis & Final Structured Response',
      type: 'output',
      content: `Analysis Complete:\n✔ Identified 2 unindexed foreign keys in table "orders" (column: user_id).\n✔ Generated migration DDL: CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);\n✔ Latency reduction estimated: ~68% on join queries.\n✔ Security validation: Passed 0 privilege escalation risks.`,
    });
    setTestTrace([...traces]);
    setIsRunningTest(false);

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#151F38] px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-400 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                <span>Autonomous AI Agent Builder</span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </h3>
              <p className="text-xs text-slate-400">Construct, configure tool bindings, and test custom autonomous AI agents</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-[#090D16] p-1 rounded-xl border border-slate-800 text-xs font-bold font-mono">
              <button
                onClick={() => setActiveTab('configure')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'configure' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Agent Config
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'tools' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Tool Bindings
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'test' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Live Testing Terminal
              </button>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Agent Selector Header Strip */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {agents.map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAgentId(a.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 ${
                    selectedAgentId === a.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-sm'
                      : 'bg-[#090D16] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>{a.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateNewAgent}
              className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center space-x-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Agent</span>
            </button>
          </div>

          {/* TAB 1: CONFIGURE AGENT */}
          {activeTab === 'configure' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Agent Identity Name</label>
                  <input
                    type="text"
                    value={currentAgent.name}
                    onChange={(e) => handleUpdateCurrent({ name: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Role / Archetype</label>
                  <input
                    type="text"
                    value={currentAgent.role}
                    onChange={(e) => handleUpdateCurrent({ role: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Reasoning Model</label>
                  <select
                    value={currentAgent.model}
                    onChange={(e) => handleUpdateCurrent({ model: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Low Latency)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (Multimodal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase font-mono">
                    <span>Temperature</span>
                    <span className="text-purple-300">{currentAgent.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={currentAgent.temperature}
                    onChange={(e) => handleUpdateCurrent({ temperature: parseFloat(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase font-mono">
                    <span>Max Context Tokens</span>
                    <span className="text-cyan-300">{currentAgent.maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="512"
                    max="8192"
                    step="512"
                    value={currentAgent.maxTokens}
                    onChange={(e) => handleUpdateCurrent({ maxTokens: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">System Prompt / Instructions</label>
                <textarea
                  value={currentAgent.systemPrompt}
                  onChange={(e) => handleUpdateCurrent({ systemPrompt: e.target.value })}
                  rows={4}
                  className="w-full bg-[#090D16] border border-slate-700 rounded-xl p-3 text-xs text-purple-200 font-mono focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TOOL BINDINGS */}
          {activeTab === 'tools' && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-slate-400">
                Equip {currentAgent.name} with autonomous tool bindings. The agent can invoke these functions dynamically during execution.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentAgent.tools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => handleToggleTool(tool.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between space-x-3 ${
                      tool.isEnabled
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-[#090D16] border-slate-800 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white font-mono">{tool.name}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{tool.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{tool.description}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${tool.isEnabled ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold' : 'border-slate-700'}`}>
                      {tool.isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE TESTING TERMINAL */}
          {activeTab === 'test' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#090D16] rounded-2xl border border-slate-800 space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase font-mono flex items-center justify-between">
                  <span>Send Test Prompt to {currentAgent.name}</span>
                  <span className="text-purple-400 font-mono text-[10px]">Model: {currentAgent.model}</span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Ask agent to perform reasoning or execute a tool..."
                    className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  />

                  <button
                    onClick={handleExecuteAgentTest}
                    disabled={isRunningTest}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isRunningTest ? 'Thinking...' : 'Run Agent'}</span>
                  </button>
                </div>
              </div>

              {/* Execution Trace */}
              {testTrace.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                    Autonomous Reasoning & Tool Trace
                  </span>
                  <div className="space-y-2">
                    {testTrace.map((trace, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border text-xs font-mono space-y-1 ${
                          trace.type === 'thought'
                            ? 'bg-[#151F38] border-purple-500/40 text-purple-300'
                            : trace.type === 'tool'
                            ? 'bg-[#091520] border-cyan-500/40 text-cyan-300'
                            : 'bg-[#091910] border-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        <div className="font-bold flex items-center space-x-2">
                          <span>{trace.step}</span>
                        </div>
                        <div className="whitespace-pre-line text-[11px] opacity-90 pl-2 border-l-2 border-current">
                          {trace.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
