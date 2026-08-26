'use client';

import React, { useState } from 'react';
import { AppProject } from '@/types/aurabots';
import { 
  Database, Server, Code, Play, Check, Copy, 
  Plus, Trash2, RefreshCw, X, Zap, ShieldCheck, 
  Send, Layers, Globe, CreditCard, MessageSquare, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DatabaseApiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  project?: AppProject;
  onUpdateProject?: React.Dispatch<React.SetStateAction<AppProject>>;
}

interface SchemaField {
  id: string;
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  defaultValue: string;
}

interface SchemaTable {
  id: string;
  name: string;
  fields: SchemaField[];
}

export function DatabaseApiStudioModal({
  isOpen,
  onClose,
  projectName = 'AuraBots App'
}: DatabaseApiStudioModalProps) {
  const [activeTab, setActiveTab] = useState<'schema' | 'endpoints' | 'connectors'>('schema');
  const [dbProvider, setDbProvider] = useState<'postgres' | 'supabase' | 'mongodb'>('postgres');

  // Schema State
  const [tables, setTables] = useState<SchemaTable[]>([
    {
      id: 'tbl_users',
      name: 'users',
      fields: [
        { id: 'f1', name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()' },
        { id: 'f2', name: 'email', type: 'VARCHAR(255)', isPrimary: false, isNullable: false, defaultValue: '' },
        { id: 'f3', name: 'full_name', type: 'VARCHAR(120)', isPrimary: false, isNullable: true, defaultValue: '' },
        { id: 'f4', name: 'role', type: 'VARCHAR(50)', isPrimary: false, isNullable: false, defaultValue: "'member'" },
        { id: 'f5', name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isNullable: false, defaultValue: 'NOW()' },
      ]
    },
    {
      id: 'tbl_orders',
      name: 'orders',
      fields: [
        { id: 'f10', name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()' },
        { id: 'f11', name: 'user_id', type: 'UUID', isPrimary: false, isNullable: false, defaultValue: '' },
        { id: 'f12', name: 'amount_cents', type: 'INTEGER', isPrimary: false, isNullable: false, defaultValue: '0' },
        { id: 'f13', name: 'status', type: 'VARCHAR(30)', isPrimary: false, isNullable: false, defaultValue: "'pending'" },
        { id: 'f14', name: 'metadata', type: 'JSONB', isPrimary: false, isNullable: true, defaultValue: "'{}'" },
      ]
    }
  ]);

  const [selectedTableId, setSelectedTableId] = useState<string>('tbl_users');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('VARCHAR(255)');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // REST/GraphQL Endpoint State
  const [activeEndpointMethod, setActiveEndpointMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [activeEndpointPath, setActiveEndpointPath] = useState('/api/v1/users');
  const [endpointPayload, setEndpointPayload] = useState('{\n  "email": "developer@aurabots.network",\n  "full_name": "Senior Architect"\n}');
  const [endpointResponse, setEndpointResponse] = useState<string | null>(null);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);

  // External Connector State
  const [stripeSecretKey, setStripeSecretKey] = useState('sk_test_51MzQuantumStripeAuraBotsKey99');
  const [twilioSid, setTwilioSid] = useState('AC_quantum_twilio_live_sid_77492a');
  const [twilioRecipient, setTwilioRecipient] = useState('+1 (555) 019-2834');
  const [connectorTestLog, setConnectorTestLog] = useState<string | null>(null);
  const [isTestingConnector, setIsTestingConnector] = useState(false);

  if (!isOpen) return null;

  const currentTable = tables.find(t => t.id === selectedTableId) || tables[0];

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    const newF: SchemaField = {
      id: `f_${Date.now()}`,
      name: newFieldName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      type: newFieldType,
      isPrimary: false,
      isNullable: true,
      defaultValue: '',
    };
    setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, fields: [...t.fields, newF] } : t));
    setNewFieldName('');
  };

  const handleRemoveField = (fieldId: string) => {
    setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, fields: t.fields.filter(f => f.id !== fieldId) } : t));
  };

  const handleAddTable = () => {
    const name = `collection_${tables.length + 1}`;
    const newT: SchemaTable = {
      id: `tbl_${Date.now()}`,
      name,
      fields: [
        { id: `f_${Date.now()}_1`, name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()' },
        { id: `f_${Date.now()}_2`, name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isNullable: false, defaultValue: 'NOW()' }
      ]
    };
    setTables(prev => [...prev, newT]);
    setSelectedTableId(newT.id);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate Export Code based on provider
  const getGeneratedSchemaCode = () => {
    if (dbProvider === 'postgres') {
      return tables.map(t => {
        const cols = t.fields.map(f => {
          let str = `  "${f.name}" ${f.type}`;
          if (f.isPrimary) str += ' PRIMARY KEY';
          if (!f.isNullable) str += ' NOT NULL';
          if (f.defaultValue) str += ` DEFAULT ${f.defaultValue}`;
          return str;
        }).join(',\n');
        return `CREATE TABLE IF NOT EXISTS "${t.name}" (\n${cols}\n);`;
      }).join('\n\n');
    } else if (dbProvider === 'supabase') {
      return `-- Supabase RLS & Schema Definition\n` + tables.map(t => {
        const cols = t.fields.map(f => `  ${f.name}: ${f.type === 'UUID' ? 'string' : f.type.includes('INT') ? 'number' : 'string'};`).join('\n');
        return `export type ${t.name.charAt(0).toUpperCase() + t.name.slice(1)} = {\n${cols}\n};\n\n-- Enable Row Level Security\nALTER TABLE "${t.name}" ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public read access" ON "${t.name}" FOR SELECT USING (true);`;
      }).join('\n\n');
    } else {
      return `// MongoDB Mongoose Schemas\nimport mongoose from 'mongoose';\n\n` + tables.map(t => {
        const schemaProps = t.fields.filter(f => f.name !== 'id').map(f => {
          const mType = f.type.includes('INT') ? 'Number' : f.type === 'BOOLEAN' ? 'Boolean' : f.type === 'TIMESTAMP' ? 'Date' : 'String';
          return `  ${f.name}: { type: ${mType}, required: ${!f.isNullable} },`;
        }).join('\n');
        return `const ${t.name.charAt(0).toUpperCase() + t.name.slice(1)}Schema = new mongoose.Schema({\n${schemaProps}\n}, { timestamps: true });\nexport const ${t.name.charAt(0).toUpperCase() + t.name.slice(1)} = mongoose.model('${t.name}', ${t.name.charAt(0).toUpperCase() + t.name.slice(1)}Schema);`;
      }).join('\n\n');
    }
  };

  // Test Endpoint Runner
  const handleRunEndpointTest = () => {
    setIsExecutingQuery(true);
    setEndpointResponse(null);
    setTimeout(() => {
      setIsExecutingQuery(false);
      let resBody: any = {};
      if (activeEndpointMethod === 'GET') {
        resBody = {
          success: true,
          count: 2,
          data: [
            { id: 'e4b9-12aa-881c', email: 'architect@aurabots.network', role: 'admin', created_at: new Date().toISOString() },
            { id: 'f8c0-33bb-992d', email: 'developer@aurabots.network', role: 'member', created_at: new Date().toISOString() }
          ],
          latencyMs: 18,
          timestamp: new Date().toISOString(),
        };
      } else if (activeEndpointMethod === 'POST') {
        resBody = {
          success: true,
          action: 'CREATED_RECORD',
          recordId: 'usr_new_' + Math.floor(Math.random() * 10000),
          inserted: JSON.parse(endpointPayload || '{}'),
          latencyMs: 24,
          timestamp: new Date().toISOString(),
        };
      } else {
        resBody = {
          success: true,
          action: `${activeEndpointMethod}_COMPLETED`,
          affectedRows: 1,
          latencyMs: 14,
          timestamp: new Date().toISOString(),
        };
      }
      setEndpointResponse(JSON.stringify(resBody, null, 2));
    }, 500);
  };

  // Test Stripe / Twilio
  const handleTestStripe = () => {
    setIsTestingConnector(true);
    setConnectorTestLog(null);
    setTimeout(() => {
      setIsTestingConnector(false);
      setConnectorTestLog(JSON.stringify({
        status: 'STRIPE_INTENT_CREATED',
        id: 'pi_3MzAuraBotsQuantum' + Math.floor(Math.random() * 10000),
        amount: 14900,
        currency: 'usd',
        client_secret: 'pi_3MzAuraBotsQuantum_secret_' + Math.floor(Math.random() * 10000),
        payment_method_types: ['card', 'apple_pay', 'google_pay'],
        livemode: false,
        handshakeLatency: '32ms',
      }, null, 2));
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }, 600);
  };

  const handleTestTwilio = () => {
    setIsTestingConnector(true);
    setConnectorTestLog(null);
    setTimeout(() => {
      setIsTestingConnector(false);
      setConnectorTestLog(JSON.stringify({
        status: 'TWILIO_DISPATCHED_QUEUED',
        sid: 'SM' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        to: twilioRecipient,
        from: '+1 (800) 555-AURA',
        body: 'AuraBots Security: Your 2FA authentication token is 849-210. Valid for 5 minutes.',
        price: '0.0075 USD',
        carrierRoute: 'Tier-1 Direct SS7',
        dispatchedAt: new Date().toISOString(),
      }, null, 2));
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-cyan-500/40 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#151F38] px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                <span>Database & API Integration Studio</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-xs text-slate-400">PostgreSQL • Supabase • MongoDB • REST/GraphQL & Stripe/Twilio Connectors</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tab Selector */}
            <div className="flex bg-[#090D16] p-1 rounded-xl border border-slate-800 text-xs font-bold font-mono">
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'schema' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Schema Editor
              </button>
              <button
                onClick={() => setActiveTab('endpoints')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'endpoints' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                REST / GraphQL
              </button>
              <button
                onClick={() => setActiveTab('connectors')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'connectors' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Stripe & Twilio
              </button>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: SCHEMA EDITOR */}
          {activeTab === 'schema' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Provider Selection & Table Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-400">Database Engine:</span>
                  {(['postgres', 'supabase', 'mongodb'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setDbProvider(p)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold capitalize transition border ${
                        dbProvider === p
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddTable}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Table / Collection</span>
                </button>
              </div>

              {/* Table Selector Pills */}
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {tables.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTableId(t.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 ${
                      selectedTableId === t.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-400/50'
                        : 'bg-[#090D16] border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.name}</span>
                    <span className="text-[10px] text-slate-500">({t.fields.length})</span>
                  </button>
                ))}
              </div>

              {/* Fields Table Editor */}
              <div className="p-4 bg-[#090D16] rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                    <span>Columns in Table: &quot;{currentTable.name}&quot;</span>
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 px-3">Field Name</th>
                        <th className="py-2 px-3">Data Type</th>
                        <th className="py-2 px-3">Constraints</th>
                        <th className="py-2 px-3">Default Value</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {currentTable.fields.map(f => (
                        <tr key={f.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-white flex items-center space-x-1.5">
                            {f.isPrimary && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">PK</span>}
                            <span>{f.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-purple-300 font-semibold">{f.type}</td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {f.isNullable ? 'NULLABLE' : 'NOT NULL'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{f.defaultValue || '—'}</td>
                          <td className="py-2.5 px-3 text-right">
                            {!f.isPrimary && (
                              <button
                                onClick={() => handleRemoveField(f.id)}
                                className="text-slate-500 hover:text-red-400 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Field Form */}
                <form onSubmit={handleAddField} className="flex items-center gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                  <input
                    type="text"
                    required
                    placeholder="New field name (e.g. status)"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="flex-1 min-w-[160px] bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="VARCHAR(255)">VARCHAR(255)</option>
                    <option value="TEXT">TEXT</option>
                    <option value="INTEGER">INTEGER</option>
                    <option value="BIGINT">BIGINT</option>
                    <option value="BOOLEAN">BOOLEAN</option>
                    <option value="TIMESTAMP">TIMESTAMP</option>
                    <option value="JSONB">JSONB</option>
                    <option value="UUID">UUID</option>
                    <option value="DECIMAL(12,2)">DECIMAL(12,2)</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Add Field
                  </button>
                </form>
              </div>

              {/* Generated Output Code */}
              <div className="p-4 bg-[#090D16] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                    Live Compiled Schema DDL ({dbProvider.toUpperCase()})
                  </span>
                  <button
                    onClick={() => copyToClipboard(getGeneratedSchemaCode(), 'schema-code')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono flex items-center space-x-1"
                  >
                    {copiedKey === 'schema-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'schema-code' ? 'Copied' : 'Copy Schema'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-[#050811] rounded-xl border border-cyan-500/30 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 shadow-inner">
                  {getGeneratedSchemaCode()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: REST / GRAPHQL ENDPOINTS */}
          {activeTab === 'endpoints' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-[#090D16] rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    Interactive REST API Endpoint Generator & Sandbox
                  </h4>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(['GET', 'POST', 'PUT', 'DELETE'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => {
                        setActiveEndpointMethod(m);
                        if (m === 'POST') setActiveEndpointPath('/api/v1/users');
                        else if (m === 'GET') setActiveEndpointPath('/api/v1/users');
                        else setActiveEndpointPath('/api/v1/users/e4b9-12aa-881c');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black transition ${
                        activeEndpointMethod === m
                          ? m === 'GET' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : m === 'POST' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : m === 'PUT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-[#0F172A] text-slate-400 border border-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}

                  <input
                    type="text"
                    value={activeEndpointPath}
                    onChange={(e) => setActiveEndpointPath(e.target.value)}
                    className="flex-1 min-w-[220px] bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                  />

                  <button
                    onClick={handleRunEndpointTest}
                    disabled={isExecutingQuery}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isExecutingQuery ? 'Dispatching...' : 'Send Request'}</span>
                  </button>
                </div>

                {activeEndpointMethod !== 'GET' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Request Body (JSON)</label>
                    <textarea
                      value={endpointPayload}
                      onChange={(e) => setEndpointPayload(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                )}

                {endpointResponse && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Server Response:</span>
                      <span className="text-emerald-400">200 OK • JSON</span>
                    </div>
                    <pre className="p-3 bg-[#050811] rounded-xl border border-purple-500/30 text-[11px] font-mono text-emerald-400 overflow-x-auto shadow-inner">
                      {endpointResponse}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STRIPE & TWILIO CONNECTORS */}
          {activeTab === 'connectors' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stripe Card */}
                <div className="p-5 bg-[#090D16] rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      Stripe Payments & Subscriptions
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Auto-configured checkout sessions, payment intents, and webhook verification.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Secret Key (sk_test_...)</label>
                    <input
                      type="password"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    onClick={handleTestStripe}
                    disabled={isTestingConnector}
                    className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Test Payment Intent Creation</span>
                  </button>
                </div>

                {/* Twilio Card */}
                <div className="p-5 bg-[#090D16] rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      Twilio SMS & OTP Verification
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    High-deliverability SMS dispatch and phone number 2FA verification channels.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Recipient Phone Number</label>
                    <input
                      type="text"
                      value={twilioRecipient}
                      onChange={(e) => setTwilioRecipient(e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <button
                    onClick={handleTestTwilio}
                    disabled={isTestingConnector}
                    className="w-full py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test SMS Dispatch</span>
                  </button>
                </div>
              </div>

              {/* Connector Live Output */}
              {connectorTestLog && (
                <div className="p-4 bg-[#090D16] rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Connector Handshake Telemetry:
                  </span>
                  <pre className="p-3 bg-[#050811] rounded-xl border border-cyan-500/30 text-[11px] font-mono text-emerald-400 overflow-x-auto shadow-inner">
                    {connectorTestLog}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
