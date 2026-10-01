import type { fr } from '../fr';

export const employers: typeof fr.employers = {
  metaTitle: 'Employers: hire graduates who are ready for the job',
  metaDescription:
    'Tell us in five minutes which skills you value. The program is built on your answers; the certificate tells you what a graduate can do.',
  crumb: 'Employers',
  hero: {
    h1: 'Hire graduates who are ready for the job.',
    lede: 'You spend weeks training a new graduate on what university does not teach. DANGBE does it beforehand, on the skills you name yourself. Start with five minutes of survey.',
    ctaSurvey: 'Take the survey (5 min)',
    ctaContact: 'Write to us',
  },
  why: {
    title: 'Why hire a DANGBE graduate',
    lede: 'What changes with a candidate who followed the program, from day one to the first quarter.',
    cards: [
      { title: 'Less onboarding time', body: 'Office tools, email, shared documents: acquired before arrival, not during.' },
      { title: 'Verified skills, not declared ones', body: 'Every completed course is proven, every skill is assessed by a volunteer. The certificate says what was seen.' },
      { title: 'A local talent pool, to international standards', body: 'Togolese graduates trained on what businesses and NGOs with international standards look for, here, without expatriation.' },
    ],
  },
  verify: {
    title: 'What we verify',
    lede: 'The certificate does not rest on a declaration. Here is what the team looks at for every participant.',
    ticks: ['Completed courses, with a proof (certificate or screenshot) validated by a volunteer', 'Regularity: a participant inactive for two weeks is contacted', 'One assessment per skill, scored by a volunteer, with comments', 'The ability to give and take feedback, observed during the follow-up'],
    quote: 'When graduates enter the workforce with stronger critical thinking, digital fluency, and collaborative skills, companies benefit through reduced onboarding time, higher productivity, and a more globally-competitive local talent pool.',
    quoteBy: 'A project volunteer',
  },
  survey: {
    title: 'The survey: five minutes that set the program.',
    body: 'About a dozen questions. Which skills you value in a young graduate, in what order, and what you actually observe in your new hires. Your answers decide the choice of courses, their weight and their order.',
    ticks: ['Anonymous if you wish', 'Results shared with respondents', 'Priority access to certified graduates'],
    cta: 'Take the survey',
  },
  certificate: {
    title: 'What the certificate means',
    is: {
      title: 'What is verified',
      items: ['Pathway courses completed, proofs validated', 'Skills assessed one by one by a volunteer', 'Regular participation, over three to six months', 'Feedback given and received during the follow-up'],
    },
    isNot: {
      title: 'What is not promised',
      items: ['A state diploma or an official title', 'A guaranteed level in a specific trade', 'A ranking of participants'],
    },
  },
  progress: {
    title: 'Where we stand',
    lede: 'The same steps as on the home page, with no invented figure. A figure appears when one exists.',
  },
  involve: {
    title: 'Get involved',
    lede: 'Beyond the survey, three concrete ways to help, for an hour or for a quarter.',
    items: [
      { title: 'Mentor a graduate', body: 'A thirty-minute check-in a month with a participant, about your trade and its expectations.' },
      { title: 'Host a visit', body: 'Half a day in your offices for a small cohort: see a workplace, ask questions.' },
      { title: 'Run a mock interview', body: 'A practice job interview, with honest feedback at the end.' },
    ],
    cta: 'Offer my help',
  },
  faq: {
    title: 'Employers’ questions',
    items: [
      { q: 'How much does hiring a DANGBE graduate cost?', a: 'Nothing. DANGBE is not an agency and takes no commission. We introduce, you hire as you see fit.' },
      { q: 'Can I see the certified profiles?', a: 'Yes, with the participants’ consent. Employers who answered the survey are notified first at the end of each cohort.' },
      { q: 'Who guarantees the quality of the certificate?', a: 'Nobody but us, and we say so. Its value comes from the method: validated proofs, assessments per skill, regular follow-up. You can check it by meeting a graduate.' },
      { q: 'Can my company fund DANGBE?', a: 'Not for now. The project runs without funding to stay independent. What we need is your answers to the survey and your time.' },
    ],
  },
  cta: {
    title: 'Five minutes to say what you look for.',
    body: 'The program is built on your answers.',
    primary: 'Take the survey',
    secondary: 'Write to us',
  },
};
