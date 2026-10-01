import type { fr } from '../fr';

export const home: typeof fr.home = {
  metaTitle: 'DANGBE — The skills employers are asking for',
  metaDescription:
    'A free, self-paced online program preparing Togolese graduates for what businesses and NGOs expect: critical thinking, digital skills, teamwork. Independent and volunteer-led.',
  hero: {
    h1: 'From degree to job: the skills employers are asking for.',
    lede:
      'DANGBE is a free, online, self-paced program for young Togolese graduates. Critical thinking, digital tools, teamwork: skills built on recognised open courseware, validated by a certificate, and a clear signal to employers.',
    ctaApply: 'Apply',
    ctaProgram: 'See the program',
    trust: ['100% free', 'Online, at your own pace', 'Independent and volunteer-led'],
    card: {
      title: 'Pilot cohort',
      subOpen: 'Applications open',
      subSoon: 'Applications opening soon',
      rows: [
        { label: 'Cost', value: '0 FCFA' },
        { label: 'Format', value: 'Online, self-paced' },
        { label: 'Duration', value: '3 to 6 months' },
        { label: 'Language', value: 'French or English' },
      ],
    },
  },
  who: {
    title: 'Two audiences, one goal.',
    lede: 'Graduates who want to be ready. Employers who want to hire people who are ready. The program is written with both.',
    graduates: {
      title: 'You just graduated',
      ticks: [
        'Bachelor’s, master’s or two-year degree, any field',
        'A computer or a smartphone, and internet access',
        'The will to learn and to say what works and what does not',
      ],
      cta: 'Apply',
    },
    employers: {
      title: 'You hire in Togo or elsewhere in Africa',
      ticks: [
        'Tell us which skills you value (5 minutes)',
        'Receive the survey results',
        'Meet the certified graduates',
      ],
      cta: 'Take the survey',
    },
  },
  skills: {
    title: 'Six skills, chosen with employers.',
    lede: 'What businesses and NGOs say they look for, and what university rarely teaches. The employer survey refines this list.',
    items: [
      {
        key: 'digital',
        title: 'Digital literacy',
        body: 'Working with the tools of the modern office: email, shared documents, spreadsheets, video calls.',
      },
      {
        key: 'critical',
        title: 'Critical thinking',
        body: 'Assessing information, telling a fact from an opinion, arguing with evidence.',
      },
      {
        key: 'problem',
        title: 'Problem-solving',
        body: 'Breaking a situation down, proposing options, choosing and explaining why.',
      },
      {
        key: 'logic',
        title: 'Logical reasoning',
        body: 'Following and building an argument, reading data, spotting an error.',
      },
      {
        key: 'team',
        title: 'Teamwork',
        body: 'Communicating clearly, keeping commitments, giving and receiving feedback.',
      },
      {
        key: 'adapt',
        title: 'Adaptability',
        body: 'Learning fast, accepting change, staying reliable when the context moves.',
      },
    ],
    note: 'Built on existing open courseware: Coursera, edX, Khan Academy, OpenClassrooms. DANGBE selects and sequences; the courses remain their publishers’.',
    cta: 'The program in detail',
  },
  how: {
    title: 'How it works',
    lede: 'Four steps. No fees, no mandatory attendance.',
    steps: [
      {
        title: 'Apply',
        body: 'A short form: your background, your access to digital tools, your motivation. An answer within two weeks.',
      },
      {
        title: 'Follow the courses, at your own pace',
        body: 'A pathway of open online courses, selected and sequenced by the team. Three months, six months or more, depending on your availability.',
      },
      {
        title: 'Move forward with support',
        body: 'A personal tracking space, regular check-ins with a volunteer, exchanges with your cohort.',
      },
      {
        title: 'Earn the DANGBE certificate',
        body: 'A statement that tells employers what you can do. With your consent, your profile is shared with the employers who answered the survey.',
      },
    ],
  },
  paths: {
    title: 'Three pathways, one certificate.',
    lede: 'The content is the same, the pace changes. French-language options exist for every pathway.',
    items: [
      { key: 'short', title: 'Short — about 3 months', body: 'For those with time every day who want to be ready fast.' },
      { key: 'medium', title: 'Medium — 6 months', body: 'For those already working or job-hunting, a few hours a week.' },
      { key: 'long', title: 'Long — at your own pace', body: 'For those who move step by step, with no deadline.' },
    ],
    ticks: ['Same content', 'Same support', 'Same certificate'],
  },
  employers: {
    title: 'Employers: tell us what you look for.',
    lede:
      'Five minutes of survey shape the program. In return, you meet graduates trained on the skills you named yourself.',
    quote:
      'By listening carefully to employers, we can close the gap between academic preparation and workplace expectations.',
    quoteBy: 'A project volunteer',
    ctaSurvey: 'Take the survey (5 min)',
    ctaWhy: 'Why hire a DANGBE graduate',
  },
  team: {
    title: 'A volunteer team, independent.',
    lede: 'Togolese alumni of the Mandela Washington Fellowship and American volunteers, giving their time.',
    who: {
      title: 'Who we are',
      body: 'A team of volunteers, mostly Togolese alumni of the Mandela Washington Fellowship, joined by American volunteers. No employees: everyone brings their time, their professional experience and their knowledge of the ground.',
    },
    not: {
      title: 'What we are not',
      body: 'We depend on no government, no embassy, no NGO. We receive no funding. The program is free because the time is given.',
    },
    cta: 'Meet the team',
  },
  milestones: {
    title: 'Where DANGBE stands',
    lede: 'In order: listen to employers, test with a first cohort, then open to all of Togo. Updated by the team.',
    items: {
      survey: {
        title: 'Employer survey',
        body: 'Businesses and NGOs in Togo and the region tell us which skills they value. Their answers set the content of the program.',
      },
      pilotApplications: {
        title: 'Applications to the pilot cohort',
        body: 'Young graduates apply. The team selects on motivation, access to digital tools and willingness to give feedback.',
      },
      pilotCohort: {
        title: 'Pilot cohort',
        body: 'A first group follows the program, with close support, and tells us what works and what does not.',
      },
      feedback: {
        title: 'Adjustments',
        body: 'The program is corrected from the feedback of participants and employers.',
      },
      launch: {
        title: 'Opening to all of Togo',
        body: 'The program opens more widely, cohort after cohort.',
      },
    },
    status: { done: 'Done', now: 'In progress', next: 'Next' },
    since: 'since {date}',
    figures: {
      surveyResponses: 'employer responses',
      pilotApplicants: 'applications received',
      pilotCertified: 'certified graduates',
    },
  },
  faq: {
    title: 'Frequently asked questions',
    aside: 'Can’t find the answer? Write to us.',
    action: 'Write to us',
    items: [
      {
        q: 'Is it really free?',
        a: 'Yes. The program relies on free, open online courses, and the team is made of volunteers. Some platforms offer an optional paid certificate; it is never required.',
      },
      {
        q: 'Who can apply?',
        a: 'Young graduates of higher education in Togo (two-year degree, bachelor’s, master’s or equivalent), any field. The pilot cohort favours recent graduates.',
      },
      {
        q: 'Do I need a computer?',
        a: 'A computer helps, but a smartphone with regular internet access is enough for most courses. We ask you to describe your access in the application so we can adapt the pathway.',
      },
      {
        q: 'Is the certificate recognised?',
        a: 'It is not a state diploma. It is a statement of verified skills, built with Togolese employers who said what they look for. Its value comes from that, and from the way we verify each step.',
      },
      {
        q: 'How long does it take?',
        a: 'About three months for the short pathway, six for the medium one, and no deadline for the long one. The content and the certificate are the same.',
      },
      {
        q: 'Does DANGBE depend on an embassy, a government or an NGO?',
        a: 'No. DANGBE is an independent initiative, run by volunteers, with no affiliation and no funding.',
      },
      {
        q: 'How does the follow-up work?',
        a: 'Each participant has a personal space where they record their progress and attach their proofs of completion. A volunteer validates, answers questions and holds regular check-ins. Assessments punctuate the pathway.',
      },
    ],
  },
  cta: {
    title: 'Start now, at your own pace.',
    body: 'The application takes ten minutes. The program is free and will stay free.',
    primary: 'Apply',
    secondary: 'Take the employer survey',
    crossText: 'Are you an employer?',
    crossLink: 'What the certificate means for you',
  },
};
