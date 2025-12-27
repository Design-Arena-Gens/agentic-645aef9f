import type { EmailMessage } from '../types/email';

export const emails: EmailMessage[] = [
  {
    id: 'mail-001',
    sender: 'Sophie Martin · RH',
    subject: 'Suivi entretien et documents manquants',
    receivedAt: '2025-01-14T08:45:00.000Z',
    body: `Bonjour,

Merci encore pour l’entretien de vendredi. Nous avons eu un excellent retour de l’équipe.

Pour finaliser ton dossier avant la proposition officielle, nous aurions besoin :
- D’une copie de ton diplôme de master
- De tes disponibilités pour une éventuelle prise de poste
- De savoir si tu as des contraintes particulières sur le télétravail

Peux-tu nous transmettre ces éléments d’ici mercredi ?

Bien cordialement,
Sophie`
  },
  {
    id: 'mail-002',
    sender: 'Guillaume · Ami de promo',
    subject: 'Des nouvelles & invitation',
    receivedAt: '2025-01-13T19:12:00.000Z',
    body: `Hey !

Ça fait une éternité ! On organise un dîner de retrouvailles samedi prochain avec la bande de promo. 
Ça te dirait de venir ? On peut garder une place à côté de toi si tu ne veux pas être coincé à côté de Julien ;)

Au passage, comment avance ton projet de freelance ? Toujours preneur d’un coup de main si tu veux qu’on brainstorme.

On t’embrasse,
Gui`
  },
  {
    id: 'mail-003',
    sender: 'Claire Durand · Cliente',
    subject: 'Point sur la livraison du rapport trimestriel',
    receivedAt: '2025-01-12T11:30:00.000Z',
    threadRef: 'Contrat #4588',
    metadata: {
      project: 'Accompagnement stratégique Riviera',
      relatedTo: 'Rapport Q4'
    },
    body: `Bonjour,

Nous avons bien reçu la première version du rapport trimestriel hier.

Plusieurs éléments nécessitent des clarifications avant la réunion de jeudi :
1. Les chiffres de la page 7 ne correspondent pas aux indicateurs communiqués en réunion de décembre.
2. La section recommandation manque d’exemples concrets sur les prochaines étapes.
3. Pouvez-vous ajouter une synthèse exécutive en début de document ?

Merci de nous dire si vous pouvez intégrer ces retours d’ici mercredi midi afin que nous puissions valider avant la présentation.

Bien à vous,
Claire`
  }
];
