"use client";

import classNames from 'classnames';
import type { AssistantReport, EmailMessage } from '../types/email';

interface EmailListProps {
  emails: EmailMessage[];
  reports: Record<string, AssistantReport>;
  selectedId: string;
  onSelect: (emailId: string) => void;
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function EmailList({ emails, reports, selectedId, onSelect }: EmailListProps) {
  return (
    <aside className="sidebar">
      <header>
        <h1>Assistant Courriels</h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--neutral-500)', fontSize: '0.85rem' }}>
          Analyse et rédaction assistée
        </p>
      </header>
      <div className="email-categories">
        <span className="category-pill">Professionnels : {emails.filter((mail) => reports[mail.id].analysis.category === 'professionnel').length}</span>
        <span className="category-pill">
          Personnels : {emails.filter((mail) => reports[mail.id].analysis.category === 'personnel').length}
        </span>
        <span className="category-pill urgent">
          Urgents : {emails.filter((mail) => reports[mail.id].analysis.urgency === 'urgent').length}
        </span>
      </div>
      <div className="email-list">
        {emails.map((email) => {
          const { analysis } = reports[email.id];
          return (
            <button
              key={email.id}
              type="button"
              onClick={() => onSelect(email.id)}
              className={classNames('email-item', { active: selectedId === email.id })}
            >
              <strong>{email.subject}</strong>
              <div className="meta">
                <span>{email.sender}</span>
                <span>{formatDate(email.receivedAt)}</span>
              </div>
              <div className="tags">
                <span className={classNames('tag', analysis.category)}>{analysis.category}</span>
                {analysis.urgency !== 'normal' && (
                  <span
                    className={classNames('tag', {
                      urgent: analysis.urgency === 'urgent',
                      relance: analysis.urgency === 'à relancer'
                    })}
                  >
                    {analysis.urgency}
                  </span>
                )}
                <span className="tag">{analysis.dominantEmotion}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
