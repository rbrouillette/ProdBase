#!/bin/bash

echo "🛠️  Rebuilding backend Docker image with no cache..."
docker-compose build --no-cache backend

echo "🚀 Starting backend container..."
docker-compose up -d backend

echo "📋 Waiting 5 seconds for backend to start..."
sleep 5

echo "📖 Showing backend container logs (Ctrl+C to exit)..."
docker logs -f saas-app-backend-1
