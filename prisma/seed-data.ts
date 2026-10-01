/**
 * The curriculum the pilot starts from. Titles and URLs are the providers'
 * own and MUST be re-checked by a human before the pilot (providers rename
 * and move courses). The employer survey will reshape this list.
 */
export const COMPETENCIES = [
  { slug: 'culture-numerique', nameFr: 'Culture numérique', nameEn: 'Digital literacy', descriptionFr: 'Travailler avec les outils du bureau moderne : messagerie, documents partagés, tableurs, visioconférence.' },
  { slug: 'pensee-critique', nameFr: 'Pensée critique', nameEn: 'Critical thinking', descriptionFr: 'Évaluer une information, distinguer un fait d’une opinion, argumenter avec des preuves.' },
  { slug: 'resolution-de-problemes', nameFr: 'Résolution de problèmes', nameEn: 'Problem-solving', descriptionFr: 'Décomposer une situation, proposer des options, choisir et expliquer pourquoi.' },
  { slug: 'raisonnement-logique', nameFr: 'Raisonnement logique', nameEn: 'Logical reasoning', descriptionFr: 'Suivre et construire un raisonnement, lire des données, repérer une erreur.' },
  { slug: 'travail-en-equipe', nameFr: 'Travail en équipe', nameEn: 'Teamwork', descriptionFr: 'Communiquer clairement, tenir ses engagements, donner et recevoir un retour.' },
  { slug: 'adaptabilite', nameFr: 'Adaptabilité', nameEn: 'Adaptability', descriptionFr: 'Apprendre vite, accepter le changement, rester fiable quand le contexte bouge.' },
  { slug: 'communication-professionnelle', nameFr: 'Communication professionnelle', nameEn: 'Professional communication', descriptionFr: 'Écrire un courriel clair, présenter une idée, s’adresser à un client ou un supérieur.' },
] as const;

export type CourseSeed = {
  slug: string;
  title: string;
  provider: string;
  url: string;
  language: 'fr' | 'en';
  estimatedHours: number;
  isFree: boolean;
  hasCertificate: boolean;
  certificateIsFree: boolean;
  competencies: readonly string[];
  description?: string;
};

