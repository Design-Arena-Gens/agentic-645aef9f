"use client";

import { useEffect, useMemo, useState } from 'react';
import { emails } from '../data/emails';
import { buildAssistantReport } from '../lib/emailAssistant';
import type { AssistantReport, SuggestedResponse } from '../types/email';
import { EmailList } from '../components/EmailList';
import { EmailOverview } from '../components/EmailOverview';
import { ResponseComposer } from '../components/ResponseComposer';
import { ValidationPreview } from '../components/ValidationPreview';

const reportsByEmail: Record<string, AssistantReport> = emails.reduce(
  (accumulator, email) => ({
    ...accumulator,
    [email.id]: buildAssistantReport(email)
  }),
  {}
);

export default function HomePage() {
  const defaultEmailId = emails[0]?.id ?? '';
  const [selectedEmailId, setSelectedEmailId] = useState(defaultEmailId);
  const [responseDraft, setResponseDraft] = useState<SuggestedResponse>(() =>
    defaultEmailId ? { ...reportsByEmail[defaultEmailId].response } : { subject: '', body: '', remarks: '' }
  );

  useEffect(() => {
    if (!selectedEmailId) return;
    setResponseDraft({ ...reportsByEmail[selectedEmailId].response });
  }, [selectedEmailId]);

  const selectedEmail = useMemo(
    () => emails.find((email) => email.id === selectedEmailId),
    [selectedEmailId]
  );

  const selectedReport = selectedEmail ? reportsByEmail[selectedEmail.id] : undefined;

  if (!selectedEmail || !selectedReport) {
    return (
      <main className="app-shell">
        <EmailList
          emails={emails}
          reports={reportsByEmail}
          selectedId={selectedEmailId}
          onSelect={setSelectedEmailId}
        />
        <section className="content">
          <div className="panel empty-state">
            <h3>Bienvenue !</h3>
            <p>Sélectionnez un e-mail dans la liste à gauche pour démarrer l’analyse et la rédaction.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <EmailList emails={emails} reports={reportsByEmail} selectedId={selectedEmailId} onSelect={setSelectedEmailId} />
      <section className="content">
        <EmailOverview email={selectedEmail} report={selectedReport} />
        <ResponseComposer
          value={responseDraft}
          onChange={setResponseDraft}
          onRegenerate={() => setResponseDraft({ ...selectedReport.response })}
        />
        <ValidationPreview response={responseDraft} />
      </section>
    </main>
  );
}
