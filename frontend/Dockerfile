FROM node:21.6.1 AS deps
WORKDIR /app

COPY package.json ./
RUN  npm install --production

FROM node:21.6.1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# https://dev.to/vorillaz/nextjs-with-public-environment-variables-in-docker-4ogf
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

FROM node:21.6.1 AS runner
WORKDIR /app

ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE ${FRONTEND_PORT}

CMD ["npm", "run", "start"]
