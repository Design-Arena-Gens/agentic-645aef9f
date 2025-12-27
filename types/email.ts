export type EmailTone = 'bienveillant' | 'professionnel' | 'ferme' | 'neutre';

export type ResponseObjective = 'remercier' | 'clarifier' | 'planifier' | 'soutien' | 'transmettre';

export interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string;
  threadRef?: string;
  metadata?: {
    project?: string;
    relatedTo?: string;
  };
}

export interface EmailAnalysis {
  category: 'professionnel' | 'personnel';
  urgency: 'urgent' | 'à relancer' | 'normal';
  dominantEmotion: 'positif' | 'stressé' | 'déçu' | 'demandant' | 'neutre';
  summary: string;
  keyPoints: string[];
  historyHint?: string;
}

export interface SuggestedResponse {
  subject: string;
  body: string;
  remarks: string;
}

export interface AssistantReport {
  analysis: EmailAnalysis;
  suggestions: {
    tone: EmailTone;
    objectives: ResponseObjective[];
    followUpDate?: string;
    reminders: string[];
  };
  response: SuggestedResponse;
}
