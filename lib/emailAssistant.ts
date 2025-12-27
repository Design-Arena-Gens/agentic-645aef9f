import { format, isBefore, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type {
  AssistantReport,
  EmailAnalysis,
  EmailMessage,
  EmailTone,
  ResponseObjective,
  SuggestedResponse
} from '../types/email';

const professionalKeywords = [
  'réunion',
  'rapport',
  'projet',
  'dossier',
  'client',
  'livraison',
  'contrat',
  'proposition',
  'document',
  'validation'
];

const urgencyKeywords = ['urgent', 'rapide', 'dès que possible', 'asap', 'd’ici', 'avant', 'mercredi'];

const positiveKeywords = ['merci', 'excellent', 'bonne nouvelle', 'heureux', 'ravis'];
const stressedKeywords = ['urgent', 'inquiet', 'manque', 'retard', 'problème'];
const disappointedKeywords = ['déçu', 'dommage', 'ne convient pas', 'insatisfait'];

const responseObjectivesByCategory: Record<string, ResponseObjective[]> = {
  professionnel: ['clarifier', 'planifier', 'transmettre'],
  personnel: ['remercier', 'soutien', 'planifier']
};

const toneByCategory: Record<string, EmailTone> = {
  professionnel: 'professionnel',
  personnel: 'bienveillant'
};

const cleanText = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const containsKeyword = (text: string, keywords: string[]) => {
  const sanitized = cleanText(text);
  return keywords.some((keyword) => sanitized.includes(keyword));
};

const detectCategory = (email: EmailMessage): EmailAnalysis['category'] => {
  if (email.metadata?.project || email.threadRef) {
    return 'professionnel';
  }
  if (containsKeyword(email.body, professionalKeywords)) {
    return 'professionnel';
  }
  return 'personnel';
};

const detectUrgency = (email: EmailMessage): EmailAnalysis['urgency'] => {
  const text = cleanText(email.body);
  if (containsKeyword(text, urgencyKeywords)) {
    return 'urgent';
  }

  if (text.includes('relance') || text.includes('nouvelles')) {
    return 'à relancer';
  }

  const deadlineMatches = email.body.match(
    /\b(demain|aujourd'hui|ce (?:matin|soir)|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/i
  );
  if (deadlineMatches) {
    return 'urgent';
  }

  return 'normal';
};

const detectEmotion = (email: EmailMessage): EmailAnalysis['dominantEmotion'] => {
  const text = cleanText(email.body);
  if (containsKeyword(text, positiveKeywords)) {
    return 'positif';
  }

  if (containsKeyword(text, disappointedKeywords)) {
    return 'déçu';
  }

  if (containsKeyword(text, stressedKeywords)) {
    return 'stressé';
  }

  if (text.includes('?')) {
    return 'demandant';
  }

  return 'neutre';
};

const summarizeEmail = (email: EmailMessage): string => {
  const firstParagraph = email.body.split('\n').find((line) => line.trim().length > 0) ?? email.body;
  const cleanParagraph = firstParagraph.replace(/\s+/g, ' ').trim();
  if (cleanParagraph.length > 140) {
    return `${cleanParagraph.slice(0, 137)}...`;
  }
  return cleanParagraph;
};

const inferHistoryHint = (email: EmailMessage): string | undefined => {
  if (email.metadata?.project) {
    return `Dernier échange sur « ${email.metadata.project} », référence ${email.threadRef ?? 'N/A'}.`;
  }
  if (email.body.toLowerCase().includes('encore') || email.body.toLowerCase().includes('retour')) {
    return "L'expéditeur attend un retour depuis un précédent message.";
  }
  return undefined;
};

const extractKeyPoints = (email: EmailMessage): string[] => {
  const lines = email.body.split('\n');
  const points: string[] = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (/^[-\d•]/.test(trimmed)) {
      points.push(trimmed.replace(/^[-\d•.()\s]+/, '').trim());
    }
  });
  if (points.length === 0) {
    const sentences = email.body
      .split(/[\n\.!?]/)
      .map((segment) => segment.trim())
      .filter(Boolean);
    return sentences.slice(0, 3);
  }
  return points;
};

