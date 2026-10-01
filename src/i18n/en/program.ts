import type { fr } from '../fr';

export const program: typeof fr.program = {
  metaTitle: 'The program: six skills, three pathways',
  metaDescription:
    'Digital literacy, critical thinking, problem-solving, logical reasoning, teamwork, adaptability. Open courseware, volunteer follow-up, DANGBE certificate. Short, medium or long.',
  crumb: 'Program',
  hero: {
    h1: 'A program built with employers, followed by volunteers.',
    lede:
      'Six skills that businesses and NGOs say they look for. Open online courses, chosen and sequenced by the team. A tracking space, regular check-ins, a certificate at the end. All free, at your own pace.',
    ctaApply: 'Apply',
    ctaHow: 'How it works',
  },
  skills: {
    title: 'Six skills, and what you will be able to do.',
    lede: 'Each skill is described by what you will be able to do at the end, not by a course title. The employer survey refines this list.',
    sourcesLabel: 'Courses from',
    items: [
      {
        key: 'digital',
        ticks: ['Run a professional inbox and a shared calendar', 'Write and share a document, a spreadsheet, a presentation', 'Take part in and lead a video-call meeting'],
        sources: ['Google', 'Microsoft Learn', 'Pix'],
      },
      {
        key: 'critical',
        ticks: ['Check a source before quoting it', 'Tell a fact, an opinion and a hypothesis apart', 'Defend a position with evidence'],
        sources: ['OpenClassrooms', 'edX'],
      },
      {
        key: 'problem',
        ticks: ['Describe a problem before solving it', 'Propose several options and compare them', 'Explain a choice to someone who did not make it'],
        sources: ['Coursera', 'edX'],
      },
      {
        key: 'logic',
        ticks: ['Follow a multi-step argument', 'Read a data table and draw a conclusion', 'Spot a contradiction or an error'],
        sources: ['Coursera', 'Khan Academy'],
      },
      {
        key: 'team',
        ticks: ['Say clearly what you will do and by when', 'Give useful feedback and take it', 'Keep a commitment, and warn when you cannot'],
        sources: ['Coursera'],
      },
      {
        key: 'adapt',
        ticks: ['Learn a new tool without formal training', 'Reorganise a week when priorities change', 'Stay reliable when the context moves'],
        sources: ['Coursera'],
      },
    ],
  },
  pathways: {
    title: 'Three pathways, one content.',
    lede: 'The difference is the pace. The content, the follow-up and the certificate are the same. The pathway is chosen at application and can change along the way.',
    headers: ['', 'Short', 'Medium', 'Long'],
    rows: [
      { label: 'Duration', values: ['about 3 months', '6 months', 'at your own pace'] },
      { label: 'Indicative pace', values: ['about 8 h a week', 'about 4 h a week', 'free'] },
      { label: 'For whom', values: ['time every day, wants to be ready fast', 'already working or job-hunting', 'step by step, no deadline'] },
      { label: 'Language', values: ['French or English', 'French or English', 'French or English'] },
      { label: 'Follow-up', values: ['a volunteer, regular check-ins', 'a volunteer, regular check-ins', 'a volunteer, regular check-ins'] },
      { label: 'Certificate', values: ['the same', 'the same', 'the same'] },
    ],
    note: 'The pace is indicative: it is the volume of the pathway’s courses spread over its duration. Nobody is excluded for going slower.',
  },
  tracking: {
    title: 'Follow-up and mentoring',
    lede: 'The courses belong to their publishers. What DANGBE adds is the follow-up: someone who checks, answers and encourages.',
    steps: [
      { title: 'A personal tracking space', body: 'You record your progress course by course and attach your proof of completion (certificate or screenshot). You see where you stand.' },
      { title: 'Regular check-ins with a volunteer', body: 'A team member validates your proofs, answers your questions and takes stock with you, online or by phone.' },
      { title: 'A cohort and feedback', body: 'You move forward with other graduates. At the end, assessments measure what you can do, skill by skill.' },
    ],
  },
  certificate: {
    title: 'What the certificate is, and is not.',
    is: {
      title: 'What it states',
      items: ['That you followed and completed the pathway’s courses', 'That your proofs were checked by the team', 'That your skills were assessed by a volunteer', 'That you are ready to give and take feedback'],
    },
    isNot: {
      title: 'What it is not',
      items: ['A state diploma or a title recognised by a ministry', 'A job promise', 'A ranking of participants'],
    },
  },
  faq: {
    title: 'Questions about the program',
    items: [
      { q: 'Do I have to take the courses in order?', a: 'The suggested order is the one that works best, but you can run two courses in parallel. The follow-up looks at what is finished, not the order.' },
      { q: 'What if I fall behind?', a: 'Nothing serious. Your volunteer contacts you after two weeks without activity to understand what is blocking. We adjust the pace or the pathway.' },
      { q: 'Are the courses in French?', a: 'Every skill has at least one course in French. Some complementary courses are in English, with subtitles; they are flagged.' },
      { q: 'Do I have to pay for the platforms’ certificates?', a: 'No. A paid certificate is never required. A screenshot of the end of the course is enough as proof.' },
    ],
  },
  cta: {
    title: 'Does the program speak to you?',
    body: 'The application takes ten minutes. No document to attach.',
    primary: 'Apply',
    secondary: 'Back to home',
  },
};
