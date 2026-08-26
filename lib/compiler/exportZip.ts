import JSZip from 'jszip';
import { AppProject } from '@/types/aurabots';
import { buildSandboxHtml } from './sandboxBundler';

/**
 * Packages an AuraBots project into a clean, deployable ZIP archive and initiates download.
 */
export async function exportProjectZip(project: AppProject): Promise<void> {
  const zip = new JSZip();

  // 1. Add all synthesized project files
  Object.entries(project.files).forEach(([filePath, content]) => {
    zip.file(filePath, content);
  });

  // 2. Add build artifacts & standalone preview HTML
  const standaloneHtml = buildSandboxHtml(project);
  zip.file('dist/index.html', standaloneHtml);

  // 3. Add project metadata and AuraBots manifest
  const manifest = {
    aurabots_runtime: '2.0.0',
    id: project.id,
    name: project.name,
    description: project.description,
    platform: project.platform,
    framework: project.framework,
    theme: project.theme,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    stats: project.stats,
    tags: project.tags,
  };
  zip.file('aurabots.json', JSON.stringify(manifest, null, 2));

  // 4. Add README.md
  const readmeContent = `# ${project.name}
${project.description}

Synthesized by **AuraBots** native compilation engine.

## Target Platform
- **Platform**: ${project.platform.toUpperCase()}
- **Framework**: ${project.framework}
- **Theme**: ${project.theme}

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`

## Architecture & Code Tree
- \`src/App.tsx\` - Main application UI component
- \`src/types.ts\` - Data models & state types
- \`src/theme.json\` - Color matrix tokens
- \`dist/index.html\` - Standalone instant sandbox bundle

Built with ❤️ by AuraBots.
`;
  zip.file('README.md', readmeContent);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_aurabots.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Direct export for single standalone HTML runtime.
 */
export function exportSingleHtml(project: AppProject): void {
  const html = buildSandboxHtml(project);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_sandbox.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const downloadProjectZip = exportProjectZip;
export const exportProjectAsZip = exportProjectZip;
