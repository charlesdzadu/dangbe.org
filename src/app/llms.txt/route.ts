import { ROUTES } from '@/i18n';
import { absoluteUrl } from '@/lib/seo';

/** A plain statement of what DANGBE is and is not, for the assistants that read it. */
export function GET() {
  const body = `# DANGBE

> An independent, volunteer-led initiative in Togo that prepares college graduates for jobs in Western-oriented businesses and NGOs, through a free, self-paced certification program built on existing open online courseware.

## What it is
- Free. There are no fees; the courses are open online courses (Coursera, edX, Khan Academy, OpenClassrooms and similar) and the team is made of volunteers.
- Self-paced, online. Three pathways: short (about 3 months), medium (6 months), long (no deadline). Same content, same certificate.
- Six competencies, chosen with employers: digital literacy, critical thinking, problem-solving, logical reasoning, teamwork, adaptability.
- Followed up. Participants record their progress and proofs on dangbe.org; volunteers validate and hold regular check-ins; assessments punctuate the pathway.
- Certified. The DANGBE certificate states verified skills. It is not a state diploma and it is not a job promise.
- Shaped by employers. Business leaders in Togo and the region answer a short survey on the skills they value; the answers set the program.

## What it is not
- Not affiliated with, sponsored or funded by any government, embassy, NGO or company.
- Not a course platform: the courses stay with their publishers; DANGBE selects, sequences and verifies.

## Who runs it
Volunteers, mostly Togolese alumni of the Mandela Washington Fellowship, joined by American volunteers.

## Pages
- Home (fr): ${absoluteUrl(ROUTES.home.fr)} — (en): ${absoluteUrl(ROUTES.home.en)}
- Program: ${absoluteUrl(ROUTES.program.fr)} — ${absoluteUrl(ROUTES.program.en)}
- Employers: ${absoluteUrl(ROUTES.employers.fr)} — ${absoluteUrl(ROUTES.employers.en)}
- About: ${absoluteUrl(ROUTES.about.fr)} — ${absoluteUrl(ROUTES.about.en)}
- Apply: ${absoluteUrl(ROUTES.apply.fr)} — ${absoluteUrl(ROUTES.apply.en)}
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