export const COURSES: readonly CourseSeed[] = [
  { slug: 'google-fondamentaux-marketing-numerique', title: 'Les fondamentaux du marketing numérique', provider: 'Google Ateliers Numériques', url: 'https://learndigital.withgoogle.com/ateliersnumeriques/course/digital-marketing', language: 'fr', estimatedHours: 40, isFree: true, hasCertificate: true, certificateIsFree: true, competencies: ['culture-numerique'], description: 'URL à vérifier : le catalogue Google a migré vers Skillshop.' },
  { slug: 'microsoft-digital-literacy', title: 'Digital Literacy', provider: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/training/paths/digital-literacy/', language: 'en', estimatedHours: 10, isFree: true, hasCertificate: false, certificateIsFree: false, competencies: ['culture-numerique'] },
  { slug: 'pix-competences-numeriques', title: 'Pix — compétences numériques', provider: 'Pix', url: 'https://pix.fr/', language: 'fr', estimatedHours: 20, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['culture-numerique'], description: 'Le parcours est gratuit ; la certification passe par un centre agréé.' },
  { slug: 'coursera-apprendre-comment-apprendre', title: 'Apprendre comment apprendre (ACA)', provider: 'Coursera / UC San Diego', url: 'https://www.coursera.org/learn/apprendre-comment-apprendre', language: 'fr', estimatedHours: 15, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['adaptabilite'] },
  { slug: 'coursera-learning-how-to-learn', title: 'Learning How to Learn', provider: 'Coursera / UC San Diego', url: 'https://www.coursera.org/learn/learning-how-to-learn', language: 'en', estimatedHours: 15, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['adaptabilite'] },
  { slug: 'edx-critical-thinking-problem-solving', title: 'Critical Thinking & Problem Solving', provider: 'edX / RITx', url: 'https://www.edx.org/learn/critical-thinking/rochester-institute-of-technology-critical-thinking-problem-solving', language: 'en', estimatedHours: 21, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['pensee-critique', 'resolution-de-problemes'] },
  { slug: 'openclassrooms-developpez-votre-esprit-critique', title: 'Développez votre esprit critique', provider: 'OpenClassrooms', url: 'https://openclassrooms.com/fr/courses/6817421-developpez-votre-esprit-critique', language: 'fr', estimatedHours: 6, isFree: true, hasCertificate: true, certificateIsFree: true, competencies: ['pensee-critique'] },
  { slug: 'coursera-creative-problem-solving', title: 'Creative Problem Solving', provider: 'Coursera / University of Minnesota', url: 'https://www.coursera.org/learn/creative-problem-solving', language: 'en', estimatedHours: 15, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['resolution-de-problemes'] },
  { slug: 'coursera-introduction-to-logic', title: 'Introduction to Logic', provider: 'Coursera / Stanford', url: 'https://www.coursera.org/learn/logic-introduction', language: 'en', estimatedHours: 35, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['raisonnement-logique'] },
  { slug: 'khan-academy-intro-programmation-js', title: 'Introduction à la programmation (JavaScript)', provider: 'Khan Academy', url: 'https://fr.khanacademy.org/computing/computer-programming/programming', language: 'fr', estimatedHours: 20, isFree: true, hasCertificate: false, certificateIsFree: false, competencies: ['raisonnement-logique'] },
  { slug: 'coursera-teamwork-skills', title: 'Teamwork Skills: Communicating Effectively in Groups', provider: 'Coursera / CU Boulder', url: 'https://www.coursera.org/learn/teamwork-skills-effective-communication', language: 'en', estimatedHours: 13, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['travail-en-equipe', 'communication-professionnelle'] },
  { slug: 'coursera-write-professional-emails-english', title: 'Write Professional Emails in English', provider: 'Coursera / Georgia Tech', url: 'https://www.coursera.org/learn/professional-emails-english', language: 'en', estimatedHours: 20, isFree: true, hasCertificate: true, certificateIsFree: false, competencies: ['communication-professionnelle'] },
];

export type TemplateSeed = {
  slug: string;
  name: string;
  type: 'SHORT' | 'MEDIUM' | 'LONG';
  targetWeeks: number;
  descriptionFr: string;
  /** [competency slug, course slug] in order. */
  items: readonly (readonly [string, string])[];
};

const SHORT_ITEMS = [
  ['culture-numerique', 'google-fondamentaux-marketing-numerique'],
  ['pensee-critique', 'openclassrooms-developpez-votre-esprit-critique'],
  ['resolution-de-problemes', 'coursera-creative-problem-solving'],
  ['raisonnement-logique', 'khan-academy-intro-programmation-js'],
  ['travail-en-equipe', 'coursera-teamwork-skills'],
  ['adaptabilite', 'coursera-apprendre-comment-apprendre'],
  ['communication-professionnelle', 'coursera-write-professional-emails-english'],
] as const;

const MEDIUM_ITEMS = [
  ...SHORT_ITEMS,
  ['pensee-critique', 'edx-critical-thinking-problem-solving'],
  ['raisonnement-logique', 'coursera-introduction-to-logic'],
  ['culture-numerique', 'pix-competences-numeriques'],
  ['adaptabilite', 'coursera-learning-how-to-learn'],
] as const;

const LONG_ITEMS = [...MEDIUM_ITEMS, ['culture-numerique', 'microsoft-digital-literacy']] as const;

export const TEMPLATES: readonly TemplateSeed[] = [
  { slug: 'parcours-court', name: 'Parcours court', type: 'SHORT', targetWeeks: 12, descriptionFr: 'Un cours par compétence, en français d’abord. Environ 100 heures, soit 8 heures par semaine.', items: SHORT_ITEMS },
  { slug: 'parcours-moyen', name: 'Parcours moyen', type: 'MEDIUM', targetWeeks: 24, descriptionFr: 'Le parcours court, approfondi par un second cours sur les compétences clés. Quelques heures par semaine.', items: MEDIUM_ITEMS },
  { slug: 'parcours-long', name: 'Parcours long', type: 'LONG', targetWeeks: 40, descriptionFr: 'Tous les cours du catalogue, sans date butoir.', items: LONG_ITEMS },
];
