import type { fr } from '../fr';

export const legal: typeof fr.legal = {
  privacy: {
    metaTitle: 'Privacy policy',
    title: 'Privacy policy',
    updated: 'Last updated: September 2026',
    intro: 'DANGBE collects the minimum information needed to process applications and follow participants. This page says which, why, for how long, and how to have it deleted.',
    sections: [
      { h: 'Who is responsible', p: ['The DANGBE initiative, a team of volunteers with no legal entity to date, reachable at the address at the bottom of the page.'] },
      { h: 'What we collect', p: ['Through the application form: identity, contact, education, access to digital tools, motivation and language level.', 'In the tracking space, for admitted participants: declared progress, links to proofs of completion, volunteers’ notes and assessments.'], ul: ['No payment data: the program is free.', 'No advertising tracking.'] },
      { h: 'Why', p: ['To select the participants of each cohort, adapt the pathway to their access to tools, follow them during the program, issue the certificate, and, with their explicit consent, present their profile to responding employers.'] },
      { h: 'For how long', p: ['An unsuccessful application is deleted 12 months after the decision. A participant’s data is kept during the program and 3 years after certification, then anonymised.'] },
      { h: 'Who has access', p: ['The team’s volunteers, each according to their role. Our technical providers host the data (database, email sending) and do not access it for their own purposes.'] },
      { h: 'Your rights', p: ['You can request access to, correction or deletion of your data at any time, by email. We answer within 30 days.'] },
    ],
  },
  notice: {
    metaTitle: 'Legal notice',
    title: 'Legal notice',
    updated: 'Last updated: September 2026',
    intro: 'The site dangbe.org is published by the DANGBE initiative and hosted by the providers listed below.',
    sections: [
      { h: 'Publisher', p: ['The DANGBE initiative, a team of volunteers, Lomé, Togo. Contact: see the bottom of the page.'] },
      { h: 'Hosting', p: ['Site: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Database: Neon Inc. (Frankfurt region, European Union). Email: Resend Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA.'] },
      { h: 'Photographs', p: ['Photographs come from Unsplash and are used under the Unsplash licence. Nobody in these pictures is a participant, volunteer or employer linked to DANGBE.'] },
      { h: 'Fonts', p: ['Instrument Sans and JetBrains Mono, under the SIL Open Font License.'] },
      { h: 'Trademarks', p: ['Coursera, edX, Khan Academy, OpenClassrooms, Google, Microsoft and Pix are trademarks of their owners. DANGBE is not affiliated with any of these platforms. The Mandela Washington Fellowship is cited as the background of team members and neither funds nor sponsors DANGBE.'] },
    ],
  },
};
