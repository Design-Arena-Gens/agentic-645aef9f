"use client";

import type { SuggestedResponse } from '../types/email';

interface ResponseComposerProps {
  value: SuggestedResponse;
  onChange: (response: SuggestedResponse) => void;
  onRegenerate: () => void;
}

export function ResponseComposer({ value, onChange, onRegenerate }: ResponseComposerProps) {
  return (
    <section className="panel response-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="panel-title" style={{ margin: 0 }}>
          Proposition de réponse
        </h3>
        <button type="button" className="btn btn-secondary" onClick={onRegenerate}>
          Réactualiser selon l’analyse
        </button>
      </div>

      <div className="response-field">
        <label>Objet du mail</label>
        <input
          value={value.subject}
          onChange={(event) => onChange({ ...value, subject: event.target.value })}
          placeholder="Objet du mail"
        />
      </div>

      <div className="response-field">
        <label>Réponse proposée</label>
        <textarea
          rows={10}
          value={value.body}
          onChange={(event) => onChange({ ...value, body: event.target.value })}
          placeholder="Réponse à valider par l’utilisateur"
        />
      </div>

      <div className="response-field">
        <label>Remarques éventuelles</label>
        <textarea
          rows={3}
          value={value.remarks}
          onChange={(event) => onChange({ ...value, remarks: event.target.value })}
          placeholder="Points d’attention, validations à demander, informations manquantes…"
        />
      </div>
    </section>
  );
}
