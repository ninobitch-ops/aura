import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AuraBots — Prompt-Driven Web & Mobile App Builder',
  description: 'Construct, preview, and package fully functional web applications, native mobile apps, and hybrid codebases with client-side native compilation synthesis.',
  openGraph: {
    title: 'AuraBots — Prompt-Driven App Builder',
    description: 'Construct, preview, and package fully functional web & native mobile apps.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraBots — Prompt-Driven App Builder',
    description: 'Construct, preview, and package fully functional web & native mobile apps.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
