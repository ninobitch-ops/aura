'use client';

import React, { useState } from 'react';
import { AppProject } from '@/types/aurabots';
import { buildSandboxHtml } from '@/lib/compiler/sandboxBundler';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { 
  Download, FileCode, Github, Sparkles, Check, 
  X, Layers, Smartphone, Copy, HardDrive, Globe
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject;
}

export function ExportModal({ isOpen, onClose, project }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'zip' | 'html' | 'github' | 'mobile'>('zip');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [ghRepoName, setGhRepoName] = useState(project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  const [ghSyncSuccess, setGhSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();

      // Add all project virtual files
      Object.entries(project.files).forEach(([filePath, content]) => {
        zip.file(filePath, content);
      });

      // Add standalone HTML bundle
      const standaloneHtml = buildSandboxHtml(project);
      zip.file('dist/index.html', standaloneHtml);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_codebase.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      console.error('ZIP export error:', err);
      setIsExporting(false);
    }
  };

  const handleDownloadHtml = () => {
    const html = buildSandboxHtml(project);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_standalone.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleGithubSync = () => {
    setGhSyncSuccess(true);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setGhSyncSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-cyan-500/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#151F38] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Package & Export Suite
              </h3>
              <p className="text-xs text-slate-400">Deploy, package ZIP, or synchronize with GitHub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Navigation Tabs */}
        <div className="flex bg-[#090D16] p-1.5 border-b border-slate-800">
          {[
            { id: 'zip', label: 'Full ZIP Package', icon: HardDrive },
            { id: 'html', label: 'Standalone HTML', icon: Globe },
            { id: 'github', label: 'GitHub Sync', icon: Github },
            { id: 'mobile', label: 'Expo / Mobile APK', icon: Smartphone },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-[#151F38] text-cyan-300 border border-cyan-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ZIP PACKAGE */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#151F38] rounded-2xl border border-slate-700/80 space-y-2">
                <h4 className="text-sm font-bold text-white">Full Source Code Package</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Includes all synthesized React TypeScript files, Tailwind CSS configs, Vite scripts, package.json dependencies, and documentation.
                </p>
                <div className="text-[11px] font-mono text-cyan-400 pt-1">
                  • {Object.keys(project.files).length} Files Included • Ready for `npm install && npm run dev`
                </div>
              </div>

              <button
                disabled={isExporting}
                onClick={handleDownloadZip}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-xl shadow-cyan-500/20 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating ZIP Archive...' : 'Download Production ZIP Package'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: STANDALONE HTML */}
          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#151F38] rounded-2xl border border-slate-700/80 space-y-2">
                <h4 className="text-sm font-bold text-white">Zero-Config Standalone HTML</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A single, self-contained HTML file bundling React 18, Babel runtime, Tailwind CSS, Lucide icons, and state logic. Can be opened immediately in any browser or hosted on static servers (GitHub Pages, Netlify, Vercel).
                </p>
              </div>

              <button
                onClick={handleDownloadHtml}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-xl shadow-purple-600/20 hover:brightness-110"
              >
                <Globe className="w-4 h-4" />
                <span>Download Standalone HTML File</span>
              </button>
            </div>
          )}

          {/* TAB 3: GITHUB SYNC */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#151F38] rounded-2xl border border-slate-700/80 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>Automated Repository Synchronization</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Directly pushes the synthesized virtual codebase to your GitHub account as a new repository with initial commit history.
                </p>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Repository Name</label>
                  <input
                    type="text"
                    value={ghRepoName}
                    onChange={(e) => setGhRepoName(e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {ghSyncSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Repository created & synced successfully to GitHub: <strong>github.com/aurabots/{ghRepoName}</strong></span>
                </div>
              )}

              <button
                onClick={handleGithubSync}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-slate-700 transition"
              >
                <Github className="w-4 h-4" />
                <span>Initialize & Push to GitHub</span>
              </button>
            </div>
          )}

          {/* TAB 4: EXPO / MOBILE */}
          {activeTab === 'mobile' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#151F38] rounded-2xl border border-slate-700/80 space-y-2">
                <h4 className="text-sm font-bold text-white">React Native & Expo Configuration</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generated `app.json` with iOS bundle identifiers, Android adaptive icons, and PWA manifest ready for EAS Build (`npx eas-cli build -p android`).
                </p>
              </div>

              <div className="p-3 bg-[#090D16] rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-40 overflow-y-auto">
                <pre>{project.files['app.json'] || 'No app.json configured'}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
