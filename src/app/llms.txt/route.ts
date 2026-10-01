import { ROUTES } from '@/i18n';
import { absoluteUrl } from '@/lib/seo';

/**
 * A plain statement of what DANGBE is and is not, for the assistants that
 * read it. Follows the llms.txt convention: one H1, a blockquote summary,
 * then H2 sections whose entries are Markdown links with a description.
 */
export function GET() {
  const body = `# DANGBE

> An independent, volunteer-led initiative in Togo that prepares college graduates for jobs in Western-oriented businesses and NGOs, through a free, self-paced certification program built on existing open online courseware.

DANGBE is free: the courses are open online courses (Coursera, edX, Khan Academy, OpenClassrooms and similar) and the team is made of volunteers. The program is self-paced and online, with three pathways: short (about 3 months), medium (6 months) and long (no deadline), all with the same content and the same certificate. It covers six competencies chosen with employers: digital literacy, critical thinking, problem-solving, logical reasoning, teamwork and adaptability. Participants record their progress and proofs on dangbe.org; volunteers validate, hold regular check-ins and assess each competency. The DANGBE certificate states verified skills; it is not a state diploma and not a job promise.

DANGBE is not affiliated with, sponsored or funded by any government, embassy, NGO or company. It is run by volunteers, mostly Togolese alumni of the Mandela Washington Fellowship, joined by American volunteers. It is not a course platform: the courses stay with their publishers; DANGBE selects, sequences and verifies.

## Pages (French)

- [Accueil](${absoluteUrl(ROUTES.home.fr)}): what the program is, who it is for, how it works, where the initiative stands
- [Programme](${absoluteUrl(ROUTES.program.fr)}): the six competencies, the three pathways, follow-up and mentoring, what the certificate is and is not
- [Employeurs](${absoluteUrl(ROUTES.employers.fr)}): why hire a DANGBE graduate, the employer survey, what is verified
- [À propos](${absoluteUrl(ROUTES.about.fr)}): mission, vision, values, independence, the team, contact
- [Postuler](${absoluteUrl(ROUTES.apply.fr)}): eligibility and the application form for the pilot cohort

## Pages (English)

- [Home](${absoluteUrl(ROUTES.home.en)}): what the program is, who it is for, how it works, where the initiative stands
- [Program](${absoluteUrl(ROUTES.program.en)}): the six competencies, the three pathways, follow-up and mentoring, what the certificate is and is not
- [Employers](${absoluteUrl(ROUTES.employers.en)}): why hire a DANGBE graduate, the employer survey, what is verified
- [About](${absoluteUrl(ROUTES.about.en)}): mission, vision, values, independence, the team, contact
- [Apply](${absoluteUrl(ROUTES.apply.en)}): eligibility and the application form for the pilot cohort

## Optional

- [Privacy policy](${absoluteUrl(ROUTES.privacy.en)}): what the application form collects, for how long, and the rights of applicants
- [Legal notice](${absoluteUrl(ROUTES.legal.en)}): publisher, hosting providers, photo and font credits
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
