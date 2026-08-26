'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CompilerNode3D, AppProject } from '@/types/aurabots';
import { generate3DNodesForProject } from '@/lib/compiler/astVisualizerGraph';
import { Box, RefreshCw, ZoomIn, ZoomOut, Eye, Layers, Sparkles } from 'lucide-react';

interface Visualizer3DCanvasProps {
  project: AppProject;
}

export function Visualizer3DCanvas({ project }: Visualizer3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<CompilerNode3D | null>(null);
  const [is4K, setIs4K] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [zoom, setZoom] = useState(1.2);

  // Rotation angles
  const angleRef = useRef({ x: 0.3, y: 0.4 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => generate3DNodesForProject(project), [project]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scale = is4K ? 2 : window.devicePixelRatio || 1;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.scale(scale, scale);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle flow state
    const particles = Array.from({ length: 45 }, () => ({
      nodeA: Math.floor(Math.random() * nodes.length),
      nodeB: Math.floor(Math.random() * nodes.length),
      progress: Math.random(),
      speed: 0.005 + Math.random() * 0.01,
    }));

    const render = () => {
      if (!containerRef.current || !canvas) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Auto-rotation if not dragging
      if (!isDraggingRef.current) {
        angleRef.current.y += rotationSpeed;
      }

      const rotX = angleRef.current.x;
      const rotY = angleRef.current.y;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const fov = 450 * zoom;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project 3D nodes to 2D
      const projectedNodes = nodes.map(n => {
        // Y rotation
        let x1 = n.x * cosY + n.z * sinY;
        let z1 = -n.x * sinY + n.z * cosY;

        // X rotation
        let y2 = n.y * cosX - z1 * sinX;
        let z2 = n.y * sinX + z1 * cosX + 380; // offset camera distance

        const scale = fov / Math.max(z2, 10);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        return {
          ...n,
          projX,
          projY,
          projZ: z2,
          projRadius: Math.max(n.radius * scale * 0.7, 3),
        };
      });

      // Draw Grid Floor Plane in 3D
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 300;
      const gridStep = 60;
      const floorY = 160;

      for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
        let x1 = gx * cosY + (-gridSize) * sinY;
        let z1 = -gx * sinY + (-gridSize) * cosY;
        let py1 = floorY * cosX - z1 * sinX;
        let pz1 = floorY * sinX + z1 * cosX + 380;
        let s1 = fov / Math.max(pz1, 10);

        let x2 = gx * cosY + (gridSize) * sinY;
        let z2 = -gx * sinY + (gridSize) * cosY;
        let py2 = floorY * cosX - z2 * sinX;
        let pz2 = floorY * sinX + z2 * cosX + 380;
        let s2 = fov / Math.max(pz2, 10);

        ctx.beginPath();
        ctx.moveTo(centerX + x1 * s1, centerY + py1 * s1);
        ctx.lineTo(centerX + x2 * s2, centerY + py2 * s2);
        ctx.stroke();
      }

      // Draw Connection Links
      nodes.forEach((node, idx) => {
        const p1 = projectedNodes[idx];
        node.connections.forEach(connId => {
          const targetIdx = nodes.findIndex(n => n.id === connId);
          if (targetIdx !== -1) {
            const p2 = projectedNodes[targetIdx];
            
            // Gradient line
            const grad = ctx.createLinearGradient(p1.projX, p1.projY, p2.projX, p2.projY);
            grad.addColorStop(0, `${node.color}55`);
            grad.addColorStop(1, `${nodes[targetIdx].color}55`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        });
      });

      // Draw Flow Particles on edges
      particles.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.nodeA = Math.floor(Math.random() * nodes.length);
          p.nodeB = Math.floor(Math.random() * nodes.length);
        }
        const p1 = projectedNodes[p.nodeA];
        const p2 = projectedNodes[p.nodeB];
        if (p1 && p2) {
          const partX = p1.projX + (p2.projX - p1.projX) * p.progress;
          const partY = p1.projY + (p2.projY - p1.projY) * p.progress;

          ctx.fillStyle = '#00F0FF';
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(partX, partY, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Sort nodes by Z depth for correct painter's rendering
      const sortedNodes = [...projectedNodes].sort((a, b) => b.projZ - a.projZ);

      // Draw Nodes
      sortedNodes.forEach(n => {
        const isSelected = selectedNode?.id === n.id;

        // Outer Glow Ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.projX, n.projY, n.projRadius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}22`;
        ctx.fill();

        // Node Body
        ctx.beginPath();
        ctx.arc(n.projX, n.projY, n.projRadius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = isSelected ? 20 : 12;
        ctx.fill();
        ctx.restore();

        // Node Label
        ctx.font = '10px monospace';
        ctx.fillStyle = '#E2E8F0';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.projX, n.projY - n.projRadius - 6);

        // Subtext
        ctx.font = '8px monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`${n.lines} LOC`, n.projX, n.projY + n.projRadius + 12);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, zoom, rotationSpeed, is4K, selectedNode]);

  // Mouse interaction handlers for orbit controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    angleRef.current.y += deltaX * 0.006;
    angleRef.current.x += deltaY * 0.006;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Simple hit test against projected nodes
    // Find closest node
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const rotX = angleRef.current.x;
    const rotY = angleRef.current.y;
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const fov = 450 * zoom;
    const centerX = width / 2;
    const centerY = height / 2;

    let closest: CompilerNode3D | null = null;
    let minDistance = 25;

    nodes.forEach(n => {
      let x1 = n.x * cosY + n.z * sinY;
      let z1 = -n.x * sinY + n.z * cosY;
      let y2 = n.y * cosX - z1 * sinX;
      let z2 = n.y * sinX + z1 * cosX + 380;
      const scale = fov / Math.max(z2, 10);
      const px = centerX + x1 * scale;
      const py = centerY + y2 * scale;

      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < minDistance) {
        minDistance = dist;
        closest = n;
      }
    });

    if (closest) {
      setSelectedNode(closest);
    }
  };

  return (
    <div 
      id="aurabots-3d-visualizer"
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] bg-[#090D16] rounded-2xl border border-slate-800 overflow-hidden select-none flex flex-col"
    >
      {/* 3D Visualizer Canvas Header Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-3 bg-[#0F172A]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
        <Box className="w-4 h-4 text-cyan-400" />
        <div className="text-xs">
          <span className="font-bold text-white uppercase font-mono">3D / 4K AST Architecture</span>
          <span className="text-slate-400 ml-2 text-[11px] font-mono">({nodes.length} Nodes Linked)</span>
        </div>
      </div>

      {/* Camera & View Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-2 bg-[#0F172A]/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
          className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
          className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            angleRef.current = { x: 0.3, y: 0.4 };
            setZoom(1.2);
          }}
          className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
          title="Reset Camera"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIs4K(!is4K)}
          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
            is4K ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'
          }`}
          title="Toggle 4K Ultra Hi-DPI Canvas Rendering"
        >
          4K Mode
        </button>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur-md border border-cyan-500/40 p-4 rounded-2xl max-w-xs shadow-2xl space-y-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono">{selectedNode.type} Node</span>
              <h4 className="text-sm font-bold text-white">{selectedNode.name}</h4>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.details}</p>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>Complexity: {selectedNode.complexity}%</span>
            <span>{selectedNode.lines} Lines</span>
          </div>
        </div>
      )}

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Hint */}
      <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono pointer-events-none">
        Drag to Orbit • Click Node to Inspect • 60 FPS
      </div>
    </div>
  );
}
