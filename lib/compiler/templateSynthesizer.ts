import { AppProject, FrameworkType, PlatformType, ThemePreset } from '@/types/aurabots';
import { parsePromptToAST, ParsedPromptAST } from './lexerParser';
import { generateAppCodeForArchetype } from './archetypeTemplates';

export function synthesizeProject(
  prompt: string,
  platform: PlatformType = 'hybrid',
  framework: FrameworkType = 'react-web',
  theme: ThemePreset = 'electric-cyan',
  existingProject?: Partial<AppProject>
): {
  project: AppProject;
  files: Record<string, string>;
  linesOfCode: number;
} {
  const ast: ParsedPromptAST = parsePromptToAST(prompt, theme);

  const projectName = existingProject?.name || ast.title;
  const projectDesc = existingProject?.description || ast.tagline;
  const projectId = existingProject?.id || `aura_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Generate the rich interactive React code for this archetype
  const appTsxContent = generateAppCodeForArchetype(ast, platform, theme);

  // Generate support files
  const packageJson = JSON.stringify({
    name: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    version: "1.0.0",
    private: true,
    description: projectDesc,
    scripts: {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    },
    dependencies: {
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "lucide-react": "^0.344.0",
      "clsx": "^2.1.1",
      "tailwind-merge": "^2.3.0"
    },
    devDependencies: {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.0",
      "typescript": "^5.4.5",
      "tailwindcss": "^3.4.4",
      "autoprefixer": "^10.4.19",
      "postcss": "^8.4.38",
      "vite": "^5.2.11"
    }
  }, null, 2);

  const appJson = JSON.stringify({
    expo: {
      name: projectName,
      slug: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "dark",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#090D16"
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: `com.aurabots.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}`
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#090D16"
        },
        package: `com.aurabots.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}`
      },
      web: {
        favicon: "./assets/favicon.png",
        bundler: "metro"
      }
    }
  }, null, 2);

  const pwaManifest = JSON.stringify({
    short_name: projectName,
    name: projectName,
    description: projectDesc,
    icons: [
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192"
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512"
      }
    ],
    start_url: "/",
    background_color: "#090D16",
    theme_color: ast.themeColors.primary,
    display: "standalone",
    orientation: "portrait"
  }, null, 2);

  const readmeMd = `# ${projectName}

> Synthesized by **AuraBots Native Program Compilation Engine**
> Target Platform: \`${platform.toUpperCase()}\` | Framework: \`${framework}\` | Theme: \`${theme}\`

## 🌟 Overview
${projectDesc}

### Key Features
${ast.features.map(f => `- **${f}**`).join('\n')}

### Architecture
- **Synthesizer Engine**: AuraBots Client-Side Deterministic AST Compiler
- **State Management**: Reactive Hooks with LocalStorage & Web Audio integration
- **Styling**: Tailwind CSS with Cyber Titanium theme
- **Target Platform**: ${platform === 'web' ? 'Web Application' : platform === 'mobile' ? 'Native Mobile (iOS / Android)' : 'Hybrid Responsive Web + Mobile'}

## 🚀 Quick Start

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
\`\`\`

## 📦 Generated File Structure
- \`src/App.tsx\` - Core Application Component & State Pipeline
- \`src/types/index.ts\` - Data Models & Type Definitions
- \`src/styles/theme.css\` - Custom Theme & Glow Effects
- \`package.json\` - Dependencies & Build Scripts
- \`app.json\` - Mobile Expo & Native Config
- \`manifest.json\` - PWA Manifest

---
*Built with AuraBots — The Prompt-to-App Synthesis Engine.*
`;

  const typesTs = `// Auto-generated types for ${projectName}

export interface AppState {
  version: string;
  theme: string;
  lastUpdated: number;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}

export interface ActionLog {
  id: string;
  timestamp: string;
  title: string;
  category: string;
  status: 'success' | 'pending' | 'warning';
}
`;

  const themeCss = `/* AuraBots Synthesized Theme CSS */
:root {
  --color-primary: ${ast.themeColors.primary};
  --color-secondary: ${ast.themeColors.secondary};
  --color-accent: ${ast.themeColors.accent};
  --bg-dark: ${ast.themeColors.bgDark};
  --bg-card: ${ast.themeColors.bgCard};
}

.aurabot-glow {
  box-shadow: 0 0 25px -4px ${ast.themeColors.primary}44;
}

.aurabot-border-glow {
  border-color: ${ast.themeColors.primary}88;
}
`;

  const files: Record<string, string> = {
    'src/App.tsx': appTsxContent,
    'src/types/index.ts': typesTs,
    'src/styles/theme.css': themeCss,
    'package.json': packageJson,
    'app.json': appJson,
    'public/manifest.json': pwaManifest,
    'README.md': readmeMd,
  };

  let totalLines = 0;
  Object.values(files).forEach(content => {
    totalLines += content.split('\n').length;
  });

  const project: AppProject = {
    id: projectId,
    name: projectName,
    description: projectDesc,
    prompt: prompt,
    platform: platform,
    framework: framework,
    theme: theme,
    version: '1.0.0',
    files: files,
    activeFilePath: 'src/App.tsx',
    createdAt: existingProject?.createdAt || Date.now(),
    updatedAt: Date.now(),
    starred: existingProject?.starred || false,
    category: ast.archetype.replace('_', ' ').toUpperCase(),
    tags: ast.features.slice(0, 4),
    author: 'You (AuraBots Studio)',
    stats: {
      componentsCount: ast.components.length + 3,
      linesOfCode: totalLines,
      astNodes: ast.components.length * 15 + 40,
      bundleSizeBytes: totalLines * 65,
      compilationTimeMs: Math.floor(Math.random() * 150 + 220),
    }
  };

  return { project, files, linesOfCode: totalLines };
}
