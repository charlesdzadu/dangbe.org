export const program = {
  metaTitle: 'Le programme : six compétences, trois parcours',
  metaDescription:
    'Culture numérique, pensée critique, résolution de problèmes, raisonnement logique, travail en équipe, adaptabilité. Cours ouverts, suivi bénévole, certification DANGBE. Court, moyen ou long.',
  crumb: 'Programme',
  hero: {
    h1: 'Un programme construit avec les employeurs, suivi par des bénévoles.',
    lede:
      'Six compétences que les entreprises et les ONG disent chercher. Des cours en ligne ouverts, choisis et ordonnés par l’équipe. Un espace de suivi, des points réguliers, une certification à la fin. Le tout gratuit, à votre rythme.',
    ctaApply: 'Postuler',
    ctaHow: 'Comment ça marche',
  },
  skills: {
    title: 'Six compétences, et ce que vous saurez faire.',
    lede: 'Chaque compétence est décrite par ce que vous saurez faire à la fin, pas par un titre de cours. L’enquête employeurs affine cette liste.',
    sourcesLabel: 'Cours issus de',
    items: [
      {
        key: 'digital',
        ticks: ['Tenir une boîte mail professionnelle et un agenda partagé', 'Rédiger et partager un document, un tableur, une présentation', 'Participer et animer une réunion en visioconférence'],
        sources: ['Google', 'Microsoft Learn', 'Pix'],
      },
      {
        key: 'critical',
        ticks: ['Vérifier une source avant de la citer', 'Distinguer un fait, une opinion, une hypothèse', 'Défendre une position avec des preuves'],
        sources: ['OpenClassrooms', 'edX'],
      },
      {
        key: 'problem',
        ticks: ['Décrire un problème avant de le résoudre', 'Proposer plusieurs options et les comparer', 'Expliquer un choix à quelqu’un qui ne l’a pas fait'],
        sources: ['Coursera', 'edX'],
      },
      {
        key: 'logic',
        ticks: ['Suivre un raisonnement en plusieurs étapes', 'Lire un tableau de données et en tirer une conclusion', 'Repérer une contradiction ou une erreur'],
        sources: ['Coursera', 'Khan Academy'],
      },
      {
        key: 'team',
        ticks: ['Dire clairement ce que l’on fait et pour quand', 'Donner un retour utile et en recevoir un', 'Tenir un engagement, prévenir quand ce n’est pas possible'],
        sources: ['Coursera'],
      },
      {
        key: 'adapt',
        ticks: ['Apprendre un outil nouveau sans formation formelle', 'Réorganiser une semaine quand les priorités changent', 'Rester fiable quand le contexte bouge'],
        sources: ['Coursera'],
      },
    ],
  },
  pathways: {
    title: 'Trois parcours, un seul contenu.',
    lede: 'La différence est le rythme. Le contenu, le suivi et la certification sont les mêmes. Le parcours se choisit à la candidature et peut changer en cours de route.',
    headers: ['', 'Court', 'Moyen', 'Long'],
    rows: [
      { label: 'Durée', values: ['environ 3 mois', '6 mois', 'à votre rythme'] },
      { label: 'Rythme indicatif', values: ['environ 8 h par semaine', 'environ 4 h par semaine', 'libre'] },
      { label: 'Pour qui', values: ['du temps chaque jour, envie d’être prêt vite', 'déjà en poste ou en recherche', 'par étapes, sans date butoir'] },
      { label: 'Langue', values: ['français ou anglais', 'français ou anglais', 'français ou anglais'] },
      { label: 'Suivi', values: ['un bénévole, des points réguliers', 'un bénévole, des points réguliers', 'un bénévole, des points réguliers'] },
      { label: 'Certification', values: ['la même', 'la même', 'la même'] },
    ],
    note: 'Le rythme est indicatif : il correspond au volume des cours du parcours, réparti sur sa durée. Personne n’est exclu pour être allé moins vite.',
  },
  tracking: {
    title: 'Suivi et mentorat',
    lede: 'Les cours sont ceux de leurs éditeurs. Ce que DANGBE ajoute, c’est le suivi : quelqu’un qui vérifie, répond et encourage.',
    steps: [
      { title: 'Un espace de suivi personnel', body: 'Vous déclarez votre progression cours par cours et joignez votre preuve de réussite (certificat ou capture). Vous voyez où vous en êtes.' },
      { title: 'Des points réguliers avec un bénévole', body: 'Un membre de l’équipe valide vos preuves, répond à vos questions et fait le point avec vous, en ligne ou par téléphone.' },
      { title: 'Une cohorte et des retours', body: 'Vous avancez avec d’autres diplômés. À la fin, des évaluations mesurent ce que vous savez faire, compétence par compétence.' },
    ],
  },
  certificate: {
    title: 'Ce que la certification est, et n’est pas.',
    is: {
      title: 'Ce qu’elle atteste',
      items: ['Que vous avez suivi et terminé les cours du parcours', 'Que vos preuves ont été vérifiées par l’équipe', 'Que vos compétences ont été évaluées par un bénévole', 'Que vous êtes prêt à donner et recevoir un retour'],
    },
    isNot: {
      title: 'Ce qu’elle n’est pas',
      items: ['Un diplôme d’État ou un titre reconnu par un ministère', 'Une promesse d’embauche', 'Un classement entre participants'],
    },
  },
  faq: {
    title: 'Questions sur le programme',
    items: [
      { q: 'Dois-je suivre les cours dans l’ordre ?', a: 'L’ordre proposé est celui qui marche le mieux, mais vous pouvez avancer sur deux cours en parallèle. Le suivi regarde ce qui est terminé, pas l’ordre.' },
      { q: 'Que se passe-t-il si je prends du retard ?', a: 'Rien de grave. Votre bénévole vous contacte après deux semaines sans activité pour comprendre ce qui bloque. On adapte le rythme ou le parcours.' },
      { q: 'Les cours sont-ils en français ?', a: 'Chaque compétence a au moins un cours en français. Certains cours complémentaires sont en anglais, avec sous-titres ; ils sont signalés.' },
      { q: 'Faut-il payer les certificats des plateformes ?', a: 'Non. Un certificat payant n’est jamais requis. Une capture d’écran de la fin du cours suffit comme preuve.' },
    ],
  },
  cta: {
    title: 'Le programme vous parle ?',
    body: 'La candidature prend dix minutes. Aucun document à joindre.',
    primary: 'Postuler',
    secondary: 'Voir l’accueil',
  },
};
