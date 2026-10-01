import type { Locale } from '@/i18n';
import { SITE_URL } from '@/lib/links';
import { button, emailLayout, escapeHtml, paragraph } from '../layout';

export function applicationReceived(args: { firstName: string; locale: Locale }) {
  const fr = args.locale !== 'en';
  const subject = fr ? 'Candidature reçue — DANGBE' : 'Application received — DANGBE';
  const lines = fr
    ? [
        `Bonjour ${args.firstName},`,
        'Nous avons bien reçu votre candidature à la cohorte pilote DANGBE. Merci.',
        'L’équipe lit chaque candidature et vous répond sous deux semaines, quelle que soit la réponse.',
        'En attendant, vous pouvez relire le programme sur dangbe.org/programme.',
      ]
    : [
        `Hello ${args.firstName},`,
        'We have received your application to the DANGBE pilot cohort. Thank you.',
        'The team reads every application and answers within two weeks, whatever the answer.',
        'Meanwhile, you can read the program again at dangbe.org/en/program.',
      ];
  return {
    subject,
    text: lines.join('\n\n'),
    html: emailLayout({ title: subject, bodyHtml: lines.map(paragraph).join('') }),
  };
}

export function newApplicationNotice(args: { firstName: string; lastName: string; city: string; applicationId: string }) {
  const subject = `Nouvelle candidature : ${args.firstName} ${args.lastName}`;
  const url = `${SITE_URL}/espace/candidatures/${args.applicationId}`;
  const text = `Nouvelle candidature de ${args.firstName} ${args.lastName} (${args.city}).\n\nÀ lire dans l’espace : ${url}`;
  return {
    subject,
    text,
    html: emailLayout({
      title: subject,
      bodyHtml: paragraph(`Nouvelle candidature de ${args.firstName} ${args.lastName} (${args.city}).`) + button(url, 'Lire la candidature'),
    }),
  };
}

export function applicationDecision(args: { firstName: string; decision: 'REJECTED' | 'WAITLISTED'; locale: Locale }) {
  const fr = args.locale !== 'en';
  const waitlisted = args.decision === 'WAITLISTED';
  const subject = fr
    ? waitlisted
      ? 'Votre candidature est en liste d’attente — DANGBE'
      : 'Réponse à votre candidature — DANGBE'
    : waitlisted
      ? 'Your application is on the waiting list — DANGBE'
      : 'Answer to your application — DANGBE';
  const lines = fr
    ? waitlisted
      ? [
          `Bonjour ${args.firstName},`,
          'Merci pour votre candidature. La cohorte pilote est complète pour le moment ; votre candidature est en liste d’attente.',
          'Nous vous écrirons dès qu’une place se libère ou qu’une nouvelle cohorte ouvre. Vous n’avez rien à refaire.',
        ]
      : [
          `Bonjour ${args.firstName},`,
          'Merci pour votre candidature à la cohorte pilote DANGBE. Nous ne pouvons pas vous y accueillir cette fois-ci.',
          'La cohorte pilote est petite, et le choix ne dit rien de votre valeur. Vous pourrez postuler de nouveau à la prochaine cohorte ; nous vous préviendrons de son ouverture.',
        ]
    : waitlisted
      ? [
          `Hello ${args.firstName},`,
          'Thank you for your application. The pilot cohort is full for now; your application is on the waiting list.',
          'We will write as soon as a seat opens or a new cohort starts. There is nothing you need to do.',
        ]
      : [
          `Hello ${args.firstName},`,
          'Thank you for applying to the DANGBE pilot cohort. We cannot welcome you this time.',
          'The pilot cohort is small, and the choice says nothing about your worth. You can apply again to the next cohort; we will let you know when it opens.',
        ];
  return { subject, text: lines.join('\n\n'), html: emailLayout({ title: subject, bodyHtml: lines.map(paragraph).join('') }) };
}

