# The exit door: a self-contained image for Railway, Fly or a VPS. Vercel does
# not use it. Build args are inlined into the client bundle, so a change to
# NEXT_PUBLIC_* needs a rebuild.
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://dangbe.org
ARG NEXT_PUBLIC_SURVEY_URL=""
ARG NEXT_PUBLIC_CONTACT_EMAIL=contact@dangbe.org
ARG NEXT_PUBLIC_LINKEDIN_URL=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SURVEY_URL=$NEXT_PUBLIC_SURVEY_URL \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL \
    NEXT_PUBLIC_LINKEDIN_URL=$NEXT_PUBLIC_LINKEDIN_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=:: PORT=3000
RUN useradd --system --uid 1001 --create-home nextjs
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
