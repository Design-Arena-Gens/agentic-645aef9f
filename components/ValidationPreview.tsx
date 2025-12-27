"use client";

import { useMemo } from 'react';
import type { SuggestedResponse } from '../types/email';

interface ValidationPreviewProps {
  response: SuggestedResponse;
}

const formatPreview = (response: SuggestedResponse) =>
  `Objet du mail : ${response.subject}

Réponse proposée :
${response.body.trim()}

- Remarques éventuelles : ${response.remarks.trim() || 'Aucune, à valider.'}
`;

export function ValidationPreview({ response }: ValidationPreviewProps) {
  const formatted = useMemo(() => formatPreview(response), [response]);

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="panel-title" style={{ margin: 0 }}>
          Format de validation
        </h3>
        <span className="pill info">Prêt pour validation humaine</span>
      </div>
      <p style={{ color: 'var(--neutral-500)', fontSize: '0.85rem' }}>
        Copiez/collez ce bloc dans votre réponse au supérieur pour obtenir la validation avant envoi.
      </p>
      <pre
        style={{
          background: '#0f172a',
          color: '#e2e8f0',
          padding: '1.25rem',
          borderRadius: '0.85rem',
          fontSize: '0.92rem',
          lineHeight: 1.6,
          overflowX: 'auto',
          margin: 0
        }}
      >
        {formatted}
      </pre>
    </section>
  );
}
