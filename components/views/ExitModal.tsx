'use client';

import React from 'react';
import { AlertTriangle, Save, Trash2, X } from 'lucide-react';

interface ExitModalProps {
  isOpen: boolean;
  onSaveAndExit: () => void;
  onDiscardAndExit: () => void;
  onCancel: () => void;
  projectName: string;
}

export function ExitModal({
  isOpen,
  onSaveAndExit,
  onDiscardAndExit,
  onCancel,
  projectName,
}: ExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">Unsaved Work Safeguard</h3>
              <p className="text-xs text-slate-400">Exit Confirmation</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Do you want to save current progress for <span className="font-bold text-cyan-300 font-mono">{projectName}</span> before switching workspace or exiting?
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onDiscardAndExit}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>

          <button
            onClick={onSaveAndExit}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
