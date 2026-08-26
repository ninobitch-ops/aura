import { AppProject } from '@/types/aurabots';

export function buildSandboxHtml(project: AppProject): string {
  const appCode = project.files['src/App.tsx'] || `
    export default function App() {
      return (
        <div style={{ color: '#fff', padding: '2rem', textAlign: 'center' }}>
          <h2>Synthesizing application...</h2>
        </div>
      );
    }
  `;

  // We convert ESM imports into globals in the standalone Babel script
  // e.g. import React, { useState, useEffect } from 'react' -> React, useState, useEffect from window.React
  // import { ArrowUpRight, ... } from 'lucide-react' -> Lucide icons mapped to SVG or window.Lucide
  const cleanedCode = cleanCodeForBabel(appCode);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(project.name)} - AuraBots Preview</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            titanium: '#090D16',
            surface: '#0F172A',
            card: '#151F38',
            cyan: {
              400: '#00F0FF',
              500: '#00D8E6',
              600: '#00ADC2',
            },
            purple: {
              400: '#A855F7',
              500: '#9333EA',
              600: '#7E22CE',
            }
          }
        }
      }
    }
  </script>

  <!-- React 18 & ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <!-- Babel Standalone for live JSX/TS compilation -->
  <script src="https://unpkg.com/@babel/standalone@7.24.4/babel.min.js"></script>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #090D16;
      color: #F8FAFC;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    ::-webkit-scrollbar-track {
      background: #0B1120;
    }
    ::-webkit-scrollbar-thumb {
      background: #1E293B;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #00F0FF;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- Lucide Icon Shim & Helpers -->
  <script>
    // Create standard SVG icon components for Lucide icons
    window.LucideIcons = {};
    const iconNames = [
      'ArrowUpRight', 'ArrowDownLeft', 'RefreshCw', 'TrendingUp', 'ShieldCheck',
      'Wallet', 'Layers', 'BarChart3', 'Clock', 'CheckCircle2', 'ChevronRight',
      'Zap', 'Copy', 'ExternalLink', 'Settings', 'Bell', 'Flame', 'Activity',
      'Heart', 'Timer', 'Play', 'Pause', 'RotateCcw', 'Award', 'Droplet',
      'CheckCircle', 'Plus', 'Dumbbell', 'Lightbulb', 'Thermometer', 'Shield',
      'Power', 'Sun', 'Moon', 'Lock', 'Unlock', 'Wind', 'Tv', 'Check',
      'AlertCircle', 'Trash2', 'MoveRight', 'Tag', 'Filter', 'User', 'Users',
      'ShoppingBag', 'Sparkles', 'X', 'ArrowRight', 'Send', 'Mic', 'Smile',
      'Hash', 'Circle', 'Volume2', 'PhoneCall', 'Disc', 'Sliders', 'Music',
      'BookOpen', 'Search', 'FileText', 'Star', 'MapPin', 'Compass', 'Calendar', 'DollarSign'
    ];

    function createLucideIcon(name) {
      return function IconComponent(props) {
        const className = props.className || 'w-4 h-4';
        const color = props.color || 'currentColor';
        const size = props.size || 16;
        
        // Basic geometric SVG icons fallback
        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: color,
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          className: className,
          dangerouslySetInnerHTML: { __html: getIconPath(name) }
        });
      };
    }

    function getIconPath(name) {
      switch(name) {
        case 'Zap': return '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>';
        case 'Activity': return '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>';
        case 'Flame': return '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/>';
        case 'Heart': return '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>';
        case 'Plus': return '<path d="M5 12h14"/><path d="M12 5v14"/>';
        case 'CheckCircle':
        case 'CheckCircle2': return '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>';
        case 'Check': return '<polyline points="20 6 9 17 4 12"/>';
        case 'X': return '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
        case 'ChevronRight': return '<path d="m9 18 6-6-6-6"/>';
        case 'ArrowUpRight': return '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>';
        case 'ArrowDownLeft': return '<path d="M17 17H7V7"/><path d="m17 7-10 10"/>';
        case 'TrendingUp': return '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>';
        case 'ShoppingBag': return '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>';
        case 'Lock': return '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';
        case 'Unlock': return '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>';
        case 'Play': return '<polygon points="5 3 19 12 5 21 5 3"/>';
        case 'Pause': return '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>';
        case 'RotateCcw': return '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>';
        case 'Power': return '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>';
        case 'RefreshCw': return '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>';
        case 'Trash2': return '<path d="3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>';
        case 'Layers': return '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>';
        case 'Send': return '<line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>';
        case 'Sun': return '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
        case 'Moon': return '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
        case 'Music': return '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>';
        default: return '<circle cx="12" cy="12" r="10"/>';
      }
    }

    iconNames.forEach(name => {
      window.LucideIcons[name] = createLucideIcon(name);
    });
  </script>

  <!-- Sandbox React Script -->
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    
    // Inject lucide icons into scope
    const {
      ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, ShieldCheck,
      Wallet, Layers, BarChart3, Clock, CheckCircle2, ChevronRight,
      Zap, Copy, ExternalLink, Settings, Bell, Flame, Activity,
      Heart, Timer, Play, Pause, RotateCcw, Award, Droplet,
      CheckCircle, Plus, Dumbbell, Lightbulb, Thermometer, Shield,
      Power, Sun, Moon, Lock, Unlock, Wind, Tv, Check,
      AlertCircle, Trash2, MoveRight, Tag, Filter, User, Users,
      ShoppingBag, Sparkles, X, ArrowRight, Send, Mic, Smile,
      Hash, Circle, Volume2, PhoneCall, Disc, Sliders, Music,
      BookOpen, Search, FileText, Star, MapPin, Compass, Calendar, DollarSign
    } = window.LucideIcons;

    ${cleanedCode}

    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>`;
}

function cleanCodeForBabel(code: string): string {
  return code
    // Remove import statements
    .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
    // Remove export default from App function
    .replace(/export\s+default\s+function\s+App/, 'function App')
    .replace(/export\s+default\s+App;?/, '');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
