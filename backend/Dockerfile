# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
COPY prisma ./prisma
RUN pnpm run build

# Stage 2: Run
FROM node:20
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
COPY --from=builder /app /app

EXPOSE 4000
CMD ["node", "dist/index.js"]
