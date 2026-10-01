# dangbe.org

Le site de DANGBE : une vitrine bilingue (FR / EN) et l'espace de suivi des cohortes. Un seul projet Next.js.

DANGBE est une initiative indépendante et bénévole au Togo qui prépare les jeunes diplômés aux compétences qu'attendent les entreprises et les ONG, par un programme gratuit bâti sur des cours en ligne ouverts. Les cours ne sont pas hébergés ici : les participants déclarent leur progression et joignent une preuve ; l'équipe fait le screening des candidatures, valide les preuves et mène les évaluations.

## Stack

- Next.js 15 (App Router), React 19, TypeScript strict, CSS maison (pas de Tailwind).
- Prisma 6 + Postgres (Neon en production, Docker en local).
- Sessions maison (cookie httpOnly + table `sessions`), bcryptjs, zod.
- E-mails transactionnels via Resend (sans clé : impression en console).
- Hébergement prévu : Vercel (région `fra1`) + Neon (`aws-eu-central-1`). Un `Dockerfile` existe comme porte de sortie.

## Démarrer en local

```bash
cp .env.example .env          # puis adaptez si besoin
pnpm install
pnpm db:up                    # Postgres 16 dans Docker, port 5433
pnpm db:migrate               # applique les migrations
pnpm db:seed                  # compétences, cours, modèles, cohorte pilote (+ démo si SEED_DEMO=1)
pnpm db:seed:admin            # crée admin@dangbe.org (ADMIN_PASSWORD ou mot de passe généré affiché une fois)
pnpm dev                      # http://localhost:3000
```

Comptes de démo (avec `SEED_DEMO=1`) : `mentor@dangbe.test` / `dangbe-mentor-2026`, `participant@dangbe.test` / `dangbe-participant-2026`.

Vérifications : `pnpm typecheck`, `pnpm lint`, `pnpm test`, `NEXT_BUILD_DIR=.next-check pnpm build` (construit à côté du serveur de dev sans le perturber).

## Structure

```
src/app/(site)/        pages publiques FR à la racine, miroir EN sous /en
src/app/(auth)/        connexion, mot de passe oublié, réinitialisation, invitation
src/app/espace/        espace connecté : (team) candidatures, cohortes, participants, validations ;
                       (admin) parcours, utilisateurs ; (participant) mon-parcours, mes-evaluations
src/actions/           server actions (une par domaine) : guard → zod → transaction → revalidate → e-mail
src/lib/auth/          sessions, tokens, mots de passe, guards
src/lib/validation/    schémas zod partagés formulaires ↔ actions
src/i18n/              dictionnaires FR (référence) et EN ; src/i18n/app/fr.ts pour l'espace
src/app/globals.css    tokens et primitives ; src/app/styles/blocks.css le langage de page
prisma/                schéma, migrations, seeds
```

## Rôles

- `ADMIN` : tout, dont les décisions d'admission, les cohortes, le catalogue et les utilisateurs.
- `MENTOR` : notation des candidatures, suivi des participants, validation des preuves, évaluations, notes.
- `PARTICIPANT` : son parcours (progression + preuves) et ses évaluations.

Un mentor voit tous les participants ; le champ « mentor » sert au filtre « mes participants ».

## Runbook bénévoles

- **Inviter un mentor ou un admin** : Espace → Utilisateurs → Inviter. La personne reçoit un lien valable 7 jours ; « Renvoyer l'invitation » en génère un nouveau.
- **Admettre un candidat** : Candidatures → la fiche → Décision (admin) → choisir la cohorte. Le compte participant est créé, son parcours copié depuis le modèle de la cohorte, l'invitation envoyée.
- **Créer une cohorte** : Cohortes → Nouvelle cohorte. Le type doit correspondre au modèle choisi.
- **Modifier le programme** : Parcours → compétences, cours, modèles. Modifier un modèle ne change pas les cohortes en cours (le parcours est copié à l'admission).
- **Mot de passe perdu** : la personne utilise « Mot de passe oublié ». Un admin peut aussi lancer `ADMIN_EMAIL=… ADMIN_PASSWORD=… pnpm db:seed:admin` pour réinitialiser un compte admin.
- **Exporter une cohorte** : le bouton « Exporter en CSV » sur la cohorte (UTF-8 avec BOM, s'ouvre dans Excel et Google Sheets).
- **Mettre à jour « Où en est DANGBE »** : `src/lib/milestones.ts` (statuts, dates, chiffres réels seulement).
- **Ajouter l'équipe sur À propos** : `src/lib/team.ts` (photos dans `public/team/`).
- **Lien de l'enquête employeurs** : variable `NEXT_PUBLIC_SURVEY_URL`. Sans elle, les boutons ouvrent un e-mail.

## Déploiement

Variables d'environnement : voir `.env.example`. Sur Vercel, `DATABASE_URL` (Neon poolée) et `DIRECT_URL` (Neon directe) ; les migrations se lancent à la main avec `pnpm db:migrate:deploy`, jamais dans le build. Vérifier le domaine d'envoi dans Resend (DKIM/SPF) avant le pilote : sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte.

## Polices et icônes

`pnpm fonts` reconstruit les woff2 (Instrument Sans, JetBrains Mono) et les TTF des images Open Graph. `node tools/icons.mjs` régénère les PNG à partir de `public/favicon.svg`.
