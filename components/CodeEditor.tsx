'use client';

import React, { useState } from 'react';
import { AppProject } from '@/types/aurabots';
import { 
  FileCode, FileJson, FileText, Folder, Copy, 
  Check, Save, Search, Sparkles, Layers, Cpu
} from 'lucide-react';

interface CodeEditorProps {
  project: AppProject;
  onUpdateFile: (path: string, newContent: string) => void;
  onRecompile: () => void;
}

export function CodeEditor({ project, onUpdateFile, onRecompile }: CodeEditorProps) {
  const [activeFile, setActiveFile] = useState<string>(project.activeFilePath || 'src/App.tsx');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentContent = project.files[activeFile] || '';

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) return <FileCode className="w-4 h-4 text-cyan-400" />;
    if (fileName.endsWith('.json')) return <FileJson className="w-4 h-4 text-amber-400" />;
    if (fileName.endsWith('.md')) return <FileText className="w-4 h-4 text-emerald-400" />;
    if (fileName.endsWith('.css')) return <FileCode className="w-4 h-4 text-purple-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileList = Object.keys(project.files).filter(f => 
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lineCount = currentContent.split('\n').length;

  return (
    <div id="aurabots-code-editor" className="h-full flex flex-col md:flex-row bg-[#090D16] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Left Sidebar: Virtual File Tree */}
      <div className="w-full md:w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col flex-shrink-0">
        {/* Tree Header & Search */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span>Project Explorer</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {Object.keys(project.files).length} Files
            </span>
          </div>

          <div className="relative">
            <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-[#151F38] text-[11px] text-white pl-7 pr-2 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Files List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {fileList.map(filePath => {
            const isActive = activeFile === filePath;
            const fileName = filePath.split('/').pop() || filePath;

            return (
              <button
                key={filePath}
                onClick={() => setActiveFile(filePath)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition text-left ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-[#151F38]/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getFileIcon(fileName)}
                  <span className="truncate">{filePath}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recompile CTA in File Tree */}
        <div className="p-3 border-t border-slate-800 bg-[#090D16]/50">
          <button
            onClick={onRecompile}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition shadow-lg"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Recompile AST</span>
          </button>
        </div>
      </div>

      {/* Right Area: Code Editor & Line Numbers */}
      <div className="flex-1 flex flex-col bg-[#070A12] overflow-hidden">
        {/* Editor Top Bar */}
        <div className="bg-[#0F172A] border-b border-slate-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getFileIcon(activeFile)}
            <span className="text-xs font-mono font-bold text-slate-200">{activeFile}</span>
            <span className="text-[10px] text-slate-500 font-mono">({lineCount} lines)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center space-x-1 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex-1 flex overflow-hidden">
          {/* Line Numbers Gutter */}
          <div className="w-12 bg-[#090D16] py-3 text-right pr-3 select-none text-slate-600 font-mono text-xs leading-6 overflow-hidden border-r border-slate-800/80">
            {Array.from({ length: Math.min(lineCount, 600) }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea Editor */}
          <textarea
            value={currentContent}
            onChange={(e) => onUpdateFile(activeFile, e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent text-slate-200 font-mono text-xs leading-6 p-3 focus:outline-none resize-none overflow-auto whitespace-pre"
          />
        </div>
      </div>
    </div>
  );
}
