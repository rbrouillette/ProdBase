# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Install Python 3, pip, and venv package
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
COPY prisma ./prisma
COPY requirements.txt /app/requirements.txt

# Create and activate virtual environment, then install packages inside it
RUN python3 -m venv /app/venv
RUN /app/venv/bin/pip install --upgrade pip
RUN /app/venv/bin/pip install -r /app/requirements.txt

# Generate Prisma client (important!)
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN pnpm run build

# Stage 2: Run
FROM node:20
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
COPY --from=builder /app /app

# Add the virtualenv bin folder to PATH
ENV PATH="/app/venv/bin:$PATH"

EXPOSE 4000
CMD ["node", "dist/index.js"]
