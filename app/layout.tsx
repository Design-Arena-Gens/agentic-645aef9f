import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assistant Courriels - Agentic',
  description:
    'Assistant spécialisé pour analyser et rédiger des réponses à vos e-mails personnels et professionnels.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