const formatFollowUpDate = (email: EmailMessage): string | undefined => {
  const explicitDateMatch = email.body.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/);
  if (explicitDateMatch) {
    const parsed = parseISO(explicitDateMatch[1].split('/').reverse().join('-'));
    if (!isNaN(parsed.getTime()) && isBefore(new Date(), parsed)) {
      return format(parsed, "EEEE d MMMM yyyy", { locale: fr });
    }
  }

  if (email.body.toLowerCase().includes('mercredi')) {
    return 'Mercredi (prochain)';
  }

  if (email.body.toLowerCase().includes('jeudi')) {
    return 'Jeudi (prochain)';
  }

  return undefined;
};

const buildResponseSubject = (email: EmailMessage): string => {
  const base = email.subject.trim();
  return base.toLowerCase().startsWith('re:') ? base : `Re: ${base}`;
};

const buildResponseBody = (email: EmailMessage, analysis: EmailAnalysis): string => {
  const salutations = analysis.category === 'professionnel' ? 'Bonjour' : 'Salut';
  const closing =
    analysis.category === 'professionnel'
      ? 'Bien cordialement,\n[Votre nom]'
      : 'À très vite,\n[Votre prénom]';

  const intro =
    analysis.category === 'professionnel'
      ? `Merci pour votre message et pour les précisions apportées.`
      : `Merci pour ton message, ça me fait très plaisir d’avoir de tes nouvelles.`;

  const actionLines = analysis.keyPoints
    .slice(0, 3)
    .map((point, index) => {
      if (analysis.category === 'professionnel') {
        return `${index + 1}. ${point[0].toUpperCase()}${point.slice(1)} — voici ma réponse :`;
      }
      return `• ${point[0].toUpperCase()}${point.slice(1)}.`;
    })
    .join('\n');

  const commitment =
    analysis.category === 'professionnel'
      ? `Je vous confirme que je peux traiter les points mentionnés${formatFollowUpDate(email) ? ` d’ici ${formatFollowUpDate(email)}` : ''}.`
      : `Je serais ravi(e) de ${analysis.keyPoints[0]?.toLowerCase() ?? 'poursuivre la discussion'}.`;

  const clarificationAsk =
    analysis.category === 'professionnel'
      ? `N'hésitez pas à me dire si vous souhaitez un échange rapide pour valider les détails.`
      : `Dis-moi ce qui t’arrangerait le plus et on s’organise.`;

  return `${salutations},

${intro}

${actionLines}

${commitment}
${clarificationAsk}

${closing}`;
};

const buildRemarks = (analysis: EmailAnalysis): string => {
  const baseRemarks: string[] = [];

  if (analysis.urgency === 'urgent') {
    baseRemarks.push('Répondre avant la fin de journée pour respecter la demande.');
  }

  if (analysis.urgency === 'à relancer') {
    baseRemarks.push('Prévoir une relance si aucune réponse sous 48h.');
  }

  if (analysis.dominantEmotion === 'stressé') {
    baseRemarks.push('Soigner le ton rassurant, proposer une solution concrète.');
  }

  if (analysis.dominantEmotion === 'déçu') {
    baseRemarks.push('Inclure des excuses si nécessaire et un plan de correction.');
  }

  if (baseRemarks.length === 0) {
    baseRemarks.push('Relire avant envoi pour confirmer les informations clés.');
  }

  return baseRemarks.join(' • ');
};

const createSuggestedResponse = (email: EmailMessage, analysis: EmailAnalysis): SuggestedResponse => ({
  subject: buildResponseSubject(email),
  body: buildResponseBody(email, analysis),
  remarks: buildRemarks(analysis)
});

export const buildAssistantReport = (email: EmailMessage): AssistantReport => {
  const category = detectCategory(email);
  const urgency = detectUrgency(email);
  const dominantEmotion = detectEmotion(email);
  const summary = summarizeEmail(email);
  const keyPoints = extractKeyPoints(email);
  const historyHint = inferHistoryHint(email);

  const analysis: EmailAnalysis = {
    category,
    urgency,
    dominantEmotion,
    summary,
    keyPoints,
    historyHint
  };

  const tone = toneByCategory[category];
  const objectives = responseObjectivesByCategory[category];
  const followUpDate = formatFollowUpDate(email);
  const reminders = [
    urgency === 'urgent' ? 'Planifier un rappel automatique si aucune réponse reçue.' : undefined,
    dominantEmotion === 'déçu' ? 'Prévoir un point téléphonique pour personnaliser le suivi.' : undefined
  ].filter(Boolean) as string[];

  const response = createSuggestedResponse(email, analysis);

  return {
    analysis,
    suggestions: {
      tone,
      objectives,
      followUpDate,
      reminders
    },
    response
  };
};
