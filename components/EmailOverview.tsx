"use client";

import type { AssistantReport, EmailMessage } from '../types/email';

interface EmailOverviewProps {
  email: EmailMessage;
  report: AssistantReport;
}

const labelForUrgency = (value: AssistantReport['analysis']['urgency']) => {
  switch (value) {
    case 'urgent':
      return { label: 'Urgence élevée', className: 'pill warning' };
    case 'à relancer':
      return { label: 'Relance à prévoir', className: 'pill info' };
    default:
      return { label: 'Priorité normale', className: 'pill' };
  }
};

export function EmailOverview({ email, report }: EmailOverviewProps) {
  const urgencyBadge = labelForUrgency(report.analysis.urgency);

  return (
    <section className="panel">
      <div className="email-header">
        <h2>{email.subject}</h2>
        <div className="email-metadata">
          <span>De : {email.sender}</span>
          <span>Reçu le {new Date(email.receivedAt).toLocaleString('fr-FR')}</span>
          {email.metadata?.project && <span>Projet : {email.metadata.project}</span>}
          {email.threadRef && <span>Référence : {email.threadRef}</span>}
        </div>
        <div className="status-badges">
          <span className={urgencyBadge.className}>{urgencyBadge.label}</span>
          <span className="pill info">Ton recommandé : {report.suggestions.tone}</span>
          <span className="pill">Emotion détectée : {report.analysis.dominantEmotion}</span>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 className="panel-title">Résumé automatique</h3>
        <p style={{ margin: '0 0 1.25rem', color: 'var(--neutral-700)', fontSize: '0.95rem' }}>
          {report.analysis.summary}
        </p>

        <div className="analysis-grid">
          <div className="analysis-card">
            <h4>Points clés identifiés</h4>
            <ul>
              {report.analysis.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="analysis-card">
            <h4>Objectifs de la réponse</h4>
            <ul>
              {report.suggestions.objectives.map((item) => (
                <li key={item}>{item[0].toUpperCase() + item.slice(1)}</li>
              ))}
            </ul>
          </div>
          <div className="analysis-card">
            <h4>Suivi conseillé</h4>
            <ul>
              <li>
                {report.suggestions.followUpDate
                  ? `Prévoir un point le ${report.suggestions.followUpDate}`
                  : 'Pas de deadline explicite détectée'}
              </li>
              {report.suggestions.reminders.length === 0 ? (
                <li>Pas de rappel additionnel requis</li>
              ) : (
                report.suggestions.reminders.map((reminder, index) => <li key={index}>{reminder}</li>)
              )}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 className="panel-title">Message original</h3>
        <div className="email-body">{email.body}</div>
      </div>

      {report.analysis.historyHint && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="analysis-card" style={{ background: 'rgba(37, 99, 235, 0.07)' }}>
            <h4 style={{ marginBottom: '0.4rem' }}>Contexte à garder en tête</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
              {report.analysis.historyHint}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
