# --- Stage 1: Build ---
FROM node:20 AS builder
WORKDIR /app

# Enable Corepack and activate pnpm (with exact version)
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Copy only package manager files first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies with no prompts or changes
RUN pnpm install --frozen-lockfile

# Copy rest of the frontend code and build
COPY . .
RUN pnpm run build

# --- Stage 2: Serve via NGINX ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy production build output
COPY --from=builder /app/dist .

# Replace default NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