export function invitation(args: {
  firstName: string;
  url: string;
  locale: Locale;
  cohortName: string;
  expiresDays: number;
  /** The person already has a password: the link goes to the sign-in page. */
  existingAccount?: boolean;
}) {
  const fr = args.locale !== 'en';
  const subject = fr ? `Bienvenue dans la ${args.cohortName} — DANGBE` : `Welcome to the ${args.cohortName} — DANGBE`;
  const third = args.existingAccount
    ? fr
      ? 'Connectez-vous avec votre mot de passe habituel pour voir votre nouveau parcours.'
      : 'Sign in with your usual password to see your new pathway.'
    : fr
      ? `Créez votre mot de passe pour ouvrir votre espace de suivi. Le lien est valable ${args.expiresDays} jours.`
      : `Set your password to open your tracking space. The link is valid for ${args.expiresDays} days.`;
  const lines = fr
    ? [`Bonjour ${args.firstName},`, `Bonne nouvelle : vous êtes admis dans la ${args.cohortName}.`, third]
    : [`Hello ${args.firstName},`, `Good news: you are admitted to the ${args.cohortName}.`, third];
  const label = args.existingAccount ? (fr ? 'Ouvrir mon espace' : 'Open my space') : fr ? 'Créer mon mot de passe' : 'Set my password';
  return {
    subject,
    text: `${lines.join('\n\n')}\n\n${args.url}`,
    html: emailLayout({ title: subject, bodyHtml: lines.map(paragraph).join('') + button(args.url, label) + paragraph(args.url) }),
  };
}

export function teamInvitation(args: { firstName: string; url: string; role: 'ADMIN' | 'MENTOR'; expiresDays: number }) {
  const subject = 'Votre accès à l’espace DANGBE';
  const roleLabel = args.role === 'ADMIN' ? 'administrateur' : 'mentor';
  const lines = [
    `Bonjour ${args.firstName},`,
    `Un compte ${roleLabel} vous a été ouvert sur l’espace DANGBE.`,
    `Créez votre mot de passe pour y accéder. Le lien est valable ${args.expiresDays} jours.`,
  ];
  return {
    subject,
    text: `${lines.join('\n\n')}\n\n${args.url}`,
    html: emailLayout({ title: subject, bodyHtml: lines.map(paragraph).join('') + button(args.url, 'Créer mon mot de passe') + paragraph(args.url) }),
  };
}

export function passwordReset(args: { firstName: string; url: string; locale: Locale; expiresMinutes: number }) {
  const fr = args.locale !== 'en';
  const subject = fr ? 'Réinitialiser votre mot de passe — DANGBE' : 'Reset your password — DANGBE';
  const lines = fr
    ? [
        `Bonjour ${args.firstName},`,
        `Vous avez demandé un nouveau mot de passe. Le lien ci-dessous est valable ${args.expiresMinutes} minutes.`,
        'Si vous n’êtes pas à l’origine de cette demande, ignorez ce message : rien ne change.',
      ]
    : [
        `Hello ${args.firstName},`,
        `You asked for a new password. The link below is valid for ${args.expiresMinutes} minutes.`,
        'If you did not ask for this, ignore this message: nothing changes.',
      ];
  const label = fr ? 'Choisir un nouveau mot de passe' : 'Choose a new password';
  return {
    subject,
    text: `${lines.join('\n\n')}\n\n${args.url}`,
    html: emailLayout({ title: subject, bodyHtml: lines.map(paragraph).join('') + button(args.url, label) + paragraph(args.url) }),
  };
}

export function proofValidated(args: { firstName: string; courseTitle: string; decision: 'VALIDATED' | 'REJECTED'; note?: string | null }) {
  const ok = args.decision === 'VALIDATED';
  const subject = ok ? `Preuve validée : ${args.courseTitle}` : `Preuve à revoir : ${args.courseTitle}`;
  const lines = [
    `Bonjour ${args.firstName},`,
    ok
      ? `Votre preuve pour « ${args.courseTitle} » a été validée. Bravo, continuez.`
      : `Votre preuve pour « ${args.courseTitle} » n’a pas pu être validée.${args.note ? ` Message de votre mentor : ${args.note}` : ''} Vous pouvez en joindre une nouvelle depuis votre espace.`,
  ];
  return {
    subject,
    text: `${lines.join('\n\n')}\n\n${SITE_URL}/espace/mon-parcours`,
    html: emailLayout({
      title: subject,
      bodyHtml: lines.map((l) => paragraph(l)).join('') + button(`${SITE_URL}/espace/mon-parcours`, 'Ouvrir mon parcours'),
    }),
  };
}

export const _escape = escapeHtml;
