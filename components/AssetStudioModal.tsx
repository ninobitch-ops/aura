'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppProject } from '@/types/aurabots';
import { Palette, Download, Sparkles, X, Check, Image as ImageIcon } from 'lucide-react';

interface AssetStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject;
  onApplyIcon: (iconDataUrl: string) => void;
}

export function AssetStudioModal({ isOpen, onClose, project, onApplyIcon }: AssetStudioModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [symbol, setSymbol] = useState<'A' | 'infinity' | 'zap' | 'flame' | 'shield' | 'cube'>('A');
  const [themeGradient, setThemeGradient] = useState<'cyan-blue' | 'purple-pink' | 'emerald' | 'amber-orange' | 'dark-titanium'>('cyan-blue');
  const [glowIntensity, setGlowIntensity] = useState(25);
  const [badgeText, setBadgeText] = useState('PRO');

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Background Rounded Rect
    const radius = 90;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    if (themeGradient === 'cyan-blue') {
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#151F38');
      bgGrad.addColorStop(1, '#0A1020');
    } else if (themeGradient === 'purple-pink') {
      bgGrad.addColorStop(0, '#1E1035');
      bgGrad.addColorStop(1, '#0D0818');
    } else if (themeGradient === 'emerald') {
      bgGrad.addColorStop(0, '#06281E');
      bgGrad.addColorStop(1, '#05130F');
    } else if (themeGradient === 'amber-orange') {
      bgGrad.addColorStop(0, '#2D1B06');
      bgGrad.addColorStop(1, '#130B02');
    } else {
      bgGrad.addColorStop(0, '#1E293B');
      bgGrad.addColorStop(1, '#020617');
    }

    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Border stroke
    ctx.lineWidth = 6;
    ctx.strokeStyle = themeGradient === 'cyan-blue' ? '#00F0FF66' : '#A855F766';
    ctx.stroke();

    // Glow Effect
    ctx.save();
    ctx.shadowColor = themeGradient === 'cyan-blue' ? '#00F0FF' : '#A855F7';
    ctx.shadowBlur = glowIntensity;

    // Draw Central Symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = themeGradient === 'cyan-blue' ? '#00F0FF' : '#A855F7';
    ctx.lineWidth = 14;

    const cx = size / 2;
    const cy = size / 2;

    if (symbol === 'A') {
      // 3D Glassmorphic A
      ctx.font = 'bold 240px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#00F0FF';
      ctx.fillText('A', cx, cy - 10);

      // Infinity crossbar
      ctx.beginPath();
      ctx.arc(cx - 45, cy + 40, 30, 0, Math.PI * 2);
      ctx.arc(cx + 45, cy + 40, 30, 0, Math.PI * 2);
      ctx.stroke();
    } else if (symbol === 'infinity') {
      ctx.beginPath();
      ctx.arc(cx - 65, cy, 55, 0, Math.PI * 2);
      ctx.arc(cx + 65, cy, 55, 0, Math.PI * 2);
      ctx.stroke();
    } else if (symbol === 'zap') {
      ctx.beginPath();
      ctx.moveTo(cx + 20, cy - 120);
      ctx.lineTo(cx - 70, cy + 10);
      ctx.lineTo(cx + 10, cy + 10);
      ctx.lineTo(cx - 20, cy + 120);
      ctx.lineTo(cx + 70, cy - 10);
      ctx.lineTo(cx - 10, cy - 10);
      ctx.closePath();
      ctx.fillStyle = '#00F0FF';
      ctx.fill();
    } else if (symbol === 'flame') {
      ctx.font = '220px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔥', cx, cy);
    } else if (symbol === 'shield') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 100);
      ctx.lineTo(cx + 90, cy - 60);
      ctx.lineTo(cx + 90, cy + 30);
      ctx.quadraticCurveTo(cx + 90, cy + 120, cx, cy + 140);
      ctx.quadraticCurveTo(cx - 90, cy + 120, cx - 90, cy + 30);
      ctx.lineTo(cx - 90, cy - 60);
      ctx.closePath();
      ctx.fillStyle = '#00F0FF33';
      ctx.fill();
      ctx.stroke();
    } else {
      // Cube
      ctx.font = '220px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💎', cx, cy);
    }

    ctx.restore();

    // Draw Corner Badge
    if (badgeText) {
      ctx.save();
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.roundRect(size - 130, 30, 95, 45, 12);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, size - 82, 52);
      ctx.restore();
    }
  }, [isOpen, symbol, themeGradient, glowIntensity, badgeText]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_icon.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleApplyToApp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    onApplyIcon(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-cyan-500/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        <div className="bg-[#151F38] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-400 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                App Icon & 3D Vector Studio
              </h3>
              <p className="text-xs text-slate-400">Generate high-DPI glassmorphic application icons</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 items-center">
          {/* Canvas Preview */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-[#090D16] rounded-3xl border border-slate-800 shadow-2xl">
              <canvas ref={canvasRef} className="w-56 h-56 rounded-2xl" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">512 x 512 Hi-DPI PNG</span>
          </div>

          {/* Controls */}
          <div className="space-y-4 text-xs">
            {/* Symbol picker */}
            <div>
              <label className="text-slate-400 font-bold uppercase block mb-1.5">Center Vector Mark</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'A', label: '3D Aura A' },
                  { id: 'infinity', label: 'Infinity ∞' },
                  { id: 'zap', label: 'Quantum Zap' },
                  { id: 'flame', label: 'Bio Flame' },
                  { id: 'shield', label: 'Shield' },
                  { id: 'cube', label: 'Crystal' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSymbol(s.id as any)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition font-semibold ${
                      symbol === s.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-[#151F38] text-slate-400 border-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Theme */}
            <div>
              <label className="text-slate-400 font-bold uppercase block mb-1.5">Color Atmosphere</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cyan-blue', label: 'Cyan Matrix' },
                  { id: 'purple-pink', label: 'Neon Nebula' },
                  { id: 'emerald', label: 'Emerald' },
                  { id: 'amber-orange', label: 'Amber Solar' },
                  { id: 'dark-titanium', label: 'Titanium' },
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setThemeGradient(g.id as any)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition font-semibold ${
                      themeGradient === g.id
                        ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                        : 'bg-[#151F38] text-slate-400 border-slate-700'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Text */}
            <div>
              <label className="text-slate-400 font-bold uppercase block mb-1">Corner Pill Badge</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                maxLength={5}
                className="w-full bg-[#151F38] border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#151F38] p-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            onClick={handleDownloadPng}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handleApplyToApp}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs uppercase flex items-center space-x-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Apply Icon to App</span>
          </button>
        </div>
      </div>
    </div>
  );
}
