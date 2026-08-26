import { CompilerNode3D, AppProject } from '@/types/aurabots';

export function generate3DNodesForProject(project: AppProject): CompilerNode3D[] {
  const nodes: CompilerNode3D[] = [];

  // Central Root Node
  nodes.push({
    id: 'root-node',
    name: project.name,
    type: 'root',
    x: 0,
    y: 0,
    z: 0,
    radius: 18,
    color: '#00F0FF',
    connections: ['comp-app', 'comp-state', 'comp-theme', 'comp-storage'],
    complexity: 92,
    lines: project.stats?.linesOfCode || 500,
    details: 'App Core Root & AST Execution Context'
  });

  // Level 1: Core Subsystems
  const subsystems = [
    { id: 'comp-app', name: 'src/App.tsx', type: 'component' as const, color: '#38BDF8', x: -140, y: -60, z: 40, lines: 280, details: 'Primary React Reactive View & Hook Tree' },
    { id: 'comp-state', name: 'Reactive State Pipeline', type: 'state' as const, color: '#A855F7', x: 140, y: -50, z: -30, lines: 110, details: 'Global Hook Store & Event Dispatcher' },
    { id: 'comp-theme', name: 'Tailwind Cyber Theme', type: 'style' as const, color: '#F43F5E', x: -70, y: 130, z: -50, lines: 85, details: 'Dynamic Design Tokens & Titanium Tokens' },
    { id: 'comp-storage', name: 'IndexedDB / Storage Engine', type: 'api' as const, color: '#10B981', x: 80, y: 120, z: 60, lines: 95, details: 'Durable Local Document Store & Cache' },
    { id: 'comp-audio', name: 'Web Audio Synthesizer', type: 'api' as const, color: '#F59E0B', x: 0, y: -160, z: 20, lines: 60, details: 'Haptic Audio Feedback Oscillator Engine' },
  ];

  subsystems.forEach(s => {
    nodes.push({
      ...s,
      radius: 13,
      connections: ['root-node'],
      complexity: Math.floor(s.lines / 3),
    });
  });

  // Level 2: Component Leaves
  const components = [
    { id: 'leaf-nav', name: 'Header & Navigation', parent: 'comp-app', x: -220, y: -120, z: 80, color: '#38BDF8', lines: 45, details: 'Top Status Bar & Mode Switcher' },
    { id: 'leaf-grid', name: 'Interactive Data Matrix', parent: 'comp-app', x: -210, y: 30, z: 60, color: '#38BDF8', lines: 80, details: 'Dynamic Cards & Responsive Layout' },
    { id: 'leaf-modal', name: 'Action & Input Modal', parent: 'comp-app', x: -170, y: -160, z: -40, color: '#38BDF8', lines: 65, details: 'Dialog Portal & Form Validation' },
    { id: 'leaf-reducer', name: 'Action Dispatcher', parent: 'comp-state', x: 230, y: -110, z: -60, color: '#A855F7', lines: 50, details: 'State Transitions & Immutability' },
    { id: 'leaf-telemetry', name: 'Real-Time Feed Logger', parent: 'comp-state', x: 220, y: 40, z: -20, color: '#A855F7', lines: 40, details: 'Event Stream & History Trail' },
    { id: 'leaf-pwa', name: 'PWA / Mobile Manifest', parent: 'comp-theme', x: -110, y: 220, z: -80, color: '#F43F5E', lines: 35, details: 'Expo Mobile & Android App Config' },
    { id: 'leaf-cache', name: 'Local Cache Worker', parent: 'comp-storage', x: 140, y: 210, z: 90, color: '#10B981', lines: 40, details: 'Background Offline Synchronizer' },
  ];

  components.forEach(c => {
    nodes.push({
      id: c.id,
      name: c.name,
      type: 'component',
      x: c.x,
      y: c.y,
      z: c.z,
      radius: 9,
      color: c.color,
      connections: [c.parent],
      complexity: Math.floor(c.lines / 2),
      lines: c.lines,
      details: c.details,
    });
  });

  return nodes;
}
