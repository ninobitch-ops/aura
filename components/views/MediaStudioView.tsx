'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppProject } from '@/types/aurabots';
import { 
  Palette, Video, Play, Pause, RotateCw, Download, 
  Upload, Sparkles, ArrowRight, ArrowLeft, Check, 
  Volume2, VolumeX, Sliders, Film, Layers, Monitor, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MediaStudioViewProps {
  project: AppProject;
  onUpdateProject: (updater: (prev: AppProject) => AppProject) => void;
  onBackToWorkspace: () => void;
  onNextToPreview: () => void;
}

// Color schemes map for logo generator
const COLOR_MAP = {
  cyan: { p1: '#00F0FF', p2: '#2563EB', glow: 'rgba(0,240,255,0.6)' },
  purple: { p1: '#A855F7', p2: '#EC4899', glow: 'rgba(168,85,247,0.6)' },
  emerald: { p1: '#10B981', p2: '#06B6D4', glow: 'rgba(16,185,129,0.6)' },
  cobalt: { p1: '#3B82F6', p2: '#6366F1', glow: 'rgba(59,130,246,0.6)' },
  gold: { p1: '#F59E0B', p2: '#EF4444', glow: 'rgba(245,158,11,0.6)' },
};

const VIDEO_SCENES = [
  { title: 'Cyber Opening & Vision', desc: 'Dramatic neon hook highlighting the problem and application name' },
  { title: 'Core UI & Interaction Flow', desc: 'Dynamic split-screen walkthrough of reactive UI components and data flows' },
  { title: 'Abstract Syntax Tree (AST)', desc: '3D spatial visualization showing component topology and reactive bindings' },
  { title: 'Multi-Device Simulation', desc: 'Simultaneous 4K Desktop, iPhone 16 Pro, and Pixel 9 Pro live execution' },
  { title: 'Deployment & CTA', desc: 'Subdomain publish, GitHub synchronization, and store package exports' },
];

export function MediaStudioView({
  project,
  onUpdateProject,
  onBackToWorkspace,
  onNextToPreview,
}: MediaStudioViewProps) {
  const [activeTab, setActiveTab] = useState<'logo' | 'video'>('logo');

  // --- LOGO GENERATOR STATE ---
  const [glowIntensity, setGlowIntensity] = useState(65);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [colorScheme, setColorScheme] = useState<'cyan' | 'purple' | 'emerald' | 'cobalt' | 'gold'>('cyan');
  const [customImage, setCustomImage] = useState<string | null>(project.iconDataUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  const logoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- INTRO VIDEO GENERATOR STATE ---
  const [selectedScene, setSelectedScene] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(120); // seconds (2 mins default)
  const [hasVoiceover, setHasVoiceover] = useState(true);
  const [soundtrack, setSoundtrack] = useState<'cyber-synth' | 'ambient-tech' | 'epic-orchestral' | 'deep-techno'>('cyber-synth');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const currentTimeRef = useRef(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isAddedToProject, setIsAddedToProject] = useState(Boolean(project.introVideo?.renderedAt));

  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state to ref when user scrubs manually
  const handleSeek = (newTime: number) => {
    setCurrentTimeSec(newTime);
    currentTimeRef.current = newTime;
  };

  // Sync playback time to state periodically for UI controls
  useEffect(() => {
    if (!isPlayingVideo) return;
    const interval = setInterval(() => {
      setCurrentTimeSec(Math.floor(currentTimeRef.current));
    }, 250);
    return () => clearInterval(interval);
  }, [isPlayingVideo]);

  // 1. Render 3D Glassmorphic "A" Logo Canvas
  useEffect(() => {
    let animId: number;
    let angle = 0;

    const render = () => {
      const canvas = logoCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Dark background gradient
      const bgGrad = ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, w/2);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(1, '#050811');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(w/2, h/2);
      ctx.rotate((angle * Math.PI) / 180);

      const scheme = COLOR_MAP[colorScheme];

      // Glow setup
      ctx.shadowColor = scheme.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 40;

      // Draw Geometric 3D "A" Infinity Emblem
      // Outer Titanium Beams
      const beamGrad = ctx.createLinearGradient(-100, -100, 100, 100);
      beamGrad.addColorStop(0, '#334155');
      beamGrad.addColorStop(0.5, '#0F172A');
      beamGrad.addColorStop(1, '#020617');

      ctx.fillStyle = wireframeMode ? 'transparent' : beamGrad;
      ctx.strokeStyle = scheme.p1;
      ctx.lineWidth = wireframeMode ? 2 : 3;

      // Left leg
      ctx.beginPath();
      ctx.moveTo(0, -110);
      ctx.lineTo(-90, 95);
      ctx.lineTo(-55, 95);
      ctx.lineTo(0, -40);
      ctx.closePath();
      if (!wireframeMode) ctx.fill();
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(0, -110);
      ctx.lineTo(90, 95);
      ctx.lineTo(55, 95);
      ctx.lineTo(0, -40);
      ctx.closePath();
      if (!wireframeMode) ctx.fill();
      ctx.stroke();

      // Infinity Loop Crossbar
      const infGrad = ctx.createLinearGradient(-80, 0, 80, 0);
      infGrad.addColorStop(0, scheme.p1);
      infGrad.addColorStop(0.5, scheme.p2);
      infGrad.addColorStop(1, scheme.p1);

      ctx.strokeStyle = infGrad;
      ctx.lineWidth = wireframeMode ? 3 : 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.bezierCurveTo(-45, -20, -75, -10, -75, 15);
      ctx.bezierCurveTo(-75, 40, -45, 50, 0, 15);
      ctx.bezierCurveTo(45, -20, 75, -10, 75, 15);
      ctx.bezierCurveTo(75, 40, 45, 50, 0, 15);
      ctx.stroke();

      // Central Spark Crystal
      ctx.shadowBlur = (glowIntensity / 100) * 50;
      ctx.shadowColor = '#FFFFFF';
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 15, 6, 0, Math.PI * 2);
      ctx.fill();

      // Apex Node
      ctx.fillStyle = scheme.p1;
      ctx.beginPath();
      ctx.moveTo(0, -125);
      ctx.lineTo(12, -110);
      ctx.lineTo(0, -95);
      ctx.lineTo(-12, -110);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      if (isRotating) {
        angle = (angle + 0.8) % 360;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [glowIntensity, isRotating, wireframeMode, colorScheme]);

  // 2. Render Dynamic Intro Video Preview Canvas
  useEffect(() => {
    let animId: number;

    const renderVideoFrame = () => {
      const canvas = videoCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Advance time if playing
      if (isPlayingVideo) {
        currentTimeRef.current += 0.03 * playbackSpeed;
        if (currentTimeRef.current >= videoDuration) {
          currentTimeRef.current = 0;
          setIsPlayingVideo(false);
          setCurrentTimeSec(0);
        }
      }

      const currTime = currentTimeRef.current;

      // Dark cinematic frame
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, w, h);

      // Cyber particle background
      const t = currTime * 2;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(i * 99 + t * 0.5) * 0.5 + 0.5) * w;
        const py = (Math.cos(i * 33 + t * 0.3) * 0.5 + 0.5) * h;
        const r = (Math.sin(i + t) * 0.5 + 0.5) * 3 + 1;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Calculate current scene index based on progress
      const progress = Math.min(currTime / videoDuration, 1);
      const sceneIndex = Math.min(Math.floor(progress * VIDEO_SCENES.length), VIDEO_SCENES.length - 1);
      const currentScene = VIDEO_SCENES[sceneIndex];

      // Draw Top HUD Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, 0, w, 40);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(0, 0, w, 40);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#00F0FF';
      ctx.fillText(`AURABOTS INTRO STREAM // 4K HIGH DYNAMIC RANGE`, 16, 25);

      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`SCENE 0${sceneIndex + 1}/05: ${currentScene.title.toUpperCase()}`, w - 340, 25);

      // Central Visual Showcase
      ctx.save();
      ctx.translate(w/2, h/2 - 15);

      // Glowing Scene Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0,240,255,0.4)';
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.roundRect(-240, -110, 480, 220, 16);
      ctx.fill();
      ctx.stroke();

      // Project Title & Scene Content
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(project.name.toUpperCase(), 0, -60);

      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(currentScene.title, 0, -25);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px sans-serif';
      // Wrap text
      const words = currentScene.desc.split(' ');
      let line = '';
      let y = 10;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (testLine.length > 55 && n > 0) {
          ctx.fillText(line, 0, y);
          line = words[n] + ' ';
          y += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 0, y);

      // Dynamic Audio Waveform Bars at bottom of card
      ctx.fillStyle = '#A855F7';
      for (let b = -180; b <= 180; b += 12) {
        const barHeight = Math.abs(Math.sin((b + t * 20) * 0.05)) * 25 + 5;
        ctx.fillRect(b, 65 - barHeight/2, 6, barHeight);
      }

      ctx.restore();

      // Bottom Progress Scrubber Bar
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, h - 8, w, 8);
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(0, h - 8, w * progress, 8);

      animId = requestAnimationFrame(renderVideoFrame);
    };

    renderVideoFrame();

    return () => cancelAnimationFrame(animId);
  }, [isPlayingVideo, videoDuration, playbackSpeed, project.name]);

  // Handle Export PNG Logo
  const handleExportLogo = (size: number) => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;

    // Create export high-res offscreen canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = size;
    offCanvas.height = size;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    // Draw current canvas scaled
    offCtx.drawImage(canvas, 0, 0, size, size);

    const url = offCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_icon_${size}x${size}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Also update project icon
    onUpdateProject(prev => ({ ...prev, iconDataUrl: url }));

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // Handle Dropzone Upload
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCustomImage(result);
      onUpdateProject(prev => ({ ...prev, iconDataUrl: result }));
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  // Add Intro Video to Project
  const handleAddVideoToProject = () => {
    setIsAddedToProject(true);
    onUpdateProject(prev => ({
      ...prev,
      introVideo: {
        scene: VIDEO_SCENES[selectedScene].title,
        duration: videoDuration,
        soundtrack,
        hasVoiceover,
        title: `${project.name} Official 4K Teaser`,
        renderedAt: Date.now(),
      }
    }));
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  // Time format helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="aurabots-media-studio-view" className="flex-1 flex flex-col min-h-0 bg-[#070B14] overflow-hidden">
      {/* Studio Mode Header */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center font-bold">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <span>Media & Brand Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Step 2 of 4
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Generate 3D geometric icon assets and 1–3 min dynamic intro videos</p>
          </div>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="flex bg-[#090D16] p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-4 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              activeTab === 'logo'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>3D Logo & Icon Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              activeTab === 'video'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Project Intro Video Generator</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 p-4 overflow-y-auto max-w-[1500px] w-full mx-auto flex flex-col">
        {/* ========================================================================= */}
        {/* TAB 1: 3D LOGO & EMBLEM STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'logo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Left Canvas Preview */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-[#090D16] rounded-3xl border border-slate-800 shadow-2xl relative">
              <canvas
                ref={logoCanvasRef}
                width={400}
                height={400}
                className="w-full max-w-[380px] aspect-square rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-slate-800/80"
              />

              <div className="flex items-center space-x-3 mt-4">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition ${
                    isRotating ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                  <span>{isRotating ? 'Auto Orbiting' : 'Paused Orbit'}</span>
                </button>

                <button
                  onClick={() => setWireframeMode(!wireframeMode)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                    wireframeMode ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Wireframe Mode: {wireframeMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Right Controls & Custom Dropzone */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Color Palette Selector */}
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Quantum Color Scheme
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {(['cyan', 'purple', 'emerald', 'cobalt', 'gold'] as const).map(color => (
                      <button
                        key={color}
                        onClick={() => setColorScheme(color)}
                        className={`p-2 rounded-xl border capitalize text-xs font-bold transition ${
                          colorScheme === color
                            ? 'bg-slate-800 border-cyan-400 text-white shadow-md'
                            : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glow Intensity Slider */}
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 font-bold uppercase">Neon Glow Intensity</span>
                    <span className="text-cyan-400 font-bold">{glowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={glowIntensity}
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Custom Image Dropzone */}
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Custom Image File Drop-Zone
                  </span>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) handleImageFile(e.dataTransfer.files[0]);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                      isDragging
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-slate-700 bg-[#090D16] hover:border-slate-500'
                    }`}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-300 font-bold">Drag & Drop Image or Click to Upload</p>
                    <p className="text-[10px] text-slate-500">Supports PNG, SVG, JPG, WebP</p>
                  </div>

                  {customImage && (
                    <div className="flex items-center space-x-3 p-2 bg-[#090D16] rounded-xl border border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={customImage} alt="Custom Icon" className="w-9 h-9 rounded-lg object-cover border border-slate-700" />
                      <div className="flex-1 text-xs text-slate-300 truncate">
                        <span className="font-bold text-emerald-400">Custom Icon Active</span>
                      </div>
                      <button
                        onClick={() => setCustomImage(null)}
                        className="text-[10px] text-red-400 hover:underline px-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleExportLogo(512)}
                  className="py-3 bg-[#0F172A] hover:bg-[#1E293B] border border-cyan-500/40 text-cyan-300 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>PNG 512x512</span>
                </button>

                <button
                  onClick={() => handleExportLogo(1024)}
                  className="py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Ultra HD 1024px</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DYNAMIC 1-3 MINUTE PROJECT INTRO VIDEO GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Left: Video Player Preview */}
            <div className="lg:col-span-7 flex flex-col p-5 bg-[#090D16] rounded-3xl border border-slate-800 shadow-2xl space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
                <canvas
                  ref={videoCanvasRef}
                  width={640}
                  height={360}
                  className="w-full h-full object-contain"
                />

                {/* Floating Play Overlay if Paused */}
                {!isPlayingVideo && (
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </button>
                )}
              </div>

              {/* Video Player Controls Bar */}
              <div className="bg-[#0F172A] p-3 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
                  >
                    {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {formatTime(currentTimeSec)} / {formatTime(videoDuration)}
                  </span>
                </div>

                {/* Scrubber slider */}
                <input
                  type="range"
                  min="0"
                  max={videoDuration}
                  step="0.5"
                  value={currentTimeSec}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="flex-1 min-w-[120px] max-w-xs accent-cyan-400 cursor-pointer mx-2"
                />

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPlaybackSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
                  >
                    {playbackSpeed}x Speed
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Intro Video Studio Controls */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Duration Selector (1 - 3 mins) */}
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 font-bold uppercase">Teaser Duration</span>
                    <span className="text-purple-400 font-bold">{videoDuration / 60} Minutes ({videoDuration}s)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { s: 60, label: '1 Min (Short Hook)' },
                      { s: 120, label: '2 Mins (Full Teaser)' },
                      { s: 180, label: '3 Mins (Deep Dive)' },
                    ].map(d => (
                      <button
                        key={d.s}
                        onClick={() => { setVideoDuration(d.s); setCurrentTimeSec(0); }}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          videoDuration === d.s
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scene Selector */}
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Jump to Scene Flow
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {VIDEO_SCENES.map((sc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedScene(idx);
                          setCurrentTimeSec((idx / VIDEO_SCENES.length) * videoDuration);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-start space-x-2 ${
                          selectedScene === idx
                            ? 'bg-[#151F38] border-cyan-500/50 text-white'
                            : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-mono text-cyan-400 font-bold">0{idx + 1}</span>
                        <div>
                          <div className="font-bold">{sc.title}</div>
                          <div className="text-[10px] text-slate-500 truncate">{sc.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soundtrack & Voiceover Toggles */}
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      AI Voiceover Narrator
                    </span>
                    <button
                      onClick={() => setHasVoiceover(!hasVoiceover)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                        hasVoiceover ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {hasVoiceover ? 'Voiceover ENABLED' : 'Muted'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Background Soundtrack Synthesizer
                    </span>
                    <select
                      value={soundtrack}
                      onChange={(e: any) => setSoundtrack(e.target.value)}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="cyber-synth">Cyber Synthwave (High Energy)</option>
                      <option value="ambient-tech">Ambient Tech (Minimalist Precision)</option>
                      <option value="epic-orchestral">Epic Orchestral (Cinematic Trailer)</option>
                      <option value="deep-techno">Deep Techno (Dark Pulse)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Add to Project Button */}
              <button
                onClick={handleAddVideoToProject}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-xl cursor-pointer ${
                  isAddedToProject
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-emerald-500/10'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/25'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isAddedToProject ? 'Intro Video Linked to Project Bundle' : 'Add 4K Intro Video to Project'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="sticky bottom-0 z-30 bg-[#090D16]/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={onBackToWorkspace}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Brand Assets & Intro Video Ready</span>
        </div>

        <button
          id="btn-media-next-step"
          onClick={onNextToPreview}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <span>Next: 4K Device Preview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
