# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy and build
COPY . .
RUN corepack enable
RUN pnpm install
RUN pnpm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine as runner

# Copy built app to Nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Remove default config and insert custom config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
